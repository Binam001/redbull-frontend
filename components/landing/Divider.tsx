"use client";

import Image from "next/image";
import React from "react";

const Divider = () => {
  return (
    <section className="w-full h-screen relative  overflow-hidden flex items-center justify-center p-0 m-0">
      <div className="absolute top-20 z-20 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08] text-secondary">
          Built for the <span className="text-primary">Ride</span>
        </h2>

        <p className="text-xs sm:text-sm md:text-lg leading-relaxed font-medium max-w-5xl mx-auto">
          For those who move with focus, courage, and energy.
        </p>
      </div>
      {/* Foreground Cans Image Standing in Front of the Heading */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <Image
          src="/images/athletes/bg-1.png"
          alt="Red Bull Cans - Gives You Wings"
          fill
          priority
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
};

export default Divider;
