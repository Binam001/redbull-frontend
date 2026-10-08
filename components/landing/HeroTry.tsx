"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Vertex Shader for Fullscreen Quad
const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Fragment Shader directly replicated from drinkzoi.co
const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uDarkColor;
  uniform vec3 uMidtoneColor;
  uniform vec3 uHighlightColor;
  uniform vec3 uMouseColor;
  uniform float uNoiseScale;
  uniform float uAmplitude;
  uniform float uGain;
  uniform float uLacunarity;
  uniform float uRotationSpeed;
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uMouseSpeed;
  uniform float uMouseNoise;
  uniform float uMouseFactor;
  uniform float uMouseDistortion;
  uniform float uBrightness;
  uniform vec2 uResolution;
  uniform float uLoadTransition;

  float random(vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    f = f * f * (3.0 - 2.0 * f);
    return mix(a, b, f.x) + (random(i + vec2(0.0, 1.0)) - a) * f.y * (1.0 - f.x) + (random(i + vec2(1.0)) - b) * f.x * f.y;
  }

  float fbm(vec2 _st) {
    float value = 0.0;
    float amplitude = uAmplitude;
    float gain_modifier = uGain * uLoadTransition;
    float lacunarity = uLacunarity;
    vec2 shift = vec2(100.2 * sin(uSpeed * uTime));
    mat2 rot = mat2(-cos(uRotationSpeed), -sin(uRotationSpeed), sin(uRotationSpeed), cos(uRotationSpeed));
    for (int i = 0; i < 5; ++i) {
      value += amplitude * noise(_st);
      _st = rot * _st * lacunarity + shift;
      amplitude *= gain_modifier;
    }
    return value;
  }

  vec3 painting(vec2 p) {
    float l = fbm(p + fbm(p));
    return mix(
      mix(uDarkColor, uMidtoneColor, l * 1.2),
      mix(uMidtoneColor, uHighlightColor, (l - 0.4) * 1.2),
      smoothstep(0.0, 1.0, l)
    ) * uBrightness;
  }

  vec2 nnoise(vec2 uv) {
    vec2 uv2 = uv;
    uv2.y = uv2.y + fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    return uv2 - uv;
  }

  float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float m = 2.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        g = g + 0.5 + 0.5 * sin(uTime * 0.5 + 6.2831 * (floor(vec2(noise(n + g), noise(n + g + vec2(1.0))) * 4.0) / 4.0)) - f;
        m = min(m, dot(g, g));
      }
    }
    return pow(sqrt(m), 3.0);
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 aspectUV = vUv;
    aspectUV.x *= aspect;
    float d = length(aspectUV - uMouse * vec2(aspect, 1.0));
    float mouseEffectFactor = smoothstep(uMouseFactor, 0.0, d);
    vec2 distortedUV = vUv;
    float mDist = smoothstep(uMouseDistortion, 0.0, d);
    for (int i = 0; i < 3; i++) {
      distortedUV -= nnoise(distortedUV) * uMouseNoise * mDist;
    }
    vec3 distortedColor = mix(painting(vUv * uNoiseScale), painting(distortedUV * uNoiseScale), mouseEffectFactor);
    distortedColor = mix(
      mix(distortedColor, distortedColor * 1.5, mouseEffectFactor),
      mix(uMidtoneColor * 0.1236, uMouseColor * 0.7, pow(clamp(uMouseSpeed, 0.0, 1.0), 0.5)),
      mouseEffectFactor * 0.8
    );
    float v = voronoi(aspectUV * 2.0);
    distortedColor = mix(distortedColor, mix(uMidtoneColor, uHighlightColor, v * 2.0), mouseEffectFactor);
    distortedColor = mix(
      distortedColor / vec3(12.92),
      pow((distortedColor + vec3(0.055)) / vec3(1.055), vec3(2.4)),
      step(vec3(0.04045), distortedColor)
    ) * 1.5;
    gl_FragColor = vec4(distortedColor, 1.0);
  }
