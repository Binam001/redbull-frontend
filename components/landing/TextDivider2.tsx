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
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !textRef.current) return;

      gsap.fromTo(
        textRef.current,
        {
          x: "70vw",
        },
        {
          x: "-50vw",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <p
        ref={textRef}
        className="text-3xl sm:text-5xl md:text-6xl lg:text-[8vw] font-primary font-bold tracking-tight text-secondary whitespace-nowrap select-none will-change-transform inline-block"
      >
        What If… You Were <span className="text-primary">Unstoppable?</span>
      </p>
    </div>
  );
};

export default TextDivider2;
