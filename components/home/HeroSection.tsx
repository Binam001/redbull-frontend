import React from "react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-[#e8e9ea] overflow-hidden select-none flex flex-col items-center justify-center pointer-events-none"
    >
      {/* Blueprint Grid Background Pattern */}
      {/* <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      /> */}

      {/* Subtle Radial Vignette / Soft Lighting */}
      {/* <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7)_0%,transparent_75%)]" /> */}

      {/* Background Typography */}
      <div className="relative z-0 flex flex-col items-center justify-center text-center px-4 max-w-7xl w-full">
        {/* Row 1: TOKENIZING */}
        <h1
          className="text-[12vw] md:text-[10.5vw] lg:text-[9.5vw] font-black uppercase text-[#121212] tracking-[0.08em] leading-[0.88] select-none whitespace-nowrap"
          style={{
            fontFamily: "'Orbitron', 'Chakra Petch', 'Arial Black', sans-serif",
            fontWeight: 900,
          }}
        >
          TOKENIZING
        </h1>

        {/* Row 2: HYDRATION */}
        <h2
          className="text-[12vw] md:text-[10.5vw] lg:text-[9.5vw] font-black uppercase text-[#121212] tracking-[0.08em] leading-[0.88] select-none whitespace-nowrap mt-1 md:mt-2"
          style={{
            fontFamily: "'Orbitron', 'Chakra Petch', 'Arial Black', sans-serif",
            fontWeight: 900,
          }}
        >
          HYDRATION
        </h2>

        {/* Dashed Separator Line */}
        <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl border-b border-dashed border-black/40 my-4 md:my-5" />

        {/* Subtitle / Footer Tagline */}
        <p
          className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.35em] font-semibold text-black/75 uppercase text-center"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          PURE. REFRESHING. BLOCKCHAIN-POWERED.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
