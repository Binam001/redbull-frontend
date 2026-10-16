import React from "react";
import Image from "next/image";

interface CareerDetailsHeroProps {
    title?: string;
    category?: string;
    department?: string;
    location?: string;
    imageSrc?: string;
}

export default function CareerDetailHero({
    title = "Make Your Mark. Move the World.",
    category,
    department,
    location,
    imageSrc = "/images/career-hero.png",
}: CareerDetailsHeroProps) {
    return (
        <section className="relative w-full h-[38vh] sm:h-[44vh] lg:h-[48vh] min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] overflow-hidden bg-zinc-950 text-white flex items-end">
            {/* Static Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                {/* Gradient Overlays for contrast and brand tone */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>


        </section>
    );
}
