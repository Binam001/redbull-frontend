"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrubWaveTextProps {
  lines?: string[];
  text?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  className?: string;
  lineClassName?: string;
  firstLetterClassName?: string;
  continuous?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
}

export const ScrubWaveText: React.FC<ScrubWaveTextProps> = ({
  lines,
  text,
  triggerRef,
  start = "top 75%",
  end = "top 20%",
  scrub = 0.8,
  className = "",
  lineClassName = "",
  firstLetterClassName = "",
  continuous = false,
  as: Component = "h2",
}) => {
  const containerRef = useRef<HTMLElement>(null);

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
    { scope: containerRef, dependencies: [triggerRef, start, end, scrub, lines, text] },
  );

  let globalCharIndex = 0;

  // Mode 1: Paragraph / Single Text with natural word wrapping
  if (text !== undefined) {
    const words = text.split(/\s+/).filter(Boolean);

    return (
      <Component
        ref={containerRef as any}
        className={`leading-relaxed ${className}`}
      >
        {words.map((word, wIdx) => {
          const isFirstWord = wIdx === 0;
          return (
            <React.Fragment key={wIdx}>
              <span
                className={`inline-block whitespace-nowrap align-baseline ${lineClassName}`}
              >
                {word.split("").map((char, cIdx) => {
                  const isFirstLetter = isFirstWord && cIdx === 0;
                  const delayIndex = globalCharIndex++;
                  return (
                    <span
                      key={`${wIdx}-${cIdx}`}
                      className={`char-scrub inline-block align-baseline will-change-transform ${
                        isFirstLetter && firstLetterClassName ? firstLetterClassName : ""
                      }`}
                      style={{ transformOrigin: "50% 100%" }}
                    >
                      <span
                        className={`inline-block align-baseline will-change-transform ${
                          continuous ? "animate-char-wave" : ""
                        }`}
                        style={
                          continuous
                            ? { animationDelay: `${delayIndex * 0.08}s` }
                            : undefined
                        }
                      >
                        {char}
                      </span>
                    </span>
                  );
                })}
              </span>
              {wIdx < words.length - 1 && " "}
            </React.Fragment>
          );
        })}
      </Component>
    );
  }

  // Mode 2: Multi-line fixed heading (Backward compatible)
  const activeLines = lines || [];

  return (
    <Component
      ref={containerRef as any}
      className={`flex flex-col items-start ${className}`}
    >
      {activeLines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          className={`inline-block overflow-hidden py-0.5 ${lineClassName}`}
        >
          {line.split("").map((char, charIndex) => {
            const isFirstLetter = lineIndex === 0 && charIndex === 0;
            const delayIndex = globalCharIndex++;
            return (
              <span
                key={`${lineIndex}-${charIndex}`}
                className={`char-scrub inline-block will-change-transform ${
                  isFirstLetter && firstLetterClassName ? firstLetterClassName : ""
                }`}
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
    </Component>
  );
};

export default ScrubWaveText;
