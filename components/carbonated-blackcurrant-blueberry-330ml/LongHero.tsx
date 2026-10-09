import Image from 'next/image'
import React from 'react'

const LongHero = () => {
    return (
        <div className='relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-between'>
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

            <div className="relative z-10 w-full px-4 pt-28 sm:pt-32 md:pt-55 text-center flex flex-col items-center gap-8 pointer-events-none">

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2vw] uppercase font-primary tracking-tight text-white leading-[0.9]">
                    YOUR TRUE ENERGY
                </h1>
                <p className='text-xs sm:text-sm md:text-xl text-white leading-relaxed font-medium max-w-md'>The authentic formulation that started a global revolution.</p>

            </div>
            <Image
                src="/images/product/long-can-hero.png"
                alt='Red Bull Gold 250ml short can'
                width={1300}
                height={1000}
                priority
                className='absolute -bottom-40 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10'
            />
        </div>
    )
}

export default LongHero