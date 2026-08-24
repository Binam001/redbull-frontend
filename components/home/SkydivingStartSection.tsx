"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ScrubWaveText } from "@/components/shared/ScrubWaveText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SkydivingStartSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const diverRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const cloudSection2Ref = useRef<HTMLDivElement>(null);
  const cloudSection3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !diverRef.current) return;

      // 1. Cloud fog slides up in Section 1
      if (fogRef.current && section1Ref.current) {
        gsap.to(fogRef.current, {
          yPercent: -120,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top 30%",
            end: "bottom center",
            scrub: 1.2,
          },
        });
      }

      // 2. Right-side cloud animates from bottom to up in Section 1
      if (cloudRef.current && section1Ref.current) {
        gsap.fromTo(
          cloudRef.current,
          {
            y: "100vh",
          },
          {
            y: "-100vh",
            ease: "power1.out",
            scrollTrigger: {
              trigger: section1Ref.current,
              start: "top 20%",
              end: "bottom 20%",
              scrub: 1.2,
            },
          },
        );
      }

      // 3. Left-side cloud animates from bottom to up in Section 2
      if (cloudSection2Ref.current && section2Ref.current) {
        gsap.fromTo(
          cloudSection2Ref.current,
          {
            y: "100vh",
          },
          {
            y: "-100vh",
            ease: "power1.out",
            scrollTrigger: {
              trigger: section2Ref.current,
              start: "top 90%",
              end: "bottom 90%",
              scrub: 1.2,
            },
          },
        );
      }

      // 4. Right-side cloud animates from bottom to up in Section 3
      if (cloudSection3Ref.current && section3Ref.current) {
        gsap.fromTo(
          cloudSection3Ref.current,
          {
            y: "100vh",
          },
          {
            y: "-100vh",
            ease: "power1.out",
            scrollTrigger: {
              trigger: section3Ref.current,
              start: "top 90%",
              end: "bottom 90%",
              scrub: 1.2,
            },
          },
        );
      }

      // 5. Continuous Sky Diver Motion across Section 1, 2, & 3
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 30%",
          end: "bottom 80%",
          scrub: 1.2,
        },
      });

      // Background color transitions to white during the whole animation
      tl.to(
        containerRef.current,
        {
          backgroundColor: "#ffffff",
          ease: "power1.inOut",
          duration: 3,
        },
        0,
      );

      // Step 1: Diver drops quickly from top into Section 1 (center-right)
      tl.fromTo(
        diverRef.current,
        {
          y: "-120vh",
          x: 0,
          rotate: -10,
        },
        {
          y: 0,
          x: 0,
          rotate: 0,
          ease: "power1.out",
          duration: 0.75,
        },
        0,
      );

      // Step 2: Diver glides earlier from center-right across to center-left in Section 2
      tl.to(
        diverRef.current,
        {
          x: "-52vw",
          y: "95vh",
          rotate: -8,
          ease: "power1.inOut",
          duration: 1.1,
        },
        0.75,
      );

      // Step 3: Diver glides back from center-left across to center-right in Section 3
      tl.to(
        diverRef.current,
        {
          x: "0vw",
          y: "170vh",
          rotate: 0,
          ease: "power1.inOut",
          duration: 1.15,
        },
        1.85,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#5b9ddf] text-black overflow-hidden select-none"
    >
      {/* <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-transparent" /> */}
      {/* <div className="absolute inset-0 h-[5vh] bg-white" /> */}
      {/* 1. Cloud Fog Overlay at the Top (Highest Z-Index, in front of the Diver) */}
      <div className="absolute top-0 left-0 w-full h-[60vh] pointer-events-none z-40 will-change-transform">
        <Image
          src="/images/home/cloud-fog-1.webp"
          alt="Cloud Fog Transition"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      <div
        ref={fogRef}
        className="absolute top-0 left-0 w-full h-screen pointer-events-none z-40 will-change-transform"
      >
        <Image
          src="/images/home/cloud-fog-1.webp"
          alt="Cloud Fog Transition"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      {/* 2. Sky Diver (Behind the Cloud Fog with z-10) */}
      <div
        ref={diverRef}
        className="absolute right-[2%] sm:right-[5%] lg:right-[8%] top-[18%] sm:top-[20%] w-[300px] md:w-[520px] xl:w-[30vw] aspect-square pointer-events-none z-10 will-change-transform flex items-center justify-center"
      >
        <Image
          src="/images/home/sky-diver-2.webp"
          alt="Red Bull Sky Diver"
          fill
          priority
          sizes="(max-width: 768px) 80vw, 50vw"
          className="object-contain drop-shadow-2xl"
        />
      </div>

      {/* 3. Floating Cloud on the Right in Section 1 (Rises from Bottom to Up) */}
      <div
        ref={cloudRef}
        className="absolute right-[-8%] sm:right-[-4%] md:right-[0%] lg:right-[3%] top-[15%] sm:top-[18%] w-[320px] sm:w-[480px] md:w-[620px] xl:w-[40vw] aspect-[16/10] pointer-events-none z-15 will-change-transform mix-blend-screen opacity-90 flex items-center justify-center"
      >
        <Image
          src="/images/home/cloud-2.png"
          alt="Atmospheric Cloud Section 1"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 50vw"
          className="object-contain"
        />
      </div>

      {/* 4. Floating Cloud on the Left in Section 2 (Rises from Bottom to Up) */}
      <div
        ref={cloudSection2Ref}
        className="absolute left-[-8%] sm:left-[-4%] md:left-[0%] lg:left-[3%] top-[45%] sm:top-[48%] w-[320px] sm:w-[480px] md:w-[620px] xl:w-[40vw] aspect-[16/10] pointer-events-none z-15 will-change-transform mix-blend-screen opacity-90 flex items-center justify-center"
      >
        <Image
          src="/images/home/cloud-2.png"
          alt="Atmospheric Cloud Section 2"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 50vw"
          className="object-contain"
        />
      </div>

      {/* 5. Floating Cloud on the Right in Section 3 (Rises from Bottom to Up) */}
      <div
        ref={cloudSection3Ref}
        className="absolute right-[-8%] sm:right-[-4%] md:right-[0%] lg:right-[3%] top-[78%] sm:top-[80%] w-[320px] sm:w-[480px] md:w-[620px] xl:w-[40vw] aspect-[16/10] pointer-events-none z-15 will-change-transform mix-blend-screen opacity-90 flex items-center justify-center"
      >
        <Image
          src="/images/home/cloud-2.png"
          alt="Atmospheric Cloud Section 3"
          fill
          priority
          sizes="(max-width: 768px) 90vw, 50vw"
          className="object-contain"
        />
      </div>

      {/* ----------------- SECTION 1: STRATOSPHERIC FREEFALL (Left Content, Diver on Right) ----------------- */}
      <section
        ref={section1Ref}
        className="relative w-full h-screen flex items-center justify-between px-6 md:px-16 lg:px-24 z-20"
      >
        {/* Section 1 Content (Left Side) */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-6">
          <ScrubWaveText
            lines={["STEP INTO", "THE VOID"]}
            triggerRef={section1Ref}
            start="top 75%"
            end="top 25%"
            scrub={0.8}
            className="font-['Orbitron',_var(--font-primary),_sans-serif] leading-tight drop-shadow-xs"
            lineClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black"
            continuous={true}
          />

          <p className="text-xs sm:text-sm md:text-base text-black/80 max-w-lg leading-relaxed font-medium">
            At the edge of the sky, hesitation does not exist. Pure focus,
            absolute stillness, and the courage to break every boundary.
          </p>
        </div>
      </section>

      {/* ----------------- SECTION 2: SUPERSONIC DESCENT (Right Content, Diver on Left) ----------------- */}
      <section
        ref={section2Ref}
        className="relative w-full h-screen flex items-center justify-end px-6 md:px-16 lg:px-24 z-20"
      >
        {/* Section 2 Content (Right Side) */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-6 ml-auto">
          <ScrubWaveText
            lines={["SPEED WITHOUT", "COMPROMISE"]}
            triggerRef={section2Ref}
            start="top 75%"
            end="top 25%"
            scrub={0.8}
            className="font-['Orbitron',_var(--font-primary),_sans-serif] leading-tight drop-shadow-xs"
            lineClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black"
            continuous={true}
          />

          <p className="text-xs sm:text-sm md:text-base text-black/80 max-w-lg leading-relaxed font-medium">
            Plummeting through the atmosphere with total clarity. When every
            micro-reaction matters, physical and mental vitality is everything.
          </p>
        </div>
      </section>

      {/* ----------------- SECTION 3: TERMINAL VELOCITY / IMPACT (Left Content, Diver on Right) ----------------- */}
      <section
        ref={section3Ref}
        className="relative w-full h-screen flex items-center justify-between px-6 md:px-16 lg:px-24 z-20"
      >
        {/* Section 3 Content (Left Side) */}
        <div className="relative z-20 flex flex-col items-start text-left max-w-xl space-y-6">
          <ScrubWaveText
            lines={["CALM AMIDST", "THE STORM"]}
            triggerRef={section3Ref}
            start="top 75%"
            end="top 25%"
            scrub={0.8}
            className="font-['Orbitron',_var(--font-primary),_sans-serif] leading-tight drop-shadow-xs"
            lineClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black"
            continuous={true}
          />

          <p className="text-xs sm:text-sm md:text-base text-black/80 max-w-lg leading-relaxed font-medium">
            Mastering extreme turbulence and touching down with pinpoint
            accuracy. Defy fear, seize the rush, and give wings to your
            ambition.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SkydivingStartSection;
