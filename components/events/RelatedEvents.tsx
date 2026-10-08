import React from "react";
import EventCard from "./EventCard";
import { EVENTS, EventData } from "@/constants/events";

interface RelatedEventsProps {
  currentEvent: EventData;
}

export default function RelatedEvents({ currentEvent }: RelatedEventsProps) {
  // Exclude current event and display exactly 3 related events
  const related = EVENTS.filter(
    (e) => e.slug !== currentEvent.slug && e.id !== currentEvent.id
  ).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="w-full text-neutral-900 font-sans pb-20 sm:pb-28 md:pb-36 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="flex flex-col gap-8 sm:gap-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-secondary leading-[1.08]">
          Related Events
        </h2>

        {/* 3-Column Grid using EventCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-neutral-700">
          {related.map((event) => (
            <div key={event.id} className="min-w-0 flex flex-col">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
