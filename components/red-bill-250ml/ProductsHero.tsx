"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/providers/LenisProvider";

import Button from "@/components/shared/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ProductsHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useLenis();

  const handleScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (scrollTo) {
      scrollTo("#aspire-section-3", { duration: 1.2 });
    } else {
      const el = document.getElementById("aspire-section-3");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const video = videoContainerRef.current;
    if (!container || !video) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop animation: travel across and down from right (Section 1) to left (Section 2)
      mm.add("(min-width: 1280px)", () => {
        gsap.to(video, {
          xPercent: -100,
          yPercent: 100,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // Mobile / Tablet animation: travel down 90vh to land into Section 2 top half
      mm.add("(max-width: 1279px)", () => {
        gsap.to(video, {
          y: "90vh",
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full">
      {/* ======================================================== */}
      {/* 2-SCREEN SCROLL CONTAINER WITH ANIMATED FLYING SHOE VIDEO */}
      {/* ======================================================== */}
      <div ref={containerRef} className="relative w-full">


        {/* ---------------- SECTION 1 (Hero State 1) ---------------- */}
        <section className="relative z-20 h-dvh w-full overflow-hidden">
          <div className="flex flex-col-reverse xl:flex-row items-center justify-center w-full h-full">
            {/* Left Column Text (Bottom half on mobile, Left half on desktop) */}
            <div className="xl:w-1/2 w-full h-1/2 xl:h-full flex flex-col justify-center text-center xl:text-left gap-4 xl:gap-8 ">
              <div className="flex flex-col gap-4 leading-relaxed">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  Every Great Journey,
                  <br />
                  Begins with a Spark
                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl ">
                  Before the finish line, before the applause, before the moment everyone remembers—there’s a first step. A quiet decision to move, to try, to see how far you can go. Red Bull® Gold is made for the moments when your day is ready to begin.
                </p>
              </div>

              {/* <div className="flex justify-center xl:justify-start">
                <Button
                  label="Discover Red Bull"
                  variant="solid"
                  className="rounded-full"
                  onClick={handleScrollClick}
                />
              </div> */}
            </div>

            {/* Spacer Column (Top half on mobile, Right half on desktop) where the video is located */}
            <div className="w-full xl:w-1/2 h-1/2 xl:h-full pointer-events-none" />
          </div>
        </section>

        {/* ---------------- SECTION 2 (Hero State 2) ---------------- */}
        <section className="relative z-20 h-dvh w-full overflow-hidden">
          <div className="flex flex-col xl:flex-row items-center justify-center w-full h-full">
            {/* Spacer Column (Top half on mobile, Left half on desktop) where video lands */}
            <div className="w-full xl:w-1/2 h-1/2 xl:h-full pointer-events-none" />

            {/* Right Column Text (Bottom half on mobile, Right half on desktop) */}
            <div className="xl:w-1/2 w-full h-1/2 xl:h-full flex flex-col justify-center xl:items-end text-center xl:text-right gap-4 xl:gap-8 ">
              <div className="xl:ml-auto flex flex-col gap-4 leading-relaxed max-w-3xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                  One Step Becomes
                  <br />
                  Something More

                  <br />
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl ">
                  A morning run turns into a new personal best. A long day becomes a chance to finish what you started. With taurine and B-group vitamins, Red Bull® Gold is a companion for active days and the ambitions that carry you through them.
                </p>
              </div>

              {/* <div className="flex justify-center xl:justify-end">
                <Button
                  label="Contact Us"
                  variant="solid"
                  className="rounded-full"
                  onClick={handleScrollClick}
                />
              </div> */}
            </div>
          </div>
        </section>

        {/* ---------------- ABSOLUTE FLYING VIDEO LAYER ---------------- */}
        <div
          ref={videoContainerRef}
          className="absolute top-0 right-0 w-full xl:w-1/2 h-[50vh] xl:h-dvh z-10 pointer-events-none flex items-center justify-center will-change-transform"
        >
          <div className="w-full h-full relative flex items-center justify-center">
            <video
              src="/videos/shoes-video-11.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="pointer-events-none object-cover w-full h-full scale-[0.9] brightness-110"
            />
            {/* Subtle soft edge fades to blend with background on all viewports */}
            <div className="absolute inset-0 bg-linear-to-t from-white via-15% via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-l from-white via-20% via-transparent to-transparent pointer-events-none" />
            <div className="xl:hidden absolute inset-0 bg-linear-to-b from-white via-15% via-transparent to-transparent pointer-events-none" />
            <div className="xl:hidden absolute inset-0 bg-linear-to-r from-white via-20% via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

