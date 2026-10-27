import React from "react";

const EnergyDrinkContent = ({
  title1,
  title2,
  desc,
}: {
  title1: string;
  title2: string;
  desc: string;
}) => {
  return (
    <section className="h-svh flex justify-center items-center bg-foreground text-background py-16 lg:py-24">
      <div className="w-full h-full flex flex-col justify-evenly items-center text-center gap-6 xl:gap-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.1] max-w-4xl">
          {title1}
          <br />
          <span className="">{title2}</span>
        </h2>
        <p className="text-sm md:text-lg lg:text-[1.4vw] text-background/70 leading-relaxed font-medium lg:max-w-[80%]">
          {desc}
        </p>
      </div>
    </section>
  );
};

export default EnergyDrinkContent;
