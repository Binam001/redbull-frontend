"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

interface FloatingTextProps {
  texts?: string[];
  children?: React.ReactNode;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  stagger?: number;
  holdTime?: number;
  onComplete?: () => void;
}

export const FloatingText: React.FC<FloatingTextProps> = ({
  texts,
  children,
  containerClassName = "",
  textClassName = "",
  animationDuration = 0.7,
  ease = "back.out(1)",
  stagger = 0.015,
  holdTime = 1.2,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const textList = useMemo(() => {
    if (texts && texts.length > 0) return texts;
    if (typeof children === "string") return [children];
    return [""];
  }, [texts, children]);

  const currentText = textList[currentIndex] || "";

  const splitText = useMemo(() => {
    return currentText.split("").map((char, index) => (
      <span
        className="inline-block char will-change-transform"
        key={`${currentIndex}-${index}`}
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [currentText, currentIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll(".char");
    if (!charElements || charElements.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Subtle Staggered Entrance (50% reduced displacement and scale distortion)
      tl.fromTo(
        charElements,
        {
          opacity: 0,
          yPercent: 50,
          scaleY: 1.25,
          scaleX: 0.9,
          transformOrigin: "50% 0%",
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
        },
      );

      // 2. If multiple texts, hold then wave out to next
      if (textList.length > 1) {
        tl.to(
          charElements,
          {
            duration: animationDuration * 0.7,
            ease: "back.in(1)",
            opacity: 0,
            yPercent: -50,
            scaleY: 1.25,
            scaleX: 0.9,
            transformOrigin: "50% 100%",
            stagger: stagger * 0.7,
            delay: holdTime,
            onComplete: () => {
              if (currentIndex < textList.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              } else {
                onComplete?.();
              }
            },
          },
        );
      } else {
        // Single text mode completion
        tl.call(() => {
          onComplete?.();
        }, undefined, `+=${holdTime}`);
      }
    }, el);

    return () => ctx.revert();
  }, [currentIndex, textList, animationDuration, ease, stagger, holdTime, onComplete]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden flex items-center justify-center ${containerClassName}`}
    >
      <h2
        className={`inline-block select-none ${textClassName}`}
      >
        {splitText}
      </h2>
    </div>
  );
};

export default FloatingText;
