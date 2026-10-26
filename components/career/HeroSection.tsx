import React from "react";
import FluidCursor from "../shared/FluidCursor";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="p-0 h-dvh relative overflow-hidden isolation-isolate bg-foreground flex justify-center items-center">
      {/* 1. Background Image (bottom of stack) */}
      {/* <div className="absolute inset-0 z-10">
        <Image
            src="/images/career-bg.webp"
          alt="Red lip lady"
          fill
          priority
          className="object-cover"
        />
      </div> */}
      <div className="absolute inset-0 w-[200px] md:w-[500px] lg:w-[40vw] aspect-[91/35] pointer-events-none select-none">
        <Image
          src="/logo.svg"
          alt="Red Bull Logo"
          fill
          priority
          className="object-contain drop-shadow-[0_0_80px_rgba(203,32,38,0.7)]"
        />
      </div>
      <div className="absolute w-[600px] sm:w-[850px] h-[400px] bg-red-600/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute w-[350px] sm:w-[550px] h-[300px] bg-yellow-500/20 blur-[110px] rounded-full pointer-events-none" />
      {/* 2. Fluid Canvas (middle of stack, reveals fluid effect on interaction) */}
      <FluidCursor
        // imageSrc="/logo.svg"
        imageSrc="/images/career-bg.webp"
        objectPosition="center"
        className="absolute inset-0 z-20 pointer-events-none w-full h-full"
      />

      {/* 3. Text (top of stack in the same stacking context so mix-blend-difference can blend with the backdrop) */}
      <div className="relative h-full flex justify-center items-center text-center pointer-events-none z-20">
        <h1 className="text-xl md:text-3xl xl:text-[4vw] text-white pointer-events-auto">
          <span className="mix-blend-difference">
            Make Your Mark. <br /> Move the World.
          </span>
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
