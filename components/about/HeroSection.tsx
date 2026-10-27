import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="h-dvh relative flex justify-center items-end">
      <div className="absolute inset-0">
        <Image
          src="/images/home/hero/npl-2.webp"
          alt="Career page background image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent via-70% to-transparent" />
      </div>
      <div className="relative z-20 w-full flex flex-col gap-4 justify-center p-x pb-16 lg:pb-24">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8vw] tracking-tight leading-[1.08] text-white">
          Make Your Mark. <br /> Move the World.
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed font-medium max-w-xl">
          Bring your ideas, energy, and ambition to a team that turns bold
          thinking into meaningful action.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
