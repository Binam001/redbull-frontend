"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import gsap from "gsap";
import { EventData } from "@/constants/events";

interface EventDetailHeroProps {
  event: EventData;
}

const DEFAULT_HERO_IMAGES = [
  "/images/home/hero/hero-1.webp",
  "/images/home/hero/hero-2.webp",
  "/images/home/hero/hero-3.webp",
];

const VERT_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Optimized Simplex Noise Organic Liquid Dissolve Shader
const FRAG_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform vec2 uPlaneResolution;
  uniform vec2 uTextureResolution1;
  uniform vec2 uTextureResolution2;
  uniform float mixRatio;

  vec3 permute(vec3 x) {
    return mod((x * 34.0 + 1.0) * x, 289.0);
  }

  float snoise() {
    vec2 v = vUv * 0.45;
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * 0.0243902439) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec2 getCoverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
    float planeAspect = planeRes.x / max(planeRes.y, 1.0);
    float texAspect = texRes.x / max(texRes.y, 1.0);
    vec2 scale = vec2(
      min(planeAspect / texAspect, 1.0),
      min(texAspect / planeAspect, 1.0)
    );
    return vec2(
      (uv.x - 0.5) * scale.x + 0.5,
      ((1.0 - uv.y) - 0.5) * scale.y + 0.5
    );
  }

  void main() {
    vec2 uv1 = getCoverUV(vUv, uPlaneResolution, uTextureResolution1);
    vec2 uv2 = getCoverUV(vUv, uPlaneResolution, uTextureResolution2);

    vec4 color1 = texture2D(uTexture1, uv1);
    vec4 color2 = texture2D(uTexture2, uv2);

    float noiseVal = (snoise() + 1.0) * 0.5;
    float grain = fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.08;
    float combinedNoise = clamp(noiseVal + grain - 0.04, 0.0, 1.0);

    float edge = 0.25;
    float threshold = mixRatio * (1.0 + 2.0 * edge) - edge;
    float dissolveFactor = 1.0 - smoothstep(threshold - edge, threshold + edge, 1.0 - combinedNoise);

    vec3 finalColor = mix(color1.rgb, color2.rgb, dissolveFactor);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const SLIDE_DURATION = 5000; // ms

export default function EventDetailHero({ event }: EventDetailHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const heroImages = useMemo(() => {
    return event.carouselImages && event.carouselImages.length > 0
      ? event.carouselImages
      : DEFAULT_HERO_IMAGES;
  }, [event.carouselImages]);

  const startDateText = useMemo(() => {
    if (event.month && event.day) {
      const monthName =
        event.month.charAt(0).toUpperCase() +
        event.month.slice(1).toLowerCase();
      return `Starts ${monthName} ${event.day}, 2026`;
    }
    return event.date;
  }, [event.month, event.day, event.date]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mixRatioRef = useRef(0);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const renderFnRef = useRef<(() => void) | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const texResolutionsRef = useRef<{ width: number; height: number }[]>([]);
  const uniformLocsRef = useRef<{
    uTexture1: WebGLUniformLocation | null;
    uTexture2: WebGLUniformLocation | null;
    uPlaneResolution: WebGLUniformLocation | null;
    uTexRes1: WebGLUniformLocation | null;
    uTexRes2: WebGLUniformLocation | null;
    uMixRatio: WebGLUniformLocation | null;
  } | null>(null);

  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const progressStartTimeRef = useRef(Date.now());
  const progressRafRef = useRef<number | null>(null);

  // Setup WebGL Canvas and preload textures
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
      depth: false,
    });
    if (!gl) return;
    glRef.current = gl;

    function compileShader(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, VERT_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      uTexture1: gl.getUniformLocation(prog, "uTexture1"),
      uTexture2: gl.getUniformLocation(prog, "uTexture2"),
      uPlaneResolution: gl.getUniformLocation(prog, "uPlaneResolution"),
      uTexRes1: gl.getUniformLocation(prog, "uTextureResolution1"),
      uTexRes2: gl.getUniformLocation(prog, "uTextureResolution2"),
      uMixRatio: gl.getUniformLocation(prog, "mixRatio"),
    };
    uniformLocsRef.current = locs;
    gl.uniform2f(locs.uTexRes1, 1920, 1080);
    gl.uniform2f(locs.uTexRes2, 1920, 1080);

    function createTexture(image: HTMLImageElement) {
      const tex = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGB,
        gl!.RGB,
        gl!.UNSIGNED_BYTE,
        image,
      );
      return tex;
    }

    function render() {
      if (!gl || !uniformLocsRef.current) return;
      gl.uniform1f(uniformLocsRef.current.uMixRatio, mixRatioRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    renderFnRef.current = render;

    function handleResize() {
      if (!canvas || !gl || !uniformLocsRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(
        uniformLocsRef.current.uPlaneResolution,
        canvas.width,
        canvas.height,
      );
      render();
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    // Preload all images from heroImages
    let loadedCount = 0;
    const loadedTextures: WebGLTexture[] = [];
    const loadedResolutions: { width: number; height: number }[] = [];

    heroImages.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tex = createTexture(img);
        if (tex) {
          loadedTextures[idx] = tex;
          loadedResolutions[idx] = {
            width: img.naturalWidth || 1920,
            height: img.naturalHeight || 1080,
          };
        }
        loadedCount++;
        if (loadedCount === heroImages.length) {
          texturesRef.current = loadedTextures;
          texResolutionsRef.current = loadedResolutions;

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, loadedTextures[0]);
          gl.uniform1i(locs.uTexture1, 0);
          gl.uniform2f(
            locs.uTexRes1,
            loadedResolutions[0].width,
            loadedResolutions[0].height,
          );

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, loadedTextures[0]);
          gl.uniform1i(locs.uTexture2, 1);
          gl.uniform2f(
            locs.uTexRes2,
            loadedResolutions[0].width,
            loadedResolutions[0].height,
          );

          mixRatioRef.current = 0;
          render();
        }
      };
      img.src = src;
      if (img.complete) {
        img.onload(new Event("load"));
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      if (gl) {
        loadedTextures.forEach((t) => gl.deleteTexture(t));
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [heroImages]);

  // Slide Transition Handler: Only the image changes!
  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (targetIndex === currentIndexRef.current || isTransitioning) return;

      const gl = glRef.current;
      const locs = uniformLocsRef.current;
      const textures = texturesRef.current;
      const resolutions = texResolutionsRef.current;

      if (!gl || !locs || textures.length < heroImages.length) {
        setCurrentIndex(targetIndex);
        return;
      }

      setIsTransitioning(true);
      setSlideProgress(0);
      progressStartTimeRef.current = Date.now();

      const fromIdx = currentIndexRef.current;
      const toIdx = targetIndex;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textures[fromIdx]);
      gl.uniform1i(locs.uTexture1, 0);
      gl.uniform2f(
        locs.uTexRes1,
        resolutions[fromIdx].width,
        resolutions[fromIdx].height,
      );

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
      gl.uniform1i(locs.uTexture2, 1);
      gl.uniform2f(
        locs.uTexRes2,
        resolutions[toIdx].width,
        resolutions[toIdx].height,
      );

      mixRatioRef.current = 0;
      renderFnRef.current?.();

      const tweenObj = { val: 0 };
      gsap.to(tweenObj, {
        val: 1,
        duration: 2.2,
        ease: "sine.inOut",
        onUpdate: () => {
          mixRatioRef.current = tweenObj.val;
          renderFnRef.current?.();
        },
        onComplete: () => {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
          gl.uniform1i(locs.uTexture1, 0);
          gl.uniform2f(
            locs.uTexRes1,
            resolutions[toIdx].width,
            resolutions[toIdx].height,
          );

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
          gl.uniform1i(locs.uTexture2, 1);
          gl.uniform2f(
            locs.uTexRes2,
            resolutions[toIdx].width,
            resolutions[toIdx].height,
          );

          mixRatioRef.current = 0;
          renderFnRef.current?.();

          setCurrentIndex(toIdx);
          setIsTransitioning(false);
          progressStartTimeRef.current = Date.now();
        },
      });
    },
    [isTransitioning, heroImages.length],
  );

  const nextSlide = useCallback(() => {
    const next = (currentIndexRef.current + 1) % heroImages.length;
    goToSlide(next);
  }, [goToSlide, heroImages.length]);

  const prevSlide = useCallback(() => {
    const prev =
      (currentIndexRef.current - 1 + heroImages.length) % heroImages.length;
    goToSlide(prev);
  }, [goToSlide, heroImages.length]);

  // Slide Progress Timer
  useEffect(() => {
    progressStartTimeRef.current = Date.now();

    const updateTimer = () => {
      if (!isTransitioning) {
        const elapsed = Date.now() - progressStartTimeRef.current;
        const p = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
        setSlideProgress(p);

        if (elapsed >= SLIDE_DURATION) {
          nextSlide();
          return;
        }
      }
      progressRafRef.current = requestAnimationFrame(updateTimer);
    };

    progressRafRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [currentIndex, isTransitioning, nextSlide]);

  return (
    <section className="relative w-full lg:h-[90vh] min-h-[70vh] overflow-hidden select-none bg-black p-0 m-0">
      {/* WebGL Organic Liquid Dissolve Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none transform scale-100 will-change-transform"
      />

      {/* Cinematic Dark Vignettes for Maximum Readability */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/90 via-black/50 to-transparent" />

      {/* Carousel Slide Indicators */}
      <div className="absolute inset-x-0 bottom-24 sm:bottom-32 md:bottom-30 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
        <div className="flex items-center justify-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-lg">
          {heroImages.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`relative overflow-hidden transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-10 sm:w-12 h-1.5 bg-white/30"
                    : "w-2 h-1.5 bg-white/40 hover:bg-white/75"
                }`}
              >
                {isActive && (
                  <span
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-none shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{ width: `${slideProgress}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
