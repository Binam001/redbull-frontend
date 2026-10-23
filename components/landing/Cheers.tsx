"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
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
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const audioPoolRef = useRef<HTMLAudioElement[]>([]);
    const poolIndexRef = useRef<number>(0);
    const lastPlayTimeRef = useRef<number>(0);

    // Synthesized metallic "ting" fallback via Web Audio API
    const playSynthesizedTing = useCallback(() => {
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = audioContextRef.current || new AudioCtx();
            if (ctx.state === "suspended") {
                ctx.resume().catch(() => {});
            }

            const now = ctx.currentTime;
            const frequencies = [2200, 3350, 4900];
            frequencies.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(idx === 0 ? 0.35 : 0.15, now + 0.004);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 0.75 : 0.45));

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.8);
            });
        } catch {
            // Audio context not available or restricted
        }
    }, []);

    // Secondary fallback: HTMLAudioElement pool
    const playFallbackAudio = useCallback(() => {
        try {
            const pool = audioPoolRef.current;
            if (pool && pool.length > 0) {
                const audio = pool[poolIndexRef.current % pool.length];
                poolIndexRef.current++;
                audio.currentTime = 0;
                audio.play().catch(() => {
                    playSynthesizedTing();
                });
            } else {
                playSynthesizedTing();
            }
        } catch {
            playSynthesizedTing();
        }
    }, [playSynthesizedTing]);

    // Primary audio playback: Web Audio API (in-memory buffer) -> HTML5 audio pool -> Synthesized ting
    const playClinkSound = useCallback(() => {
        const now = Date.now();
        // Prevent rapid duplicate firings within 180ms
        if (now - lastPlayTimeRef.current < 180) return;
        lastPlayTimeRef.current = now;

        const ctx = audioContextRef.current;

        const playBuffer = () => {
            if (!ctx || !audioBufferRef.current) return false;
            try {
                const source = ctx.createBufferSource();
                source.buffer = audioBufferRef.current;
                const gain = ctx.createGain();
                gain.gain.value = 1.0;
                source.connect(gain);
                gain.connect(ctx.destination);
                source.start(0);
                return true;
            } catch {
                return false;
            }
        };

        if (ctx && audioBufferRef.current) {
            if (ctx.state === "running") {
                if (playBuffer()) return;
            } else if (ctx.state === "suspended") {
                ctx.resume()
                    .then(() => {
                        if (!playBuffer()) {
                            playFallbackAudio();
                        }
                    })
                    .catch(() => {
                        playFallbackAudio();
                    });
                return;
            }
        }

        playFallbackAudio();
    }, [playFallbackAudio]);

    // Preload & warm up clink audio + Web Audio buffer
    useEffect(() => {
        // Pool of 4 audio elements for rapid playback
        const pool = [
            new Audio("/audios/can-clink.mp3"),
            new Audio("/audios/can-clink.mp3"),
            new Audio("/audios/can-clink.mp3"),
            new Audio("/audios/can-clink.mp3"),
        ];
        pool.forEach((a) => {
            a.preload = "auto";
            a.volume = 0.95;
            a.load();
        });
        audioPoolRef.current = pool;

        const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;

            fetch("/audios/can-clink.mp3")
                .then((res) => res.arrayBuffer())
                .then((buf) => ctx.decodeAudioData(buf))
                .then((decoded) => {
                    audioBufferRef.current = decoded;
                })
                .catch(() => { });
        }

        // Keep attempting to resume/unlock on any user interaction until running
        const unlock = () => {
            const ctx = audioContextRef.current;
            if (ctx && ctx.state === "suspended") {
                ctx.resume().then(() => {
                    if (ctx.state === "running") {
                        events.forEach((evt) => window.removeEventListener(evt, unlock));
                    }
                }).catch(() => {});
            }
        };

        const events = ["pointerdown", "touchstart", "click", "keydown", "wheel", "scroll"];
        events.forEach((evt) => {
            window.addEventListener(evt, unlock, { passive: true });
        });

        return () => {
            events.forEach((evt) => {
                window.removeEventListener(evt, unlock);
            });
        };
    }, []);

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
            const targetLeftX = -40;
            const targetRightX = 40;

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

            // Initially hidden in top corners; appear when the bottles click
            if (leftText) {
                gsap.set(leftText, {
                    autoAlpha: 0,
                    y: -28,
                    x: -16,
                    scale: 0.94,
                    filter: "blur(6px)",
                });
            }

            if (rightText) {
                gsap.set(rightText, {
                    autoAlpha: 0,
                    y: -28,
                    x: 16,
                    scale: 0.94,
                    filter: "blur(6px)",
                });
            }

            if (cheersLine) {
                gsap.set(cheersLine, {
                    autoAlpha: 0,
                    y: 32,
                    scale: 0.94,
                    filter: "blur(8px)",
                });
            }

            let prevProgress = 0;
            let clinkArmed = true;

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
                    onUpdate: (self) => {
                        const p = self.progress;

                        // Crossed forward through the meeting point (~0.50)
                        if (p >= 0.50 && prevProgress < 0.50 && clinkArmed) {
                            clinkArmed = false;
                            playClinkSound();
                        }
                        // Re-arm as soon as hands visually separate when scrolling back
                        else if (p < 0.46) {
                            clinkArmed = true;
                        }

                        prevProgress = p;
                    },
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

            // 2. Subtle cheers clink micro-impact when cans meet (the click/clink moment)
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

            // 3. Reveal Left Title & Explore Button in top-left empty space
            if (leftText) {
                tl.to(
                    leftText,
                    {
                        autoAlpha: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.35,
                        ease: "power3.out",
                    },
                    0.82
                );
            }

            // 3. Reveal Right Title & Explore Button in top-right empty space
            if (rightText) {
                tl.to(
                    rightText,
                    {
                        autoAlpha: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.35,
                        ease: "power3.out",
                    },
                    0.82
                );
            }

            // 4. Reveal "cheers to new energy" line right after the clink
            if (cheersLine) {
                tl.to(
                    cheersLine,
                    {
                        autoAlpha: 1,
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
        { scope: containerRef, dependencies: [playClinkSound] }
    );

    return (
        <div className="w-full">
            <div
                ref={containerRef}
                className="relative w-full h-screen overflow-hidden font-sans select-none bg-black"
            >
                {/* Top Corner Products Info Layer (Left in Top-Left, Right in Top-Right) */}
                <div className="absolute top-0 inset-x-0 z-30 pointer-events-none p-6 sm:p-10 md:p-12 lg:p-[4vw] flex items-start justify-between">
                    {/* ================= TOP-LEFT: BLUEBERRY BLACKCURRANT ================= */}
                    <div
                        ref={leftTextRef}
                        className="flex flex-col items-start text-left space-y-2.5 sm:space-y-3 lg:space-y-[0.8vw] max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-[22vw] pointer-events-auto will-change-transform will-change-opacity"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-primary/40 text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                            <span>New-Gen Can · 330ml</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold tracking-tight text-white leading-[1.12]">
                            Blueberry <br className="hidden sm:inline" />
                            <span>Blackcurrant</span>
                        </h2>

                        <div className="pt-1 sm:pt-2 lg:pt-[0.4vw]">
                            <Button
                                label="Explore Blackcurrant"
                                href="/energy-drinks/carbonated-blackcurrant-blueberry-330ml"
                                className="rounded-full px-4 py-2 sm:px-6 sm:py-2.5 lg:px-[1.6vw] lg:py-[0.6vw] text-xs sm:text-sm lg:text-[0.85vw]"
                            />
                        </div>
                    </div>

                    {/* ================= TOP-RIGHT: RED BULL GOLD ================= */}
                    <div
                        ref={rightTextRef}
                        className="flex flex-col items-end text-right space-y-2.5 sm:space-y-3 lg:space-y-[0.8vw] max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-[22vw] pointer-events-auto will-change-transform will-change-opacity"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-primary/40 text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                            <span>Classic Gold · 250ml</span>
                        </div>

                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold tracking-tight text-white leading-[1.12]">
                            Everyday Energy <br className="hidden sm:inline" />
                            <span>with Red Bull Gold</span>
                        </h2>

                        <div className="pt-1 sm:pt-2 lg:pt-[0.4vw]">
                            <Button
                                label="Explore Red Bull Gold"
                                href="/energy-drinks/red-bull-250ml"
                                className="rounded-full px-4 py-2 sm:px-6 sm:py-2.5 lg:px-[1.6vw] lg:py-[0.6vw] text-xs sm:text-sm lg:text-[0.85vw]"
                            />
                        </div>
                    </div>
                </div>

                {/* Front / Foreground Hands CTA Layer (meets in middle on scroll) */}
                <div
                    className="hands-foreground-layer absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center"
                >
                    <div
                        className="relative w-[150vw] sm:w-[125vw] md:w-full lg:w-[100vw] lg:max-w-none aspect-[1678/937] flex items-center justify-center scale-75 sm:scale-[0.78] lg:scale-[0.8] origin-center"
                    >
                        {/* Right Hand (holding gold can) */}
                        <div
                            ref={rightHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
                        >
                            <Image
                                src="/images/product/short-right-2.png"
                                alt="Right hand holding Red Bull can"
                                fill
                                priority
                                sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
                                className="w-full h-full object-contain pointer-events-none select-none"
                                draggable={false}
                            />
                        </div>

                        {/* Left Hand (holding purple/gold can) */}
                        <div
                            ref={leftHandRef}
                            className="absolute inset-0 flex items-center justify-center will-change-transform z-20"
                        >
                            <Image
                                src="/images/product/long-left-2.png"
                                alt="Left hand holding Red Bull can"
                                fill
                                priority
                                sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
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
                    {/* <div className="overflow-hidden py-1 lg:py-[0.3vw]">
                        <h3 className="font-primary text-xl sm:text-2xl md:text-3xl lg:text-[2.4vw] font-bold tracking-tight uppercase text-white drop-shadow-[0_4px_24px_rgba(203,32,38,0.35)] lg:drop-shadow-[0_0.3vw_1.5vw_rgba(203,32,38,0.35)]">
                            Cheers to <span className="text-primary">new energy</span>
                        </h3>
                    </div> */}
                </div>
            </div>
        </div>
    );
}