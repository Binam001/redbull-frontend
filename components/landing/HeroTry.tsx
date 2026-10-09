"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import FluidBackground from "@/components/about/FluidBackground";

gsap.registerPlugin(ScrollTrigger);

const HeroTryCanCanvas = dynamic(
  () => import("./HeroTryCanCanvas"),
  { ssr: false }
);

// Video code commented out for now:
// const START_FRAME = 5;
// const TOTAL_FRAMES = 219; // Comp 1_00005.webp through Comp 1_00223.webp (223 - 5 + 1)

export default function HeroTry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Video frame sequence refs (commented out for now):
  // const frameCanvasRef = useRef<HTMLCanvasElement>(null);
  // const imagesRef = useRef<HTMLImageElement[]>([]);
  // const currentFrameRef = useRef<number>(0);
  // const frameDrawnRef = useRef<number>(-1);

  // Direct DOM refs to eliminate React re-renders during scroll
  const canContainerRef = useRef<HTMLDivElement>(null);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);

  // Marquee horizontal scroll ref & container ref
  const marqueeOffsetRef = useRef<number>(0);
  const marqueeLayerRef = useRef<HTMLDivElement>(null);

  // Hero text container ref (THE ULTIMATE ENERGY DRINK)
  const heroTextLayerRef = useRef<HTMLDivElement>(null);
  // Ending text container ref (appears as video approaches end)
  const endingTextLayerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress
  const scrollProgressRef = useRef<number>(0);
  const scrollLabelRef = useRef<HTMLDivElement>(null);

  /*
  // --- 2. FRAME SEQUENCE PRELOADING (commented out for now) ---
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    async function loadAllFrames() {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frameNum = START_FRAME + i;
        const pad = frameNum.toString().padStart(5, "0");
        const img = new Image();
        img.src = `/bottle-frames/Comp%201_${pad}.webp`;
        images.push(img);
      }
      imagesRef.current = images;

      const priorityCount = 15;
      const priorityPromises = images.slice(0, priorityCount).map(
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

      if (!isCancelled) {
        drawFrame(0);
      }

      images.forEach((img, index) => {
        if (index < priorityCount) return;
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

  // --- 3. DRAW CURRENT FRAME TO CANVAS (commented out for now) ---
  const drawFrame = (frameIndex: number) => {
    const canvas = frameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      const images = imagesRef.current;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = frameIndex - offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
          img = images[prev];
          break;
        }
        const next = frameIndex + offset;
        if (next < TOTAL_FRAMES && images[next]?.complete && images[next]?.naturalWidth > 0) {
          img = images[next];
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const fw = img.naturalWidth || 1920;
    const fh = img.naturalHeight || 1080;
    const canvasRatio = cw / ch;
    const frameRatio = fw / fh;

    let dw = cw;
    let dh = ch;
    let dx = 0;
    let dy = 0;

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

  // Canvas size sync (commented out for now)
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
  */

  // --- 4. ENTRANCE INITIALIZATION ---
  useEffect(() => {
    if (canContainerRef.current) {
      canContainerRef.current.style.transform = "scale(1)";
      canContainerRef.current.style.opacity = "1";
    }
    if (heroTextLayerRef.current) {
      heroTextLayerRef.current.style.transform = "translate3d(0, 0, 0)";
      heroTextLayerRef.current.style.opacity = "1";
    }
  }, []);

  // --- 5. MARQUEE CONTINUOUS LOOP ---
  useEffect(() => {
    let animId: number;
    const speed = 1.2; // px per frame

    function loop() {
      marqueeOffsetRef.current -= speed;
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

          // 1. Frame sequence scrubbing (commented out for now):
          // const frame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(p * (TOTAL_FRAMES - 1))));
          // currentFrameRef.current = frame;
          // drawFrame(frame);

          // 2. Marquee opacity: Fades out from 1 to 0 between scroll 0.0 and 0.28
          if (marqueeLayerRef.current) {
            marqueeLayerRef.current.style.opacity = p < 0.28 ? `${Math.max(0, 1 - p / 0.28)}` : "0";
          }

          // 3. Hero Text ("THE ULTIMATE ENERGY DRINK") is visible immediately when pinned, then floats up
          if (heroTextLayerRef.current) {
            if (p <= 0.28) {
              heroTextLayerRef.current.style.opacity = "1";
              heroTextLayerRef.current.style.transform = "translate3d(0, 0, 0)";
            } else if (p < 0.50) {
              const rel = (p - 0.28) / 0.22; // 0 to 1
              const y = -rel * 60;
              const op = Math.max(0, 1 - rel);
              heroTextLayerRef.current.style.opacity = `${op}`;
              heroTextLayerRef.current.style.transform = `translate3d(0, ${y}vh, 0)`;
            } else {
              heroTextLayerRef.current.style.opacity = "0";
              heroTextLayerRef.current.style.transform = "translate3d(0, -60vh, 0)";
            }
          }

          // 3b. Ending Hero Text ("BUILT FOR ELITES") rises smoothly and stays centered
          if (endingTextLayerRef.current) {
            if (p < 0.45) {
              endingTextLayerRef.current.style.opacity = "0";
              endingTextLayerRef.current.style.transform = "translate3d(0, 60vh, 0)";
            } else if (p < 0.70) {
              const rel = (p - 0.45) / 0.25; // 0 to 1
              const y = 60 * (1 - rel);
              const op = Math.min(1, Math.max(0, rel));
              endingTextLayerRef.current.style.opacity = `${op}`;
              endingTextLayerRef.current.style.transform = `translate3d(0, ${y}vh, 0)`;
            } else {
              endingTextLayerRef.current.style.opacity = "1";
              endingTextLayerRef.current.style.transform = "translate3d(0, 0, 0)";
            }
          }

          // 4. Scroll indicator fades out immediately on scroll
          if (scrollLabelRef.current) {
            scrollLabelRef.current.style.opacity = p > 0.04 ? `${Math.max(0, 1 - (p - 0.04) * 15)}` : "1";
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full text-black select-none"
      style={{
        height: "220vh",
        fontFamily: "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* 3. STICKY HERO VIEWPORT (100VH) */}
      {/* ========================================================================= */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Layer A: WebGL Background Canvas with Fluid Shader */}
        {/* <FluidBackground /> */}

        {/* Layer B: Marquee Text (Freeze. Shake. Drink.) - Behind the Can */}
        <div
          ref={marqueeLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden will-change-opacity"
          style={{
            opacity: 0,
          }}
        >
        </div>

        {/* Layer C: Hero Heading (THE ULTIMATE ENERGY DRINK) - Visible immediately when pinned */}
        <div
          ref={heroTextLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 text-center will-change-transform will-change-opacity"
          style={{
            transform: "translate3d(0, 0, 0)",
            opacity: 1,
          }}
        >
          <p
            className="text-secondary font-light! uppercase tracking-tight leading-[0.84] max-w-[95vw] font-primary"
            style={{
              fontSize: "clamp(3.8rem, 8vw, 15rem)",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block">THE ULTIMATE</span>
            <span className="block"><span className="text-primary">ENERGY</span> DRINK</span>
          </p>
        </div>

        {/* Layer C2: Ending Heading (BUILT FOR ELITES) */}
        <div
          ref={endingTextLayerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4 text-center will-change-transform will-change-opacity"
          style={{
            transform: "translate3d(0, 60vh, 0)",
            opacity: 0,
          }}
        >
          <p
            className="text-secondary font-light! uppercase tracking-tight leading-[0.84] max-w-[95vw] font-primary"
            style={{
              fontSize: "clamp(3.8rem, 8vw, 15rem)",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block">BUILT FOR</span>
            <span className="block text-primary">ELITES</span>
          </p>
        </div>

        {/* Layer D: 3D Red Bull Can - In front of text */}
        <div
          ref={canContainerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform will-change-opacity"
          style={{
            transform: "scale(1)",
            opacity: 1,
          }}
        >
          {/* Previous Frame Sequence Canvas (commented out for now): */}
          {/* <canvas
            ref={frameCanvasRef}
            className="w-full h-full object-contain pointer-events-none"
          /> */}

          {/* 3D Red Bull Can Canvas with smooth unique rotation */}
          <HeroTryCanCanvas scrollProgressRef={scrollProgressRef} />
        </div>

        {/* Layer E: Bottom Indicators (Scroll label - Centered) */}
        <footer className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center pointer-events-none">
          <div
            ref={scrollLabelRef}
            className="text-white/80 font-medium tracking-wide text-sm md:text-base flex items-center justify-center will-change-opacity transition-opacity duration-300"
            style={{
              opacity: 1,
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