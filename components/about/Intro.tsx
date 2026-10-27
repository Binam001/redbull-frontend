"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  return (
    <section
      className={`relative w-full  flex flex-col items-center justify-center overflow-hidden py-0 pt-16 lg:pt-24`}
    >
      <div className="w-full flex flex-col gap-4 lg:gap-8">
        {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08] ">
          Built for the <span className="text-primary">Extraordinary</span>
        </h1> */}
        <p className="text-xl md:text-3xl lg:text-[2.2vw] leading-snug lg:leading-[1.5]">
          <span className="text-primary">RedBull</span> is made for the moments
          when you’re ready to take things further. Since 1987, Red Bull Energy
          Drink has brought its distinctive taste and energy to people pushing
          boundaries in sport, music, culture, and everyday life. Whether you’re
          chasing a new goal, facing a long day, or finding the focus to finish
          what you started, Red Bull is there to fuel the moment. Open a can,
          find your rhythm, and bring your full energy to whatever comes next.
          This is more than a drink, it’s a mindset built around action,
          ambition, and the courage to go beyond the ordinary. Red Bull gives
          you wings.
        </p>
      </div>
    </section>
  );
}
