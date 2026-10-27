import React from "react";

const TextDivider2 = () => {
  return (
    <section className="h-svh flex justify-center items-center py-16 lg:py-24">
      <div className="w-full h-full flex flex-col justify-evenly items-center text-center gap-6 xl:gap-10 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.1] max-w-4xl">
          More Than Just a Drink,
          <br />
          <span className="whitespace-nowrap">
            Energy That Inspires the Extraordinary
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-lg lg:text-[1.4vw] text-foreground/70 leading-relaxed font-medium max-w-2xl lg:max-w-[80%]">
          Red Bull is more than what’s inside the can, it’s the spark that turns
          ambition into motion. From athletes conquering impossible summits and
          redefining human limits, to creators and dreamers staying up to build
          the future, it exists to fuel the courage, focus, and drive to do what
          has never been done before. When you have the drive, Red Bull gives
          you the wings to make it extraordinary.
        </p>
      </div>
    </section>
  );
};

export default TextDivider2;
