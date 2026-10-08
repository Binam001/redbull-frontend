"use client";

import React, { useState, useMemo } from "react";
import EventCard, { EVENTS } from "./EventCard";

export default function AllEvents() {
    const [selectedLocation, setSelectedLocation] = useState<string>("all");
    const [selectedSport, setSelectedSport] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Dynamically derive unique locations and sports from EVENTS
    const locationOptions = useMemo(() => {
        const unique = Array.from(new Set(EVENTS.map((e) => e.country)));
        return ["all", ...unique];
    }, []);

    const sportOptions = useMemo(() => {
        const unique = Array.from(new Set(EVENTS.map((e) => e.sport)));
        return ["all", ...unique];
    }, []);

    // Filter events based on criteria
    const filteredEvents = useMemo(() => {
        return EVENTS.filter((event) => {
            const matchesLocation =
                selectedLocation === "all" ||
                event.country.toLowerCase() === selectedLocation.toLowerCase() ||
                event.location.toLowerCase().includes(selectedLocation.toLowerCase());

            const matchesSport =
                selectedSport === "all" ||
                event.sport.toLowerCase() === selectedSport.toLowerCase();

            const query = searchQuery.trim().toLowerCase();
            const matchesSearch =
                !query ||
                event.title.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.sport.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query);

            return matchesLocation && matchesSport && matchesSearch;
        });
    }, [selectedLocation, selectedSport, searchQuery]);

    const handleReset = () => {
        setSelectedLocation("all");
        setSelectedSport("all");
        setSearchQuery("");
    };

    return (
        <section
            className="w-full text-neutral-900 font-sans py-14 sm:pb-20 md:pb-24 px-4 sm:px-8 md:px-12 lg:px-20 bg-white"

        >
            {/* Header with Title and Pill Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 sm:mb-14">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                        All Events
                    </h2>
                </div>

                {/* Filter Tab - Pill-shaped filter bar matching user reference */}
                <div className="bg-neutral-100 border border-neutral-300 rounded-2xl sm:rounded-full p-1.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-8 w-full lg:w-auto sm:min-w-[560px] md:min-w-[640px] lg:min-w-[800px]">
                    {/* Location Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full sm:w-auto appearance-none bg-transparent hover:bg-white text-neutral-800 text-xs sm:text-sm font-medium pl-4 pr-8 py-2 rounded-full cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-neutral-200/80"
                        >
                            <option value="all">All locations</option>
                            {locationOptions
                                .filter((loc) => loc !== "all")
                                .map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                        </select>
                        <svg
                            className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Sport Dropdown */}
                    <div className="relative">
                        <select
                            value={selectedSport}
                            onChange={(e) => setSelectedSport(e.target.value)}
                            className="w-full sm:w-auto appearance-none bg-transparent hover:bg-white text-neutral-800 text-xs sm:text-sm font-medium pl-4 pr-8 py-2 rounded-full cursor-pointer focus:outline-none transition-colors border border-transparent hover:border-neutral-200/80"
                        >
                            <option value="all">All sports</option>
                            {sportOptions
                                .filter((sport) => sport !== "all")
                                .map((sport) => (
                                    <option key={sport} value={sport}>
                                        {sport}
                                    </option>
                                ))}
                        </select>
                        <svg
                            className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Search Bar on Right */}
                    <div className="relative flex-1 min-w-[240px] sm:min-w-[300px] md:min-w-[360px]">
                        <svg
                            className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search events..."
                            className="w-full bg-white text-neutral-900 text-xs sm:text-sm pl-9 pr-8 py-2 sm:py-2.5 rounded-full border border-neutral-200/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 shadow-xs placeholder:text-neutral-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs cursor-pointer"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Connected Grid Display */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l  border-neutral-700">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="min-w-0 flex flex-col">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty state when no events match */
                <div className="text-center py-20 px-4 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                    <p className="text-lg font-medium text-neutral-700 mb-2">
                        No events found matching your criteria.
                    </p>
                    <p className="text-sm text-neutral-500 mb-6">
                        Try searching for a different keyword or resetting your filters.
                    </p>
                    <button
                        onClick={handleReset}
                        className="px-5 py-2.5 rounded-full bg-secondary text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        Reset Filters
                    </button>
                </div>
            )}
        </section>
    );
}