"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SkydivingStartSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const diverRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !diverRef.current) return;

      // 1. Cloud fog slides up in Section 1
      if (fogRef.current && section1Ref.current) {
        gsap.to(fogRef.current, {
          yPercent: -120,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top 30%",
            end: "bottom center",
            scrub: 1.2,
          },
        });
      }

      // 2. Continuous Sky Diver Motion across Section 1 & Section 2
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 30%",
          end: "bottom 80%",
          scrub: 1.2,
        },
      });

      // Step 1: Diver drops from top into Section 1 (center-right)
      tl.fromTo(
        diverRef.current,
        {
          y: "-120vh",
          x: 0,
          rotate: -10,
          opacity: 0.7,
        },
        {
          y: 0,
          x: 0,
          rotate: 0,
          opacity: 1,
          ease: "power1.out",
          duration: 1,
        },
      );

      // Step 2: Diver glides from center-right across to center-left in Section 2
      tl.to(diverRef.current, {
        x: "-52vw",
        y: "90vh",
        rotate: -5,
        ease: "power1.inOut",
        duration: 1.4,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#5b9ddf] text-black overflow-hidden select-none"
    >
      {/* 1. Cloud Fog Overlay at the Top (Highest Z-Index, in front of the Diver) */}
      <div
        ref={fogRef}
        className="absolute top-0 left-0 w-full h-screen pointer-events-none z-40 will-change-transform"
      >
        <Image
          src="/images/home/cloud-fog-1.webp"
          alt="Cloud Fog Transition"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      {/* 2. Sky Diver (Behind the Cloud Fog with z-10) */}
      <div
        ref={diverRef}
        className="absolute right-[2%] sm:right-[5%] lg:right-[8%] top-[18%] sm:top-[20%] w-[300px] md:w-[520px] xl:w-[30vw] aspect-square pointer-events-none z-10 will-change-transform flex items-center justify-center"
      >
        <Image
          src="/images/home/sky-diver-2.webp"
          alt="Red Bull Sky Diver"
          fill
          priority
          sizes="(max-width: 768px) 80vw, 50vw"
          className="object-contain drop-shadow-2xl"
        />
      </div>

      {/* ----------------- SECTION 1: STRATOSPHERIC FREEFALL (Left Content, Diver on Right) ----------------- */}
      <section
        ref={section1Ref}
        className="relative w-full h-screen flex items-center justify-between px-6 md:px-16 lg:px-24 z-20"
      >
        {/* Section 1 Content (Left Side) */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/20 bg-white/20 backdrop-blur-xs font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>Altitude 39,000M</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black font-['Orbitron',_var(--font-primary),_sans-serif] leading-tight drop-shadow-xs">
            STRATOSPHERIC
            <br />
            FREEFALL
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-black/80 max-w-lg leading-relaxed font-mono font-medium">
            Breaking sound barriers. The pinnacle of human endurance fueled by
            pure relentless drive and zero gravity innovation.
          </p>
        </div>
      </section>

      {/* ----------------- SECTION 2: SUPERSONIC DESCENT (Right Content, Diver on Left) ----------------- */}
      <section
        ref={section2Ref}
        className="relative w-full h-screen flex items-center justify-end px-6 md:px-16 lg:px-24 z-20"
      >
        {/* Section 2 Content (Right Side) */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-6 ml-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/20 bg-white/20 backdrop-blur-xs font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black">
            <span className="size-2 rounded-full bg-[#f25b19] animate-pulse" />
            <span>Speed Mach 1.25</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black font-['Orbitron',_var(--font-primary),_sans-serif] leading-tight drop-shadow-xs">
            SUPERSONIC
            <br />
            ACCELERATION
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-black/80 max-w-lg leading-relaxed font-mono font-medium">
            Surpassing 1,357.6 km/h without mechanical propulsion. Mastering
            aerodynamic control through extreme atmospheric resistance.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SkydivingStartSection;
