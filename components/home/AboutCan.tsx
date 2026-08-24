import React from "react";
import Button from "../shared/Button";

const AboutCan = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center z-40">
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-6 items-center">
        {/* Left Column */}
        <div className="xl:col-span-4 flex flex-col justify-between h-full space-y-12 xl:space-y-24 relative z-50 pointer-events-auto">
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
        <div className="xl:col-span-4 flex items-center justify-center my-6 xl:my-0 pointer-events-none">
          <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl border border-black/20 bg-black/[0.02] flex items-center justify-center p-4 shadow-xs pointer-events-none">
            {/* The 3D Can from the global canvas aligns directly here */}
          </div>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-4 flex flex-col justify-between h-full space-y-12 xl:space-y-24 relative z-50 pointer-events-auto">
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
          <div className="relative z-50 pointer-events-auto">
            <Button label="View Products" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCan;
