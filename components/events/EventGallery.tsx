"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { EventData } from "@/constants/events";
import Heading from "../shared/Heading";

interface EventGalleryProps {
  event: EventData;
}

export default function EventGallery({ event }: EventGalleryProps) {
  // Aggregate available images and deduplicate to avoid identical slides
  const images = useMemo(() => {
    const raw =
      event.galleryImages && event.galleryImages.length > 0
        ? event.galleryImages
        : ([
            event.image,
            event.venueImage,
            ...(event.carouselImages || []),
            "/images/home/hero/adventure-5.webp",
            "/images/home/hero/adventure-6.webp",
            "/images/home/hero/adventure-4.webp",
          ].filter(Boolean) as string[]);

    const unique = Array.from(new Set(raw));
    // Ensure sufficient slides for smooth infinite loop without snapping gaps
    if (unique.length > 0 && unique.length < 5) {
      return [...unique, ...unique];
    }
    return unique;
  }, [event]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    loop: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSlideClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <div className="w-full text-neutral-900 font-sans pt-6 pb-16 overflow-hidden bg-white">
      {/* ── Section Title ── */}
      <div className="mb-6 sm:mb-10 max-w-6xl mx-auto">
        <Heading
          as="h2"
          text="Event Gallery"
          highlight="Gallery"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
        />
      </div>

      {/* ── Center-Focused Embla Carousel Container ── */}
      <div className="relative w-full">
        {/* Navigation Arrow: Prev */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous gallery image"
          className="absolute left-3 sm:left-6 md:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/15 bg-white/95 backdrop-blur-xs text-secondary hover:bg-primary hover:text-white hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none"
        >
          <svg
            className="w-5 h-5 -translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Navigation Arrow: Next */}
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next gallery image"
          className="absolute right-3 sm:right-6 md:right-10 lg:right-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-black/15 bg-white/95 backdrop-blur-xs text-secondary hover:bg-primary hover:text-white hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none"
        >
          <svg
            className="w-5 h-5 translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Carousel Viewport */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing w-full"
        >
          <div className="flex items-center -ml-3 sm:-ml-4 md:-ml-6 py-4">
            {images.map((imgSrc, index) => {
              const isActive = selectedIndex === index;

              return (
                <div
                  key={`${imgSrc}-${index}`}
                  onClick={() => onSlideClick(index)}
                  className="shrink-0 min-w-0 pl-3 sm:pl-4 md:pl-6 basis-[82%] sm:basis-[68%] md:basis-[56%] lg:basis-[62%] select-none"
                >
                  <div
                    className={`relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden transition-[opacity,transform,filter] duration-500 ease-out ${
                      isActive
                        ? "scale-100 opacity-100 ring-1 ring-black/5"
                        : "scale-[0.93] opacity-40 brightness-75 hover:opacity-60 cursor-pointer"
                    }`}
                  >
                    <Image
                      src={imgSrc}
                      alt={`${event.title} gallery view ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 85vw, 55vw"
                      priority={index === 0}
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Slide Indicator Dots ── */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
