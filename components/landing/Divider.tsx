"use client";

import Image from "next/image";
import React from "react";

const Divider = () => {
    return (
        <section className="w-full h-screen relative  overflow-hidden flex items-center justify-center p-0 m-0">

            <div className="absolute bottom-20 z-20 flex flex-col items-center justify-center px-6 text-center text-white">


                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08]">
                    Built for the Ride
                </h2>

                <p className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-5xl mx-auto mt-4">
                    For those who move with focus, courage, and energy.
                </p>
            </div>
            {/* Foreground Cans Image Standing in Front of the Heading */}
            <div className="relative z-10 w-full h-full pointer-events-none">
                <Image
                    src="/images/home/divider/helmet-divider-2.png"
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