"use client";

import React from "react";
import FluidBackground from "./FluidBackground";

export default function AboutTokenomics() {
  return (
    <section
      id="about-tokenomics"
      className="relative w-full h-screen bg-black text-white flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-24 select-none overflow-hidden"
    >
      {/* WebGL Fluid Background matching HeroTry.tsx */}
      <FluidBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center text-center gap-8 sm:gap-10 md:gap-12">
        {/* Big 3-Line Headline matching exact Ethnocentric typography from the screenshot */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08]"
        >
          A World in Motion
        </h1>

        {/* Mission Statement Description */}
        <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
          <p className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium ">
            It begins with a restless spirit—the instinct to question the edge, lean into the unknown, and test what human capability can achieve when limits are left behind. Across sport, music, street culture, and groundbreaking expeditions, Red Bull is the canvas where imagination meets pure velocity.
          </p>

          <p className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium">
            We believe that the extraordinary is forged by those who dare to take the harder line, step onto the empty stage, and push past the doubt of what’s possible. We don’t just watch culture evolve—we fuel the people shaping it. Whether on the razor’s edge of motorsport, the peaks of alpine freeride, or the creative spaces shaping tomorrow&apos;s sound, every story here shares the same pulse: an uncompromising commitment to never stand still.
          </p>
        </div>
      </div>
    </section>
  );
}
