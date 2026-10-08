"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Button from "../shared/Button";
import { EVENTS } from "@/constants/events";

interface SlideData {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  startDate: string;
}

const HERO_SLIDES: SlideData[] = EVENTS.slice(0, 3).map((event, idx) => {
  const monthName = event.month
    ? event.month.charAt(0).toUpperCase() + event.month.slice(1).toLowerCase()
    : "Oct";
  return {
    id: event.id,
    slug: event.slug,
    image: `/images/home/hero/hero-${idx + 1}.jpg`,
    title: event.title,
    description: event.description,
    ctaText: "Explore more",
    startDate: `Starts ${monthName} ${event.day}, 2026`,
  };
});

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

  void main() {
    // Exact aspect ratio correction: object-fit cover
    vec2 ratio1 = clamp(
      vec2(uPlaneResolution.x / uPlaneResolution.y / (uTextureResolution1.x / uTextureResolution1.y), 1.0) /
      vec2(1.0, uPlaneResolution.y / uPlaneResolution.x / (uTextureResolution1.y / uTextureResolution1.x)),
      vec2(0.0), vec2(1.0)
    );
    vec2 ratio2 = clamp(
      vec2(uPlaneResolution.x / uPlaneResolution.y / (uTextureResolution2.x / uTextureResolution2.y), 1.0) /
      vec2(1.0, uPlaneResolution.y / uPlaneResolution.x / (uTextureResolution2.y / uTextureResolution2.x)),
      vec2(0.0), vec2(1.0)
    );

    vec2 uv1 = vec2(vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5, (1.0 - vUv.y) * ratio1.y + (1.0 - ratio1.y) * 0.5);
    vec2 uv2 = vec2(vUv.x * ratio2.x + (1.0 - ratio2.x) * 0.5, (1.0 - vUv.y) * ratio2.y + (1.0 - ratio2.y) * 0.5);

    vec4 color1 = texture2D(uTexture1, uv1);
    vec4 color2 = texture2D(uTexture2, uv2);

    // Compute normalized noise map [0.0, 1.0]
    float noiseVal = (snoise() + 1.0) * 0.5;
    float grain = fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.08;
    float combinedNoise = clamp(noiseVal + grain - 0.04, 0.0, 1.0);

    // Guaranteed range: 0.0 at mixRatio=0, 1.0 at mixRatio=1
    float edge = 0.25;
    float threshold = mixRatio * (1.0 + 2.0 * edge) - edge;
    float dissolveFactor = 1.0 - smoothstep(threshold - edge, threshold + edge, 1.0 - combinedNoise);

    vec3 finalColor = mix(color1.rgb, color2.rgb, dissolveFactor);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const SLIDE_DURATION = 4500; // ms

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

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

    // Quad Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
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

    function createTexture(image: HTMLImageElement) {
      const tex = gl!.createTexture();
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, gl!.RGB, gl!.UNSIGNED_BYTE, image);
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
      // Cap dpr at 1.5 for buttery smooth 60fps performance on all displays
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniformLocsRef.current.uPlaneResolution, canvas.width, canvas.height);
      render();
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    // Preload all slides
    let loadedCount = 0;
    const loadedTextures: WebGLTexture[] = [];
    const loadedResolutions: { width: number; height: number }[] = [];

    HERO_SLIDES.forEach((slide, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const tex = createTexture(img);
        if (tex) {
          loadedTextures[idx] = tex;
          loadedResolutions[idx] = { width: img.naturalWidth || 1920, height: img.naturalHeight || 1080 };
        }
        loadedCount++;
        if (loadedCount === HERO_SLIDES.length) {
          texturesRef.current = loadedTextures;
          texResolutionsRef.current = loadedResolutions;

          // Initial Texture Setup: Slide 0 on both units
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, loadedTextures[0]);
          gl.uniform1i(locs.uTexture1, 0);
          gl.uniform2f(locs.uTexRes1, loadedResolutions[0].width, loadedResolutions[0].height);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, loadedTextures[0]);
          gl.uniform1i(locs.uTexture2, 1);
          gl.uniform2f(locs.uTexRes2, loadedResolutions[0].width, loadedResolutions[0].height);

          mixRatioRef.current = 0;
          render();
        }
      };
      img.src = slide.image;
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
  }, []);

  // Slide Transition Handler
  const goToSlide = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndexRef.current || isTransitioning) return;

    const gl = glRef.current;
    const locs = uniformLocsRef.current;
    const textures = texturesRef.current;
    const resolutions = texResolutionsRef.current;

    if (!gl || !locs || textures.length < HERO_SLIDES.length) {
      setCurrentIndex(targetIndex);
      setDisplayIndex(targetIndex);
      return;
    }

    setIsTransitioning(true);
    setSlideProgress(0);
    progressStartTimeRef.current = Date.now();

    const fromIdx = currentIndexRef.current;
    const toIdx = targetIndex;

    // Texture 0 = current slide, Texture 1 = incoming slide
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[fromIdx]);
    gl.uniform1i(locs.uTexture1, 0);
    gl.uniform2f(locs.uTexRes1, resolutions[fromIdx].width, resolutions[fromIdx].height);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
    gl.uniform1i(locs.uTexture2, 1);
    gl.uniform2f(locs.uTexRes2, resolutions[toIdx].width, resolutions[toIdx].height);

    mixRatioRef.current = 0;
    renderFnRef.current?.();

    // Staggered text exit animation
    const exitTl = gsap.timeline();
    exitTl.to([titleRef.current, descRef.current, actionsRef.current], {
      opacity: 0,
      y: -14,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setDisplayIndex(toIdx);
        // Staggered text entrance animation
        gsap.fromTo(
          [titleRef.current, descRef.current, actionsRef.current],
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.12,
          }
        );
      },
    });

    // 60FPS WebGL Simplex Noise Dissolve Reveal Animation
    const tweenObj = { val: 0 };
    gsap.to(tweenObj, {
      val: 1,
      duration: 2.8,
      ease: "sine.inOut",
      onUpdate: () => {
        mixRatioRef.current = tweenObj.val;
        renderFnRef.current?.();
      },
      onComplete: () => {
        // Settle textures: Texture 0 becomes the new active texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
        gl.uniform1i(locs.uTexture1, 0);
        gl.uniform2f(locs.uTexRes1, resolutions[toIdx].width, resolutions[toIdx].height);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[toIdx]);
        gl.uniform1i(locs.uTexture2, 1);
        gl.uniform2f(locs.uTexRes2, resolutions[toIdx].width, resolutions[toIdx].height);

        mixRatioRef.current = 0;
        renderFnRef.current?.();

        setCurrentIndex(toIdx);
        setIsTransitioning(false);
        progressStartTimeRef.current = Date.now();
      },
    });
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (currentIndexRef.current + 1) % HERO_SLIDES.length;
    goToSlide(next);
  }, [goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndexRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(prev);
  }, [goToSlide]);

  // Smooth Slide Progress Timer (Matching Red Bull's animated indicator)
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

  const activeSlide = HERO_SLIDES[displayIndex];

  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-black p-0 m-0">
      {/* Hardware-Accelerated WebGL Organic Liquid Noise Reveal Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none transform scale-100 will-change-transform"
      />

      {/* Cinematic Gradient Vignettes for Crystal-Clear Readability */}
      {/* <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/70 via-transparent to-black/90" /> */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-black/80 via-black/35 to-transparent w-full md:w-4/5" />

      {/* Bottom-Left Hero Content Overlay (Red Bull Editorial Layout) */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-16 lg:px-24 pb-12 sm:pb-16 md:pb-20 z-10 pointer-events-none">
        <div
          ref={textWrapperRef}
          className="max-w-4xl space-y-4 sm:space-y-6 pointer-events-auto"
        >
          {/* Bold Editorial Headline */}
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08] will-change-transform"
          >
            {activeSlide.title}
          </h1>

          {/* Editorial Description */}
          <p
            ref={descRef}
            className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-2xl will-change-transform"
          >
            {activeSlide.description}
          </p>

          {/* Action Row */}
          <div ref={actionsRef} className="pt-2 flex flex-wrap items-center gap-4 will-change-transform">
            <Button
              label={activeSlide.ctaText || "Explore more"}
              href={`/events/${activeSlide.slug}`}
              className="rounded-full"
            />

            <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium tracking-wide transition-all ">
              <svg
                className="w-4 h-4 text-[#cb2026]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{activeSlide.startDate}</span>
            </div>
          </div>

          {/* Interactive Animated Pagination Indicators */}
          <div className="pt-4 flex items-center gap-2.5">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`relative overflow-hidden transition-all duration-300 rounded-full cursor-pointer ${isActive
                    ? "w-12 sm:w-14 h-2 bg-white/30"
                    : "w-2.5 h-2 bg-white/40 hover:bg-white/75"
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
      </div>

      {/* Bottom-Right Controls: Prev/Next Glass Buttons */}
      <div className="absolute right-6 sm:right-10 md:right-16 lg:right-24 bottom-12 sm:bottom-16 md:bottom-20 z-10 flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            disabled={isTransitioning}
            aria-label="Previous Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={isTransitioning}
            aria-label="Next Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}