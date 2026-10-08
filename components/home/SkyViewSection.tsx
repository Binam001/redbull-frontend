"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SkyViewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const cloudRingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1.2,
          pin: true,
          refreshPriority: 5,
        },
      });

      // 1. Zoom in the background sky view image slightly
      tl.to(
        bgImageRef.current,
        {
          scale: 1.18,
          ease: "none",
        },
        0,
      );

      // 2. Expand and part the cloud ring outward off-screen
      tl.to(
        cloudRingRef.current,
        {
          scale: 2.5,
          opacity: 0,
          ease: "power1.out",
        },
        0,
      );

      // 3. Center text subtle scale and clarity
      // tl.fromTo(
      //   contentRef.current,
      //   {
      //     opacity: 0.9,
      //     scale: 0.96,
      //   },
      //   {
      //     opacity: 1,
      //     scale: 1.04,
      //     ease: "none",
      //   },
      //   0,
      // );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* 1. Full-Screen Sky View Background */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <Image
          src="/images/home/sky-view-1.webp"
          alt="Aerial Sky View"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft atmospheric gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 2. Center Content Overlay */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6 max-w-2xl text-white space-y-4 will-change-transform pointer-events-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal italic tracking-wide font-serif drop-shadow-md">
          The sky&apos;s the limit!
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-light drop-shadow-sm max-w-lg">
          Unleash boundless potential. Where digital elevation meets physical
          refreshment, redefining horizons.
        </p>

        <button
          type="button"
          className="mt-4 inline-flex items-center gap-3 bg-[#1e40af] hover:bg-[#1d4ed8] text-white px-7 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span>VIEW MORE</span>
          <span className="size-6 rounded-full bg-white text-[#1e40af] flex items-center justify-center text-xs font-bold">
            →
          </span>
        </button>
      </div>

      {/* 3. Cloud Ring Frame (Expands and moves off-screen on scroll) */}
      <div
        ref={cloudRingRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30 will-change-transform flex items-center justify-center"
      >
        <div className="relative w-[100vw] h-[100vh]">
          <Image
            src="/images/home/cloud-ring-2.webp"
            alt="Cloud Ring Frame"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default SkyViewSection;
