"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Heading from "@/components/shared/Heading";

interface CardData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  name: string;
  description: string;
  defaultImage: string;
  hoverImage: string;
}

const CARDS: CardData[] = [
  {
    id: "card-1",
    slug: "formula-1",
    title: "Formula 1<br />Grand Prix",
    subtitle: "Scuderia Racing",
    name: "Monika Grace",
    description:
      "Precision aerodynamics meet raw asphalt adrenaline. Pushing cutting-edge engineering past 340 km/h to capture the checkered flag.",
    hoverImage: "/images/athletes/athlete-2-back.webp",
    defaultImage: "/images/athletes/athlete-2.webp",
  },
  {
    id: "card-2",
    slug: "freestyle-motocross",
    title: "Freestyle<br />Motocross",
    subtitle: "X-Fighters Division",
    name: "Mike Carter",
    description:
      "Launching forty feet into thin air, defying gravity with heart-stopping tsunami flips and uncompromising two-wheeled mastery.",
    hoverImage: "/images/athletes/athlete-3-back.webp",
    defaultImage: "/images/athletes/athlete-3.webp",
  },
  {
    id: "card-3",
    slug: "ocean-surfing",
    title: "Big Wave<br />Ocean Surfing",
    subtitle: "Heavy Water Elite",
    name: "Emily Blunt",
    description:
      "Carving towering 50-foot monster swells where split-second composure and raw nerve separate immortality from wipeout.",
    hoverImage: "/images/athletes/athlete-1-back.webp",
    defaultImage: "/images/athletes/athlete-1.webp",
  },
  {
    id: "card-4",
    slug: "world-marathon",
    title: "World Marathon<br />Major",
    subtitle: "Endurance Elite",
    name: "Varun Dev",
    description:
      "Pushing physiological thresholds over 42.195 km of grueling asphalt, where pace precision and mental fortitude redefine human endurance.",
    hoverImage: "/images/home/hero/adventure-5.webp",
    defaultImage: "/images/athletes/athlete-4.webp",
  },
  {
    id: "card-5",
    slug: "street-skateboarding",
    title: "Urban Street<br />Skateboarding",
    subtitle: "Street League Pro",
    name: "Mike Carter",
    description:
      "Transforming raw city concrete into an arena of technical innovation, balance, and relentless boundary-pushing skate progression.",
    hoverImage: "/images/home/athletes/hover-athlete-2.webp",
    defaultImage: "/images/athletes/athlete-3-back.webp",
  },
  {
    id: "card-6",
    slug: "rock-climbing",
    title: "Alpine Cliff<br />Rock Climbing",
    subtitle: "Vertical Horizons",
    name: "Emily Blunt",
    description:
      "Ascending sheer monolithic granite walls with unyielding grip, pure mental clarity, and zero margin for error.",
    hoverImage: "/images/athletes/athlete-1-back.webp",
    defaultImage: "/images/athletes/athlete-6.webp",
  },
];

export default function AthletesDisplay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section
      ref={containerRef}
      className="w-full lg:max-w-none text-neutral-900 font-sans selection:bg-neutral-200 py-16 sm:py-20 lg:py-[5vw] px-0 overflow-hidden"
    >
      {/* Section Header with Title and Carousel Navigation Buttons */}
      <header className="w-full mb-6 sm:mb-10 lg:mb-[3vw] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-[1.2vw] px-4 sm:px-8 lg:px-[4vw]">
        <div>
          <Heading
            as="h2"
            text="Our Elite Champions"
            highlight="elite"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
          />
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-[0.8vw] self-end sm:self-auto">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[2.8vw] lg:h-[2.8vw] rounded-full border border-secondary/10 bg-secondary/70 flex items-center justify-center text-white hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 lg:w-[1.2vw] lg:h-[1.2vw] -translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[2.8vw] lg:h-[2.8vw] rounded-full border border-secondary/10 bg-secondary/70 flex items-center justify-center text-white hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 lg:w-[1.2vw] lg:h-[1.2vw] translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Embla Carousel Viewport */}
      <div className="w-full overflow-hidden py-4 -my-4" ref={emblaRef}>
        <div className="flex touch-pan-y -mx-2.5 sm:-mx-3.5 lg:-mx-[0.8vw]">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="flex-[0_0_85%] sm:flex-[0_0_46%] md:flex-[0_0_31%] lg:flex-[0_0_23.5%] min-w-0 flex flex-col px-2.5 sm:px-3.5 lg:px-[0.8vw]"
            >
              <Link
                href={`/athletes/${card.slug}`}
                className="athlete-card group relative w-full aspect-[3/4.1] cursor-pointer will-change-transform shadow-xl select-none block"
                style={{
                  clipPath: "inset(0 round 24px)",
                }}
              >
                {/* Background Image Container with Smooth Hover Fade */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-[inherit] bg-neutral-900">
                  {/* Default Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.defaultImage}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out group-hover:opacity-0"
                    loading="lazy"
                  />
                  {/* Hover Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.hoverImage}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {card.name &&
                  (() => {
                    const parts = card.name.trim().split(/\s+/);
                    const first = parts[0] || "";
                    const last = parts.slice(1).join(" ") || "";
                    return (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none group-hover:opacity-0 transition-opacity duration-500 pt-[60%]">
                        <div className="flex flex-col items-center text-center font-black uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]">
                          <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1]">
                            {first}
                          </span>
                          {last && (
                            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1] mt-1 sm:mt-1.5">
                              {last}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {/* Editorial Copy Reveal on Hover */}
                <div
                  className="athlete-card-copy absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-[2vw] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 55%, transparent 100%)",
                  }}
                >
                  <h3
                    className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[2vw] leading-[0.95] tracking-tight mb-2.5 lg:mb-[0.7vw] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{
                      fontFamily: "'BeausiteClassic-Medium', sans-serif",
                    }}
                    dangerouslySetInnerHTML={{ __html: card.title }}
                  />
                  <p
                    className="text-white/80 font-light text-xs sm:text-sm md:text-[0.92rem] lg:text-[0.82vw] leading-[1.38] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{
                      fontFamily: "'BeausiteClassic-Light', sans-serif",
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Clean & Minimal View Profile CTA */}
                  <div className="mt-3.5 lg:mt-[0.9vw] inline-flex items-center gap-1.5 text-xs lg:text-[0.75vw] text-white/90 font-semibold uppercase tracking-wider group-hover:text-white transition-colors duration-300">
                    <span className="text-white">View Athlete Profile</span>
                    <svg
                      className="w-3.5 h-3.5 lg:w-[0.8vw] lg:h-[0.8vw] transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Scoped Styles for Hover Clip-Path and Lift Transition */}
      <style jsx>{`
        .athlete-card {
          clip-path: inset(0 round 24px);
          transition:
            clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1),
            transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .athlete-card:hover {
          clip-path: inset(0 round 36px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          transform: translateY(-4px);
        }
      `}</style>
    </section>
  );
}
