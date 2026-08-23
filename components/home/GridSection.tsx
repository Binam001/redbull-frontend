import React from "react";
import Image from "next/image";

const GridSection = () => {
  return (
    <section className="relative w-full min-h-screen bg-[#e8e9ea] text-black overflow-hidden select-none flex items-center justify-center py-16 px-6 md:px-12 lg:px-20 z-10">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Big Cans Image Card */}
        <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-black/20 bg-black/5 aspect-square lg:aspect-auto min-h-[380px] lg:min-h-[500px] shadow-xs">
          <Image
            src="/images/home/can-img-1.webp"
            alt="Hydroflow Cans Arrangement"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Right Column: Bento Cards */}
        <div className="lg:col-span-6 flex flex-col gap-6 justify-between">
          {/* Top Row: 2 Cards */}
          <div className="grid grid-cols-12 gap-6 h-[200px] md:h-[220px]">
            {/* Top-Left: Metallic Copper Card */}
            <div className="col-span-8 relative rounded-3xl border border-black/20 p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-xs bg-gradient-to-br from-[#d6b498] via-[#c69a7c] to-[#e4cbb9]">
              <span
                className="text-base md:text-lg font-black tracking-widest uppercase text-black"
                style={{
                  fontFamily:
                    "'Orbitron', 'Chakra Petch', var(--font-primary), sans-serif",
                }}
              >
                HYDROFLOW
              </span>

              {/* Digital Matrix / QR Pattern Icon */}
              <div className="self-end opacity-80">
                <svg
                  className="w-12 h-12 md:w-14 md:h-14 text-black"
                  viewBox="0 0 48 48"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="4" width="8" height="8" />
                  <rect x="6" y="6" width="4" height="4" fill="#d6b498" />
                  <rect x="36" y="4" width="8" height="8" />
                  <rect x="38" y="6" width="4" height="4" fill="#d6b498" />
                  <rect x="4" y="36" width="8" height="8" />
                  <rect x="6" y="38" width="4" height="4" fill="#d6b498" />
                  <rect x="18" y="8" width="4" height="4" />
                  <rect x="26" y="4" width="4" height="4" />
                  <rect x="22" y="16" width="6" height="6" />
                  <rect x="32" y="18" width="4" height="4" />
                  <rect x="8" y="22" width="4" height="4" />
                  <rect x="14" y="28" width="4" height="4" />
                  <rect x="36" y="28" width="6" height="4" />
                  <rect x="24" y="34" width="4" height="6" />
                  <rect x="32" y="38" width="6" height="4" />
                  <rect x="18" y="40" width="4" height="4" />
                </svg>
              </div>
            </div>

            {/* Top-Right: Arrow Action Card */}
            <div className="col-span-4 relative rounded-3xl border border-black/20 bg-black/[0.02] p-6 flex items-center justify-center shadow-xs">
              <button
                type="button"
                aria-label="Next Action"
                className="size-14 md:size-16 rounded-full bg-[#f25b19] hover:bg-[#e04f0f] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 md:size-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Row: SCAN IT, TRADE IT Banner Card */}
          <div className="flex-1 min-h-[220px] md:min-h-[260px] rounded-3xl border border-black/20 bg-black/[0.02] p-8 md:p-12 flex items-center justify-center text-center shadow-xs">
            <h2
              className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-wider leading-none"
              style={{
                fontFamily:
                  "'Orbitron', 'Chakra Petch', var(--font-primary), sans-serif",
                fontWeight: 900,
              }}
            >
              <span className="text-black block mb-2">SCAN IT,</span>
              <span className="text-[#f25b19]">TRADE </span>
              <span className="text-black">IT</span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GridSection;