`;

const TOTAL_FRAMES = 192;

export default function HeroTry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Background WebGL Canvas
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Frame Sequence Canvas
  const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const frameDrawnRef = useRef<number>(-1);

  // Direct DOM refs to eliminate React re-renders during scroll
  const canContainerRef = useRef<HTMLDivElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);

  // Marquee horizontal scroll ref & container ref
  const marqueeOffsetRef = useRef<number>(0);
  const marqueeLayerRef = useRef<HTMLDivElement>(null);

  // Hero text container ref (THE ULTIMATE ICED TEA)
  const heroTextLayerRef = useRef<HTMLDivElement>(null);

  // Custom Cursor
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5, screenX: -100, screenY: -100 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.5, screenX: -100, screenY: -100 });
  const mouseSpeed = useRef<number>(0);
  const prevMouse = useRef({ x: 0.5, y: 0.5 });

  // Scroll Progress
  const scrollProgressRef = useRef<number>(0);
  const scrollLabelRef = useRef<HTMLDivElement>(null);

  // --- 1. WEBGL BACKGROUND SHADER INITIALIZATION ---
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
    if (!gl) return;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error("Shader compile error:", glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad geometry (2 triangles as a strip)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uMouseSpeedLoc = gl.getUniformLocation(program, "uMouseSpeed");
    const uDarkColorLoc = gl.getUniformLocation(program, "uDarkColor");
    const uMidtoneColorLoc = gl.getUniformLocation(program, "uMidtoneColor");
    const uHighlightColorLoc = gl.getUniformLocation(program, "uHighlightColor");
    const uMouseColorLoc = gl.getUniformLocation(program, "uMouseColor");
    const uNoiseScaleLoc = gl.getUniformLocation(program, "uNoiseScale");
    const uAmplitudeLoc = gl.getUniformLocation(program, "uAmplitude");
    const uGainLoc = gl.getUniformLocation(program, "uGain");
    const uLacunarityLoc = gl.getUniformLocation(program, "uLacunarity");
    const uRotationSpeedLoc = gl.getUniformLocation(program, "uRotationSpeed");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uMouseFactorLoc = gl.getUniformLocation(program, "uMouseFactor");
    const uMouseDistortionLoc = gl.getUniformLocation(program, "uMouseDistortion");
    const uMouseNoiseLoc = gl.getUniformLocation(program, "uMouseNoise");
    const uBrightnessLoc = gl.getUniformLocation(program, "uBrightness");
    const uLoadTransitionLoc = gl.getUniformLocation(program, "uLoadTransition");

    // Static uniform values exactly as in drinkzoi.co
    gl.uniform3f(uDarkColorLoc, 0.05, 0.13, 0.2);
    gl.uniform3f(uMidtoneColorLoc, 0.34, 0.5, 0.59);
    gl.uniform3f(uHighlightColorLoc, 0.48, 0.62, 0.75);
    gl.uniform3f(uMouseColorLoc, 0.05, 0.13, 0.2);
    gl.uniform1f(uNoiseScaleLoc, 3.1739);
    gl.uniform1f(uAmplitudeLoc, 0.5217);
    gl.uniform1f(uGainLoc, 0.2826);
    gl.uniform1f(uLacunarityLoc, 2.0);
    gl.uniform1f(uRotationSpeedLoc, 0.0);
    gl.uniform1f(uSpeedLoc, 0.0049);
    gl.uniform1f(uMouseFactorLoc, 0.5478);
    gl.uniform1f(uMouseDistortionLoc, 0.15);
    gl.uniform1f(uMouseNoiseLoc, 0.05);
    gl.uniform1f(uBrightnessLoc, 0.95);
    gl.uniform1f(uLoadTransitionLoc, 1.0);

    let animationFrameId: number = 0;
    let startTime = performance.now();
    let isIntersecting = true;

    function resize() {
      if (!canvas || !gl) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function render(currentTime: number) {
      if (!gl || !isIntersecting) {
        animationFrameId = 0;
        return;
      }
      const elapsed = (currentTime - startTime) * 0.001;

      // Mouse smoothing and velocity
      mouseSmooth.current.x += (mousePos.current.x - mouseSmooth.current.x) * 0.075;
      mouseSmooth.current.y += (mousePos.current.y - mouseSmooth.current.y) * 0.075;

      const dx = mouseSmooth.current.x - prevMouse.current.x;
      const dy = mouseSmooth.current.y - prevMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetSpeed = dist * 25.0;
      mouseSpeed.current += (targetSpeed - mouseSpeed.current) * 0.08;
      prevMouse.current.x = mouseSmooth.current.x;
      prevMouse.current.y = mouseSmooth.current.y;

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mouseSmooth.current.x, mouseSmooth.current.y);
      gl.uniform1f(uMouseSpeedLoc, Math.min(mouseSpeed.current, 1.0));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    // Pause WebGL rendering when hero is scrolled out of view to save GPU/CPU
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, []);

  // --- 2. FRAME SEQUENCE PRELOADING ---
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    async function loadAllFrames() {
      // First, create all image objects
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const pad = i.toString().padStart(4, "0");
        const img = new Image();
        img.src = `/frames/frame_${pad}.webp`;
        images.push(img);
      }
      imagesRef.current = images;

      // Priority load first 10 frames so hero can render immediately
      const priorityPromises = images.slice(0, 10).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) {
              loadedCount++;
              resolve();
            } else {
              img.onload = () => {
                loadedCount++;
                resolve();
              };
              img.onerror = () => {
                loadedCount++;
                resolve();
              };
            }
          })
      );
      await Promise.all(priorityPromises);

      // Render initial frame once available
      if (!isCancelled) {
        drawFrame(0);
      }

      // Load remaining frames silently in the background
      images.forEach((img, index) => {
        if (index < 10) return;
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = () => {
            if (isCancelled) return;
            loadedCount++;
          };
          img.onerror = () => {
            if (isCancelled) return;
            loadedCount++;
          };
        }
      });
    }

    loadAllFrames();

    return () => {
      isCancelled = true;
    };
  }, []);

  // --- 3. DRAW CURRENT FRAME TO CANVAS ---
  const drawFrame = (frameIndex: number) => {
    const canvas = frameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    // Calculate aspect ratio cover/contain fitting
    const fw = 1920;
    const fh = 1080;
    const canvasRatio = cw / ch;
    const frameRatio = fw / fh;

    let dw = cw;
    let dh = ch;
    let dx = 0;
    let dy = 0;

    // We use a responsive fit: on desktop cover or nice contain, centering the can
    if (canvasRatio > frameRatio) {
      dw = cw;
      dh = cw / frameRatio;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * frameRatio;
      dx = (cw - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    frameDrawnRef.current = frameIndex;
  };

  // Canvas size sync
  useEffect(() => {
    function handleResize() {
      const canvas = frameCanvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentFrameRef.current);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 4. ENTRANCE ANIMATION (SYNCED WITH PRELOADER) ---
  useEffect(() => {
    let hasTriggered = false;

    function playEntranceAnimation() {
      if (hasTriggered) return;
      hasTriggered = true;

      // Animate the ice block / can into full view
      const canAnim = { scale: 0.6, opacity: 0 };
      gsap.to(canAnim, {
        scale: 1.0,
        opacity: 1.0,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => {
          if (canContainerRef.current) {
            canContainerRef.current.style.transform = `scale(${canAnim.scale})`;
            canContainerRef.current.style.opacity = `${canAnim.opacity}`;
          }
        },
      });

      // Animate marquee text in
      gsap.to(
        {},
        {
          duration: 1.2,
          delay: 0.35,
          onUpdate: function () {
            if (marqueeLayerRef.current) {
              marqueeLayerRef.current.style.opacity = `${this.progress()}`;
            }
          },
          onComplete: () => {
            setIsIntroComplete(true);
          },
        }
      );

      // Animate scroll label in
      gsap.to(
        {},
        {
          duration: 1.0,
          delay: 0.7,
          onUpdate: function () {
            if (scrollLabelRef.current) {
              scrollLabelRef.current.style.opacity = `${this.progress()}`;
            }
          },
        }
      );
    }

    // Check if user has already entered site or preloader was previously dismissed
    if (
      typeof window !== "undefined" &&
      (sessionStorage.getItem("hasEnteredSite") === "true" ||
        (window as Window & { hasEnteredIntro?: boolean }).hasEnteredIntro)
    ) {
      playEntranceAnimation();
      return;
    }

    // Listen to Preloader exit and completion events
    window.addEventListener("preloaderExit", playEntranceAnimation);
    window.addEventListener("preloaderComplete", playEntranceAnimation);
    window.addEventListener("audioPreferenceChanged", playEntranceAnimation);

    // Fallback: If Preloader component is not rendered or user navigates directly
    const fallbackTimer = setTimeout(() => {
      playEntranceAnimation();
    }, 4500);

    return () => {
      window.removeEventListener("preloaderExit", playEntranceAnimation);
      window.removeEventListener("preloaderComplete", playEntranceAnimation);
      window.removeEventListener("audioPreferenceChanged", playEntranceAnimation);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // --- 5. MARQUEE CONTINUOUS LOOP ---
  useEffect(() => {
    let animId: number;
    const speed = 1.2; // px per frame

    function loop() {
      marqueeOffsetRef.current -= speed;
      // Single loop width calculation (approx half of the doubled text)
      if (marqueeOffsetRef.current <= -2500) {
        marqueeOffsetRef.current = 0;
      }
      const el = document.getElementById("zoi-marquee-track");
      if (el) {
        el.style.transform = `translate3d(${marqueeOffsetRef.current}px, 0, 0)`;
      }
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // --- 6. SCROLL PROGRESSION & SCRUBBING ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        refreshPriority: 12,
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // 1. Frame sequence scrubbing: 0 to 191
          const frame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1))));
          currentFrameRef.current = frame;
          drawFrame(frame);

          // 2. Marquee opacity: Fades out from 1 to 0 between scroll 0.0 and 0.28
          if (marqueeLayerRef.current) {
            marqueeLayerRef.current.style.opacity = p < 0.28 ? `${Math.max(0, 1 - p / 0.28)}` : "0";
          }

          // 3. Hero Text ("THE ULTIMATE ICED TEA") rises up from below
          if (heroTextLayerRef.current) {
            if (p < 0.1) {
              heroTextLayerRef.current.style.opacity = "0";
              heroTextLayerRef.current.style.transform = "translate3d(0, 120vh, 0)";
            } else if (p <= 0.95) {
              const rel = (p - 0.1) / 0.85; // 0 to 1
              const y = 90 - rel * 180;
              let op = 1;
              if (rel < 0.15) op = rel / 0.15;
              else if (rel > 0.85) op = Math.max(0, 1 - (rel - 0.85) / 0.15);
              heroTextLayerRef.current.style.opacity = `${op}`;
              heroTextLayerRef.current.style.transform = `translate3d(0, ${y}vh, 0)`;
            } else {
              heroTextLayerRef.current.style.opacity = "0";
              heroTextLayerRef.current.style.transform = "translate3d(0, -90vh, 0)";
            }
          }

          // 4. Scroll indicator fades out immediately on scroll
          if (scrollLabelRef.current) {
            scrollLabelRef.current.style.opacity = p > 0.03 ? `${Math.max(0, 1 - (p - 0.03) * 15)}` : "1";
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // --- 7. MOUSE TRACKING & CUSTOM CURSOR ---
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const normX = e.clientX / window.innerWidth;
      const normY = 1.0 - e.clientY / window.innerHeight; // WebGL UV coordinates

      mousePos.current.x = normX;
      mousePos.current.y = normY;
      mousePos.current.screenX = e.clientX;
      mousePos.current.screenY = e.clientY;
    }

    window.addEventListener("mousemove", handleMouseMove);

    // Smooth cursor follower animation loop
    let animId: number;
    function updateCursor() {
      mouseSmooth.current.screenX += (mousePos.current.screenX - mouseSmooth.current.screenX) * 0.15;
      mouseSmooth.current.screenY += (mousePos.current.screenY - mouseSmooth.current.screenY) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseSmooth.current.screenX}px, ${mouseSmooth.current.screenY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(updateCursor);
    }
    animId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#000000] text-white select-none"
      style={{
        height: "550vh",
        fontFamily: "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 1. CUSTOM FLOWER / ASTERISK CURSOR */}
      {/* ========================================================================= */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[100] transition-opacity duration-300 hidden md:block"
        style={{
          opacity: isIntroComplete ? 1 : 0,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-125"
        >
          <path
            d="M18.3126 15.5231C17.0584 15.0958 15.8095 14.6482 14.5544 14.2374C14.3521 14.1679 14.0319 14.1411 13.9014 14.2574C13.7753 14.3697 13.7404 14.6895 13.7778 14.8979C14.0047 16.1857 14.2648 17.4673 14.5081 18.756C14.6492 19.5274 14.4015 19.8885 13.6171 20.0411C12.8366 20.1982 12.0518 20.359 11.2684 20.4953C10.5972 20.6173 10.2002 20.3469 10.0621 19.6665C9.8092 18.4019 9.5732 17.13 9.32464 15.8615C9.17189 15.0771 8.87285 14.9691 8.28235 15.4795C7.32315 16.3027 6.37605 17.1308 5.42072 17.9584C4.77803 18.5152 4.34703 18.4779 3.7896 17.8434C3.26752 17.2398 2.74109 16.6401 2.22336 16.0326C1.8141 15.5469 1.83776 15.0656 2.30356 14.6429C2.81285 14.1814 3.34152 13.7417 3.85856 13.2889C4.36255 12.8478 4.8743 12.4153 5.37876 11.9659C5.84844 11.5476 5.78614 11.1974 5.19582 10.99C3.9629 10.5516 2.72469 10.1335 1.48695 9.70713C0.726782 9.44041 0.535759 9.03334 0.798994 8.26062C1.05211 7.52032 1.30522 6.78002 1.56656 6.04019C1.80813 5.35698 2.23645 5.15485 2.91193 5.38779C4.16177 5.81896 5.41113 6.25835 6.66532 6.68565C7.28419 6.89882 7.55769 6.66299 7.43752 6.02899C7.19717 4.76099 6.95295 3.48864 6.70438 2.22017C6.54239 1.38161 6.7819 1.02005 7.60398 0.857193C8.36755 0.707451 9.13548 0.553835 9.9068 0.412792C10.6114 0.284392 11.0044 0.550512 11.1411 1.2556C11.3906 2.50762 11.6237 3.7587 11.8689 5.0146C12.0284 5.82414 12.3275 5.93219 12.9436 5.40677C13.8989 4.57918 14.846 3.75112 15.8052 2.92788C16.4213 2.40246 16.8567 2.43588 17.3986 3.05301C17.9013 3.63487 18.4045 4.20851 18.9029 4.79425C19.4327 5.40655 19.395 5.84578 18.7736 6.39153C17.8134 7.23121 16.8373 8.06172 15.8771 8.9014C15.334 9.37741 15.3934 9.70675 16.0766 9.94839C17.2936 10.3777 18.5197 10.791 19.7366 11.2202C20.4687 11.4729 20.6675 11.8887 20.4144 12.629C20.1603 13.3858 19.9024 14.1382 19.6319 14.894C19.4004 15.5448 18.9716 15.7551 18.3121 15.5313"
            fill="#F0F0F0"
          />
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. STICKY HERO VIEWPORT (100VH) */}
      {/* ========================================================================= */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Layer A: WebGL Background Canvas with Fluid Shader */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Layer B: Marquee Text (Freeze. Shake. Drink.) - Behind the Can */}
        <div
          ref={marqueeLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden will-change-opacity"
          style={{
            opacity: 0,
          }}
        >
          <div
            id="zoi-marquee-track"
            className="flex items-center whitespace-nowrap text-white font-light will-change-transform"
            style={{
              fontSize: "clamp(3.8rem, 11vw, 12rem)",
              letterSpacing: "0.015em",
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            <span className="px-6">Freeze. Shake. Drink.</span>
            <span className="px-6">Freeze. Shake. Drink.</span>
            <span className="px-6">Freeze. Shake. Drink.</span>
            <span className="px-6">Freeze. Shake. Drink.</span>
            <span className="px-6">Freeze. Shake. Drink.</span>
            <span className="px-6">Freeze. Shake. Drink.</span>
          </div>
        </div>

        {/* Layer C: Hero Heading (THE ULTIMATE ICED TEA) - Behind the Can, rises on scroll */}
        <div
          ref={heroTextLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 text-center will-change-transform will-change-opacity"
          style={{
            transform: "translate3d(0, 100vh, 0)",
            opacity: 0,
          }}
        >
          <h1
            className="text-white font-light uppercase tracking-tight leading-[0.84] max-w-[95vw]"
            style={{
              fontSize: "clamp(3.8rem, 13.5vw, 15rem)",
              fontFamily: "'BeausiteClassic-Light', sans-serif",
              letterSpacing: "-0.01em",
              textShadow: "0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="block">THE ULTIMATE</span>
            <span className="block">ICED TEA</span>
          </h1>
        </div>

        {/* Layer D: Frame Sequence Canvas (Ice Cube & Can) - In front of text */}
        <div
          ref={canContainerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform will-change-opacity"
          style={{
            transform: "scale(0.6)",
            opacity: 0,
          }}
        >
          <canvas
            ref={frameCanvasRef}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Layer E: Bottom Indicators (Scroll label - Centered) */}
        <footer className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center pointer-events-none">
          <div
            ref={scrollLabelRef}
            className="text-white/80 font-medium tracking-wide text-sm md:text-base flex items-center justify-center will-change-opacity transition-opacity duration-300"
            style={{
              opacity: 0,
              fontFamily: "'BeausiteClassic-Medium', sans-serif",
            }}
          >
            <span>Scroll</span>
          </div>
        </footer>
      </div>
    </div>
  );
}