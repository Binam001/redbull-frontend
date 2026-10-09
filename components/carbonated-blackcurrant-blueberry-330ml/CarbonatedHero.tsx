"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CarbonatedCanCanvas = dynamic(
  () => import("./CarbonatedCanCanvas"),
  { ssr: false }
);

export default function CarbonatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Pin the 3D can canvas across the 2-screen container section
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
    },
    { scope: containerRef }
  );

  return (
    <div className="relative w-full">
      {/* ======================================================== */}
      {/* 2-SCREEN SCROLL CONTAINER WITH PINNED 3D RED BULL CAN   */}
      {/* ======================================================== */}
      <div ref={containerRef} className="relative w-full">
        {/* ---------------- 3D CAN PINNED LAYER ---------------- */}
        <div
          ref={canvasWrapperRef}
          className="absolute top-0 left-0 w-full h-screen z-20 pointer-events-none"
        >
          <CarbonatedCanCanvas />
        </div>

        {/* ---------------- SECTION 1 (Hero State 1) ---------------- */}
        <section className="relative z-10 h-screen w-full overflow-hidden">
          <div className="flex flex-col-reverse xl:flex-row items-center justify-center w-full h-full">
            {/* Left Column Text (Bottom half on mobile, Left half on desktop) */}
            <div className="xl:w-1/2 w-full h-1/2 xl:h-full flex flex-col justify-center text-center xl:text-left gap-4 xl:gap-8">
              <div className="flex flex-col gap-4 leading-relaxed">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  When the Day,
                  <br />
                  Calls for More
                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl">
                  Some days move to their own rhythm: a busy morning, a late study session, one more match, one more mile. When the moment asks you to keep going, reach for a refreshingly different kind of energy.
                </p>
              </div>
            </div>

            {/* Spacer Column (Top half on mobile, Right half on desktop) where 3D can floats at first */}
            <div className="w-full xl:w-1/2 h-1/2 xl:h-full pointer-events-none" />
          </div>
        </section>

        {/* ---------------- SECTION 2 (Hero State 2) ---------------- */}
        <section className="carbonated-hero-section-two relative z-10 h-screen w-full overflow-hidden">
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full">
            {/* Spacer Column (Top half on mobile, Left half on desktop) where 3D can lands tilted */}
            <div className="w-full xl:w-1/2 h-1/2 xl:h-full pointer-events-none" />

            {/* Right Column Text (Bottom half on mobile, Right half on desktop) */}
            <div className="xl:w-1/2 w-full h-1/2 xl:h-full flex flex-col justify-center xl:items-end text-center xl:text-right gap-4 xl:gap-8 px-6 sm:px-12 md:px-16 lg:px-24">
              <div className="xl:ml-auto flex flex-col gap-4 leading-relaxed max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  Blackcurrant.
                  <br />
                  Blueberry. Your Move.
                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
                  Bold blackcurrant meets juicy blueberry in a smooth, sparkling flavor that brings a fresh twist to your routine. Crack open the New-Gen Can, take a sip, and find your flow—wherever the day takes you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

