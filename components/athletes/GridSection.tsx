"use client";

import React from "react";
import Link from "next/link";
import Heading from "../shared/Heading";

interface GridItem {
  id: string;
  title: string;
  image: string;
  alt: string;
  href: string;
}

const ITEMS: GridItem[] = [
  {
    id: "training",
    title: "Training",
    image: "/images/home/athletes/hover-athlete-1.jpg",
    alt: "Athlete performance training",
    href: "/athletes",
  },
  {
    id: "yoga",
    title: "Yoga",
    image: "/images/home/athletes/hover-athlete-2.jpg",
    alt: "Yoga and mobility training",
    href: "/athletes",
  },
  {
    id: "fitness",
    title: "Fitness",
    image: "/images/home/athletes/hover-athlete-3.jpg",
    alt: "High performance fitness training",
    href: "/athletes",
  },
  {
    id: "nutrition",
    title: "Nutrition",
    image: "/images/home/hero/adventure-5.jpg",
    alt: "Athlete nutrition and fueling",
    href: "/athletes",
  },
  {
    id: "muscles-building",
    title: "Muscles Building",
    image: "/images/athletes/athlete-2-back.jpg",
    alt: "Strength conditioning and muscle building",
    href: "/athletes",
  },
];

function GridCard({
  item,
  className = "",
  titleClassName = "text-base sm:text-lg lg:text-[1.25vw]",
}: {
  item: GridItem;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Link
      href={item.href}
      className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg transition-all duration-500 block h-full bg-neutral-900 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.image}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      {/* Bottom Dark Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />
      {/* Bottom Label */}
      <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 lg:bottom-[1.6vw] lg:left-[1.6vw] z-10">
        <span
          className={`font-black uppercase tracking-wider text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] ${titleClassName}`}
        >
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export default function GridSection() {
  return (
    <section className="w-full text-neutral-900 font-sans py-12 sm:py-16 md:py-20 lg:py-[5vw] px-4 sm:px-8 lg:px-[4vw]">
      <div className="w-full max-w-7xl lg:max-w-none mx-auto space-y-8 lg:space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 lg:gap-12">
          <div>
            <Heading
              as="h2"
              text={"Build for the\nExtraordinary"}
              highlight="Extraordinary"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
            />
          </div>
          <p className="text-neutral-600 font-medium text-sm sm:text-base lg:text-[1.05vw] leading-relaxed max-w-md lg:max-w-xl">
            Explore the elite disciplines, physical conditioning, and
            performance science that empower Red Bull athletes to shatter limits
            and redefine what&apos;s possible.
          </p>
        </div>
        {/* Asymmetric Bento Layout Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.42fr_1fr] gap-4 sm:gap-6 lg:gap-[1.5vw] lg:min-h-[540px] xl:min-h-[620px]">
          {/* Left Side: Two Staggered Rows */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-[1.5vw] h-full">
            {/* Top Row: Card 1 (Training, wider ~58%) + Card 2 (Yoga, narrower ~42%) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.38fr_1fr] gap-4 sm:gap-6 lg:gap-[1.5vw] flex-1">
              <GridCard item={ITEMS[0]} className="min-h-[220px] sm:min-h-0" />
              <GridCard item={ITEMS[1]} className="min-h-[220px] sm:min-h-0" />
            </div>

            {/* Bottom Row: Card 3 (Fitness, narrower ~35%) + Card 4 (Nutrition, wider ~65%) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.85fr] gap-4 sm:gap-6 lg:gap-[1.5vw] flex-1">
              <GridCard item={ITEMS[2]} className="min-h-[220px] sm:min-h-0" />
              <GridCard item={ITEMS[3]} className="min-h-[220px] sm:min-h-0" />
            </div>
          </div>

          {/* Right Side: Card 5 (Muscles Building, Tall Right Column spanning full height) */}
          <GridCard
            item={ITEMS[4]}
            className="min-h-[380px] lg:min-h-0"
            titleClassName="text-lg sm:text-xl lg:text-[1.4vw]"
          />
        </div>
      </div>
    </section>
  );
}
