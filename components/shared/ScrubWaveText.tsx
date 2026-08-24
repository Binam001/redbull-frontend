"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrubWaveTextProps {
  lines: string[];
  triggerRef?: React.RefObject<HTMLDivElement | null>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  className?: string;
  lineClassName?: string;
  continuous?: boolean;
}

export const ScrubWaveText: React.FC<ScrubWaveTextProps> = ({
  lines,
  triggerRef,
  start = "top 75%",
  end = "top 20%",
  scrub = 0.8,
  className = "",
  lineClassName = "",
  continuous = true,
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const chars = el.querySelectorAll(".char-scrub");
      if (!chars || chars.length === 0) return;

      const trigger = triggerRef?.current || el;

      gsap.fromTo(
        chars,
        {
          y: 90,
          opacity: 0,
          rotateX: -65,
          scaleY: 1.45,
          scaleX: 0.9,
          transformOrigin: "50% 100%",
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.035,
          ease: "power2.out",
          scrollTrigger: {
            trigger: trigger,
            start: start,
            end: end,
            scrub: scrub,
          },
        },
      );
    },
    { scope: containerRef, dependencies: [triggerRef, start, end, scrub] },
  );

  let globalCharIndex = 0;

  return (
    <h2 ref={containerRef} className={`flex flex-col items-start ${className}`}>
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className={`inline-block overflow-hidden py-0.5 ${lineClassName}`}
        >
          {line.split("").map((char, charIndex) => {
            const delayIndex = globalCharIndex++;
            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                className="char-scrub inline-block will-change-transform"
                style={{ transformOrigin: "50% 100%" }}
              >
                <span
                  className={`inline-block will-change-transform ${
                    continuous ? "animate-char-wave" : ""
                  }`}
                  style={
                    continuous
                      ? {
                          animationDelay: `${delayIndex * 0.08}s`,
                        }
                      : undefined
                  }
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </h2>
  );
};

export default ScrubWaveText;
