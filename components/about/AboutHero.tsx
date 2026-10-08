"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CanCanvas = dynamic(() => import("./CanCanvas"), { ssr: false });

export default function AboutHero() {
  const [rotate, setRotate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bottomTextRef = useRef<HTMLHeadingElement>(null);

  const handleRotate = () => {
    setRotate(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => { });
    }
  };

  // Pin the 3D canvas for the entire 200vh hero section using GSAP ScrollTrigger
  useGSAP(
    () => {
      const container = containerRef.current;
      const canvasWrapper = canvasWrapperRef.current;
      if (!container || !canvasWrapper) return;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        pin: canvasWrapper,
        pinSpacing: false,
        anticipatePin: 1,
        refreshPriority: 10,
      });

      // Fade out bottom text as soon as user starts scrolling
      if (bottomTextRef.current) {
        gsap.to(bottomTextRef.current, {
          opacity: 0,
          y: 20,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=160",
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[200vh] !p-0 !m-0 bg-[#f2f2f2] text-[#1b1b1b] select-none"
    >
      <style jsx global>{`
        @keyframes dashAnimation {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -100;
          }
        }
        .animate-dash-line {
          animation: dashAnimation 5s linear infinite;
        }
      `}</style>

      {/* ---------------- 3D CAN PINNED LAYER (z-20 so it renders on top of the center card video) ---------------- */}
      <div
        ref={canvasWrapperRef}
        className="absolute top-0 left-0 w-full h-screen z-20 pointer-events-none"
      >
        <CanCanvas rotate={rotate} setRotate={setRotate} />
      </div>

      {/* ---------------- SCROLLABLE 200VH CONTENT LAYER ---------------- */}
      <div className="relative w-full h-[200vh] flex flex-col pointer-events-auto">
        {/* ================= SECTION 1: HERO STATE 1 (100vh) ================= */}
        <div className="w-full h-screen relative flex flex-col items-center justify-center px-4 sm:px-8">
          {/* Central Title and Tagline */}
          <div className="flex flex-col items-center justify-center text-center gap-3 sm:gap-4 md:gap-5 max-w-5xl">
            <h1
              className="text-[12vw] md:text-[8vw] tracking-widest text-secondary leading-[1.08]"
            >
              {/* <span className="relative z-30 block">RED BULL</span> */}
              <span className="relative z-10 block text-primary">GIVES YOU </span>
              <span className="relative z-30 block text-primary"> WINGS</span>
            </h1>

            {/* Animated Dotted / Dashed Line */}
            <div className="w-full flex justify-center py-2 sm:py-3 relative z-10">
              <svg viewBox="0 0 800 2" className="w-[65%] md:w-[48%] h-[2px]">
                <line
                  x1="0"
                  y1="1"
                  x2="800"
                  y2="1"
                  stroke="#1b1b1b"
                  strokeWidth="2"
                  strokeDasharray="20, 6"
                  className="animate-dash-line"
                />
              </svg>
            </div>


          </div>
          <h2
            ref={bottomTextRef}
            className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium z-30 transition-opacity"
          >
            Pure. Refreshing. Blockchain-Powered.
          </h2>

          {/* Bottom Ecosystem / Partner Bar */}
          {/* <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[90vw] md:w-[80vw] max-w-7xl z-10 pointer-events-auto">
            <div className="flex items-center justify-between border border-[#1b1b1b] rounded-xl overflow-hidden bg-[#f6f6f6]/80 backdrop-blur-md shadow-sm">
              <div className="flex-1 h-14 sm:h-16 md:h-20 flex items-center justify-center px-3 sm:px-6 border-r border-[#1b1b1b] transition-colors hover:bg-black/5">
                <span className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L3.5 6.9v9.8L12 21.6l8.5-4.9V6.9L12 2zm6.5 13.7L12 19.4l-6.5-3.7V8.3L12 4.6l6.5 3.7v7.4z" />
                  </svg>
                  FOUNDED IN 1987
                </span>
              </div>

              <div className="flex-1 h-14 sm:h-16 md:h-20 flex items-center justify-center px-3 sm:px-6 border-r border-[#1b1b1b] transition-colors hover:bg-black/5">
                <span className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.5 5.5l19 3.5-13 12-6-15.5zm4 3.5l3.5 9 7.5-7-11-2z" />
                  </svg>
                  GIVES YOU WINGS
                </span>
              </div>

              <div className="hidden sm:flex flex-1 h-14 sm:h-16 md:h-20 items-center justify-center px-3 sm:px-6 border-r border-[#1b1b1b] transition-colors hover:bg-black/5">
                <span className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.5 3.5-3.5 3.5-3.5-3.5L12 2zm0 13l3.5 3.5-3.5 3.5-3.5-3.5 3.5-3.5zm-6.5-6.5L9 12 5.5 15.5 2 12l3.5-3.5zm13 0L22 12l-3.5 3.5-3.5-3.5 3.5-3.5zm-6.5 1.5l2 2-2 2-2-2 2-2z" />
                  </svg>
                  MORE THAN AN ENERGY DRINK
                </span>
              </div>

              <div className="flex-1 h-14 sm:h-16 md:h-20 flex items-center justify-center px-3 sm:px-6 border-r border-[#1b1b1b] transition-colors hover:bg-black/5">
                <span className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  BUILT FOR THE EXTRAORDINARY
                </span>
              </div>

              <div className="hidden md:flex flex-1 h-14 sm:h-16 md:h-20 items-center justify-center px-3 sm:px-6 transition-colors hover:bg-black/5">
                <span className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-wider text-[#1b1b1b] flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 6.5h14l-2.5 3H2.5L5 6.5zm-2.5 5.5H16.5l2.5 3H5l-2.5-3zm2.5 5.5h14l-2.5 3H2.5L5 17.5z" />
                  </svg>
                  SOLANA
                </span>
              </div>
            </div>
          </div> */}
        </div>

        {/* ================= SECTION 2: HERO STATE 2 (100vh) ================= */}
        <div className="hero-content-two w-full h-screen relative flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          {/* Left area: reserved for the tilted 3D can */}
          <div className="w-full md:w-1/2 h-[35vh] md:h-full pointer-events-none" />

          {/* Right Column: Editorial Welcome to the World of Red Bull */}
          <div className="hero-content-two-text w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6 z-30 pointer-events-auto max-w-xl lg:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2vw] font-bold tracking-tight text-primary leading-[1.12]">
              Welcome to the World of Red Bull
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#1b1b1b]/75 leading-relaxed font-normal">
              A world shaped by people who move with curiosity, take on new challenges, and bring their own energy to what they love. From sport and music to culture and adventure, step inside and discover the moments, ideas, and communities that make Red Bull what it is.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
