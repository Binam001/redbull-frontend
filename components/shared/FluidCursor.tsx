"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// --- Simulation Configuration ---
interface FluidConfig {
  simResolution: number;
  dyeResolution: number;
  curl: number;
  pressureIterations: number;
  velocityDissipation: number;
  dyeDissipation: number;
  splatRadius: number;
  forceStrength: number;
  pressureDecay: number;
  threshold: number;
  edgeSoftness: number;
  inkColor: THREE.Color;
}

const DEFAULT_CONFIG: FluidConfig = {
  simResolution: 256,
  dyeResolution: 1024,
  curl: 25,
  pressureIterations: 30,
  velocityDissipation: 0.95,
  dyeDissipation: 0.95,
  splatRadius: 0.35,
  forceStrength: 7.0,
  pressureDecay: 0.75,
  threshold: 0.08,
  edgeSoftness: 0.01,
  inkColor: new THREE.Color(1, 1, 1),
};

// --- GLSL Shaders ---
const baseVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const shaders = {
  splat: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform float radius;
    uniform vec3 color;
    uniform vec2 point;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv - point;
      p.x *= aspectRatio;
      vec3 base = texture2D(uTarget, vUv).xyz;
      gl_FragColor = vec4(base + exp(-dot(p, p) / radius) * color, 1.0);
    }
  `,
  advection: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    varying vec2 vUv;
    void main() {
      vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
      gl_FragColor = vec4(dissipation * texture2D(uSource, coord).rgb, 1.0);
    }
  `,
  divergence: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;
    vec2 vel(vec2 uv) {
      vec2 v = uv;
      if (uv.x < 0.0) v.x = -1.0;
      if (uv.x > 1.0) v.x = -1.0;
      if (uv.y < 0.0) v.y = -1.0;
      if (uv.y > 1.0) v.y = -1.0;
      return texture2D(uVelocity, uv).xy;
    }
    void main() {
      float L = vel(vUv - vec2(texelSize.x, 0.0)).x;
      float R = vel(vUv + vec2(texelSize.x, 0.0)).x;
      float T = vel(vUv + vec2(0.0, texelSize.y)).y;
      float B = vel(vUv - vec2(0.0, texelSize.y)).y;
      gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }
  `,
  curl: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;
    void main() {
      float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
      float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
      float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
      gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }
  `,
  vorticity: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform vec2 texelSize;
    uniform float curlStrength;
    uniform float dt;
    varying vec2 vUv;
    void main() {
      float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
      float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
      float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
      float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
      float C = texture2D(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curlStrength * C;
      force.y *= -1.0;
      gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
    }
  `,
  pressure: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    uniform vec2 texelSize;
    varying vec2 vUv;
    void main() {
      vec2 L = clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0);
      vec2 R = clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0);
      vec2 T = clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0);
      vec2 B = clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0);
      float pL = texture2D(uPressure, L).x;
      float pR = texture2D(uPressure, R).x;
      float pT = texture2D(uPressure, T).x;
      float pB = texture2D(uPressure, B).x;
      float div = texture2D(uDivergence, vUv).x;
      gl_FragColor = vec4((pL + pR + pT + pB - div) * 0.25, 0.0, 0.0, 1.0);
    }
  `,
  gradientSubtract: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    uniform vec2 texelSize;
    varying vec2 vUv;
    void main() {
      float pL = texture2D(uPressure, clamp(vUv - vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
      float pR = texture2D(uPressure, clamp(vUv + vec2(texelSize.x, 0.0), 0.0, 1.0)).x;
      float pT = texture2D(uPressure, clamp(vUv + vec2(0.0, texelSize.y), 0.0, 1.0)).x;
      float pB = texture2D(uPressure, clamp(vUv - vec2(0.0, texelSize.y), 0.0, 1.0)).x;
      vec2 vel = texture2D(uVelocity, vUv).xy;
      vel.xy -= vec2(pR - pL, pT - pB);
      gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `,
  clear: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uTexture;
    uniform float value;
    varying vec2 vUv;
    void main() {
      gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `,
  display: `
    precision highp float;
    precision mediump sampler2D;
    uniform sampler2D uTexture;
    uniform sampler2D uVideo;
    uniform vec3 uColor;
    uniform float uUseColor;
    uniform float uHasAlpha;
    uniform float uColorAlpha;
    uniform float uFitMode; // 0.0 = cover, 1.0 = contain
    uniform float uScale;
    uniform float threshold;
    uniform float edgeSoftness;
    uniform float screenAspect;
    uniform float videoAspect;
    uniform float posMode; // 0.0 = top, 1.0 = center, 2.0 = bottom
    varying vec2 vUv;

    vec2 getUv(vec2 uv, float sAspect, float vAspect, float pos, float fit, float sc) {
      vec2 st = (uv - 0.5) / max(sc, 0.001) + 0.5;
      if (fit > 0.5) {
        // CONTAIN mode: keep aspect ratio, center on screen
        if (sAspect > vAspect) {
          st.x = (st.x - 0.5) * (sAspect / vAspect) + 0.5;
        } else {
          st.y = (st.y - 0.5) * (vAspect / sAspect) + 0.5;
        }
      } else {
        // COVER mode
        if (sAspect > vAspect) {
          float scale = vAspect / sAspect;
          if (pos < 0.5) {
            st.y = 1.0 - (1.0 - st.y) * scale;
          } else if (pos < 1.5) {
            st.y = (st.y - 0.5) * scale + 0.5;
          } else {
            st.y = st.y * scale;
          }
        } else {
          st.x = (st.x - 0.5) * (sAspect / vAspect) + 0.5;
        }
      }
      return st;
    }

    void main() {
      // 1. Fluid cursor mask from simulation density
      float d = clamp(length(texture2D(uTexture, vUv).rgb), 0.0, 1.0);
      float a = edgeSoftness > 0.0
        ? smoothstep(threshold - edgeSoftness * 0.5, threshold + edgeSoftness * 0.5, d)
        : step(threshold, d);

      if (a <= 0.001) {
        discard;
      }

      vec3 outColor = uColor;
      float finalAlpha = a;

      if (uUseColor < 0.5) {
        vec2 uvCoords = getUv(vUv, screenAspect, videoAspect, posMode, uFitMode, uScale);
        vec4 texColor = vec4(0.0);
        if (uvCoords.x >= 0.0 && uvCoords.x <= 1.0 && uvCoords.y >= 0.0 && uvCoords.y <= 1.0) {
          texColor = texture2D(uVideo, uvCoords);
        }

        if (uHasAlpha > 0.5) {
          if (uColorAlpha > 0.01) {
            // Blend logo onto fluid color
            outColor = mix(uColor, texColor.rgb, texColor.a);
            finalAlpha = a;
          } else {
            // Reveal ONLY the logo graphic itself
            outColor = texColor.rgb;
            finalAlpha = a * texColor.a;
          }
        } else {
          outColor = texColor.rgb;
          finalAlpha = a;
        }
      }

      if (finalAlpha <= 0.001) {
        discard;
      }

      gl_FragColor = vec4(outColor, finalAlpha);
    }
  `,
};

// Double-buffered render target for ping-pong reads and writes
interface DoubleRenderTarget {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;
  swap: () => void;
}

interface FluidCursorProps {
  className?: string;
  color?: string;
  imageSrc?: string;
  imageUrl?: string;
  image?: string;
  imgSrc?: string;
  videoSrc?: string;
  fit?: "cover" | "contain";
  scale?: number;
  threshold?: number;
  edgeSoftness?: number;
  objectPosition?: "top" | "center" | "bottom";
}

function resolveCssColor(colorStr: string, element?: HTMLElement | null): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(1, 1, 1);
  const trimmed = (colorStr || "").trim();
  if (!trimmed) return new THREE.Color(1, 1, 1);

  // Resolve CSS variable if passed (e.g. "var(--color-primary)" or "--primary")
  if (trimmed.startsWith("var(") || trimmed.startsWith("--")) {
    const varName = trimmed.startsWith("var(")
      ? trimmed.replace(/^var\(\s*/, "").replace(/\s*,?.*?\)$/, "").trim()
      : trimmed;
    const targetEl = element || document.documentElement;
    const val = getComputedStyle(targetEl).getPropertyValue(varName).trim();
    if (val) {
      return resolveCssColor(val, targetEl);
    }
  }

  try {
    return new THREE.Color(trimmed);
  } catch {
    try {
      const dummy = document.createElement("div");
      dummy.style.color = trimmed;
      document.body.appendChild(dummy);
      const computed = getComputedStyle(dummy).color;
      document.body.removeChild(dummy);
      return new THREE.Color(computed);
    } catch {
      return new THREE.Color(1, 1, 1);
    }
  }
}

export default function FluidCursor({
  className,
  color,
  imageSrc,
  imageUrl,
  image,
  imgSrc,
  videoSrc,
  fit,
  scale,
  threshold,
  edgeSoftness,
  objectPosition = "center",
}: FluidCursorProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finalImageSrc = imageSrc || imageUrl || image || imgSrc;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = DEFAULT_CONFIG;

    const threeColor = resolveCssColor(color || "white", canvas);
    const parsedColorVec = new THREE.Vector3(
      threeColor.r,
      threeColor.g,
      threeColor.b,
    );
    const isSvg = Boolean(finalImageSrc && finalImageSrc.includes(".svg"));
    const hasAlpha = isSvg || Boolean(finalImageSrc && (finalImageSrc.endsWith(".png") || finalImageSrc.includes(".png")));
    const hasExplicitColor = Boolean(color && color !== "transparent");
    const useColor = !finalImageSrc && !videoSrc;
    const fitMode = fit || (isSvg ? "contain" : "cover");
    const finalScale = scale ?? (fitMode === "contain" ? 0.65 : 1.0);

    // 0. Content Texture Setup (Image or Video)
    let contentTexture: THREE.Texture;
    let contentAspect = 16 / 9;
    const video =
      !finalImageSrc && videoSrc ? document.createElement("video") : null;

    const onLoadedMetadata = () => {
      if (video && video.videoWidth && video.videoHeight) {
        contentAspect = video.videoWidth / video.videoHeight;
      }
    };

    const tryPlay = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    if (finalImageSrc) {
      if (isSvg) {
        const offscreen = document.createElement("canvas");
        offscreen.width = 1820;
        offscreen.height = 700;
        const ctx = offscreen.getContext("2d");

        const canvasTex = new THREE.CanvasTexture(offscreen);
        canvasTex.minFilter = THREE.LinearFilter;
        canvasTex.magFilter = THREE.LinearFilter;
        canvasTex.format = THREE.RGBAFormat;
        canvasTex.generateMipmaps = false;
        contentTexture = canvasTex;
        contentAspect = 1820 / 700;

        // Fetch SVG text directly to completely eliminate any browser CORS or caching issues
        fetch(finalImageSrc)
          .then((res) => res.text())
          .then((svgText) => {
            const blob = new Blob([svgText], {
              type: "image/svg+xml;charset=utf-8",
            });
            const blobUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
              if (ctx) {
                ctx.clearRect(0, 0, offscreen.width, offscreen.height);
                ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
                canvasTex.needsUpdate = true;
                URL.revokeObjectURL(blobUrl);
              }
            };
            img.src = blobUrl;
          })
          .catch(() => {
            const img = new Image();
            img.onload = () => {
              if (ctx) {
                ctx.clearRect(0, 0, offscreen.width, offscreen.height);
                ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
                canvasTex.needsUpdate = true;
              }
            };
            img.src = finalImageSrc;
          });
      } else {
        const textureLoader = new THREE.TextureLoader();
        const imgTex = textureLoader.load(finalImageSrc, (tex) => {
          if (tex.image && tex.image.width && tex.image.height) {
            contentAspect = tex.image.width / tex.image.height;
          }
        });
        imgTex.minFilter = THREE.LinearFilter;
        imgTex.magFilter = THREE.LinearFilter;
        imgTex.format = THREE.RGBAFormat;
        imgTex.generateMipmaps = false;
        contentTexture = imgTex;
      }
    } else if (video) {
      video.src = videoSrc!;
      video.crossOrigin = "anonymous";
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("muted", "");
      video.addEventListener("loadedmetadata", onLoadedMetadata);

      const vTex = new THREE.VideoTexture(video);
      vTex.minFilter = THREE.LinearFilter;
      vTex.magFilter = THREE.LinearFilter;
      vTex.format = THREE.RGBAFormat;
      vTex.generateMipmaps = false;
      contentTexture = vTex;

      tryPlay();
      window.addEventListener("pointerdown", tryPlay, { once: true });
    } else {
      const dummyCanvas = document.createElement("canvas");
      dummyCanvas.width = 1;
      dummyCanvas.height = 1;
      contentTexture = new THREE.CanvasTexture(dummyCanvas);
    }

    // 1. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setClearColor(0x000000, 0);
    let dpr = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr);

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width || window.innerWidth, 1);
      const h = Math.max(rect.height || window.innerHeight, 1);
      renderer.setSize(w, h, false);
      return { w: w * dpr, h: h * dpr };
    };

    const initialSize = updateDimensions();
    let width = initialSize.w;
    let height = initialSize.h;

    // 2. 2D Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    scene.add(quad);

    // 3. Render Targets (Ping-Pong buffers)
    const aspect = width / height;
    const targetOptions: THREE.RenderTargetOptions = {
      type: THREE.HalfFloatType,
      depthBuffer: false,
      stencilBuffer: false,
    };

    const createSingle = (w: number, h: number) =>
      new THREE.WebGLRenderTarget(w, h, targetOptions);

    const createDouble = (w: number, h: number): DoubleRenderTarget => {
      let read = createSingle(w, h);
      let write = createSingle(w, h);
      return {
        get read() {
          return read;
        },
        get write() {
          return write;
        },
        swap() {
          const temp = read;
          read = write;
          write = temp;
        },
      };
    };

    const simSize = {
      w: config.simResolution,
      h: Math.round(config.simResolution / aspect),
    };
    const dyeSize = {
      w: config.dyeResolution,
      h: Math.round(config.dyeResolution / aspect),
    };

    const velocity = createDouble(simSize.w, simSize.h);
    const dye = createDouble(dyeSize.w, dyeSize.h);
    const divergence = createSingle(simSize.w, simSize.h);
    const curl = createSingle(simSize.w, simSize.h);
    const pressure = createDouble(simSize.w, simSize.h);

    // 4. Materials Setup
    const makeMaterial = (
      frag: string,
      uniforms: { [key: string]: THREE.IUniform },
      transparent = false,
    ) =>
      new THREE.ShaderMaterial({
        vertexShader: baseVertexShader,
        fragmentShader: frag,
        uniforms,
        depthTest: false,
        depthWrite: false,
        transparent,
      });

    const materials = {
      splat: makeMaterial(shaders.splat, {
        uTarget: { value: null },
        aspectRatio: { value: 1.0 },
        radius: { value: 0.0 },
        color: { value: new THREE.Vector3() },
        point: { value: new THREE.Vector2() },
      }),
      advection: makeMaterial(shaders.advection, {
        uVelocity: { value: null },
        uSource: { value: null },
        texelSize: { value: new THREE.Vector2() },
        dt: { value: 0.0 },
        dissipation: { value: 0.0 },
      }),
      divergence: makeMaterial(shaders.divergence, {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      curl: makeMaterial(shaders.curl, {
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      vorticity: makeMaterial(shaders.vorticity, {
        uVelocity: { value: null },
        uCurl: { value: null },
        texelSize: { value: new THREE.Vector2() },
        curlStrength: { value: 0.0 },
        dt: { value: 0.0 },
      }),
      pressure: makeMaterial(shaders.pressure, {
        uPressure: { value: null },
        uDivergence: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      gradientSubtract: makeMaterial(shaders.gradientSubtract, {
        uPressure: { value: null },
        uVelocity: { value: null },
        texelSize: { value: new THREE.Vector2() },
      }),
      clear: makeMaterial(shaders.clear, {
        uTexture: { value: null },
        value: { value: 0.0 },
      }),
      display: makeMaterial(
        shaders.display,
        {
          uTexture: { value: null },
          uVideo: { value: contentTexture },
          uColor: { value: parsedColorVec },
          uUseColor: { value: useColor ? 1.0 : 0.0 },
          uHasAlpha: { value: hasAlpha ? 1.0 : 0.0 },
          uColorAlpha: { value: hasExplicitColor ? 1.0 : 0.0 },
          uFitMode: { value: fitMode === "contain" ? 1.0 : 0.0 },
          uScale: { value: finalScale },
          threshold: { value: 0.0 },
          edgeSoftness: { value: 0.0 },
          screenAspect: { value: 1.0 },
          videoAspect: { value: 16 / 9 },
          posMode: { value: 1.0 },
        },
        true,
      ),
    };

    // Helper functions for rendering passes
    const pass = (
      mat: THREE.ShaderMaterial,
      target: THREE.WebGLRenderTarget | null,
    ) => {
      quad.material = mat;
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
    };

    const setUniforms = (
      mat: THREE.ShaderMaterial,
      values: { [key: string]: any },
    ) => {
      Object.entries(values).forEach(([key, val]) => {
        if (mat.uniforms[key]) {
          mat.uniforms[key].value = val;
        }
      });
      return mat;
    };

    // 5. Input Tracking (Mouse & Touch)
    const mouse = { x: 0, y: 0, velocityX: 0, velocityY: 0, moved: false };

    const onMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const localX = (clientX - rect.left) * dpr;
      const localY = (clientY - rect.top) * dpr;

      if (!mouse.moved && mouse.x === 0 && mouse.y === 0) {
        mouse.x = localX;
        mouse.y = localY;
      }

      const dx = localX - mouse.x;
      const dy = localY - mouse.y;

      mouse.velocityX = dx * config.forceStrength;
      mouse.velocityY = dy * config.forceStrength;
      mouse.x = localX;
      mouse.y = localY;
      mouse.moved = true;
    };

    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      const size = updateDimensions();
      width = size.w;
      height = size.h;
    };
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // 6. Splat Ink & Momentum Injection
    const splat = (x: number, y: number, vX: number, vY: number) => {
      setUniforms(materials.splat, {
        aspectRatio: width / height,
        point: new THREE.Vector2(x / width, 1 - y / height),
        radius: config.splatRadius / 100,
      });

      // Inject movement into velocity
      setUniforms(materials.splat, {
        uTarget: velocity.read.texture,
        color: new THREE.Vector3(vX, -vY, 0),
      });
      pass(materials.splat, velocity.write);
      velocity.swap();

      // Inject ink color into dye buffer
      setUniforms(materials.splat, {
        uTarget: dye.read.texture,
        color: new THREE.Vector3(3.0, 3.0, 3.0),
      });
      pass(materials.splat, dye.write);
      dye.swap();
    };

    // 7. Full Physics Simulation Step
    const simulate = (dt: number) => {
      const simTexel = new THREE.Vector2(1 / simSize.w, 1 / simSize.h);

      // Step 1: Compute Curl
      pass(
        setUniforms(materials.curl, {
          uVelocity: velocity.read.texture,
          texelSize: simTexel,
        }),
        curl,
      );

      // Step 2: Apply Vorticity Confinement
      pass(
        setUniforms(materials.vorticity, {
          uVelocity: velocity.read.texture,
          uCurl: curl.texture,
          texelSize: simTexel,
          curlStrength: config.curl,
          dt,
        }),
        velocity.write,
      );
      velocity.swap();

      // Step 3: Compute Divergence
      pass(
        setUniforms(materials.divergence, {
          uVelocity: velocity.read.texture,
          texelSize: simTexel,
        }),
        divergence,
      );

      // Step 4: Pressure Decay Clear
      pass(
        setUniforms(materials.clear, {
          uTexture: pressure.read.texture,
          value: config.pressureDecay,
        }),
        pressure.write,
      );
      pressure.swap();

      // Step 5: Pressure Solver Iterations
      setUniforms(materials.pressure, {
        uDivergence: divergence.texture,
        texelSize: simTexel,
      });
      for (let i = 0; i < config.pressureIterations; i++) {
        materials.pressure.uniforms.uPressure.value = pressure.read.texture;
        pass(materials.pressure, pressure.write);
        pressure.swap();
      }

      // Step 6: Gradient Subtract
      pass(
        setUniforms(materials.gradientSubtract, {
          uPressure: pressure.read.texture,
          uVelocity: velocity.read.texture,
          texelSize: simTexel,
        }),
        velocity.write,
      );
      velocity.swap();

      // Step 7: Advect Velocity Field
      pass(
        setUniforms(materials.advection, {
          uVelocity: velocity.read.texture,
          uSource: velocity.read.texture,
          texelSize: simTexel,
          dt,
          dissipation: config.velocityDissipation,
        }),
        velocity.write,
      );
      velocity.swap();

      // Step 8: Advect Dye Field
      const dyeTexel = new THREE.Vector2(1 / dyeSize.w, 1 / dyeSize.h);
      pass(
        setUniforms(materials.advection, {
          uVelocity: velocity.read.texture,
          uSource: dye.read.texture,
          texelSize: dyeTexel,
          dt,
          dissipation: config.dyeDissipation,
        }),
        dye.write,
      );
      dye.swap();
    };

    // 8. Render to Screen
    const render = () => {
      if (video && video.readyState >= video.HAVE_CURRENT_DATA) {
        contentTexture.needsUpdate = true;
      }
      if (
        video &&
        video.videoWidth &&
        video.videoHeight &&
        contentAspect !== video.videoWidth / video.videoHeight
      ) {
        contentAspect = video.videoWidth / video.videoHeight;
      }

      const rect = canvas.getBoundingClientRect();
      const currentScreenAspect =
        (rect.width || window.innerWidth) / (rect.height || window.innerHeight);

      const posVal =
        objectPosition === "center"
          ? 1.0
          : objectPosition === "bottom"
            ? 2.0
            : 0.0;

      pass(
        setUniforms(materials.display, {
          uTexture: dye.read.texture,
          uVideo: contentTexture,
          uColor: parsedColorVec,
          uUseColor: useColor ? 1.0 : 0.0,
          uHasAlpha: hasAlpha ? 1.0 : 0.0,
          uColorAlpha: hasExplicitColor ? 1.0 : 0.0,
          uFitMode: fitMode === "contain" ? 1.0 : 0.0,
          uScale: finalScale,
          threshold: threshold ?? config.threshold,
          edgeSoftness: edgeSoftness ?? config.edgeSoftness,
          screenAspect: currentScreenAspect,
          videoAspect: contentAspect,
          posMode: posVal,
        }),
        null,
      );
    };

    // 9. Simulation Animation Loop
    let animationFrameId: number;
    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;

      if (mouse.moved) {
        splat(mouse.x, mouse.y, mouse.velocityX, mouse.velocityY);
        mouse.moved = false;
      }

      simulate(dt);
      render();

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", tryPlay);
      resizeObserver.disconnect();

      if (video) {
        video.pause();
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
        video.removeAttribute("src");
        video.load();
      }
      contentTexture.dispose();

      renderer.dispose();
      velocity.read.dispose();
      velocity.write.dispose();
      dye.read.dispose();
      dye.write.dispose();
      divergence.dispose();
      curl.dispose();
      pressure.read.dispose();
      pressure.write.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [finalImageSrc, color, videoSrc, fit, scale, threshold, edgeSoftness, objectPosition]);

  return (
    <canvas
      ref={canvasRef}
      className={
        className || "absolute inset-0 pointer-events-none z-50 w-full h-full"
      }
      aria-hidden="true"
    />
  );
}
