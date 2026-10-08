import React from "react";

const ProductDivider = () => {
  return (
    <section
      id="aspire-section-3"
      className="relative z-20 min-h-dvh w-full bg-black text-white overflow-hidden p-0"
    >
      <div className="flex flex-col-reverse xl:flex-row items-stretch justify-center w-full min-h-dvh">
        <div className="xl:w-1/2 w-full flex flex-col justify-center text-center xl:text-left gap-4 xl:gap-8 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08]">
            A Golden Can
            <br />
            <span className="whitespace-nowrap ">
              with a Purpose
            </span>
            <br />
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-xl ">
            Known by many as Red Bull® Gold, this 250ml can brings together taurine, B-group vitamins, amino acids and carbohydrates in a distinctive functional beverage. Every detail is part of a blend created for people who like to keep their days in motion.
          </p>
        </div>

        <div className="xl:w-1/2 w-full h-[50vh] xl:h-auto min-h-[50vh] xl:min-h-dvh z-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full relative flex items-center justify-center">
            <video
              src="/videos/shoes-video-11.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="pointer-events-none object-cover w-full h-full brightness-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDivider;