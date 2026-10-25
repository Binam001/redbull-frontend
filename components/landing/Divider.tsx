"use client";

import Image from "next/image";
import React from "react";

const Divider = () => {
  return (
    <section className="w-full h-svh relative overflow-hidden flex items-center justify-center p-0 m-0">
      <div className="absolute top-20 z-30 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08] text-secondary">
          Built for the <span className="text-primary">Ride</span>
          <br />
          Born to Push <span className="text-primary">Limits.</span>
        </h2>

        {/* <p className="text-xs sm:text-sm md:text-lg leading-relaxed font-medium max-w-5xl mx-auto">
          For those who move with focus, courage, and energy.
        </p> */}
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-white via-25% via-transparent to-transparent z-20" />
      {/* Foreground Cans Image Standing in Front of the Heading */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* <Image
          src="/images/athletes/bg-1.png"
          alt="Red Bull Cans - Gives You Wings"
          fill
          priority
          className="object-cover object-bottom"
        /> */}
        <video
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.8;
            }
          }}
          src="/videos/ramp-jump-1.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </section>
  );
};

export default Divider;
