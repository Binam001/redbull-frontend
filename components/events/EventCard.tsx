"use client";

import React from "react";
import Link from "next/link";
import {
  EVENTS,
  getEventBySlug,
  type EventData,
  type EventStatus,
} from "@/constants/events";

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
    case "upcoming":
      return (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
      );
    case "past":
      return (
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

function getEventMonthDay(event: EventData): string {
  const monthMap: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const rawMonth = (event.month || "").toLowerCase().slice(0, 3);
  let monthNum = monthMap[rawMonth];
  if (!monthNum && event.date) {
    const lowerDate = event.date.toLowerCase();
    for (const [m, num] of Object.entries(monthMap)) {
      if (lowerDate.includes(m)) {
        monthNum = num;
        break;
      }
    }
  }
  monthNum = monthNum || "10";

  let dayNum = event.day || "";
  if (!dayNum && event.date) {
    const match = event.date.match(/\b\d{1,2}\b/);
    if (match) dayNum = match[0];
  }
  const cleanDay = dayNum ? dayNum.padStart(2, "0") : "01";

  return `${monthNum}/${cleanDay}`;
}

function getEventCta(status: EventStatus): {
  label: string;
  variant: "live" | "replay" | "register" | "upcoming";
} {
  switch (status) {
    case "live":
      return { label: "Live Stream", variant: "live" };
    case "past":
      return { label: "Watch Replay", variant: "replay" };
    case "upcoming":
      return { label: "Upcoming", variant: "upcoming" };
    case "tickets":
    case "live-soon":
    default:
      return { label: "Register Now", variant: "register" };
  }
}

interface EventCardProps {
  event: EventData;
  className?: string;
}

export default function EventCard({ event, className = "" }: EventCardProps) {
  const monthDay = getEventMonthDay(event);
  const cta = getEventCta(event.status);

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group relative w-full aspect-7/9 rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-5 lg:p-[1.4vw] select-none border border-white/10 hover:border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
    >
      {/* Background Full-bleed Poster Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={event.image}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.src = "/images/marketing-cards/card_1_default.jpg";
        }}
        loading="lazy"
      />

      {/* Top Dark Gradient for Crisp Top Badges */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Bottom Dark Gradient for Title and Details */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent pointer-events-none" />

      {/* Top Row: Sport & Location (Left) & Month/Day Date (Right) */}
      <div className="relative z-10 flex items-center justify-between gap-2 w-full">
        {/* Top Left: event.sport and location */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/15 text-white shadow-sm max-w-[70%]">
          <span className="text-xs sm:text-sm lg:text-[0.85vw] font-bold uppercase tracking-wider text-white shrink-0">
            {event.sport}
          </span>
          {event.location && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/40 shrink-0" />
              <span className="text-xs sm:text-sm lg:text-[0.85vw] font-medium text-white/75 truncate">
                {event.location}
              </span>
            </>
          )}
        </div>

        {/* Top Right: Date in Month/Day Format (e.g. 10/24) */}
        <div className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/45 backdrop-blur-md border border-white/15 text-white shadow-sm font-primary shrink-0">
          <span className="text-xs sm:text-sm lg:text-[0.95vw] font-bold tracking-tight text-white">
            {monthDay}
          </span>
        </div>
      </div>

      {/* Bottom Section: Title & Dynamic Action Button */}
      <div className="relative z-10 flex flex-col justify-end">
        {/* Event Title */}
        <h3 className="text-base sm:text-xl md:text-2xl lg:text-[1.2vw] text-white leading-snug tracking-tight line-clamp-2 drop-shadow-md font-primary group-hover:text-red-400 transition-colors">
          {event.title}
        </h3>

        {/* Single Dynamic Action Button - Full Width */}
        <div className="mt-3.5 sm:mt-4 w-full">
          {cta.variant === "live" && (
            <span className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 lg:py-[0.7vw] rounded-full bg-primary text-white font-semibold text-xs sm:text-sm lg:text-[0.85vw] shadow-lg shadow-red-600/30 group-hover:bg-primary/90 transition-all duration-300 text-center">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{cta.label}</span>
            </span>
          )}
          {cta.variant === "replay" && (
            <span className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 lg:py-[0.7vw] rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 font-semibold text-xs sm:text-sm lg:text-[0.85vw] shadow-md group-hover:border-white/40 transition-all duration-300 text-center">
              <svg
                className="w-3.5 h-3.5 text-white fill-current shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{cta.label}</span>
            </span>
          )}
          {(cta.variant === "register" || cta.variant === "upcoming") && (
            <span className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 lg:py-[0.7vw] rounded-full bg-white text-neutral-900 group-hover:bg-primary group-hover:text-white font-bold text-xs sm:text-sm lg:text-[0.85vw] shadow-md transition-all duration-300 text-center">
              <span>{cta.label}</span>
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
