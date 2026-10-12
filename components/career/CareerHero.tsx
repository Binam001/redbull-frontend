import React from 'react';
import Image from 'next/image';

interface CareerHeroProps {
    title?: string;
    imageSrc?: string;
}

const CareerHero: React.FC<CareerHeroProps> = ({
    title = 'Make Your Mark. Move the World.',
    imageSrc = '/images/career-hero.png',
}) => {
    return (
        <section className="relative w-full h-[48vh] sm:h-[54vh] lg:h-[70vh]  flex items-end justify-end overflow-hidden !py-0 px-4 sm:px-8 lg:px-[5vw] bg-black select-none">
            {/* Background Photographic Image (Grayscale + High Contrast) */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center  pointer-events-none select-none scale-105"
                />

                {/* Dark Tint & Filmic Vignette Overlays */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/85 pointer-events-none" />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                    }}
                />
            </div>

            {/* Centered Hero Headline */}
            <div className="relative z-10 w-full lg:max-w-[90vw] mx-auto text-center flex flex-col gap-4 items-center justify-center pointer-events-none pb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.9)]">
                    {title}
                </h1>
                <p
                    className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-xl mx-auto"
                >
                    Bring your ideas, energy, and ambition to a team that turns bold thinking into meaningful action.
                </p>
            </div>
        </section>
    );
};

export default CareerHero;