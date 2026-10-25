"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface IntroProps {
  kicker?: string;
  titleLines?: (string | React.ReactNode)[];
  description?: string;
  className?: string;
}

export default function Intro({
  kicker = "About Hydroflow Tokenomics",
  titleLines = [
    "BUILT FOR",
    <React.Fragment key="extraordinary-line">
      THE <span className="text-primary">EXTRAORDINARY</span>
    </React.Fragment>,
  ],
  description = "Red Bull is made for the moments when you’re ready to take things further. Since 1987, Red Bull Energy Drink has brought its distinctive taste and energy to people pushing boundaries in sport, music, culture, and everyday life. Whether you’re chasing a new goal, facing a long day, or finding the focus to finish what you started, Red Bull is there to fuel the moment. Open a can, find your rhythm, and bring your full energy to whatever comes next. This is more than a drink, it’s a mindset built around action, ambition, and the courage to go beyond the ordinary. Red Bull gives you wings.",
  className = "",
}: IntroProps) {
  return (
    <div
      className={`relative w-full  flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24 mt-28 select-none overflow-hidden ${className}`}
    >
      <div className="w-full max-w-350 mx-auto flex flex-col gap-12 items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08] ">
          {titleLines.map((line, idx) => (
            <span
              key={idx}
              className="title-line block will-change-transform will-change-opacity"
            >
              {line}
            </span>
          ))}
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-5xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  );
}
