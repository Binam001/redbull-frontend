"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ImageSliderSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const videoLists = [
    {
      id: 1,
      title: "DOWNHILL MTB: GRAVITY ON THE EDGE",
      subtitle:
        "From the sheer sandstone cliffs of Red Bull Rampage to the brutal tracks of Red Bull Hardline, Red Bull powers mountain bike athletes with the razor-sharp focus, split-second reflexes, and fearless grit to tame nature’s steepest descents.",
      imgSrc: "/images/home/hero/adventure-5.webp",
      position: "left" as const,
    },
    {
      id: 2,
      title: "SKATEBOARDING: CREATIVITY IN MOTION",
      subtitle:
        "Backing iconic street contests and skate parks worldwide, Red Bull champions raw skate progression—fueling riders with the balance, technical precision, and relentless drive to lock into every grind.",
      imgSrc: "/images/product/canbonated-can-ad-6.webp",
      position: "right" as const,
    },
    {
      id: 3,
      title: "SLOPESTYLE MTB: ARTISTRY IN FLIGHT",
      subtitle:
        "Taking flight at premier events like Red Bull Joyride, Red Bull empowers freestyle athletes with the aerial awareness, explosive amplitude, and nerves of steel to land impossible tricks high above the crowd.",
      imgSrc: "/images/product/canbonated-can-ad-7.webp",
      position: "left" as const,
    },
  ];

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const layers = gsap.utils.toArray<HTMLElement>(".scene-layer", container);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${(videoLists.length - 1) * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      // We start from the second layer because the first one is our base
      layers.forEach((layer, index) => {
        if (index === 0) return;

        const content = layer.querySelector(".scene-content");

        tl.fromTo(
          layer,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            duration: 1,
          },
          index - 1,
        ).fromTo(
          content,
          { yPercent: 20 },
          { yPercent: 0, ease: "none", duration: 1 },
          index - 1,
        );
      });

      // Refresh ScrollTrigger so positions align with any upstream pins
      ScrollTrigger.refresh();
    },
    { scope: containerRef },
  );

  // Fallback refresh once page layout and media settle
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="h-svh w-full relative overflow-hidden bg-black"
    >
      {videoLists.map((item, idx) => {
        const isRight =
          item.position === "right" || (!item.position && idx % 2 === 1);

        return (
          <div
            key={item.id}
            className="scene-layer absolute inset-0 w-full h-full overflow-hidden"
            style={{
              zIndex: idx + 1,
              clipPath:
                idx === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
            }}
          >
            {/* Inner Content Wrapper for Parallax effect */}
            <div className="scene-content relative w-full h-full">
              {/* Background Image Layer */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  fill
                  priority={idx === 0}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-black/35 pointer-events-none" />
                {isRight ? (
                  <div className="absolute inset-0 bg-linear-to-l from-black/70 via-transparent to-transparent pointer-events-none" />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-transparent pointer-events-none" />
                )}
              </div>

              {/* Zigzag Content Overlay: 1st Center-Left, 2nd Center-Right, 3rd Center-Left */}
              <div
                className={`absolute bottom-8 lg:bottom-0 lg:top-1/2 -translate-y-1/2 z-10 w-full max-w-xl lg:max-w-[40vw] px-6 sm:px-10 lg:px-0 flex flex-col gap-3 sm:gap-4 ${
                  isRight
                    ? "lg:right-16 xl:right-28 lg:items-end lg:text-right"
                    : "lg:left-16 xl:left-28 lg:items-start lg:text-left"
                }`}
              >
                {item.title && (
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6vw] font-bold tracking-tight text-white font-primary uppercase leading-[1.1]">
                    {item.title}
                  </h3>
                )}
                {item.subtitle && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-[1.3vw] text-white/90 leading-relaxed font-medium max-w-xl">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ImageSliderSection;
