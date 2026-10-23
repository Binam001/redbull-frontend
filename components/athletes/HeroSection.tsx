import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="h-dvh relative flex justify-end">
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/athletes/bg-2.jpg"
          alt="Athletes background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
      </div>
      <div className="relative z-20 w-full flex flex-col gap-4 justify-end pointer-events-none p-x pb-24 lg:pb-[20vh]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8vw] tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
          Beyond Limits
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed font-medium drop-shadow-md">
          Meet the athletes redefining what's possible.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
