"use client";

import React from "react";

const ZeroCompromiseCard = () => {
  return (
    <div className="relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] sm:rounded-[32px] bg-linear-to-br from-[#161c28] via-[#0f131c] to-[#0a0d13] p-6 sm:p-8 md:p-10 flex flex-col justify-end text-white overflow-hidden shadow-lg border border-white/10">
      <div className="relative xl:max-w-[40%] z-10 space-y-2">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          Vitalizes Body.
          <br />
          Sharpens Mind.
        </h3>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-medium pt-0.5 drop-shadow-xs">
          Engineered to give you wings whenever you need peak focus and
          unstoppable stamina.
        </p>
      </div>
    </div>
  );
};

export default ZeroCompromiseCard;
