"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import EventCard, { EVENTS } from "./EventCard";
import Heading from "../shared/Heading";

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
            className="w-full lg:max-w-none text-neutral-900 font-sans py-12 sm:py-20 md:py-24 lg:py-[6vw] px-4 sm:px-8 lg:px-[5vw] overflow-hidden"
        >
            {/* Header with Title and Carousel Navigation Buttons */}
            <header className="w-full mb-6 sm:mb-10 lg:mb-[3vw] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:gap-[1.2vw]">
                <div>
                    {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                         <span className="text-primary"></span>
                    </h2> */}
                    <Heading
                        as="h2"
                        text="Featured Events"
                        highlight="Events"
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
                    />

                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-3 lg:gap-[0.8vw] self-end sm:self-auto">
                    <button
                        onClick={scrollPrev}
                        disabled={prevBtnDisabled}
                        className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[2.8vw] lg:h-[2.8vw] rounded-full border border-black/10 bg-zinc-500 flex items-center justify-center text-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5 lg:w-[1.2vw] lg:h-[1.2vw] -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={nextBtnDisabled}
                        className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[2.8vw] lg:h-[2.8vw] rounded-full border border-black/10 bg-zinc-500 flex items-center justify-center text-white hover:bg-neutral-900 hover:text-white hover:border-neutral-900 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5 lg:w-[1.2vw] lg:h-[1.2vw] translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Embla Carousel Viewport */}
            <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y -mx-2.5 sm:-mx-3.5 lg:-mx-[0.8vw]">
                    {EVENTS.map((event) => (
                        <div
                            key={event.id}
                            className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333333%] min-w-0 flex flex-col px-2.5 sm:px-3.5 lg:px-[0.8vw]"
                        >
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Indicator Dots */}
            {scrollSnaps.length > 1 && (
                <div className="flex justify-center items-center gap-2 lg:gap-[0.5vw] mt-8 sm:mt-10 lg:mt-[2.5vw]">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={`transition-all duration-300 rounded-full cursor-pointer ${index === selectedIndex
                                ? "w-8 h-2 lg:w-[2vw] lg:h-[0.5vw] bg-neutral-900"
                                : "w-2 h-2 lg:w-[0.5vw] lg:h-[0.5vw] bg-neutral-300 hover:bg-neutral-400"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}