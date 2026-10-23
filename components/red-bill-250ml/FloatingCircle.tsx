"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FloatingCircleProps {
  className?: string;
}

export default function FloatingCircle({
  className = "",
}: FloatingCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleElRef = useRef<HTMLDivElement>(null);
  const svgCircleRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const circle = svgCircleRef.current;
      const circleEl = circleElRef.current;
      if (!circle || !circleEl) return;

      const circleLength = circle.getTotalLength() || 307.8;

      // 1. Initial State:
      // The circle element is strictly placed DEAD-CENTER on screen (y: 0, scale: 1).
      // Stroke is dashed out, opacity: 0 so no starting dot is visible.
      gsap.set(circle, {
        strokeDasharray: circleLength,
        strokeDashoffset: circleLength,
        opacity: 0,
        rotate: -90,
        transformOrigin: "50% 50%",
        stroke: "#ffffff",
        fill: "transparent",
      });

      gsap.set(circleEl, {
        xPercent: -50,
        yPercent: -50,
        y: 0,
        scale: 1,
        opacity: 1,
      });

      // =========================================================================
      // TIMELINE FOR HERO SECTION FLOATING CIRCLE
      // -------------------------------------------------------------------------
      // Circle stays 100% STILL AT THE CENTER (y: 0) while stroke draws around can,
      // turns yellow, and ONLY THEN moves down below screen as HeroSection unpins.
      // =========================================================================
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-gallery",
          start: "top top",
          end: "+=140%",
          scrub: 1,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      // A. Fade in circle stroke as drawing begins (avoids initial dot artifact)
      tl.to(
        circle,
        {
          opacity: 1,
          duration: 0.04,
          ease: "power1.in",
        },
        0.02,
      );

      // B. Circle draws stroke around from 12 o'clock while LOCKED AT THE CENTER (y: 0)
      tl.to(
        circle,
        {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: "none",
        },
        0.02,
      );

      // C. Transition stroke to Red Bull golden yellow upon completion (still at center)
      tl.to(
        circle,
        {
          stroke: "#F9EC33",
          duration: 0.1,
          ease: "power1.out",
        },
        0.55,
      );

      // D. Now and ONLY now: animate circle DOWN below the screen as HeroSection concludes
      tl.to(
        circleEl,
        {
          y: "85dvh",
          scale: 0.68,
          opacity: 0,
          duration: 0.3,
          ease: "power1.in",
        },
        0.7,
      );

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-dvh pointer-events-none z-35 overflow-hidden ${className}`}
    >
      <div
        ref={circleElRef}
        className="absolute top-1/2 left-1/2 w-52 sm:w-72 md:w-80 lg:w-[22vw] max-w-[360px] aspect-square flex items-center justify-center will-change-transform"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_24px_rgba(249,236,51,0.65)] drop-shadow-[0_0_48px_rgba(255,255,255,0.4)] pointer-events-none overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            ref={svgCircleRef}
            cx="50"
            cy="50"
            r="49"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
