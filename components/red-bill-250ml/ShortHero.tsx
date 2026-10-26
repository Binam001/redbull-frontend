"use client";

import { useResponsive } from "@/hooks/useMediaQuery";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import {
  LOGO_LEFT_BULL,
  LOGO_LEFT_BULL_OUTER,
  LOGO_MASK_URI,
  LOGO_PATHS,
  LOGO_RIGHT_BULL,
  LOGO_RIGHT_BULL_OUTER,
  LOGO_VIEWBOX,
} from "./logoData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ShortHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const handWrapperRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLDivElement>(null);
  const maskedHandRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const maskedContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { isSmallerDevice } = useResponsive();

  useGSAP(
    () => {
      if (
        !containerRef.current ||
        !contentRef.current ||
        !handRef.current ||
        !handWrapperRef.current ||
        !maskedHandRef.current ||
        !logoWrapperRef.current ||
        !maskedContainerRef.current ||
        !svgRef.current
      )
        return;

      const paths = svgRef.current.querySelectorAll<SVGPathElement>("path");

      // 1. Initialize SVG path lengths so outline starts at 0% drawn and fill is transparent
      paths.forEach((path) => {
        const length = path.getTotalLength() || 150;
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fillOpacity: 0,
          strokeOpacity: 1,
        });
      });

      // 2. Set initial positions
      gsap.set([handRef.current, maskedHandRef.current], {
        yPercent: 60,
      });
      gsap.set(handWrapperRef.current, {
        opacity: 1,
      });
      gsap.set(logoWrapperRef.current, {
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        opacity: 1,
      });
      gsap.set(maskedContainerRef.current, {
        opacity: 1,
      });
      gsap.set(svgRef.current, {
        opacity: 0,
      });

      // 3. Single unified scrubbed ScrollTrigger pinned to the viewport
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 20,
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

      // B. Both main and masked can layers translate up in perfect sync (0 to 0.70)
      tl.to(
        [handRef.current, maskedHandRef.current],
        {
          yPercent: isSmallerDevice ? 0 : 10,
          duration: 0.7,
          ease: "power1.out",
        },
        0,
      );

      // C. SVG logo outline fades in and draws strokes (0.08 to 0.58)
      tl.to(
        svgRef.current,
        {
          opacity: 1,
          duration: 0.08,
          ease: "power1.in",
        },
        0.08,
      );

      paths.forEach((path) => {
        tl.to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.48,
            ease: "none",
          },
          0.1,
        );
      });

      // D. Main unmasked can fades out, leaving ONLY the masked logo fill visible (0.35 to 0.65)
      tl.to(
        handWrapperRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power1.inOut",
        },
        0.35,
      );

      // E. Masked can image fades out cleanly, leaving ONLY the glowing SVG outline (0.65 to 0.85)
      tl.to(
        maskedContainerRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power1.inOut",
        },
        0.65,
      );

      // F. Instead of fading out, fill the logo with its authentic Red Bull colors and fade out outlines!
      paths.forEach((path) => {
        tl.to(
          path,
          {
            fillOpacity: 1,
            strokeOpacity: 0,
            duration: 0.25,
            ease: "power1.out",
          },
          0.68,
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="hero-gallery"
      className="relative z-30 w-full h-dvh overflow-visible flex flex-col items-center justify-start text-white select-none bg-black"
    >
      {/* 1. Ambient Spotlight Atmosphere Background (--secondary: #233971) */}
      <div className="absolute -inset-px z-0 overflow-hidden bg-black pointer-events-none">
        <div
          className="absolute inset-0 select-none"
          style={{
            background: `
              radial-gradient(
                ellipse 75% 62% at 50% 50%,
                rgba(35, 57, 113, 0.72) 0%,
                rgba(35, 57, 113, 0.48) 30%,
                rgba(20, 32, 68, 0.24) 55%,
                rgba(0, 0, 0, 0.95) 82%,
                #000000 100%
              )
            `,
          }}
        />
      </div>

      {/* 2. Center Masked Can Area + SVG Outline (Visible together in center) */}
      <div
        ref={logoWrapperRef}
        className="absolute top-1/2 left-1/2 z-30 pointer-events-none w-72 sm:w-96 md:w-[480px] lg:w-[560px] xl:w-[38vw] max-w-[640px] aspect-[91/35] flex items-center justify-center will-change-transform"
      >
        {/* Can image visible ONLY inside the logo mask */}
        <div
          ref={maskedContainerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden will-change-opacity z-10"
          style={{
            maskImage: `url("${LOGO_MASK_URI}")`,
            WebkitMaskImage: `url("${LOGO_MASK_URI}")`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          {/* Full-viewport canvas aligned with the screen */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-dvh pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-[200vw] md:w-[160vw] lg:w-[70vw] xl:w-[90vw] max-w-none flex justify-center">
              <div
                ref={maskedHandRef}
                className="w-full h-auto will-change-transform flex justify-center"
              >
                <Image
                  src="/images/product/short-can-hero.webp"
                  alt="Red Bull 250ml inside logo"
                  width={1300}
                  height={1000}
                  priority
                  className="w-full h-auto object-contain pointer-events-none select-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Animated SVG Logo Outline (Clean Pure White Drawing) */}
        <svg
          ref={svgRef}
          viewBox={LOGO_VIEWBOX}
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_32px_rgba(255,255,255,0.2)] pointer-events-none z-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask to ensure the sun outline does not cut through the charging bulls */}
            <mask id="bulls-stroke-mask">
              <rect width="91" height="35" fill="white" />
              <path d={LOGO_LEFT_BULL_OUTER} fill="black" />
              <path d={LOGO_RIGHT_BULL_OUTER} fill="black" />
            </mask>
          </defs>
          {LOGO_PATHS.map((item) => (
            <path
              key={item.id}
              d={item.d}
              stroke={item.stroke}
              fill={item.fill}
              fillOpacity={0}
              strokeWidth={0.28}
              strokeLinecap="round"
              strokeLinejoin="round"
              mask={item.mask}
            />
          ))}
        </svg>
      </div>

      {/* 3. Text Content & CTA (Slides down & fades out on scroll) */}
      <div
        ref={contentRef}
        className="relative h-full z-10 flex flex-col justify-center items-center text-center mx-auto will-change-transform px-4 pointer-events-auto"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08]">
          YOUR TRUE ENERGY
        </h1>

        <p className="mt-4 text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-5xl mx-auto">
          The authentic formulation that started a global revolution.
        </p>

        {/* <div className="mt-6 sm:mt-8">
                    <Button
                        label="Find Your Next Step"
                        variant="white"
                        href="#product-details"
                        className="!bg-transparent !text-white !border-2 !border-white hover:!bg-white hover:!text-black !rounded-md tracking-wider uppercase font-medium text-xs sm:text-sm px-7 py-3 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]"
                    />
                </div> */}
      </div>

      {/* 4. Main Can Image (Translates up, then fades out into the dark background) */}
      <div
        ref={handWrapperRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 w-[200vw] md:w-[160vw] lg:w-[70vw] xl:w-[90vw] max-w-none flex justify-center pointer-events-none will-change-transform"
      >
        <div
          ref={handRef}
          className="w-full h-auto will-change-transform flex justify-center"
        >
          <Image
            src="/images/product/short-can-hero.webp"
            alt="Red Bull 250ml short can"
            width={1300}
            height={1000}
            priority
            className="w-full h-auto object-contain pointer-events-none select-none"
          />
        </div>
      </div>
    </section>
  );
}
