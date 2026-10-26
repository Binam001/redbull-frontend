"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GoldCanCanvas = dynamic(() => import("./GoldCanCanvas"), { ssr: false });

export default function ProductsHero() {
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
    { scope: containerRef },
  );

  return (
    <div className="relative w-full">
      {/* ======================================================== */}
      {/* 2-SCREEN SCROLL CONTAINER WITH PINNED 3D GOLD CAN       */}
      {/* ======================================================== */}
      <div
        ref={containerRef}
        className="products-hero-scroll-container relative w-full"
      >
        {/* ---------------- 3D CAN PINNED LAYER ---------------- */}
        <div
          ref={canvasWrapperRef}
          className="absolute top-0 left-0 w-full h-svh z-20 pointer-events-none"
        >
          <GoldCanCanvas />
        </div>

        {/* ---------------- SECTION 1 (Hero State 1) ---------------- */}
        <section className="relative z-10 h-svh lg:min-h-[75vh] w-full flex items-center justify-center py-8 xl:py-16 overflow-hidden">
          <div className="flex flex-col justify-end xl:justify-center xl:flex-row items-center w-full h-full">
            {/* Left Column Text (Bottom on mobile/tablet, Left half on desktop) */}
            <div className="xl:w-1/2 w-full flex flex-col justify-center items-center xl:items-start text-center xl:text-left gap-4 xl:gap-6 px-6 sm:px-8 xl:px-0 pb-8 sm:pb-12 xl:pb-0">
              <div className="flex flex-col items-center xl:items-start gap-3 sm:gap-4 leading-relaxed w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  Every Great Journey,
                  <br />
                  Begins with a Spark
                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl mx-auto xl:mx-0">
                  Before the finish line, before the applause, before the moment
                  everyone remembers—there’s a first step. A quiet decision to
                  move, to try, to see how far you can go. Red Bull® Gold is
                  made for the moments when your day is ready to begin.
                </p>
              </div>
            </div>

            {/* Spacer Column (Desktop only where 3D gold can floats at first) */}
            <div className="hidden xl:block xl:w-1/2 pointer-events-none" />
          </div>
        </section>

        {/* ---------------- SECTION 2 (Hero State 2) ---------------- */}
        <section className="products-hero-section-two relative z-10 h-svh lg:min-h-[75vh] w-full flex items-center justify-center py-8 xl:py-16 overflow-hidden">
          <div className="flex flex-col justify-end xl:justify-center xl:flex-row items-center w-full h-full">
            {/* Spacer Column (Desktop only where 3D gold can lands tilted) */}
            <div className="hidden xl:block xl:w-1/2 pointer-events-none" />

            {/* Right Column Text (Bottom on mobile/tablet, Right half on desktop) */}
            <div className="xl:w-1/2 w-full flex flex-col justify-center items-center xl:items-end text-center xl:text-right gap-4 xl:gap-6 px-6 sm:px-12 md:px-16 lg:px-24 pb-8 sm:pb-12 xl:pb-0">
              <div className="flex flex-col items-center xl:items-end gap-3 sm:gap-4 leading-relaxed max-w-3xl w-full xl:ml-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  One Step Becomes
                  <br />
                  Something More
                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl mx-auto xl:mx-0">
                  A morning run turns into a new personal best. A long day
                  becomes a chance to finish what you started. With taurine and
                  B-group vitamins, Red Bull® Gold is a companion for active
                  days and the ambitions that carry you through them.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
