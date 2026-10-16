"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { EVENTS, type EventData } from "@/constants/events";
import Heading from "../shared/Heading";

function formatEventDate(event: EventData) {
    const raw = event.date || "";
    // Match "start – end Month Year" or "start - end Month"
    const matchRange = raw.match(/(\d{1,2})\s*[-–—]\s*(\d{1,2})\s+([A-Za-z]+)(?:\s*[-–—]\s*([A-Za-z]+))?/);
    if (matchRange) {
        const d1 = matchRange[1].padStart(2, "0");
        const d2 = matchRange[2].padStart(2, "0");
        const m1 = matchRange[3].slice(0, 3);
        const m2 = matchRange[4] ? matchRange[4].slice(0, 3) : m1;
        return {
            days: `${d1} – ${d2}`,
            months: m1 === m2 ? `${m1}   ${m1}` : `${m1}   ${m2}`,
        };
    }

    // Match single day "day Month Year"
    const matchSingle = raw.match(/(\d{1,2})\s+([A-Za-z]+)/);
    if (matchSingle) {
        const d = matchSingle[1].padStart(2, "0");
        const m = matchSingle[2].slice(0, 3);
        return {
            days: `${d}`,
            months: m,
        };
    }

    return {
        days: (event.day || "01").padStart(2, "0"),
        months: (event.month || "Oct").slice(0, 3),
    };
}

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
        <section className="w-full text-neutral-900 font-sans py-14 sm:pb-20 md:pb-28 px-4 sm:px-8 md:px-12 lg:px-20 bg-white">
            {/* Header: Title on Left, Filter Pills on Right */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 sm:mb-14">
                <div>
                    {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                        All Events
                    </h2> */}
                    <Heading
                        as="h2"
                        text="All Events"
                        highlight="Events"
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
                    />
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
                                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${isSelected
                                    ? "bg-primary text-white border border-secondary/50"
                                    : "bg-transparent text-neutral-700 hover:text-black border border-neutral-300 hover:border-neutral-700"
                                    }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Display: Date -> Ticket Image -> Title & Description */}
            {filteredEvents.length > 0 ? (
                <div className="flex flex-col divide-y divide-neutral-200 border-t border-b border-neutral-200">
                    {filteredEvents.map((event) => {
                        const dateInfo = formatEventDate(event);

                        return (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className="group flex flex-col md:flex-row md:items-center gap-6 lg:gap-10 py-8 sm:py-10 transition-colors hover:bg-neutral-50/70 px-2 sm:px-6 rounded-2xl select-none"
                            >
                                {/* 1. DATE: Large bold numbers with months below */}
                                <div className="shrink-0 w-28 sm:w-32 lg:w-66 flex flex-col justify-center">
                                    <span className="text-3xl sm:text-6xl font-normal text-primary tracking-tight leading-none">
                                        {dateInfo.days}
                                    </span>
                                    <span className="text-xs sm:text-xl font-semibold uppercase tracking-wider text-neutral-500 mt-2 whitespace-pre">
                                        {dateInfo.months}
                                    </span>
                                </div>

                                {/* 2. IMAGE: Ticket Card with left & right notches */}
                                <div className="relative w-full sm:w-64 md:w-72 lg:w-96 aspect-16/10 rounded-2xl overflow-hidden bg-neutral-900 shrink-0 shadow-sm border border-neutral-100">
                                    {/* <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white z-20 pointer-events-none" />
                                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white z-20 pointer-events-none" /> */}

                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/marketing-cards/card_1_default.jpg";
                                        }}
                                        loading="lazy"
                                    />
                                </div>

                                {/* 3. TITLE & DESCRIPTION */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    {/* Status Badge */}
                                    {/* <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800">
                                            <span>📢</span>
                                            <span>Happening now</span>
                                        </span>
                                    </div> */}

                                    {/* Category / Sport */}
                                    {/* <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                                        {event.sport}
                                    </span> */}
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full border border-neutral-700 text-[10px] sm:text-xs font-semibold text-neutral-800 tracking-wider uppercase shrink-0 transition-colors group-hover:border-black w-fit">
                                        {event.status === "live" && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                        )}
                                        <span>{event.sport}</span>
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold text-neutral-900 group-hover:text-secondary transition-colors font-primary leading-tight">
                                        {event.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="mt-2 text-sm sm:text-lg text-neutral-600 line-clamp-2 leading-relaxed">
                                        {event.description}
                                    </p>

                                    {/* Location with Flag */}
                                    <div className="flex items-center gap-2 mt-3 text-lg font-bold text-neutral-600">
                                        {/* <span className="text-base">{event.flagEmoji || "📍"}</span> */}
                                        <span>{event.fullLocation || event.country || event.location}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                /* Empty state when no events match */
                <div className="text-center py-20 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
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