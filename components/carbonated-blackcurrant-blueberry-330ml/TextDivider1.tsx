import React from "react";

const TextDivider1 = () => {
  return (
    <section className="flex justify-center items-center bg-foreground text-background">
      <div className="w-full flex flex-col justify-center items-center text-center gap-4 xl:gap-8 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 xl:py-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]">
          A Fresh Flavor
          <br />
          <span className="whitespace-nowrap ">with a Spark</span>
          <br />
        </h2>
        <p className="text-xs sm:text-sm md:text-lg text-background/70 leading-relaxed font-medium max-w-xl lg:max-w-[60%]">
          Meet Red Bull Carbonated Blackcurrant Blueberry 330ml: a
          ready-to-drink can made for active days and full schedules. Its fruity
          flavor and lively carbonation make it easy to enjoy between tasks,
          before a workout, or whenever you’re ready for a refreshing change.
        </p>
      </div>
    </section>
  );
};

export default TextDivider1;
