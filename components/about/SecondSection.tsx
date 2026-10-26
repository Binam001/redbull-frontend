"use client";

import React from "react";
import Image from "next/image";

const SecondSection = () => {
  return (
    <section className="relative">
      <div className="flex flex-col items-center">
        {/* Bento Grid (2x2 Asymmetric Layout with Red Bull Palette) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
          {/* Card 1 (Top-Left): Stratospheric Focus (Deep Navy Overlay) */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] overflow-hidden group shadow-md bg-[#223971]">
            <Image
              src="/images/home/rabindra-dhaat-1.webp"
              alt="Stratospheric Focus"
              fill
              className="object-cover"
            />
            {/* Red Bull Deep Navy Gradient Overlay */}
            {/* <div className="absolute inset-0 bg-linear-to-t from-[#101b38]/95 via-[#223971]/50 to-transparent" /> */}

            {/* Left Text Content */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 w-full z-10 space-y-2">
              <h3 className="w-[45%] text-2xl sm:text-3xl md:text-4xl xl:text-[2vw] font-black uppercase text-white tracking-tight leading-none drop-shadow-md">
                COURAGE HAS WINGS.
              </h3>
              <p className="text-xs sm:text-sm md:text-base xl:text-[1vw] text-white/90 leading-relaxed font-medium drop-shadow-sm max-w-[80%] lg:max-w-[40%]">
                Red Bull gives you the energy to face it, push through it, and
                go further than you thought possible.
              </p>
            </div>
          </div>

          {/* Card 2 (Top-Right): Red Bull Ad */}
          <div className="lg:col-span-5 relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] overflow-hidden shadow-md">
            <Image
              src="/images/home/ad-1.webp"
              alt="Red Bull Ad"
              fill
              className="object-cover"
            />
          </div>

          {/* Card 3 (Bottom-Left): Vitalizes Body. Sharpens Mind. */}
          <div className="lg:col-span-5 relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] bg-linear-to-br from-[#161c28] via-[#0f131c] to-[#0a0d13] p-6 sm:p-8 md:p-10 flex flex-col justify-end text-white overflow-hidden shadow-lg border border-white/10">
            <Image
              src="/images/home/red-bull-can.webp"
              alt="Stratospheric Focus"
              fill
              className="object-cover"
            />
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                Vitalizes Body.
                <br />
                Sharpens Mind.
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-medium pt-0.5 drop-shadow-xs max-w-[70%]">
                Engineered to give you wings whenever you need peak focus and
                unstoppable stamina.
              </p>
            </div>
          </div>

          {/* Card 4 (Bottom-Right): Red Bull Deep Navy (#223971) with Champion Athlete */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] bg-[#223971] overflow-hidden group shadow-md flex items-center justify-between">
            {/* Full background image filling the grid card */}
            <Image
              src="/images/home/kavita-nepali-1.webp"
              alt="Kavita Nepali - Red Bull Athlete"
              fill
              className="object-cover object-right sm:object-center"
            />

            {/* Gradient Overlay for text contrast */}
            <div className="absolute inset-0 bg-linear-to-r from-[#223971]/95 via-[#223971]/50 to-transparent z-0" />

            {/* Left Text Content */}
            <div className="relative p-6 sm:p-8 md:p-10 z-10 self-end space-y-1.5">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight w-[60%] lg:w-[50%]">
                Tested Where Failure Is Not an Option.
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium pt-1 w-[80%]">
                From international cricket grounds to high-altitude Himalayan
                ascents. Red Bull is not merely consumed; it is deployed by
                athletes who play only to win.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondSection;
