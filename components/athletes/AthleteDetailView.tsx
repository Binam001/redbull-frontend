"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AthleteData, ATHLETES } from "@/constants/athletes";

interface AthleteDetailViewProps {
  athlete: AthleteData;
}

export default function AthleteDetailView({ athlete }: AthleteDetailViewProps) {
  // Find current index and previous/next athletes for bottom navigation
  const currentIndex = ATHLETES.findIndex((a) => a.id === athlete.id);
  const prevAthlete =
    currentIndex > 0
      ? ATHLETES[currentIndex - 1]
      : ATHLETES[ATHLETES.length - 1];
  const nextAthlete =
    currentIndex < ATHLETES.length - 1
      ? ATHLETES[currentIndex + 1]
      : ATHLETES[0];

  const otherAthletes = ATHLETES.filter((a) => a.id !== athlete.id);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -carouselRef.current.clientWidth
          : carouselRef.current.clientWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <article className="w-full bg-white text-neutral-900 pb-24">
      {/* ── Top Hero Banner (Full-Width Background Image Blend) ── */}
      <div className="relative w-full overflow-hidden bg-white min-h-[440px] sm:min-h-[480px] lg:min-h-[560px] flex items-center">
        {/* Full-Width Background Image Layer */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Ambient center soft glow (matches Sample 2 central halo) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] lg:w-[850px] lg:h-[850px] bg-gradient-to-tr from-primary/20 via-ternary/15 to-secondary/15 rounded-full blur-3xl opacity-60" />

          {/* Full-width athlete hero image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={
                athlete.portraitImage ||
                athlete.hoverImage ||
                athlete.actionImage ||
                athlete.defaultImage
              }
              alt={athlete.name}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center lg:object-[center_35%] opacity-90 lg:opacity-100 transition-all duration-700"
            />

            {/* Left-to-Right Fade: keeps headline text crisp and high-contrast */}
            <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 sm:via-white/65 to-transparent z-10" />

            {/* Top Fade: melts seamlessly under navbar */}
            <div className="absolute top-0 inset-x-0 h-20 sm:h-24 bg-linear-to-b from-white via-white/50 to-transparent z-10" />

            {/* Bottom Fade: melts seamlessly into white page */}
            <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-linear-to-t from-white via-white/30 to-transparent z-10" />
          </div>
        </div>

        {/* Hero Content on Top */}
        <div className="relative max-w-4xl mx-auto w-full pt-24 sm:pt-28 lg:pt-30 pb-8 sm:pb-10 px-4 sm:px-6 z-10">
          {/* Back Navigation Link */}
          <Link
            href="/athletes"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 text-sm mb-8 transition-colors group cursor-pointer w-fit"
          >
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>All Athletes</span>
          </Link>

          {/* Category Pill Badge */}
          <div className="mb-5">
            <span className="px-3.5 py-1 rounded-full border border-neutral-200 bg-neutral-100/90 backdrop-blur-sm text-xs font-semibold uppercase text-neutral-800">
              {athlete.discipline ? athlete.discipline : "Athlete Profile"}
            </span>
          </div>

          {/* Headline Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-secondary leading-[1.15] mb-5 max-w-3xl">
            {athlete.name}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            {athlete.description}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-300 bg-neutral-100 shrink-0">
                <Image
                  src={athlete.portraitImage || athlete.defaultImage}
                  alt={athlete.name}
                  fill
                  sizes="32px"
                  className="object-cover object-top"
                />
              </div>
              <span className="font-semibold text-neutral-900">
                {athlete.team || "Oracle Red Bull Racing"}
              </span>
            </div>

            <span className="text-neutral-300 select-none">·</span>

            <span>{athlete.hometown || athlete.nationality}</span>

            <span className="text-neutral-300 select-none">·</span>

            <span className="font-semibold text-primary">{athlete.sport}</span>
          </div>
        </div>
      </div>

      {/* ── Main Editorial Content Section ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Signature Gradient Accent Divider (Matches WebX) */}
        <div className="h-[2.5px] w-20 bg-gradient-to-r from-primary via-ternary to-secondary mb-10 sm:mb-12 rounded-full" />

        <div className="w-full flex flex-col gap-8 sm:gap-10">
          {/* Introductory Narrative */}
          {athlete.bio.length > 0 && (
            <div className="flex flex-col gap-5 text-neutral-700 text-base sm:text-lg md:text-[1.125rem] leading-[1.85] font-light">
              <p>{athlete.bio[0]}</p>
              {athlete.bio.length > 1 && <p>{athlete.bio[1]}</p>}
            </div>
          )}

          {/* Subheading 1: Career Mindset & Trajectory */}
          <div className="pt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4">
              The Mindset &amp; Athletic Trajectory
            </h2>
            {athlete.bio.length > 2 && (
              <p className="text-neutral-700 text-base sm:text-lg md:text-[1.125rem] leading-[1.85] font-light mb-6">
                {athlete.bio[2]}
              </p>
            )}

            {/* Editorial Pull Quote */}
            {athlete.quote && (
              <blockquote className="my-6 pl-5 sm:pl-6 border-l-4 border-primary py-1.5 italic text-lg sm:text-xl md:text-2xl text-secondary font-medium leading-relaxed">
                &ldquo;{athlete.quote}&rdquo;
                <footer className="mt-2 text-xs sm:text-sm not-italic font-semibold text-neutral-500 uppercase">
                  — {athlete.name}
                </footer>
              </blockquote>
            )}
          </div>

          {/* Subheading 2: Visual Showcase */}
          <div className="pt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4">
              Visual Showcase
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-2">
              {/* Action Shot Card */}
              <div className="relative h-[300px] sm:h-[380px] md:h-[420px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 group border border-neutral-200/80">
                <Image
                  src={athlete.actionImage || athlete.hoverImage}
                  alt={`${athlete.name} action capture`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs font-semibold uppercase">
                    Action Capture
                  </span>
                </div>
              </div>

              {/* Portrait Shot Card */}
              <div className="relative h-[300px] sm:h-[380px] md:h-[420px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 group border border-neutral-200/80">
                <Image
                  src={athlete.portraitImage || athlete.defaultImage}
                  alt={`${athlete.name} portrait`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] sm:text-xs font-semibold uppercase">
                    Athlete Portrait
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subheading 3: Performance Benchmarks & Key Stats */}
          {athlete.stats && athlete.stats.length > 0 && (
            <div className="pt-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4">
                Performance Benchmarks
              </h2>
              <div className="w-full bg-neutral-50/70 border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                  {athlete.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between border-l-2 border-neutral-300 pl-4 sm:pl-5 py-1 min-w-0"
                    >
                      <span className="text-[11px] sm:text-xs text-neutral-500 uppercase font-semibold block mb-1.5 truncate">
                        {stat.label}
                      </span>
                      <div
                        className={`font-bold text-secondary mb-1 leading-tight break-words ${
                          stat.value.length > 8
                            ? "text-xl sm:text-2xl lg:text-2xl"
                            : "text-2xl sm:text-3xl lg:text-4xl font-mono"
                        }`}
                      >
                        {stat.value}
                      </div>
                      {stat.detail && (
                        <span className="text-xs sm:text-sm text-neutral-600 font-light leading-snug">
                          {stat.detail}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subheading 4: Career Milestones */}
          {athlete.highlights && athlete.highlights.length > 0 && (
            <div className="pt-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-4">
                Career Milestones &amp; Major Accolades
              </h2>
              <div className="flex flex-col gap-3">
                {athlete.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200/80 rounded-xl hover:border-neutral-400 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm sm:text-base font-bold text-primary">
                        {item.year}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-neutral-900">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-500 mt-1 sm:mt-0 font-medium">
                      {item.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Other Athletes Carousel Section (Full Width) ── */}
      <section className="w-full px-4 sm:px-8 lg:px-[5vw] pt-12 sm:pt-16 mt-8 bg-white">
        <div className="w-full lg:max-w-none mx-auto">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-8">
            <div>
              {/* <span className="text-xs uppercase font-semibold text-neutral-400 block mb-1">
                Discover More
              </span> */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                Other Athletes
              </h2>
            </div>

            {/* Navigation Scroll Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Full-width Carousel Cards Container */}
          <div
            ref={carouselRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {otherAthletes.map((item) => (
              <Link
                key={item.id}
                href={`/athletes/${item.slug}`}
                className="group flex-shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3rem)/3)] snap-start rounded-2xl overflow-hidden border border-neutral-200/90 bg-white hover:border-neutral-400 transition-all duration-300 flex flex-col"
              >
                {/* Athlete Image */}
                <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={
                      item.portraitImage || item.hoverImage || item.defaultImage
                    }
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 270px, 340px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Sport Pill Overlay */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {item.sport}
                    </span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-neutral-500 font-medium mb-1">
                    {item.nationality} · {item.debutYear}
                  </span>
                  <h3 className="text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>View Profile</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Athletes Button */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/athletes"
              className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-950 uppercase py-3 px-8 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors"
            >
              View All Athletes
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
