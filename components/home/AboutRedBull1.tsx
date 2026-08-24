import React from "react";

const AboutRedBull1 = () => {
  return (
    <>
      {/* ----------------- SECTION 2: Content on Left, Can on Right ----------------- */}
      <section className="relative w-full h-screen flex items-center z-10">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Section 2 Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-secondary">
              THE ANATOMY
              <br />
              <span className="text-primary">OF PURE</span>
              <br />
              ALERTNESS.
            </h2>

            <p className="text-sm md:text-base text-black/70 max-w-md leading-relaxed font-medium">
              Alpine water, taurine, and vital B-vitamins. A formula engineered
              for immediate neurological drive and sustained stamina.
            </p>
          </div>

          {/* Right Spacer for 3D Can */}
          <div className="w-full md:w-1/2 h-full hidden md:block" />
        </div>
      </section>

      {/* ----------------- SECTION 3: Can on Left, Content on Right ----------------- */}
      <section className="relative w-full h-screen flex items-center z-10">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Spacer for 3D Can */}
          <div className="w-full md:w-1/2 h-full hidden md:block" />

          {/* Right: Section 3 Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-secondary">
              WHEN SECONDS
              <br />
              <span className="text-primary">DECIDE THE</span>
              <br />
              OUTCOME.
            </h2>

            <p className="text-sm md:text-base text-black/70 max-w-md leading-relaxed font-medium">
              From high-speed cockpits to decisive championship plays. When
              fatigue is not an option, Red Bull vitalizes body and mind.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutRedBull1;
