"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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

  const [activeFilter, setActiveFilter] = useState<"upcoming" | "past">(
    "upcoming",
  );
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Filter events: "upcoming" contains register, live, and upcoming events; "past" contains replay events
  const filteredEvents = useMemo(() => {
    if (activeFilter === "past") {
      return EVENTS.filter((e) => e.status === "past");
    }
    return EVENTS.filter((e) => e.status !== "past");
  }, [activeFilter]);

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

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  const handleFilterChange = (filter: "upcoming" | "past") => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Re-initialize carousel and reset scroll position when active filter changes
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi, filteredEvents]);

  return (
    <section className="w-full lg:max-w-none px-0 overflow-hidden">
      {/* Header with Title, Event Filters, and Carousel Navigation Buttons */}
      <header className="w-full mb-6 sm:mb-10 lg:mb-[3vw] flex flex-row items-start sm:items-center justify-between gap-4 lg:gap-[1.2vw] px-4 sm:px-8 lg:px-[4vw]">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <Heading
            as="h2"
            text="Events"
            // highlight="Events"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3vw] tracking-tight leading-[1.08]"
          />
          {/* Event Filter (Upcoming / Past) */}
          <div className="flex items-center p-1 rounded-full bg-neutral-100 border border-black/10 shadow-xs">
            <button
              type="button"
              onClick={() => handleFilterChange("upcoming")}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm lg:text-[0.85vw] font-bold uppercase tracking-wider transition-all duration-200 ${
                activeFilter === "upcoming"
                  ? "bg-secondary text-white"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("past")}
              className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm lg:text-[0.85vw] font-bold uppercase tracking-wider transition-all duration-200 ${
                activeFilter === "past"
                  ? "bg-secondary text-white"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Filters & Carousel Controls */}
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-[1.2vw] self-end sm:self-auto">
          {/* Arrow Controls */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-[0.8vw]">
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="size-10 md:size-11 lg:size-[2.8vw] rounded-full border border-secondary/10 bg-secondary flex items-center justify-center text-white hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
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
              className="size-10 md:size-11 lg:size-[2.8vw] rounded-full border border-secondary/10 bg-secondary flex items-center justify-center text-white hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-neutral-800 disabled:hover:border-black/10 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
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
        </div>
      </header>

      {/* Embla Carousel Viewport */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y pl-4 sm:pl-8 lg:pl-[4vw] gap-5 sm:gap-7 lg:gap-[1.6vw]">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex-[0_0_85%] sm:flex-[0_0_46%] md:flex-[0_0_31%] lg:flex-[0_0_23.5%] min-w-0 flex flex-col shrink-0 last:mr-4 sm:last:mr-8 lg:last:mr-[4vw]"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
