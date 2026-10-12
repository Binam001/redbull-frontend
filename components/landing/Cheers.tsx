"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/shared/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Cheers() {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftHandRef = useRef<HTMLDivElement>(null);
    const rightHandRef = useRef<HTMLDivElement>(null);
    const leftTextRef = useRef<HTMLDivElement>(null);
    const rightTextRef = useRef<HTMLDivElement>(null);
    const cheersLineRef = useRef<HTMLDivElement>(null);

    // Scroll-triggered hands entrance animation meeting in middle
    useGSAP(
        () => {
            const container = containerRef.current;
            const leftHand = leftHandRef.current;
            const rightHand = rightHandRef.current;
            const leftText = leftTextRef.current;
            const rightText = rightTextRef.current;
            const cheersLine = cheersLineRef.current;
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

            if (leftText && rightText) {
                gsap.set([leftText, rightText], { opacity: 1, y: 0 });
            }

            if (cheersLine) {
                gsap.set(cheersLine, {
                    opacity: 0,
                    y: 32,
                    scale: 0.94,
                    filter: "blur(8px)",
                });
            }

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "+=140%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    refreshPriority: 8,
                    invalidateOnRefresh: true,
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

            // 2. Softly dim descriptions as cans draw close to clink in center
            if (leftText && rightText) {
                tl.to(
                    [leftText, rightText],
                    {
                        opacity: 0.15,
                        scale: 0.95,
                        duration: 0.35,
                        ease: "power2.inOut",
                    },
                    0.45
                );
            }

            // 3. Subtle cheers clink micro-impact when cans meet
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

            // 4. Reveal "cheers to new energy" line right after the clink
            if (cheersLine) {
                tl.to(
                    cheersLine,
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.35,
                        ease: "power3.out",
                    },
                    0.88
                );
            }

            // 5. Hold in the met/cheers position for remaining pinned scroll
            tl.to({}, { duration: 0.35 });
        },
        { scope: containerRef }
    );

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden font-sans select-none bg-black"
            >
                {/* Product Descriptions Layer (Left Can info on right of left can, Right Can info on left of right can) */}
                <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-8 lg:px-[5vw] pointer-events-auto">
                    <div className="w-full lg:max-w-[45vw] grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-[8vw] items-center">
                        {/* ================= LEFT CAN DESCRIPTION ================= */}
                        <div
                            ref={leftTextRef}
                            className="flex flex-col items-start text-left space-y-3 sm:space-y-4 lg:space-y-[1.2vw] max-w-sm sm:max-w-md lg:max-w-[32vw] z-10 will-change-transform"
                        >
                            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                                <span>New-Gen Can · 330ml</span>
                            </div> */}

                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold tracking-tight text-white leading-[1.12]">
                                Blueberry  <br className="hidden sm:inline" />
                                <span className=""> Blackcurrant</span>
                            </h2>

                            {/* <p className="text-xs sm:text-sm md:text-base text-white/75 leading-relaxed font-normal">
                                Red Bull Carbonated Blackcurrant Blueberry 330ml pairs lively carbonation with the rich, fruity taste of blackcurrant and blueberry. Smooth, refreshing, and ready to enjoy, it’s a flavorful choice for work, study, gaming, or time on the move—whenever you want a refreshing drink with an energizing boost.
                            </p> */}

                            <div className="pt-1 sm:pt-2 lg:pt-[0.6vw]">
                                <Button
                                    label="Explore Blackcurrant"
                                    href="/energy-drinks/carbonated-blackcurrant-blueberry-330ml"
                                    className="rounded-full lg:px-[1.6vw] lg:py-[0.6vw] lg:text-[0.85vw]"
                                />
                            </div>
                        </div>

                        {/* ================= RIGHT CAN DESCRIPTION ================= */}
                        <div
                            ref={rightTextRef}
                            className="flex flex-col items-end text-right space-y-3 sm:space-y-4 lg:space-y-[1.2vw] max-w-sm sm:max-w-md lg:max-w-[32vw] ml-auto z-10 will-change-transform"
                        >
                            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                                <span>Classic Gold · 250ml</span>
                            </div> */}

                            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold tracking-tight text-white leading-[1.12]">
                                Everyday Energy <br className="hidden sm:inline" />
                                <span className="">with Red  Bull  Gold</span>
                            </h2>

                            {/* <p className="text-xs sm:text-sm md:text-base text-white/75 leading-relaxed font-normal">
                                Meet Red Bull Gold 250ml—a convenient companion for busy days and active routines. Made with high-quality ingredients, including taurine and B-group vitamins, it brings together amino acids and carbohydrates in a crisp, refreshing drink. Keep a can close for the moments that call for focus, movement, and a little extra energy.
                            </p> */}

                            <div className="pt-1 sm:pt-2 lg:pt-[0.6vw]">
                                <Button
                                    label="Explore Red Bull Gold"
                                    href="/energy-drinks/red-bull-250ml"
                                    className="rounded-full lg:px-[1.6vw] lg:py-[0.6vw] lg:text-[0.85vw]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Front / Foreground Hands CTA Layer (meets in middle on scroll) */}
                <div className="hands-foreground-layer absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center">
                    <div className="relative w-[150vw] sm:w-[125vw] md:w-full lg:w-[100vw] lg:max-w-none aspect-[1678/937] flex items-center justify-center">
                        {/* Right Hand (holding gold can) */}
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

                        {/* Left Hand (holding purple/gold can) */}
                        <div
                            ref={leftHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-20"
                        >
                            <img
                                src="/images/product/long-left.png"
                                alt="Left hand holding Red Bull can"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>
                    </div>
                </div>

                {/* "Cheers to new energy" Reveal Line (right below the cans after clink) */}
                <div
                    ref={cheersLineRef}
                    className="absolute bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-[3.5vw] left-1/2 -translate-x-1/2 z-30 pointer-events-none text-center px-4 sm:px-8 lg:px-[5vw] will-change-transform will-change-opacity"
                >
                    <div className="overflow-hidden py-1 lg:py-[0.3vw]">
                        <h3 className="font-primary text-xl sm:text-2xl md:text-3xl lg:text-[2.4vw] font-bold tracking-tight uppercase text-white drop-shadow-[0_4px_24px_rgba(203,32,38,0.35)] lg:drop-shadow-[0_0.3vw_1.5vw_rgba(203,32,38,0.35)]">
                            Cheers to <span className="text-primary">new energy</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
}