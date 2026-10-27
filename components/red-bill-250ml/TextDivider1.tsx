import React from "react";

const TextDivider1 = () => {
  return (
    <section className="h-svh flex justify-center items-center py-16 lg:py-24">
      <div className="w-full h-full flex flex-col justify-evenly items-center text-center gap-6 xl:gap-10 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.1] max-w-4xl">
          The Iconic Gold Heritage,
          <br />
          <span className="sm:whitespace-nowrap">
            Powered by Your True Energy
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-lg lg:text-[1.4vw] text-foreground/70 leading-relaxed font-medium max-w-2xl lg:max-w-[80%]">
          Experience Red Bull® Gold 250ml: the legendary non-carbonated energy
          drink rooted in authentic Krating Daeng heritage. Formulated with
          high-potency taurine and vital B-group vitamins, it delivers a smooth,
          concentrated surge of vitality to stimulate your body’s metabolism,
          heighten mental focus, and sustain physical endurance through
          demanding days. Pure, relentless, and uncompromised ignite your true
          energy.
        </p>
      </div>
    </section>
  );
};

export default TextDivider1;
