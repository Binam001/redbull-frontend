import React from "react";
import Image from "next/image";
import { EventData } from "@/constants/events";

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
  const paragraphs = event.aboutEvent && event.aboutEvent.length > 0 ? event.aboutEvent : [event.description];
  const venueImage = event.venueImage || "/images/demo-location.jpg";
  const venueParagraphs: string[] = Array.isArray(event.aboutVenue)
    ? event.aboutVenue
    : event.aboutVenue
    ? [event.aboutVenue]
    : [
        `Each year the event takes place in ${event.fullLocation || `${event.location}, ${event.country}`}. Experience the atmosphere and high-energy excitement live at this world-class venue.`,
      ];

  return (
    <section className="w-full text-neutral-900 font-sans py-14 sm:py-20 md:py-24 px-6 sm:px-10 md:px-16 lg:px-24 bg-white">
      <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
        {/* 1. Lead Short Description */}
        {leadDesc && (
          <div>
            <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium">
              {renderMarkdownLinks(leadDesc)}
            </p>
          </div>
        )}

        {/* 2. About the Event Section */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <h2 className="text-3xl sm:text-5xl tracking-tight text-secondary leading-[1.08]">
            About the event
          </h2>
          <div className="flex flex-col gap-4 sm:gap-6">
            {paragraphs.map((para, index) => (
              <p
                key={index}
                className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium"
              >
                {renderMarkdownLinks(para)}
              </p>
            ))}
          </div>
        </div>

        {/* 3. About the Venue Section */}
        <div className="flex flex-col gap-6 sm:gap-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-secondary leading-[1.08]">
            About the venue
          </h2>

          {/* Venue Images: Two images side-by-side in grid so they fit comfortably on screen */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-2 sm:mb-4">
            <div className="w-full relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-neutral-100 group">
              <Image
                src={venueImage}
                alt={`Venue for ${event.title} - View 1`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="w-full relative aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-neutral-100 group">
              <Image
                src={venueImage}
                alt={`Venue for ${event.title} - View 2`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Venue Description below images */}
          {venueParagraphs.length > 0 && (
            <div className="flex flex-col gap-4 sm:gap-6">
              {venueParagraphs.map((para, index) => (
                <p
                  key={index}
                  className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium"
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
