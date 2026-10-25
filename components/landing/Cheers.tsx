"use client";

import React, { useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Cheers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<HTMLDivElement>(null);
  const rightHandRef = useRef<HTMLDivElement>(null);
  const leftClosedRef = useRef<HTMLDivElement>(null);
  const leftOpenedRef = useRef<HTMLDivElement>(null);
  const rightClosedRef = useRef<HTMLDivElement>(null);
  const rightOpenedRef = useRef<HTMLDivElement>(null);
  const clinkAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const lastPlayTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(false);

  // Pre-load audio into AudioBuffer for 0ms latency playback
  React.useEffect(() => {
    const timer = setTimeout(() => {
      isMountedRef.current = true;
    }, 400);

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        fetch("/audios/can-clink-1.ogg")
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current = decoded;
          })
          .catch(() => {});
      }
    } catch {
      // Fallback to standard HTMLAudioElement
    }

    return () => clearTimeout(timer);
  }, []);

  // Direct can clink audio trigger on scroll - zero latency WebAudio with fallback
  const playClinkSound = useCallback(() => {
    if (!isMountedRef.current) return;

    const now = Date.now();
    // Prevent duplicate rapid triggers within 250ms
    if (now - lastPlayTimeRef.current < 250) return;
    lastPlayTimeRef.current = now;

    // 1. Try zero-latency Web Audio buffer
    const ctx = audioCtxRef.current;
    const buffer = audioBufferRef.current;
    if (ctx && buffer) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      try {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
        return;
      } catch {
        // Fall through to HTMLAudioElement
      }
    }

    // 2. HTMLAudioElement fallback
    const audio = clinkAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, []);

  // Scroll-triggered hands entrance animation meeting in middle
  useGSAP(
    () => {
      const container = containerRef.current;
      const leftHand = leftHandRef.current;
      const rightHand = rightHandRef.current;
      const leftClosed = leftClosedRef.current;
      const leftOpened = leftOpenedRef.current;
      const rightClosed = rightClosedRef.current;
      const rightOpened = rightOpenedRef.current;

      if (
        !container ||
        !leftHand ||
        !rightHand ||
        !leftClosed ||
        !leftOpened ||
        !rightClosed ||
        !rightOpened
      )
        return;

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

      // Initial can states: closed cans visible, opened cans hidden
      gsap.set([leftClosed, rightClosed], { autoAlpha: 1 });
      gsap.set([leftOpened, rightOpened], { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
          refreshPriority: 8,
          invalidateOnRefresh: true,
        },
      });

      // 1. Hands glide in from left and right and meet in the center (0 to 0.8)
      tl.to(
        leftHand,
        {
          xPercent: targetLeftX,
          rotate: 0,
          yPercent: 0,
          ease: "power2.out",
          duration: 0.8,
        },
        0,
      ).to(
        rightHand,
        {
          xPercent: targetRightX,
          rotate: 0,
          yPercent: 0,
          ease: "power2.out",
          duration: 0.8,
        },
        0,
      );

      // At exactly 0.8: seamlessly swap closed cans to opened cans
      tl.to(
        [leftClosed, rightClosed],
        { autoAlpha: 0, duration: 0.001, ease: "none" },
        0.8,
      ).to(
        [leftOpened, rightOpened],
        { autoAlpha: 1, duration: 0.001, ease: "none" },
        0.8,
      );

      // Trigger clink sound at exactly 0.8 (only when scrolling forward)
      tl.call(
        () => {
          if (!tl.scrollTrigger || tl.scrollTrigger.direction > 0) {
            playClinkSound();
          }
        },
        undefined,
        0.75,
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
        0.8,
      );

      // 3. Hold in the met/cheers position for remaining pinned scroll
      tl.to({}, { duration: 0.35 });
    },
    { scope: containerRef, dependencies: [playClinkSound] },
  );

  return (
    <div className="w-full">
      {/* Dedicated audio element for can clink sound */}
      <audio ref={clinkAudioRef} src="/audios/can-clink-1.ogg" preload="auto" />

      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden font-sans"
      >
        {/* Front / Foreground Hands CTA Layer (meets in middle on scroll) */}
        <div className="hands-foreground-layer absolute inset-0 pointer-events-none select-none overflow-hidden z-20 flex items-center justify-center">
          <div className="relative w-[150vw] sm:w-[125vw] md:w-full lg:w-[100vw] lg:max-w-none aspect-[1678/937] flex items-center justify-center scale-75 sm:scale-[0.78] lg:scale-[0.8] origin-center">
            {/* Right Hand (holding gold can) */}
            <div
              ref={rightHandRef}
              className="absolute inset-0 flex items-center justify-center will-change-transform z-10"
            >
              {/* Closed Can Image */}
              <div
                ref={rightClosedRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              >
                <Image
                  src="/images/product/right-can-closed-1.webp"
                  alt="Right hand holding Red Bull can closed"
                  fill
                  priority
                  sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>

              {/* Opened Can Image */}
              <div
                ref={rightOpenedRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0 invisible"
              >
                <Image
                  src="/images/product/right-can-opened-1.webp"
                  alt="Right hand holding Red Bull can opened"
                  fill
                  priority
                  sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Left Hand (holding purple/gold can) */}
            <div
              ref={leftHandRef}
              className="absolute inset-0 flex items-center justify-center will-change-transform z-20"
            >
              {/* Closed Can Image */}
              <div
                ref={leftClosedRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              >
                <Image
                  src="/images/product/left-can-closed-1.webp"
                  alt="Left hand holding Red Bull can closed"
                  fill
                  priority
                  sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>

              {/* Opened Can Image */}
              <div
                ref={leftOpenedRef}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-0 invisible"
              >
                <Image
                  src="/images/product/left-can-opened-1.webp"
                  alt="Left hand holding Red Bull can opened"
                  fill
                  priority
                  sizes="(max-width: 640px) 150vw, (max-width: 768px) 125vw, 100vw"
                  className="w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
