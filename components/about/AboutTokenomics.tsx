"use client";

import React from "react";
import Image from "next/image";

export default function AboutTokenomics() {
  return (
    <section
      id="about-tokenomics"
      className="relative w-full flex items-center justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-20 sm:py-24 overflow-hidden"
    >
      <div className="relative z-10 w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
        {/* ================= LEFT COLUMN: TCP ================= */}
        <div className="flex flex-col items-start space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center px-6 py-4">
            <div className="relative w-36 sm:w-44 md:w-68 h-12 sm:h-24">
              <Image
                src="/images/about/tcp.png"
                alt="T.C. Pharmaceuticals"
                fill
                priority
                sizes="(max-width: 768px) 180px, 200px"
                className="object-contain object-center"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl tracking-tight text-secondary font-bold leading-tight">
              A Legacy of Energy, Built to Empower
            </h2>
            <p className="text-xs sm:text-sm md:text-lg  text-black/70 leading-relaxed font-normal">
              Founded in Thailand in 1956, T.C. Pharmaceuticals Industries
              Company Limited created Red Bull to help people find the energy to
              pursue what matters. That founding belief continues to shape our
              commitment to quality, responsibility, and positive impact
              supporting people as they work toward their goals and contribute
              to a better future.
            </p>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SARAS ================= */}
        <div className="flex flex-col items-start space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center justify-center px-6 py-4">
            <div className="relative w-36 sm:w-44 md:w-68 h-12 sm:h-24">
              <Image
                src="/images/about/saras.png"
                alt="Saras Beverages"
                fill
                priority
                sizes="(max-width: 768px) 180px, 200px"
                className="object-contain object-center"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl  tracking-tight text-secondary font-bold leading-tight">
              Bringing Red Bull’s True Energy to Nepal
            </h2>
            <p className="text-xs sm:text-sm md:text-lg  text-black/70 leading-relaxed font-normal">
              Since 2023, Saras Beverages has manufactured and distributed Red
              Bull in Nepal in partnership with T.C. Pharmaceuticals Industries
              Thailand. At our facility in Bharatpur, we uphold global standards
              of quality and safety while creating energy drinks for local
              consumers. We’re committed to customer-focused innovation and a
              more sustainable, connected future for Nepal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
