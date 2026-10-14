"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Cycle() {
    const pathname = usePathname();

    // Do not show Cycle section on contact page
    if (pathname?.startsWith("/contact")) {
        return null;
    }

    return <CycleContent />;
}

function CycleContent() {
    const currentStart = 1;
    const currentEnd = 126;
    const currentFolder = "/compressed-footer";

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const totalFrames = currentEnd - currentStart + 1;

    // 1. Preload sequence frames
    useEffect(() => {
        setIsReady(false);
        let loaded = 0;
        const loadedImages: HTMLImageElement[] = [];

        const drawFrame = (img: HTMLImageElement) => {
            const canvas = canvasRef.current;
            if (!canvas || !img || img.naturalWidth === 0) return;
            if (canvas.width !== img.naturalWidth) {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
            }
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };

        const handleImageLoad = (idx: number) => {
            loaded += 1;

            // Draw the first frame as soon as it's ready so canvas isn't blank
            if (idx === 0) {
                const firstImg = loadedImages[0];
                if (firstImg) drawFrame(firstImg);
            }

            if (loaded === totalFrames) {
                setIsReady(true);
                const validImg = loadedImages.find((img) => img.naturalWidth > 0);
                if (validImg) drawFrame(validImg);
            }
        };

        for (let i = currentStart; i <= currentEnd; i++) {
            const img = new window.Image();
            const idx = i - currentStart;
            img.src = `${currentFolder}/${i}.webp`;
            img.onload = () => handleImageLoad(idx);
            img.onerror = () => handleImageLoad(idx);

            if (img.complete) {
                handleImageLoad(idx);
            }

            loadedImages.push(img);
        }

        imagesRef.current = loadedImages;
    }, [currentStart, currentEnd, totalFrames, currentFolder]);

    // 2. Scroll Scrub GSAP Timeline
    useGSAP(
        () => {
            if (!isReady || imagesRef.current.length === 0) return;

            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const obj = { frame: 0 };

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top 40%",
                    end: "bottom 50%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            tl.to(
                obj,
                {
                    frame: totalFrames - 1,
                    ease: "none",
                    duration: 2,
                    onUpdate: () => {
                        const frameIndex = Math.min(
                            totalFrames - 1,
                            Math.max(0, Math.round(obj.frame)),
                        );
                        const img = imagesRef.current[frameIndex];
                        if (img && img.complete && img.naturalWidth > 0) {
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                            }
                        }
                    },
                },
                0,
            );

            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
            });
        },
        {
            scope: containerRef,
            dependencies: [isReady, totalFrames],
        },
    );

    return (
        <div className="relative w-full">
            <div
                ref={containerRef}
                className="relative w-full h-dvh overflow-hidden select-none bg-black"
                style={{
                    background:
                        "linear-gradient(to bottom, #ffffff 0%, #ffffff 30%, #000000 80%, #000000 100%)",
                }}
            >
                {/* 1. Deep Eased White Scrim Gradient (Seamlessly dissolves FAQ into mountain sky with zero banding) */}
                <div
                    className="absolute top-0 inset-x-0 h-64 sm:h-80 md:h-[45vh] lg:h-[50vh] z-[13] pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.99) 6%, rgba(255,255,255,0.96) 13%, rgba(255,255,255,0.91) 21%, rgba(255,255,255,0.83) 30%, rgba(255,255,255,0.73) 40%, rgba(255,255,255,0.61) 50%, rgba(255,255,255,0.48) 60%, rgba(255,255,255,0.35) 70%, rgba(255,255,255,0.22) 79%, rgba(255,255,255,0.12) 87%, rgba(255,255,255,0.04) 94%, transparent 100%)",
                    }}
                />

                {/* 2. Soft Ambient Alpine Mist/Haze Diffusion Layer */}
                <div
                    className="absolute top-0 inset-x-0 h-80 sm:h-[55vh] md:h-[62vh] z-[12] pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.28) 35%, rgba(255,255,255,0.08) 70%, transparent 100%)",
                    }}
                />

                {/* 3. Smooth Eased Bottom Fade into Pitch-Black Footer */}
                <div
                    className="absolute bottom-0 inset-x-0 h-44 sm:h-56 md:h-72 z-[12] pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to top, #000000 0%, rgba(0,0,0,0.99) 6%, rgba(0,0,0,0.95) 14%, rgba(0,0,0,0.88) 24%, rgba(0,0,0,0.76) 35%, rgba(0,0,0,0.60) 48%, rgba(0,0,0,0.42) 62%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.10) 86%, rgba(0,0,0,0.03) 95%, transparent 100%)",
                    }}
                />

                <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="relative w-full h-full object-cover object-center z-10"
                    />
                </div>
            </div>
        </div>
    );
}