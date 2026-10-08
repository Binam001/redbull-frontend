"use client";

import React from "react";
import Image from "next/image";

interface TcpProps {
    title?: string;
    paragraphs?: string[];
    imageSrc?: string;
    imageAlt?: string;
}

export default function Saras({
    title = "Bringing Red Bull’s True Energy to Nepal",
    paragraphs = [
        "Since 2023, Saras Beverages has been the sole manufacturer and distributor of Red Bull in Nepal. Working with the brand’s founders, T.C. Pharmaceuticals Industries Thailand, we produce Red Bull at our state-of-the-art facility in Bharatpur—upholding global standards of quality and safety. We’re committed to creating high-performance energy drinks, innovating for our customers, and building a more sustainable, connected future for Nepal.",
    ],
    imageSrc = "/images/about/saras.png",
    imageAlt = "A Heritage of Welcome",
}: TcpProps) {
    return (
        <section className="relative w-full  flex flex-col lg:flex-row items-center justify-between overflow-hidden">
            {/* ================= RIGHT COLUMN: EDITORIAL TYPOGRAPHY ================= */}
            <div className="relative w-full lg:w-1/2 flex flex-col justify-center   z-10">
                <div className="max-w-3xl">
                    {/* Section Headline */}
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-primary leading-[1.08] max-w-2xl"

                    >
                        {title}
                    </h2>

                    {/* Paragraphs */}
                    <div className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium  mt-8">
                        {paragraphs.map((p, idx) => (
                            <p key={idx}>{p}</p>
                        ))}
                    </div>
                </div>
            </div>
            {/* ================= LEFT COLUMN: IMAGE WITH SEAMLESS GRADIENT FADE ================= */}
            <div className="relative w-full lg:w-1/2 h-[20vh] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center"
                />


            </div>


        </section>
    );
}