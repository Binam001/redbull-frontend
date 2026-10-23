"use client";

import Image from "next/image";
import React, { useRef } from "react";
import Button from "../shared/Button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useResponsive } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handWrapperRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const maskedHandRef = useRef<HTMLDivElement>(null);
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const maskedContainerRef = useRef<HTMLDivElement>(null);

  const { isSmallerDevice } = useResponsive();

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !contentRef.current ||
        !handRef.current ||
        !handWrapperRef.current ||
        !maskedHandRef.current ||
        !circleWrapperRef.current ||
        !maskedContainerRef.current
      )
        return;

      // 1. Set initial positions
      gsap.set([handRef.current, maskedHandRef.current], {
        yPercent: 60,
      });
      gsap.set(handWrapperRef.current, {
        opacity: 1,
      });
      gsap.set(circleWrapperRef.current, {
        xPercent: -50,
        yPercent: -50,
      });
      gsap.set(maskedContainerRef.current, {
        opacity: 1,
      });

      // 2. Scrubbed ScrollTrigger pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: 20,
          invalidateOnRefresh: true,
        },
      });

      // A. Text Content slides down and fades out (0 to 0.25)
      tl.to(
        contentRef.current,
        {
          yPercent: 40,
          opacity: 0,
          duration: 0.25,
          ease: "power1.inOut",
        },
        0,
      );

      // B. Both main and masked can layers translate up in sync (0 to 0.70)
      tl.to(
        [handRef.current, maskedHandRef.current],
        {
          yPercent: isSmallerDevice ? 0 : 8,
          duration: 0.7,
          ease: "power1.out",
        },
        0,
      );

      // C. Backside unmasked can fades out early and completely (0.05 to 0.20)
      tl.to(
        handWrapperRef.current,
        {
          opacity: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        0.05,
      );

      // D. Masked can fades out COMPLETELY towards the end (0.70 to 0.95)
      tl.to(
        maskedContainerRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power1.inOut",
        },
        0.7,
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="hero-gallery"
      className="relative z-30 w-full h-dvh overflow-visible flex flex-col items-center justify-start text-white select-none bg-black"
    >
      {/* 1. Ambient Spotlight Atmosphere Background */}
      <div className="absolute inset-[-1px] z-0 overflow-hidden bg-black pointer-events-none">
        <div
          className="absolute inset-0 select-none"
          style={{
            background: `
              radial-gradient(
                ellipse 75% 62% at 50% 50%,
                rgba(35, 57, 113, 0.72) 0%,
                rgba(35, 57, 113, 0.28) 45%,
                rgba(0, 0, 0, 0.85) 75%,
                #000000 100%
              )
            `,
          }}
        />
      </div>

      {/* 2. Middle Red Bull Circle Area (Masked Can + SVG Animated Drawing Circle) */}
      <div
        ref={circleWrapperRef}
        className="absolute top-1/2 left-1/2 z-30 pointer-events-none w-52 sm:w-72 md:w-80 lg:w-[22vw] max-w-[360px] aspect-square flex items-center justify-center will-change-transform"
      >
        {/* Can image visible ONLY inside the middle circle mask - inset ensures no overflow past stroke */}
        <div
          ref={maskedContainerRef}
          className="absolute inset-[2px] pointer-events-none overflow-hidden rounded-full will-change-opacity z-10"
          style={{
            maskImage:
              "radial-gradient(circle at center, black 98%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 98%, transparent 100%)",
          }}
        >
          {/* Full-viewport canvas aligned with screen so masked can matches outer can 1:1 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-dvh pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-[140vw] sm:w-[110vw] md:w-[90vw] lg:w-[70vw] xl:w-[90vw] max-w-none flex justify-center">
              <div
                ref={maskedHandRef}
                className="w-full h-auto will-change-transform flex justify-center"
              >
                <Image
                  src="/images/product/short-can-hero.png"
                  alt="Red Bull 250ml inside circle"
                  width={1300}
                  height={1000}
                  priority
                  className="w-full h-auto object-contain select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Text Content & CTA (Slides down & fades out on scroll) */}
      <div
        ref={contentRef}
        className="relative h-full z-10 flex flex-col justify-center items-center text-center mx-auto will-change-transform px-4 pointer-events-auto"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08] font-bold">
          YOUR TRUE ENERGY
        </h1>

        <p className="mt-4 text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-5xl mx-auto">
          The authentic formulation that started a global revolution.
        </p>

        {/* <div className="mt-6 sm:mt-8">
          <Button
            label="Find Your Next Step"
            variant="white"
            href="/about"
            className="!bg-transparent !text-white !border-2 !border-white hover:!bg-white hover:!text-black !rounded-md tracking-wider uppercase font-medium text-xs sm:text-sm px-7 py-3 transition-all duration-300"
          />
        </div> */}
      </div>

      {/* 4. Main Can Image (Translates up, then fades out into background) */}
      <div
        ref={handWrapperRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[140vw] sm:w-[110vw] md:w-[90vw] lg:w-[70vw] xl:w-[90vw] max-w-none flex justify-center pointer-events-none will-change-transform"
      >
        <div
          ref={handRef}
          className="w-full h-auto will-change-transform flex justify-center"
        >
          <Image
            src="/images/product/short-can-hero.png"
            alt="Red Bull 250ml short can"
            width={1300}
            height={1000}
            priority
            className="w-full h-auto object-contain select-none pointer-events-none"
          />
        </div>
      </div>
    </section>
  );
}
