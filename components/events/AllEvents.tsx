"use client";

import React, { useState, useMemo } from "react";
import EventCard, { EVENTS } from "./EventCard";

export default function AllEvents() {
    const [selectedSport, setSelectedSport] = useState<string>("all");

    // Dynamically derive unique sports from EVENTS
    const sportOptions = useMemo(() => {
        const unique = Array.from(new Set(EVENTS.map((e) => e.sport)));
        return ["all", ...unique];
    }, []);

    // Filter events based on criteria
    const filteredEvents = useMemo(() => {
        return EVENTS.filter((event) => {
            return (
                selectedSport === "all" ||
                event.sport.toLowerCase() === selectedSport.toLowerCase()
            );
        });
    }, [selectedSport]);

    const handleReset = () => {
        setSelectedSport("all");
    };

    return (
        <section className="w-full text-neutral-900 font-sans py-14 sm:pb-20 md:pb-24 px-4 sm:px-8 md:px-12 lg:px-20 bg-white">
            {/* Header: Title on Left, Filter Pills on Right */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 sm:mb-14">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                        All Events
                    </h2>
                </div>

                {/* Filter Pills on the Right */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    {sportOptions.map((sport) => {
                        const isSelected = selectedSport.toLowerCase() === sport.toLowerCase();
                        const label = sport === "all" ? "ALL" : sport.toUpperCase();

                        return (
                            <button
                                key={sport}
                                onClick={() => setSelectedSport(sport)}
                                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? "bg-black text-white border border-black"
                                        : "bg-transparent text-neutral-700 hover:text-black border border-neutral-300 hover:border-neutral-700"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Connected Grid Display */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-neutral-700">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="min-w-0 flex flex-col">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty state when no events match */
                <div className="text-center py-20 px-4 bg-neutral-50 rounded-none border border-dashed border-neutral-300">
                    <p className="text-lg font-medium text-neutral-700 mb-2">
                        No events found matching your criteria.
                    </p>
                    <p className="text-sm text-neutral-500 mb-6">
                        Try selecting a different category.
                    </p>
                    <button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-full bg-black text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </section>
    );
}