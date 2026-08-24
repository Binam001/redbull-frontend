import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="h-dvh relative text-background">
      <div className="absolute inset-0">
        <Image
          src="/images/home/bg-1.webp"
          alt="Background image"
          fill
          className="object-cover"
        />
      </div>
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 h-dvh p-x">
        {/* Left Side: Content (50% width) */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6 z-10 my-auto">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/15 bg-black/[0.03] font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black/60">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  <span>Red Bull Athlete</span>
                </div> */}

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[3.3vw] font-black tracking-tight leading-[1.05]">
            Made for Those <br /> Who Dare to Rise.
          </h1>

          <p className="text-sm md:text-base xl:text-[1.8vw] text-white/75 max-w-md leading-[1.05]">
            Red Bull is made for every <br /> challenge, every breakthrough,
            <br /> and every champion ready to rise.
          </p>
        </div>

        {/* Right Side: Image (50% width) */}
        <div className="w-full md:w-1/2 h-[50vh] sm:h-[65vh] md:h-[85vh] xl:h-[100vh] relative flex items-center justify-center">
          <Image
            src="/images/home/paras-khadka-5.webp"
            alt="Paras Khadka - Red Bull Athlete"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
