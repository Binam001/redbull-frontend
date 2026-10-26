"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Button from "../shared/Button";

gsap.registerPlugin(ScrollTrigger);

const HeroTryCanCanvas = dynamic(() => import("./HeroTryCanCanvas"), {
  ssr: false,
});

const HeroTryGoldCanCanvas = dynamic(() => import("./HeroTryGoldCanCanvas"), {
  ssr: false,
});

export default function HeroTry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Section 1 refs (Blueberry Blackcurrant can)
  const section1Ref = useRef<HTMLDivElement>(null);
  const can1ContainerRef = useRef<HTMLDivElement>(null);
  const heroText1LayerRef = useRef<HTMLDivElement>(null);

  // Section 2 refs (Gold Can model)
  const section2Ref = useRef<HTMLDivElement>(null);
  const can2ContainerRef = useRef<HTMLDivElement>(null);
  const heroText2LayerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress reference
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop Animation (>= 1024px: Side-by-Side layout)
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            refreshPriority: 12,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        });

        // Initial setup for Desktop
        gsap.set(section1Ref.current, { xPercent: 0, x: 0 });
        gsap.set(section2Ref.current, { xPercent: 100, x: 0 });
        gsap.set(can1ContainerRef.current, {
          xPercent: 0,
          x: 0,
          yPercent: 0,
          y: 0,
          scale: 1,
        });
        gsap.set(can2ContainerRef.current, {
          xPercent: -26,
          x: 0,
          yPercent: 0,
          y: 0,
          scale: 1,
        });
        gsap.set(heroText1LayerRef.current, { opacity: 0, x: 60, y: 0 });
        gsap.set(heroText2LayerRef.current, { opacity: 1, x: 0, y: 0 });

        tl
          // Step 1: Can 1 starts center, glides left, Text 1 appears on right
          .to(
            can1ContainerRef.current,
            {
              xPercent: -26,
              yPercent: 0,
              scale: 1,
              duration: 1,
              ease: "power2.inOut",
            },
            "step1",
          )
          .to(
            heroText1LayerRef.current,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "<0.5",
          )

          // Step 2: Slide transition: Section 1 moves off to left, Section 2 slides in from right
          .to(
            section1Ref.current,
            {
              xPercent: -100,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          )
          .to(
            section2Ref.current,
            {
              xPercent: 0,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          );
      });

      // Tablet Animation (768px - 1023px: Vertical Stack with scaled-down can)
      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            refreshPriority: 12,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        });

        // Initial setup for Tablet: can in dead-center initially with scale 0.88
        gsap.set(section1Ref.current, { xPercent: 0, x: 0 });
        gsap.set(section2Ref.current, { xPercent: 100, x: 0 });
        gsap.set(can1ContainerRef.current, {
          xPercent: 0,
          x: 0,
          yPercent: 0,
          y: 0,
          scale: 0.88,
        });
        gsap.set(can2ContainerRef.current, {
          xPercent: 0,
          x: 0,
          yPercent: -10,
          y: 0,
          scale: 0.90,
        });
        gsap.set(heroText1LayerRef.current, { opacity: 0, x: 0, y: 30 });
        gsap.set(heroText2LayerRef.current, { opacity: 1, x: 0, y: 0 });

        tl
          // Step 1: Can 1 glides up gently to clear text, Text 1 appears centered at bottom
          .to(
            can1ContainerRef.current,
            {
              yPercent: -10,
              xPercent: 0,
              scale: 0.88,
              duration: 1,
              ease: "power2.inOut",
            },
            "step1",
          )
          .to(
            heroText1LayerRef.current,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "<0.5",
          )

          // Step 2: Slide transition
          .to(
            section1Ref.current,
            {
              xPercent: -100,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          )
          .to(
            section2Ref.current,
            {
              xPercent: 0,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          );
      });

      // Mobile Animation (< 768px)
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
            },
          },
        });

        // Initial setup for Mobile: can on top, content at bottom
        gsap.set(section1Ref.current, { xPercent: 0, x: 0 });
        gsap.set(section2Ref.current, { xPercent: 100, x: 0 });
        gsap.set(can1ContainerRef.current, {
          xPercent: 0,
          x: 0,
          yPercent: 0,
          y: 0,
          scale: 0.82,
        });
        gsap.set(can2ContainerRef.current, {
          xPercent: 0,
          x: 0,
          yPercent: -6,
          y: 0,
          scale: 0.95,
        });
        gsap.set(heroText1LayerRef.current, { opacity: 0, x: 0, y: 30 });
        gsap.set(heroText2LayerRef.current, { opacity: 1, x: 0, y: 0 });

        tl
          // Step 1: Can 1 glides up to top, Text 1 appears at bottom
          .to(
            can1ContainerRef.current,
            {
              yPercent: -6,
              xPercent: 0,
              scale: 0.80,
              duration: 1,
              ease: "power2.inOut",
            },
            "step1",
          )
          .to(
            heroText1LayerRef.current,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            "<0.5",
          )

          // Step 2: Slide transition: Section 1 moves off to left, Section 2 slides in from right
          .to(
            section1Ref.current,
            {
              xPercent: -100,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          )
          .to(
            section2Ref.current,
            {
              xPercent: 0,
              x: 0,
              duration: 1.0,
              ease: "power2.inOut",
            },
            "slide",
          );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full text-black"
      style={{
        height: "400vh",
        fontFamily:
          "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ========================================================================= */}
      {/* STICKY HERO VIEWPORT (100VH) */}
      {/* ========================================================================= */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-svh w-full overflow-hidden flex items-center justify-center"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: Blueberry Blackcurrant Can (Slides Left Off Screen) */}
        {/* ========================================================================= */}
        <div
          ref={section1Ref}
          className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform z-10"
        >
          {/* Text 1: Heading & CTA Button (Bottom on mobile/tablet, Right on desktop) */}
          <div
            ref={heroText1LayerRef}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-0 inset-x-0 lg:inset-x-auto lg:top-0 lg:inset-y-0 lg:right-0 w-full lg:w-[50%] flex flex-col justify-end lg:justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-8 md:px-12 lg:px-14 xl:px-18 z-30 will-change-transform will-change-opacity pointer-events-auto"
            style={{ opacity: 0 }}
          >
            <div className="max-w-xl space-y-3 sm:space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2
                className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary text-center lg:text-left"
                style={{
                  fontSize: "clamp(1.75rem, 4.4vw, 5.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                <span className="block whitespace-nowrap">THE ULTIMATE</span>
                <span className="block whitespace-nowrap mt-1 sm:mt-2">
                  <span className="text-primary">ENERGY</span> DRINK
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block text-center lg:text-left">
                Engineered for world-class athletes, peak performers, and
                non-stop active lifestyles.
              </p>
              <div className="flex justify-center lg:justify-start w-full">
                <Button
                  label="View Product"
                  href="/energy-drinks/carbonated-blackcurrant-blueberry-330ml"
                />
              </div>
            </div>
          </div>

          {/* Can 1: 3D Red Bull Can Canvas */}
          <div
            ref={can1ContainerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform"
          >
            <HeroTryCanCanvas scrollProgressRef={scrollProgressRef} />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: Gold Can Model Layout (Slides In From Right) */}
        {/* ========================================================================= */}
        <div
          ref={section2Ref}
          className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform z-20"
        >
          {/* Text 2: Heading & CTA Button (Bottom on mobile/tablet, Right on desktop) */}
          <div
            ref={heroText2LayerRef}
            className="absolute bottom-6 sm:bottom-8 md:bottom-10 lg:bottom-0 inset-x-0 lg:inset-x-auto lg:top-0 lg:inset-y-0 lg:right-0 w-full lg:w-[50%] flex flex-col justify-end lg:justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-8 md:px-12 lg:px-14 xl:px-18 z-30 will-change-transform will-change-opacity pointer-events-auto"
          >
            <div className="max-w-xl space-y-3 sm:space-y-4 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2
                className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary text-center lg:text-left"
                style={{
                  fontSize: "clamp(1.75rem, 4.4vw, 5.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                <span className="block whitespace-nowrap">THE ULTIMATE</span>
                <span className="block whitespace-nowrap mt-1 sm:mt-2">
                  <span className="text-primary">ENERGY</span> DRINK
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block text-center lg:text-left">
                Engineered for world-class athletes, peak performers, and
                non-stop active lifestyles.
              </p>
              <div className="flex justify-center lg:justify-start w-full">
                <Button
                  label="View Product"
                  href="/energy-drinks/red-bull-250ml"
                />
              </div>
            </div>
          </div>

          {/* Can 2: 3D Gold Can Canvas (Left side of Section 2) */}
          <div
            ref={can2ContainerRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 will-change-transform"
          >
            <HeroTryGoldCanCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
