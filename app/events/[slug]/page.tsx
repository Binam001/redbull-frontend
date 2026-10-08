import React from "react";
import { Metadata } from "next";
import { EVENTS, getEventBySlug } from "@/constants/events";
import EventDetailHero from "@/components/events/EventDetailHero";
import EventDescription from "@/components/events/EventDescription";
import EventFaq from "@/components/events/EventFaq";
import EventGallery from "@/components/events/EventGallery";
import RelatedEvents from "@/components/events/RelatedEvents";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug) || EVENTS[1];

  return {
    title: `${event.title} | Red Bull Events`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = getEventBySlug(slug) || EVENTS[1];

  return (
    <main className="relative bg-white min-h-screen">
      <EventDetailHero event={event} />
      <EventDescription event={event} />
      <EventFaq event={event} />
      <EventGallery event={event} />
      <RelatedEvents currentEvent={event} />
    </main>
  );
}
