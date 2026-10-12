"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

gsap.registerPlugin(ScrollTrigger);

const HeroTryCanCanvas = dynamic(
  () => import("./HeroTryCanCanvas"),
  { ssr: false }
);

export default function HeroTry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Can container ref for smooth horizontal translation
  const canContainerRef = useRef<HTMLDivElement>(null);

  // Text layers:
  // Text 1: "THE ULTIMATE ENERGY DRINK" on the right
  const heroTextLayerRef = useRef<HTMLDivElement>(null);
  // Text 2: "BUILT FOR ELITES" on the left (commented out)
  const endingTextLayerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress and indicator
  const scrollProgressRef = useRef<number>(0);
  const scrollLabelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop & Tablet Animation
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            refreshPriority: 12,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
              if (scrollLabelRef.current) {
                scrollLabelRef.current.style.opacity =
                  self.progress > 0.05 ? "0" : "1";
              }
            },
          },
        });

        // Initial setup: bottle centered, text layers hidden
        gsap.set(canContainerRef.current, { xPercent: 0 });
        gsap.set(heroTextLayerRef.current, { opacity: 0, x: 60 });
        if (endingTextLayerRef.current) {
          gsap.set(endingTextLayerRef.current, { opacity: 0, x: -60 });
        }

        tl
          // Initial state: bottle remains centered with no background text
          .to({}, { duration: 0.8 })

          // Phase 1: Bottle moves to the LEFT; "THE ULTIMATE ENERGY DRINK" appears on the RIGHT
          .to(
            canContainerRef.current,
            {
              xPercent: -26,
              duration: 2.4,
              ease: "power2.inOut",
            },
            "step1"
          )
          .to(
            heroTextLayerRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 1.8,
              ease: "power2.out",
            },
            "step1+=0.3"
          )

          // Final hold: Bottle stays on the left and text on the right
          .to({}, { duration: 1.6 });

        /*
        // --- PHASE 2: BUILT FOR ELITES (commented out as requested) ---
        tl
          .to(
            heroTextLayerRef.current,
            {
              opacity: 0,
              x: 50,
              duration: 1.2,
              ease: "power2.in",
            },
            "step2"
          )
          .to(
            canContainerRef.current,
            {
              xPercent: 26,
              duration: 2.6,
              ease: "power2.inOut",
            },
            "step2"
          )
          .to(
            endingTextLayerRef.current,
            {
              opacity: 1,
              x: 0,
              duration: 2.0,
              ease: "power2.out",
            },
            "step2+=0.35"
          )
          .to({}, { duration: 2.0 });
        */
      });

      // Mobile Animation
      mm.add("(max-width: 767px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            refreshPriority: 12,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
              if (scrollLabelRef.current) {
                scrollLabelRef.current.style.opacity =
                  self.progress > 0.05 ? "0" : "1";
              }
            },
          },
        });

        // Initial setup
        gsap.set(canContainerRef.current, { xPercent: 0 });
        gsap.set(heroTextLayerRef.current, { opacity: 0, y: 30 });
        if (endingTextLayerRef.current) {
          gsap.set(endingTextLayerRef.current, { opacity: 0, y: 30 });
        }

        tl
          // Initial center hold
          .to({}, { duration: 0.8 })

          // Phase 1: Bottle moves slightly left, text appears on right
          .to(
            canContainerRef.current,
            {
              xPercent: -18,
              duration: 2.4,
              ease: "power2.inOut",
            },
            "step1"
          )
          .to(
            heroTextLayerRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1.8,
              ease: "power2.out",
            },
            "step1+=0.3"
          )

          // Hold
          .to({}, { duration: 1.6 });

        /*
        // --- PHASE 2: BUILT FOR ELITES (commented out as requested) ---
        tl
          .to(
            heroTextLayerRef.current,
            {
              opacity: 0,
              y: -20,
              duration: 1.2,
              ease: "power2.in",
            },
            "step2"
          )
          .to(
            canContainerRef.current,
            {
              xPercent: 18,
              duration: 2.6,
              ease: "power2.inOut",
            },
            "step2"
          )
          .to(
            endingTextLayerRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 2.0,
              ease: "power2.out",
            },
            "step2+=0.35"
          )
          .to({}, { duration: 2.0 });
        */
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full text-black select-none"
      style={{
        height: "180vh",
        fontFamily: "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* STICKY HERO VIEWPORT (100VH) */}
      {/* ========================================================================= */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* Layer 1: Right Heading ("THE ULTIMATE ENERGY DRINK") - visible when can moves left */}
        <div
          ref={heroTextLayerRef}
          className="absolute inset-y-0 right-0 w-[55%] md:w-[50%] flex flex-col justify-center items-start px-4 sm:px-8 md:px-10 lg:px-14 xl:px-18 pointer-events-none z-10 will-change-transform will-change-opacity"
          style={{ opacity: 0 }}
        >
          <div className="max-w-xl">
            {/* <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-8 md:w-12 h-[2px] bg-primary"></span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.25em] text-secondary font-bold uppercase">
                Vitalizes Body &amp; Mind
              </span>
            </div> */}
            <h2
              className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary select-none"
              style={{
                fontSize: "clamp(1.8rem, 4.4vw, 5.2rem)",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="block whitespace-nowrap">THE ULTIMATE</span>
              <span className="block whitespace-nowrap mt-1 sm:mt-2">
                <span className="text-primary">ENERGY</span> DRINK
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-lg text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block">
              Engineered for world-class athletes, peak performers, and non-stop active lifestyles.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Layer 2: Left Heading ("BUILT FOR ELITES") (commented out as requested)   */}
        {/* ========================================================================= */}
        {/*
        <div
          ref={endingTextLayerRef}
          className="absolute inset-y-0 left-0 w-[55%] md:w-[50%] flex flex-col justify-center items-start px-4 sm:px-8 md:px-10 lg:px-14 xl:px-18 pointer-events-none z-10 will-change-transform will-change-opacity"
          style={{ opacity: 0 }}
        >
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
              <span className="w-8 md:w-12 h-[2px] bg-primary"></span>
              <span className="text-[10px] sm:text-xs md:text-sm font-sans tracking-[0.25em] text-secondary font-bold uppercase">
                Peak Performance
              </span>
            </div>
            <h2
              className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary select-none"
              style={{
                fontSize: "clamp(1.8rem, 4.4vw, 5.2rem)",
                letterSpacing: "-0.01em",
              }}
            >
              <span className="block whitespace-nowrap">BUILT FOR</span>
              <span className="block whitespace-nowrap mt-1 sm:mt-2 text-primary">ELITES</span>
            </h2>
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block">
              When extreme focus, endurance, and uncompromising speed are demanded at the highest level.
            </p>
          </div>
        </div>
        */}

        {/* Layer 3: 3D Red Bull Can Canvas - Moves horizontally to the left */}
        <div
          ref={canContainerRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform"
        >
          <HeroTryCanCanvas scrollProgressRef={scrollProgressRef} />
        </div>

        {/* Layer 4: Bottom Indicator (Scroll label - Centered) */}
        {/* <footer className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center pointer-events-none">
          <div
            ref={scrollLabelRef}
            className="text-secondary/70 font-medium tracking-widest text-xs uppercase flex flex-col items-center gap-2 will-change-opacity transition-opacity duration-300"
            style={{
              opacity: 1,
              fontFamily: "'BeausiteClassic-Medium', sans-serif",
            }}
          >
            <span>Scroll to Explore</span>
            <div className="w-[1px] h-6 bg-secondary/20 relative overflow-hidden">
              <div className="w-full h-1/2 bg-primary animate-bounce"></div>
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  );
}