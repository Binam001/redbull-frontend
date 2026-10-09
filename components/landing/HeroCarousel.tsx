"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import Button from "../shared/Button";
import { EVENTS } from "@/constants/events";

interface SlideData {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
  ctaText: string;
  startDate: string;
}

const HERO_SLIDES: SlideData[] = EVENTS.map((event) => {
  const monthName = event.month
    ? event.month.charAt(0).toUpperCase() + event.month.slice(1).toLowerCase()
    : "Oct";
  return {
    id: event.id,
    slug: event.slug,
    image: event.image,
    title: event.title,
    description: event.description,
    ctaText: "Explore more",
    startDate: `Starts ${monthName} ${event.day}, 2026`,
  };
});

const SLIDE_DURATION = 5000; // ms

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  const textWrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentIndex;

  const progressStartTimeRef = useRef(Date.now());
  const progressRafRef = useRef<number | null>(null);

  // Slide Transition Handler with smooth text animation
  const goToSlide = useCallback((targetIndex: number) => {
    if (targetIndex === currentIndexRef.current || isTransitioning) return;

    setIsTransitioning(true);
    setSlideProgress(0);
    progressStartTimeRef.current = Date.now();

    // Staggered text exit animation
    const exitTl = gsap.timeline();
    exitTl.to([titleRef.current, descRef.current, actionsRef.current], {
      opacity: 0,
      y: -12,
      duration: 0.3,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: () => {
        setCurrentIndex(targetIndex);
        // Staggered text entrance animation
        gsap.fromTo(
          [titleRef.current, descRef.current, actionsRef.current],
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            onComplete: () => {
              setIsTransitioning(false);
              progressStartTimeRef.current = Date.now();
            },
          }
        );
      },
    });
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    const next = (currentIndexRef.current + 1) % HERO_SLIDES.length;
    goToSlide(next);
  }, [goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndexRef.current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(prev);
  }, [goToSlide]);

  // Smooth Slide Progress Timer
  useEffect(() => {
    progressStartTimeRef.current = Date.now();

    const updateTimer = () => {
      if (!isTransitioning) {
        const elapsed = Date.now() - progressStartTimeRef.current;
        const p = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
        setSlideProgress(p);

        if (elapsed >= SLIDE_DURATION) {
          nextSlide();
          return;
        }
      }
      progressRafRef.current = requestAnimationFrame(updateTimer);
    };

    progressRafRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
    };
  }, [currentIndex, isTransitioning, nextSlide]);

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section className="relative w-full h-screen min-h-screen overflow-hidden select-none bg-black p-0 m-0">
      {/* Mapped Hero Background Images */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-0 pointer-events-auto" : "opacity-0 z-[-1] pointer-events-none"
                }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className={`object-cover object-center w-full h-full transition-transform duration-[6000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                  }`}
              />
            </div>
          );
        })}
      </div>

      {/* Cinematic Gradient Vignettes for Readability */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-r from-black/85 via-black/40 to-transparent w-full md:w-4/5 z-[1]" />
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/90 via-transparent to-black/20 z-[1]" />

      {/* Bottom-Left Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-10 md:px-16 lg:px-24 pb-12 sm:pb-16 md:pb-20 z-10 pointer-events-none">
        <div
          ref={textWrapperRef}
          className="max-w-4xl space-y-4 sm:space-y-6 pointer-events-auto"
        >
          {/* Bold Editorial Headline */}
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-white leading-[1.08] will-change-transform"
          >
            {activeSlide.title}
          </h1>

          {/* Editorial Description */}
          <p
            ref={descRef}
            className="text-xs sm:text-sm md:text-lg text-white/70 leading-relaxed font-medium max-w-2xl will-change-transform"
          >
            {activeSlide.description}
          </p>

          {/* Action Row */}
          <div ref={actionsRef} className="pt-2 flex flex-wrap items-center gap-4 will-change-transform">
            <Button
              label={activeSlide.ctaText || "Explore more"}
              href={`/events/${activeSlide.slug}`}
              className="rounded-full"
            />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#cb2026]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
                {activeSlide.startDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Right Controls: Prev/Next Glass Buttons */}
      <div className="absolute right-6 sm:right-10 md:right-16 lg:right-24 bottom-14 sm:bottom-16 md:bottom-20 z-10 flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            disabled={isTransitioning}
            aria-label="Previous Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/50 active:scale-95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={nextSlide}
            disabled={isTransitioning}
            aria-label="Next Slide"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/50 active:scale-95 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer disabled:opacity-40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Interactive Animated Pagination Indicators (Full Screen Width) */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-6 sm:inset-x-10 md:inset-x-16 lg:inset-x-24 z-20 flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const isPast = idx < currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="relative flex-1 h-6 flex items-center cursor-pointer group"
            >
              <div className="w-full h-0.5 overflow-hidden rounded-full bg-white/20 group-hover:bg-white/35 transition-colors relative">
                {isActive ? (
                  <span
                    className="absolute inset-y-0 left-0 bg-white rounded-full transition-none shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{ width: `${slideProgress}%` }}
                  />
                ) : isPast ? (
                  <span className="absolute inset-y-0 left-0 w-full bg-white/70 rounded-full" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}