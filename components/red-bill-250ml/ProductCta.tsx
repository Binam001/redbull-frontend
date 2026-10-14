"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/shared/Button";

gsap.registerPlugin(ScrollTrigger);

export default function ProductCta() {
    const containerRef = useRef<HTMLDivElement>(null);
    // const leftHandRef = useRef<HTMLDivElement>(null);
    // const rightHandRef = useRef<HTMLDivElement>(null);

    // Scroll-triggered hands entrance animation meeting in middle (commented out)
    /*
    useGSAP(
        () => {
            const container = containerRef.current;
            const leftHand = leftHandRef.current;
            const rightHand = rightHandRef.current;
            if (!container || !leftHand || !rightHand) return;

            // Target meeting position:
            // -32.8% for left hand, +32.8% for right hand (meeting symmetrically in middle)
            const targetLeftX = -32.8;
            const targetRightX = 32.8;

            // Initial positions: off-screen left and right with subtle tilt
            gsap.set(leftHand, {
                xPercent: -65,
                rotate: -6,
                yPercent: 4,
            });
            gsap.set(rightHand, {
                xPercent: 60,
                rotate: 6,
                yPercent: 4,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "+=120%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    refreshPriority: 8,
                },
            });

            // 1. Hands glide in from left and right and meet in the center
            tl.to(
                leftHand,
                {
                    xPercent: targetLeftX,
                    rotate: 0,
                    yPercent: 0,
                    ease: "power2.out",
                    duration: 0.8,
                },
                0
            ).to(
                rightHand,
                {
                    xPercent: targetRightX,
                    rotate: 0,
                    yPercent: 0,
                    ease: "power2.out",
                    duration: 0.8,
                },
                0
            );

            // 2. Subtle cheers clink micro-impact when cans meet
            tl.to(
                [leftHand, rightHand],
                {
                    scale: 1.03,
                    duration: 0.08,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: 1,
                },
                0.8
            );

            // 3. Hold in the met/cheers position for remaining pinned scroll
            tl.to({}, { duration: 0.2 });
        },
        { scope: containerRef }
    );
    */

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative w-full  flex items-center justify-center bg-white text-neutral-900 select-none p-8 overflow-hidden pt-44"
            >
                {/* Background Content Layer */}
                <div className="max-w-4xl text-center space-y-6">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                        Your Next Chapter <br /> Starts Here
                    </h1>

                    <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl mx-auto">
                        The plan is yours. The pace is yours. When you’re ready to take on what comes next, reach for Red Bull® Gold and make room for another step, another challenge, another possibility.
                    </p>

                    <div className="pt-4 flex justify-center gap-4">
                        <Button
                            label="Discover Red Bull Gold"
                            className="rounded-full"
                        />
                    </div>
                </div>

                {/* Front / Foreground Hands CTA Layer (commented out) */}
                {/*
                <div className="hands-foreground-layer absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center">
                    <div className="relative w-[150vw] sm:w-[125vw] md:w-full max-w-[1920px] aspect-[1678/937] flex items-center justify-center">
                        <div
                            ref={rightHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
                        >
                            <img
                                src="/images/product/short-right.png"
                                alt="Right hand holding Red Bull can"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>

                        <div
                            ref={leftHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-20"
                        >
                            <img
                                src="/images/product/short-left.png"
                                alt="Left hand holding Red Bull can"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>
                */}
            </div>
        </div>
    );
}