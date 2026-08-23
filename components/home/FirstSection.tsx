import Image from "next/image";
import React from "react";

const FirstSection = () => {
  return (
    <section className="relative w-full h-dvh flex items-center bg-[#E0DEDD] text-black overflow-hidden select-none z-10">
      <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent z-20" />
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 min-h-dvh">
        {/* Left Side: Content (50% width) */}
        <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6 z-10 my-auto">
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/15 bg-black/[0.03] font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-black/60">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span>Red Bull Athlete</span>
          </div> */}

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-secondary font-['Orbitron',_var(--font-primary),_sans-serif]">
            PARAS
            <br />
            <span className="text-primary">KHADKA</span>
          </h1>

          <p className="text-sm md:text-base text-black/75 max-w-md leading-relaxed font-mono">
            Former captain of the Nepal National Cricket Team. A symbol of
            leadership, resilience, and the relentless drive to push beyond
            every boundary.
          </p>

          <div className="flex items-center gap-6 pt-2 font-mono text-xs text-black/60 uppercase tracking-widest">
            <div className="flex flex-col">
              <span className="text-lg font-black text-black">#77</span>
              <span className="text-[10px] text-black/50">ALL-ROUNDER</span>
            </div>
            <span className="w-px h-8 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-black">NEPAL</span>
              <span className="text-[10px] text-black/50">NATIONAL TEAM</span>
            </div>
            <span className="w-px h-8 bg-black/20" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-black">LEADER</span>
              <span className="text-[10px] text-black/50">RED BULL HERO</span>
            </div>
          </div>
        </div>

        {/* Right Side: Image (50% width) */}
        <div className="w-full md:w-1/2 h-[50vh] sm:h-[65vh] md:h-[85vh] xl:h-[100vh] relative flex items-center justify-center">
          <Image
            src="/images/home/paras-khadka-2.webp"
            alt="Paras Khadka - Red Bull Athlete"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain scale-[1.1]"
          />
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
