import Image from 'next/image'
import React from 'react'

const LongHero = () => {
    return (
        <section className="relative w-full h-screen min-h-[580px] lg:min-h-0 bg-black overflow-hidden flex flex-col items-center justify-between px-4 sm:px-8 lg:px-[5vw]">
            {/* Red Ambient Spotlight Gradient Glow */}
            <div
                className="absolute inset-0 pointer-events-none z-0 select-none"
                style={{
                    background: `
                        radial-gradient(
                            ellipse 85% 65% at 50% 62%,
                            rgba(198, 32, 38, 0.65) 0%,
                            rgba(162, 24, 28, 0.45) 28%,
                            rgba(115, 16, 20, 0.22) 52%,
                            rgba(0, 0, 0, 0) 76%
                        )
                    `,
                }}
            />

            <div className="relative z-10 w-full lg:max-w-[90vw] mx-auto pt-32 sm:pt-36 md:pt-44 lg:pt-[11vw] xl:pt-[10vw] text-center flex flex-col items-center gap-3 sm:gap-4 md:gap-6 lg:gap-[1.2vw] pointer-events-none">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2vw] uppercase font-primary tracking-tight text-white leading-[0.92] lg:leading-[0.9]">
                    Naya josh refreshing <br /> energy
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-[1.1vw] xl:text-[1vw] text-white/90 leading-relaxed font-medium max-w-sm sm:max-w-md lg:max-w-[34vw]">
                    The New Gen - energy
                </p>
            </div>

            <div className="absolute -bottom-14 sm:-bottom-20 md:-bottom-28 lg:-bottom-[7vw] xl:-bottom-[8vw] left-1/2 -translate-x-1/2 pointer-events-none select-none z-10 w-[115vw] sm:w-[90vw] md:w-[75vw] lg:w-[62vw] xl:w-[55vw] max-w-none flex justify-center">
                <Image
                    src="/images/product/long-can-hero.png"
                    alt="Red Bull Carbonated Blackcurrant Blueberry 330ml can"
                    width={1300}
                    height={1000}
                    priority
                    sizes="(max-width: 640px) 115vw, (max-width: 768px) 90vw, (max-width: 1024px) 75vw, 60vw"
                    className="w-full h-auto object-contain pointer-events-none select-none"
                />
            </div>
        </section>
    );
};

export default LongHero;