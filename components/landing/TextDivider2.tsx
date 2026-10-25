"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TextDivider2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const l1 = line1Ref.current;
      const l2 = line2Ref.current;
      const l3 = line3Ref.current;
      if (!container || !l1 || !l2 || !l3) return;

      // Initial positions:
      // 1st line: off to the right
      gsap.set(l1, {
        x: "50vw",
        opacity: 0,
      });

      // 2nd line: off to the right
      gsap.set(l2, {
        x: "-50vw",
        opacity: 0,
      });

      // 3rd line: down below the mask
      gsap.set(l3, {
        yPercent: 125,
        opacity: 0,
        rotateX: -20,
        transformOrigin: "center top",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "center 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. First line animates in from the right
      tl.to(
        l1,
        {
          x: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
        },
        0,
      );

      // 2. Second line animates in from the right
      tl.to(
        l2,
        {
          x: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power2.out",
        },
        0.35,
      );

      // 3. Third line animates up from down
      tl.to(
        l3,
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        0.7,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden min-h-[55vh] sm:min-h-[60vh] lg:min-h-[68vh] flex items-center justify-center text-center px-4 py-16 sm:py-24 select-none"
    >
      <div className="w-full flex flex-col items-center justify-center leading-[1.04] sm:leading-[1.06] [perspective:1000px]">
        {/* Line 1 - animates from right */}
        <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center">
          <span
            ref={line1Ref}
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-[7.5vw] font-primary font-bold tracking-tight text-secondary uppercase will-change-transform"
          >
            What If
          </span>
        </div>

        {/* Line 2 - animates from right */}
        <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center">
          <span
            ref={line2Ref}
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-[7.5vw] font-primary font-bold tracking-tight text-secondary uppercase will-change-transform"
          >
            You Were
          </span>
        </div>

        {/* Line 3 - animates from down */}
        <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center">
          <span
            ref={line3Ref}
            className="block text-4xl sm:text-6xl md:text-7xl lg:text-[7.5vw] font-primary font-bold tracking-tight text-primary uppercase will-change-transform"
          >
            Unstoppable?
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextDivider2;
