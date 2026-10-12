"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParagraphRevealProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export default function ParagraphReveal({
  text,
  children,
  className = "",
  textClassName = "",
  start = "top 80%",
  end = "bottom 40%",
  scrub = true,
}: ParagraphRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const resolvedText = typeof children === "string" ? children : text || "";

  useEffect(() => {
    if (!containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".reveal-word");
    if (words.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.25 });

      gsap.to(words, {
        opacity: 1,
        duration: 0.2,
        stagger: 0.07,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [resolvedText, start, end, scrub]);

  const words = resolvedText.trim() ? resolvedText.split(/\s+/) : [];

  return (
    <section className={`relative w-full overflow-hidden px-4 sm:px-8 lg:px-[5vw] ${className}`}>
      <div ref={containerRef} className="relative w-full lg:max-w-[90vw] mx-auto">
        <p
          className={`text-center text-xl sm:text-2xl md:text-3xl lg:text-[2.6vw] xl:text-[2.4vw] font-bold leading-snug lg:leading-[1.28] text-secondary selection:bg-primary selection:text-white ${textClassName}`}
        >
          {typeof children !== "string" && children
            ? children
            : words.length > 0
              ? words.map((w, i) => (
                <span
                  key={i}
                  className="reveal-word inline-block mr-1.5 sm:mr-2 lg:mr-[0.55vw] transition-colors duration-200 cursor-pointer hover:text-primary hover:!opacity-100 selection:bg-primary selection:text-white"
                >
                  {w}
                </span>
              ))
              : null}
        </p>
      </div>
    </section>
  );
}
