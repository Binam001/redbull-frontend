"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import EventCard, { EVENTS } from "./EventCard";

export default function FeaturedEvents() {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        containScroll: "trimSnaps",
        dragFree: false,
        loop: false,
    });

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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
        [emblaApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnDisabled(!emblaApi.canScrollPrev());
        setNextBtnDisabled(!emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section
            className="w-full text-neutral-900 font-sans py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-12 lg:px-20 overflow-hidden"

        >
            {/* Header with Title and Carousel Navigation Buttons */}
            <header className="w-full mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                        Featured Events
                    </h2>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                        className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                        className="w-11 h-11 rounded-full border border-black/10 bg-white flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Embla Carousel Viewport */}
            <div className="w-full overflow-hidden border-t border-l border-neutral-700" ref={emblaRef}>
                <div className="flex touch-pan-y">
                    {EVENTS.map((event) => (
                        <div
                            key={event.id}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 flex flex-col"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Indicator Dots */}
            {scrollSnaps.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 sm:mt-10">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${index === selectedIndex
                                ? "w-8 h-2 bg-neutral-900"
                                : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}