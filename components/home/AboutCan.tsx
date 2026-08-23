import React from "react";

const AboutCan = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center z-10">
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-6 items-center">
        {/* Left Column */}
        <div className="xl:col-span-4 flex flex-col justify-between h-full space-y-12 xl:space-y-24">
          {/* Top: Header Info */}
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-mono text-black/60">
              Pre-Trade Energy
            </p>
            <h2 className="text-4xl md:text-5xl uppercase tracking-tight leading-none text-black">
              SOLANA
              <br />
              SPLASH
            </h2>
            <p className="text-xs md:text-sm font-medium text-black/70 pt-1">
              330ml with Zero Sugar
            </p>
          </div>

          {/* Bottom: Ingredients */}
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/80">
              INGREDIENTS
            </h3>
            <p className="text-xs md:text-sm text-black/70 leading-relaxed">
              Caffeine, Natural Flavor, Magnesium Citrate, Sodium Citrate,
              Stevia Extract
            </p>
          </div>
        </div>

        {/* Center Column: Framed Can Container */}
        <div className="xl:col-span-4 flex items-center justify-center my-6 xl:my-0">
          <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl border border-black/20 bg-black/[0.02] flex items-center justify-center p-4 shadow-xs pointer-events-none">
            {/* The 3D Can from the global canvas aligns directly here */}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 flex flex-col justify-between h-full space-y-12 xl:space-y-24">
          {/* Top: Introduction */}
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-black/80">
              INTRODUCTION TO DRINK
            </h3>
            <p className="text-xs md:text-sm text-black/75 leading-relaxed">
              Solana Splash by HydroFlow is the world&apos;s first tokenized
              energy drink, blending cutting-edge blockchain innovation with
              peak performance. Designed for the modern trader, Solana Splash
              combines refreshing taste with tokenized transparency, redefining
              how you hydrate and energize.
            </p>
          </div>

          {/* Bottom: CTA Button */}
          <div>
            <button
              type="button"
              className="bg-[#f25b19] hover:bg-[#e04f0f] text-white px-7 py-3 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Rotate Hydroflow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCan;
