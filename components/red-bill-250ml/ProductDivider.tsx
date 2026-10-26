import Image from "next/image";
import React from "react";

const ProductDivider = () => {
  return (
    <section
      id="aspire-section-3"
      className="relative z-20 h-svh w-full bg-black text-white overflow-hidden p-0"
    >
      <div className="flex flex-col-reverse xl:flex-row items-stretch justify-center w-full h-full">
        {/* Content Half (Bottom on mobile/tablet, Left on desktop) */}
        <div className="h-1/2 xl:h-full xl:w-1/2 w-full flex flex-col justify-center text-center xl:text-left gap-3 sm:gap-4 xl:gap-8 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-4 sm:py-6 xl:py-0 z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.5vw] tracking-tight text-white leading-[1.08]">
            A Golden Can
            <br />
            <span className="whitespace-nowrap">with a Purpose</span>
            <br />
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/70 leading-relaxed font-medium max-w-xl mx-auto xl:mx-0">
            Known by many as Red Bull® Gold, this 250ml can brings together
            taurine, B-group vitamins, amino acids and carbohydrates in a
            distinctive functional beverage. Every detail is part of a blend
            created for people who like to keep their days in motion.
          </p>
        </div>

        {/* Image Half (Top on mobile/tablet, Right on desktop) */}
        <div className="h-1/2 xl:h-full xl:w-1/2 w-full z-0 pointer-events-none flex items-center justify-center bg-black relative">
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t xl:bg-linear-to-r from-black via-black/20 xl:via-transparent to-transparent z-10" />
            <Image
              src="/images/product/small-can.webp"
              alt="Carbonated Divider"
              fill
              sizes="(max-width: 1280px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDivider;
