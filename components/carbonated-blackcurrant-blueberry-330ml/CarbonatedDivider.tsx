import Image from "next/image";
import React from "react";

const CarbonatedDivider = () => {
  return (
    <section
      id="aspire-section-3"
      className="relative z-20 h-svh lg:min-h-svh w-full bg-black text-white overflow-hidden p-0"
    >
      <div className="flex flex-col-reverse xl:flex-row items-stretch justify-center w-full min-h-dvh">
        {/* <div className="xl:w-1/2 w-full flex flex-col justify-center text-center xl:text-left gap-4 xl:gap-8 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08]">
            A Fresh Flavor
            <br />
            <span className="whitespace-nowrap ">with a Spark</span>
            <br />
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-xl ">
            Meet Red Bull Carbonated Blackcurrant Blueberry 330ml: a
            ready-to-drink can made for active days and full schedules. Its
            fruity flavor and lively carbonation make it easy to enjoy between
            tasks, before a workout, or whenever you’re ready for a refreshing
            change.
          </p>
        </div> */}

        <div className="w-full h-svh lg:h-auto lg:min-h-dvh z-0 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full relative flex items-center justify-center">
            <Image
              src="/images/product/can-ad-1.webp"
              alt="Carbonated Divider"
              fill
              sizes="(max-width: 1280px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {/* <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-transparent" /> */}
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarbonatedDivider;
