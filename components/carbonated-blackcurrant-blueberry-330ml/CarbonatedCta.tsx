"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/shared/Button";

gsap.registerPlugin(ScrollTrigger);

export default function CarbonatedCta() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftHandRef = useRef<HTMLDivElement>(null);
    const rightHandRef = useRef<HTMLDivElement>(null);

    // Scroll-triggered hands entrance animation meeting in middle
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
                xPercent: -105,
                rotate: -6,
                yPercent: 4,
            });
            gsap.set(rightHand, {
                xPercent: 105,
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

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden font-sans select-none"
            >
                {/* Background Content Layer */}
                <div className="hero-content-background absolute inset-0 flex flex-col items-center justify-center bg-white text-neutral-900 p-8">
                    <div className="max-w-4xl text-center space-y-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                            Make Room <br /> for What’s Next
                        </h1>

                        <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl mx-auto">
                            Whether you’re getting into work, studying late, gaming with friends, or gearing up to move, the New-Gen Can brings flavor and fizz along for the ride. Choose your moment, crack it open, and take on what’s next.
                        </p>

                        <div className="pt-4 flex justify-center gap-4">
                            <Button
                                label="Discover the New-Gen Can"
                                className="rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Front / Foreground Hands CTA Layer (meets in middle on scroll) */}
                <div className="hands-foreground-layer absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center">
                    <div className="relative w-[150vw] sm:w-[125vw] md:w-full max-w-[1920px] aspect-[1678/937] flex items-center justify-center">
                        {/* Right Hand (behind left hand, holding yellow/purple can) */}
                        <div
                            ref={rightHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
                        >
                            <img
                                src="/images/home/cta/right-image.png"
                                alt="Right hand holding Red Bull can"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>

                        {/* Left Hand (in front of right hand, holding blue/silver can) */}
                        <div
                            ref={leftHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-20"
                        >
                            <img
                                src="/images/home/cta/left-hand.png"
                                alt="Left hand holding Red Bull can"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}