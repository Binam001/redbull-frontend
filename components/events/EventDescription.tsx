import React from "react";
import Image from "next/image";
import { EventData } from "@/constants/events";
import Heading from "../shared/Heading";
import ScrubWaveText from "../shared/ScrubWaveText";
import EventTicketCard from "./EventTicketCard";

interface EventDescriptionProps {
  event: EventData;
}

/**
 * Parses markdown links [label](url) and renders styled anchor tags.
 * Also cleans missing spaces around markdown tags (e.g. top[female] or )on Kolob).
 */
function renderMarkdownLinks(text: string) {
  if (!text) return null;

  // Normalize spacing around links if missing
  const normalizedText = text
    .replace(/([a-zA-Z0-9’']+)\[/g, "$1 [")
    .replace(/\]\(([^)]+)\)([a-zA-Z0-9])/g, "]($1) $2");

  // Split by markdown link pattern [label](url)
  const parts = normalizedText.split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, idx) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, label, url] = match;
      return (
        <a
          key={idx}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 decoration-black/30 hover:decoration-[#cb2026] text-black hover:text-[#cb2026] transition-colors font-semibold"
        >
          {label}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function EventDescription({ event }: EventDescriptionProps) {
  const leadDesc = event.leadDescription || event.description;
  const paragraphs =
    event.aboutEvent && event.aboutEvent.length > 0
      ? event.aboutEvent
      : [event.description];
  const venueImage = event.venueImage || "/images/demo-location.webp";
  const venueParagraphs: string[] = Array.isArray(event.aboutVenue)
    ? event.aboutVenue
    : event.aboutVenue
      ? [event.aboutVenue]
      : [
          `Each year the event takes place in ${event.fullLocation || `${event.location}, ${event.country}`}. Experience the atmosphere and high-energy excitement live at this world-class venue.`,
        ];

  // Clean markdown links syntax [label](url) -> label for clean animated scrub typography
  const cleanLeadDesc = leadDesc
    ? leadDesc.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    : "";

  return (
    <section className="relative">
      {/* ── Event Ticket Pass Card (Overlapping Hero & Overview) ── */}
      <EventTicketCard event={event} />

      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20 mt-8 lg:mt-12">
        {/* 1. Lead Short Description (Overview) */}

        {leadDesc && (
          <div className="my-4 md:my-8 lg:my-[1vw] max-w-6xl mx-auto">
            <Heading
              as="h2"
              text="Overview"
              highlight=""
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08] mb-4"
            />

            <p className="md:text-lg lg:text-xl text-neutral-800 leading-relaxed font-medium">
              <span className="text-primary font-bold text-[2em] leading-none align-baseline inline-block mr-0.5">
                {cleanLeadDesc.charAt(0)}
              </span>
              {cleanLeadDesc.slice(1)}
            </p>
          </div>
        )}

        {/* 2. About the Event Section */}
        <div className="flex flex-col gap-4 max-w-6xl mx-auto">
          <Heading
            as="h2"
            text="About the event"
            highlight="event"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
          />
          <div className="flex flex-col gap-4 sm:gap-6">
            {paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-800 leading-relaxed font-medium"
              >
                {renderMarkdownLinks(para)}
              </p>
            ))}
          </div>
        </div>

        {/* 3. About the Venue Section */}
        <div className="flex flex-col gap-6 sm:gap-8 max-w-6xl mt-4 mx-auto">
          <Heading
            as="h2"
            text="About the venue"
            highlight="venue"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
          />

          {/* Venue Image */}
          <div className="w-full mb-2 sm:mb-4">
            <div className="w-full relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-neutral-100 group">
              <Image
                src={venueImage}
                alt={`Venue for ${event.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Venue Description below images */}
          {venueParagraphs.length > 0 && (
            <div className="flex flex-col gap-4 sm:gap-6 max-w-6xl mx-auto">
              {venueParagraphs.map((para, index) => (
                <p
                  key={index}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-800 leading-relaxed font-medium"
                >
                  {renderMarkdownLinks(para)}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
