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
            },
          },
        });

        // Initial setup
        gsap.set(section1Ref.current, { xPercent: 0, x: 0 });
        gsap.set(section2Ref.current, { xPercent: 100, x: 0 });
        gsap.set(can1ContainerRef.current, { xPercent: 0, x: 0 });
        gsap.set(can2ContainerRef.current, { xPercent: -26, x: 0 });
        gsap.set(heroText1LayerRef.current, { opacity: 0, x: 60 });
        gsap.set(heroText2LayerRef.current, { opacity: 1, x: 0 });

        tl
          // Step 1: Can 1 starts center, glides left, Text 1 appears on right
          // .to({}, { duration: 0.6 })
          .to(
            can1ContainerRef.current,
            {
              xPercent: -26,
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
              duration: 1,
              ease: "power2.out",
            },
            "<0.5",
          )

          // Step 2: Hold Section 1
          // .to({}, { duration: 2.0 })

          // Step 3: Slide transition: Section 1 moves off to left, Section 2 slides in from right
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

        // Step 4: Hold Section 2 (Gold Can layout)
        // .to({}, { duration: 2.2 })

        // Step 5: Final animation: Section 2 moves off to the left side of the screen
        // .to(
        //   section2Ref.current,
        //   {
        //     xPercent: -100,
        //     x: 0,
        //     duration: 2.8,
        //     ease: "power2.inOut",
        //   },
        //   "slideOut2",
        // );
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
            },
          },
        });

        // Initial setup
        gsap.set(section1Ref.current, { xPercent: 0, x: 0 });
        gsap.set(section2Ref.current, { xPercent: 100, x: 0 });
        gsap.set(can1ContainerRef.current, { xPercent: 0, x: 0 });
        gsap.set(can2ContainerRef.current, { xPercent: -18, x: 0 });
        gsap.set(heroText1LayerRef.current, { opacity: 0, y: 30 });
        gsap.set(heroText2LayerRef.current, { opacity: 1, y: 0 });

        tl.to({}, { duration: 0.6 })
          .to(
            can1ContainerRef.current,
            {
              xPercent: -18,
              duration: 2.2,
              ease: "power2.inOut",
            },
            "step1",
          )
          .to(
            heroText1LayerRef.current,
            {
              opacity: 1,
              y: 0,
              duration: 1.8,
              ease: "power2.out",
            },
            "step1+=0.2",
          )
          .to({}, { duration: 1.8 })
          .to(
            section1Ref.current,
            {
              xPercent: -100,
              x: 0,
              duration: 3.0,
              ease: "power2.inOut",
            },
            "slide",
          )
          .to(
            section2Ref.current,
            {
              xPercent: 0,
              x: 0,
              duration: 3.0,
              ease: "power2.inOut",
            },
            "slide",
          )
          .to({}, { duration: 2.2 })
          .to(
            section2Ref.current,
            {
              xPercent: -100,
              x: 0,
              duration: 2.8,
              ease: "power2.inOut",
            },
            "slideOut2",
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
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: Blueberry Blackcurrant Can (Slides Left Off Screen) */}
        {/* ========================================================================= */}
        <div
          ref={section1Ref}
          className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform z-10"
        >
          {/* Text 1: Right Heading ("THE ULTIMATE ENERGY DRINK") */}
          <div
            ref={heroText1LayerRef}
            className="absolute inset-y-0 right-0 w-[55%] md:w-[50%] flex flex-col justify-center items-start px-4 sm:px-8 md:px-10 lg:px-14 xl:px-18 z-10 will-change-transform will-change-opacity"
            style={{ opacity: 0 }}
          >
            <div className="max-w-xl space-y-4">
              <h2
                className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary"
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
              <p className="text-xs sm:text-sm md:text-lg text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block">
                Engineered for world-class athletes, peak performers, and
                non-stop active lifestyles.
              </p>
              <Button
                label="View Product"
                href="/energy-drinks/carbonated-blackcurrant-blueberry-330ml"
              />
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
          {/* Text 2: Right Heading ("THE ORIGINAL GOLD FORMULA") */}
          <div
            ref={heroText2LayerRef}
            className="absolute inset-y-0 right-0 w-[55%] md:w-[50%] flex flex-col justify-center items-start px-4 sm:px-8 md:px-10 lg:px-14 xl:px-18 z-10 will-change-transform will-change-opacity"
          >
            <div className="max-w-xl space-y-4">
              <h2
                className="text-secondary font-bold uppercase tracking-tight leading-[0.92] font-primary"
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
              <p className="text-xs sm:text-sm md:text-lg text-secondary/70 max-w-md font-sans leading-relaxed hidden sm:block">
                Engineered for world-class athletes, peak performers, and
                non-stop active lifestyles.
              </p>
              <Button
                label="View Product"
                href="/energy-drinks/red-bull-250ml"
              />
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
