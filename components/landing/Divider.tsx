"use client";

import Image from "next/image";
import React from "react";

const Divider = () => {
    return (
        <section className="w-full h-screen relative bg-[#000000] overflow-hidden flex items-center justify-center p-0 m-0">
            {/* Ambient Radial Lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-187.5 h-87.5 bg-primary/20 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-8 w-95 h-95 bg-primary/15 rounded-full blur-[130px] pointer-events-none z-0" />
            <div className="absolute top-1/2 right-8 w-95 h-95 bg-[#233971]/25 rounded-full blur-[130px] pointer-events-none z-0" />

            {/* Background 3-Line Flanking Typography */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
                {/* Line 1: RED BULL (Centered High Above the Can Lids) */}
                <div className="absolute top-8 sm:top-12 md:top-14 lg:top-16 left-0 right-0 w-full text-center px-4">
                    <h2
                        className="font-black uppercase text-white tracking-tight leading-none inline-block drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
                        style={{
                            fontSize: "clamp(2.4rem, 7vw, 7.5rem)",
                            fontFamily: "'Ethnocentric', 'AcuminPro-Bold', sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        <span className="text-white drop-shadow-[0_6px_25px_rgba(203,32,38,0.4)]">
                            RED BULL
                        </span>
                    </h2>
                </div>

                {/* Line 2: GIVES YOU (Flanking the Left Side Above Horizontal Can) */}
                <div className="absolute left-4 sm:left-8 md:left-12 lg:left-16 xl:left-20 top-[40%] md:top-[42%] -translate-y-1/2 text-left z-0">
                    {/* Atmospheric Red Glow behind GIVES YOU */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-40 bg-primary/30 rounded-full blur-[85px] pointer-events-none -z-10" />

                    <span
                        className="font-black uppercase text-white tracking-tight leading-none block whitespace-nowrap drop-shadow-[0_0_35px_rgba(203,32,38,0.75)]"
                        style={{
                            fontSize: "clamp(1.2rem, 3.2vw, 4.2rem)",
                            fontFamily: "'Ethnocentric', 'AcuminPro-Bold', sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        GIVES YOU
                    </span>
                </div>

                {/* Line 3: WINGS (Flanking the Right Side Above Tilted Can) */}
                <div className="absolute right-4 sm:right-8 md:right-12 lg:right-16 xl:right-20 top-[40%] md:top-[42%] -translate-y-1/2 text-right z-0">
                    {/* Atmospheric Red Glow behind WINGS */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-40 bg-primary/30 rounded-full blur-[85px] pointer-events-none -z-10" />

                    <span
                        className="font-black uppercase text-white tracking-tight leading-none block whitespace-nowrap drop-shadow-[0_0_35px_rgba(203,32,38,0.75)]"
                        style={{
                            fontSize: "clamp(1.8rem, 4.8vw, 6.2rem)",
                            fontFamily: "'Ethnocentric', 'AcuminPro-Bold', sans-serif",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        WINGS
                    </span>
                </div>
            </div>

            {/* Foreground Cans Image Standing in Front of the Heading */}
            <div className="relative z-10 w-full h-full pointer-events-none">
                <Image
                    src="/images/home/divider/divider-1.png"
                    alt="Red Bull Cans - Gives You Wings"
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div>
        </section>
    );
};

export default Divider;