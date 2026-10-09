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
      gsap.set(words, { opacity: 0.15 });

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
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [resolvedText, start, end, scrub]);

  const words = resolvedText.trim() ? resolvedText.split(/\s+/) : [];

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div ref={containerRef} className="relative  mx-auto">
        <p
          className={`text-center text-xl md:text-2xl lg:text-5xl font-bold leading-snug text-secondary ${textClassName}`}
        >
          {typeof children !== "string" && children
            ? children
            : words.length > 0
              ? words.map((w, i) => (
                <span key={i} className="reveal-word inline-block mr-2">
                  {w}
                </span>
              ))
              : null}
        </p>
      </div>
    </section>
  );
}
