"use client";

import React from "react";
import Image from "next/image";

interface TcpProps {
    title?: string;
    paragraphs?: string[];
    imageSrc?: string;
    imageAlt?: string;
}

export default function Tcp({
    title = "A Legacy of Energy, Built to Empower",
    paragraphs = [
        "Founded in Thailand in 1956, T.C. Pharmaceuticals Industries Company Limited created Red Bull with a belief in helping people find the energy to pursue what matters. Today, that legacy guides our commitment to quality, responsibility, and positive impact—empowering people to reach their goals and contribute to a better future.",
    ],
    imageSrc = "/images/about/tcp.png",
    imageAlt = "A Heritage of Welcome",
}: TcpProps) {
    return (
        <section className="relative w-full  flex flex-col lg:flex-row items-center justify-between overflow-hidden my-16">
            {/* ================= LEFT COLUMN: IMAGE WITH SEAMLESS GRADIENT FADE ================= */}
            <div className="relative w-full lg:w-1/2 h-[30vh] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain object-center"
                />


            </div>

            {/* ================= RIGHT COLUMN: EDITORIAL TYPOGRAPHY ================= */}
            <div className="relative w-full lg:w-1/2 flex flex-col justify-center  py-16 lg:py-24 z-10">
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
        </section>
    );
}