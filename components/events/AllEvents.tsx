"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { EVENTS, type EventData } from "@/constants/events";

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function getEventDateInfo(event: EventData) {
  const mStr = (event.month || "Oct").toLowerCase().slice(0, 3);
  const monthIdx = MONTH_MAP[mStr] ?? 9;
  const dayNum = parseInt(event.day || "1", 10);
  const d = new Date(2026, monthIdx, dayNum);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });

  return {
    weekday,
    day: dayNum,
  };
}

export default function AllEvents() {
  // Sort events chronologically
  const sortedEvents = useMemo(() => {
    return [...EVENTS].sort((a, b) => {
      const monthA =
        MONTH_MAP[a.month?.toLowerCase().slice(0, 3) || "oct"] ?? 9;
      const monthB =
        MONTH_MAP[b.month?.toLowerCase().slice(0, 3) || "oct"] ?? 9;
      if (monthA !== monthB) return monthA - monthB;
      return parseInt(a.day || "1", 10) - parseInt(b.day || "1", 10);
    });
  }, []);

  // Group events by month for the clean calendar view
  const eventsByMonth = useMemo(() => {
    const groups: { monthTitle: string; events: EventData[] }[] = [];
    const map = new Map<string, EventData[]>();

    sortedEvents.forEach((ev) => {
      const m = ev.month?.toUpperCase().slice(0, 3) || "OCT";
      const fullMonthName =
        m === "OCT"
          ? "October 2026"
          : m === "NOV"
            ? "November 2026"
            : `${ev.month} 2026`;
      if (!map.has(fullMonthName)) {
        map.set(fullMonthName, []);
      }
      map.get(fullMonthName)!.push(ev);
    });

    map.forEach((events, monthTitle) => {
      groups.push({ monthTitle, events });
    });

    return groups;
  }, [sortedEvents]);

  return (
    <section className="w-full text-neutral-900 font-sans py-14 sm:py-20 md:py-24 px-4 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {eventsByMonth.map((group) => (
          <div key={group.monthTitle} className="space-y-3">
            {/* Month Header: Clean typography, no top-right filter buttons */}
            <div className="pb-4 border-b border-neutral-200/80">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                {group.monthTitle}
              </h2>
            </div>

            {/* Event List */}
            <div className="divide-y divide-neutral-200/60">
              {group.events.map((event) => {
                const dateInfo = getEventDateInfo(event);

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group flex flex-col md:flex-row md:items-start justify-between gap-6 lg:gap-10 py-8 sm:py-10 px-3 sm:px-6 rounded-2xl"
                  >
                    {/* Left & Middle Block: Date + Details */}
                    <div className="flex gap-4 sm:gap-6 lg:gap-8 flex-1 min-w-0">
                      {/* 1. Date: Calendar Tear-off Badge (Weekday + Day Number) */}
                      <div className="shrink-0 self-start w-14 h-16 sm:w-16 sm:h-[72px] rounded-2xl bg-linear-to-b from-[#2d4991] to-secondary p-1.5 shadow-[0_6px_16px_-2px_rgba(35,57,113,0.2)] flex flex-col select-none">
                        {/* Binder Slot / Ring */}
                        <div className="flex justify-center items-center pb-1 pt-0.5">
                          <div className="w-4 sm:w-5 h-1 rounded-full bg-[#152347] shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)] flex items-center justify-center">
                            <div className="w-2.5 sm:w-3 h-[2px] rounded-full bg-white/80 shadow-sm -mt-0.5" />
                          </div>
                        </div>

                        {/* White Paper Sheet */}
                        <div className="flex-1 bg-linear-to-b from-white via-white to-[#f4f7f9] rounded-xl overflow-hidden flex flex-col shadow-sm border border-black/5">
                          {/* Weekday (e.g. Fri, Mon, Sat) */}
                          <div className="py-0.5 text-center border-b border-neutral-200/70 bg-neutral-50/70">
                            <span className="block text-[10px] sm:text-[11px] font-bold text-neutral-700 tracking-tight leading-none">
                              {dateInfo.weekday}
                            </span>
                          </div>

                          {/* Day Number (e.g. 17, 5, 8) */}
                          <div className="flex-1 flex items-center justify-center">
                            <span className="text-base sm:text-xl font-black text-secondary leading-none tracking-tight">
                              {dateInfo.day}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 2. Middle Content (Hover Accent Border, Title, Venue, Description) */}
                      <div className="flex-1 min-w-0 border-l-[3px] border-transparent group-hover:border-amber-400 pl-4 sm:pl-5 transition-colors duration-200">
                        {/* Meta: Calendar Date */}
                        <div className="flex items-center gap-2.5 text-xs sm:text-[13px] text-neutral-500 font-medium mb-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 text-neutral-500">
                            <svg
                              className="w-3.5 h-3.5 text-amber-500 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                strokeWidth="2"
                              />
                              <line
                                x1="16"
                                y1="2"
                                x2="16"
                                y2="6"
                                strokeWidth="2"
                              />
                              <line
                                x1="8"
                                y1="2"
                                x2="8"
                                y2="6"
                                strokeWidth="2"
                              />
                              <line
                                x1="3"
                                y1="10"
                                x2="21"
                                y2="10"
                                strokeWidth="2"
                              />
                            </svg>
                            <span>{event.date}</span>
                          </span>
                        </div>

                        {/* Event Title */}
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-900 group-hover:text-primary transition-colors leading-snug">
                          {event.title}
                        </h3>

                        {/* Venue / Location */}
                        <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1">
                          {event.fullLocation || event.location}
                        </p>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed mt-2.5 max-w-xl">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* 3. Image on Right */}
                    <div className="w-full sm:w-48 md:w-52 lg:w-60 aspect-16/10 rounded-2xl overflow-hidden shrink-0 bg-neutral-100 shadow-sm border border-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/images/marketing-cards/card_1_default.jpg";
                        }}
                        loading="lazy"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
