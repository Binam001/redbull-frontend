"use client";

import React from "react";
import Link from "next/link";
import { EVENTS, getEventBySlug, type EventData, type EventStatus } from "@/constants/events";
import Button from "../shared/Button";

export { EVENTS, getEventBySlug, type EventData, type EventStatus };

// Status badge icon helper (preserved for backwards compatibility)
export function StatusBadgeIcon({ status }: { status: EventStatus }) {
    switch (status) {
        case "live":
            return (
                <span className="relative flex h-2 w-2 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            );
        case "live-soon":
            return (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.9 19.1C1.2 15.2 1.2 8.8 4.9 4.9" />
                    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    <path d="M12 13.5v5" />
                    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                    <path d="M19.1 4.9c3.7 3.9 3.7 10.3 0 14.2" />
                </svg>
            );
        case "tickets":
            return (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                </svg>
            );
        case "past":
            return (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );
    }
}

// Breaks month names into stacked syllables (e.g. "Dec / em / ber", "Oct / ob / er")
function getStackedMonthParts(rawMonth?: string, fullDate?: string): string[] {
    const text = (rawMonth || fullDate || "").toLowerCase();
    if (text.includes("jan")) return ["Jan", "ua", "ry"];
    if (text.includes("feb")) return ["Feb", "ru", "ary"];
    if (text.includes("mar")) return ["Mar", "ch"];
    if (text.includes("apr")) return ["Apr", "il"];
    if (text.includes("may")) return ["May"];
    if (text.includes("jun")) return ["Jun", "e"];
    if (text.includes("jul")) return ["Jul", "y"];
    if (text.includes("aug")) return ["Aug", "ust"];
    if (text.includes("sep")) return ["Sept", "em", "ber"];
    if (text.includes("oct")) return ["Oct", "ob", "er"];
    if (text.includes("nov")) return ["Nov", "em", "ber"];
    if (text.includes("dec")) return ["Dec", "em", "ber"];

    const clean = (rawMonth || "Oct").trim();
    if (clean.length <= 4) return [clean];
    return [clean.slice(0, 3), clean.slice(3, 5), clean.slice(5)].filter(Boolean);
}

function getEventDayNumber(event: EventData): string {
    if (event.day) return event.day;
    if (event.date) {
        const match = event.date.match(/\b\d{1,2}\b/);
        if (match) return match[0];
    }
    return "1";
}

interface EventCardProps {
    event: EventData;
    className?: string;
}

export default function EventCard({ event, className = "" }: EventCardProps) {
    const dayNumber = getEventDayNumber(event);
    const monthParts = getStackedMonthParts(event.month, event.date);

    return (
        <Link
            href={`/events/${event.slug}`}
            className={`group bg-white p-5 sm:p-7 md:p-8 lg:p-[1.8vw] rounded-3xl sm:rounded-4xl lg:rounded-[2vw] hover:bg-zinc-100 transition-colors flex flex-col justify-between h-full select-none cursor-pointer block ${className}`}
        >
            <div>
                {/* Top Row: Pop-up Date & Outlined Capsule Tag */}
                <div className="flex items-end justify-between gap-3 lg:gap-[0.8vw] mb-4 sm:mb-5 lg:mb-[1.2vw]">
                    {/* Pop-up Date Display */}
                    <div className="flex items-center gap-1.5 lg:gap-[0.4vw] select-none leading-none">
                        <span className="text-4xl sm:text-7xl md:text-8xl lg:text-[4.5vw] font-medium text-primary tracking-tight leading-none">
                            {dayNumber}
                        </span>
                        <div className="flex flex-col text-[11px] sm:text-sm lg:text-[0.85vw] font-bold text-neutral-600 leading-[1.05] tracking-tight">
                            {monthParts.map((part, i) => (
                                <span key={i}>{part}</span>
                            ))}
                        </div>
                    </div>

                    {/* Category Pill Tag */}
                    <span className="inline-flex items-center gap-1.5 lg:gap-[0.35vw] px-3 py-1 lg:px-[0.8vw] lg:py-[0.3vw] mb-1.5 sm:mb-2 lg:mb-[0.5vw] rounded-full border border-neutral-700 text-[10px] sm:text-xs lg:text-[0.75vw] font-semibold text-neutral-800 tracking-wider uppercase shrink-0 transition-colors group-hover:border-black">
                        {event.status === "live" && (
                            <span className="w-1.5 h-1.5 lg:w-[0.4vw] lg:h-[0.4vw] rounded-full bg-red-600 animate-pulse" />
                        )}
                        <span>{event.sport}</span>
                    </span>
                </div>

                {/* Sharp Landscape Image Container */}
                <div className="relative w-full aspect-16/11 overflow-hidden bg-neutral-100 rounded-xl sm:rounded-2xl lg:rounded-[1.2vw] mb-4 sm:mb-6 lg:mb-[1.4vw]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out rounded-none"
                        onError={(e) => {
                            e.currentTarget.src = "/images/marketing-cards/card_1_default.jpg";
                        }}
                        loading="lazy"
                    />
                </div>

                {/* Event Headline */}
                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-[1.65vw] font-bold text-neutral-700 leading-snug lg:leading-[1.2] tracking-tight line-clamp-2 group-hover:text-neutral-950 transition-colors font-primary">
                    {event.title}
                </h3>

                {/* Short Editorial Description */}
                <p className="mt-2 sm:mt-3 lg:mt-[0.8vw] text-xs sm:text-sm md:text-base lg:text-[0.9vw] lg:leading-[1.5] text-neutral-500 font-normal line-clamp-3">
                    {event.description}
                </p>
            </div>

            <Button
                label="Read More"
                className="rounded-full mt-4 lg:mt-[0.1vw] lg:px-[1.6vw] lg:py-[0.55vw] lg:text-[0.85vw]"
            />
        </Link>
    );
}
