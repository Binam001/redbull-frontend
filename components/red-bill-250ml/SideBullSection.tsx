"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
  LOGO_LEFT_BULL,
  LOGO_RIGHT_BULL,
  LOGO_SUN,
  LOGO_VIEWBOX,
} from "./logoData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SideBullSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftBullRef = useRef<HTMLDivElement>(null);
  const rightBullRef = useRef<HTMLDivElement>(null);
  const sunCircleRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !leftBullRef.current ||
        !rightBullRef.current ||
        !sunCircleRef.current
      )
        return;

      // 1. Initial positions:
      // Sun circle positioned below
      // Left bull positioned offscreen at the bottom-left corner of the viewport
      // Right bull positioned offscreen at the bottom-right corner of the viewport
      gsap.set(sunCircleRef.current, {
        y: "45vh",
        opacity: 0,
        scale: 0.85,
      });
      gsap.set(leftBullRef.current, {
        x: "-45vw",
        y: "45vh",
        opacity: 0,
      });
      gsap.set(rightBullRef.current, {
        x: "45vw",
        y: "45vh",
        opacity: 0,
      });
      gsap.set(logoWrapperRef.current, {
        opacity: 1,
      });
      if (taglineRef.current) {
        gsap.set(taglineRef.current, {
          opacity: 0,
          y: 35,
        });
      }

      // 2. Main pinned timeline for SideBullSection
      // Pinning the section directly creates the proper .pin-spacer and prevents
      // subsequent sections (e.g. ProductDivider) from scrolling up prematurely.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 10,
          invalidateOnRefresh: true,
        },
      });

      // A. Sun circle rises and charging bulls fly in from bottom corners to meet at center
      tl.fromTo(
        sunCircleRef.current,
        {
          y: "45vh",
          opacity: 0,
          scale: 0.85,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          immediateRender: false,
        },
        0,
      )
        .fromTo(
          leftBullRef.current,
          {
            x: "-45vw",
            y: "45vh",
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            immediateRender: false,
          },
          0,
        )
        .fromTo(
          rightBullRef.current,
          {
            x: "45vw",
            y: "45vh",
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            immediateRender: false,
          },
          0,
        );

      // C. Tagline text reveals after the logo locks into place
      if (taglineRef.current) {
        tl.to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          1.2,
        );
      }

      // D. Smooth fade out towards the very end of the pin duration
      //   tl.to(
      //     [logoWrapperRef.current, taglineRef.current, titleRef.current],
      //     {
      //       opacity: 0,
      //       duration: 0.4,
      //       ease: "power1.in",
      //     },
      //     1.8,
      //   );

      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="side-bull-section"
      className="relative z-20 w-full h-dvh bg-black text-white p-0 overflow-hidden select-none flex items-center justify-center will-change-transform"
    >
      {/* 1. Ambient Background with subtle Red Bull navy radial gradient */}
      <div className="absolute inset-0 h-full w-full z-0 overflow-hidden pointer-events-none">
        <Image
          src="/images/home/bg-2.webp"
          alt="Red Bull atmosphere background"
          fill
          priority
          className="object-cover object-bottom opacity-40 scale-y-[-1]"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(
                ellipse 75% 62% at 50% 50%,
                rgba(35, 57, 113, 0.65) 0%,
                rgba(20, 32, 68, 0.35) 45%,
                rgba(0, 0, 0, 0.9) 78%,
                #000000 100%
              )
            `,
          }}
        />
      </div>

      {/* 2. Top Title Heading */}
      <div
        ref={titleRef}
        className="absolute top-8 sm:top-12 md:top-14 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none will-change-opacity"
      >
        <h3 className="leading-tight font-bold text-xl sm:text-2xl md:text-4xl xl:text-[2.6vw] uppercase tracking-wider text-white">
          MADE FOR THE DISTANCE
          <br />
          <span className="text-white/60">BETWEEN NOW AND NEXT.</span>
        </h3>
      </div>

      {/* 3. Center Red Bull Logo Stage (Exact 91/35 aspect ratio for charging bulls) */}
      <div
        ref={logoWrapperRef}
        className="relative w-72 sm:w-96 md:w-[480px] lg:w-[560px] xl:w-[38vw] max-w-[640px] aspect-[91/35] flex items-center justify-center pointer-events-none z-30 will-change-opacity"
      >
        {/* Sun Circle: rises from bottom, placed BEHIND the bulls (z-10) */}
        <div
          ref={sunCircleRef}
          className="absolute inset-0 w-full h-full will-change-transform flex items-center justify-center z-10"
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-full h-full drop-shadow-[0_0_24px_rgba(249,236,51,0.65)] drop-shadow-[0_0_48px_rgba(255,255,255,0.3)] pointer-events-none overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={LOGO_SUN}
              fill="#F9EC33"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Left Bull: slides from bottom-left corner of the viewport (z-20 in front of sun) */}
        <div
          ref={leftBullRef}
          className="absolute inset-0 w-full h-full will-change-transform flex items-center justify-center z-20"
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-full h-full drop-shadow-[0_0_24px_rgba(237,32,39,0.55)] drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={LOGO_LEFT_BULL}
              fill="#ED2027"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Right Bull: slides from bottom-right corner of the viewport (z-20 in front of sun) */}
        <div
          ref={rightBullRef}
          className="absolute inset-0 w-full h-full will-change-transform flex items-center justify-center z-20"
        >
          <svg
            viewBox={LOGO_VIEWBOX}
            className="w-full h-full drop-shadow-[0_0_24px_rgba(237,32,39,0.55)] drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={LOGO_RIGHT_BULL}
              fill="#ED2027"
              stroke="#ffffff"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* 4. Bottom Tagline: reveals once bulls meet the circle */}
      <div
        ref={taglineRef}
        className="absolute bottom-10 sm:bottom-14 md:bottom-16 left-0 right-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-auto will-change-opacity"
      >
        <h2 className="font-bold text-2xl sm:text-3xl md:text-5xl xl:text-[3vw] uppercase tracking-tight leading-none text-white">
          Step Beyond, <span className="text-[#ED2027]">Aspire Further.</span>
        </h2>
        <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base xl:text-[0.95vw] text-white/70 max-w-xl mx-auto leading-relaxed">
          Push past every threshold with uncompromising energy, boundless focus,
          and relentless momentum.
        </p>
      </div>
    </section>
  );
}
