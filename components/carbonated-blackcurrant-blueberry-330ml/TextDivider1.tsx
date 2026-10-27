import React from "react";

const TextDivider1 = () => {
  return (
    <section className="h-svh flex justify-center items-center bg-foreground text-background py-16 lg:py-24">
      <div className="w-full h-full flex flex-col justify-evenly items-center text-center gap-6 xl:gap-10 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.1] max-w-4xl">
          A Fresh Berry Flavor with a Spark,
          <br />
          <span className="whitespace-nowrap">
            Driven by Unstoppable Momentum
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-lg lg:text-[1.4vw] text-background/70 leading-relaxed font-medium max-w-2xl lg:max-w-[80%]">
          Experience Red Bull Carbonated Blackcurrant Blueberry 330ml: an
          invigorating fusion of dark, luscious berries and crisp, sparkling
          carbonation built for active days and demanding schedules. Formulated
          with high-grade taurine and essential B-group vitamins, it delivers a
          smooth, reliable functional energy boost whether you’re locked into a
          project, heading into a workout, or recharging for what’s next.
        </p>
      </div>
    </section>
  );
};

export default TextDivider1;
