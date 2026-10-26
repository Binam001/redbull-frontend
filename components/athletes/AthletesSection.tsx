"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Heading from "../shared/Heading";
import { getAthleteBySlug } from "@/constants/athletes";
import Button from "../shared/Button";

export interface Athlete {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  sport: string;
  avatar: string;
  gold?: number;
  silver?: number;
  bronze?: number;
}

const ATHLETES: Athlete[] = [
  {
    id: "max-verstappen",
    name: "Max Verstappen",
    sport: "Formula 1",
    country: "Netherlands",
    countryCode: "nl",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 61,
    silver: 32,
    bronze: 15,
  },
  {
    id: "armand-duplantis",
    name: "Armand Duplantis",
    sport: "Pole Vault",
    country: "Sweden",
    countryCode: "se",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 18,
    silver: 5,
    bronze: 2,
  },
  {
    id: "eileen-gu",
    name: "Eileen Gu",
    sport: "Freestyle Skiing",
    country: "China",
    countryCode: "cn",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 12,
    silver: 6,
    bronze: 3,
  },
  {
    id: "marc-marquez",
    name: "Marc Márquez",
    sport: "MotoGP",
    country: "Spain",
    countryCode: "es",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 59,
    silver: 24,
    bronze: 12,
  },
  {
    id: "chloe-kim",
    name: "Chloe Kim",
    sport: "Snowboarding",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 10,
    silver: 4,
    bronze: 2,
  },
  {
    id: "carissa-moore",
    name: "Carissa Moore",
    sport: "Surfing",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 14,
    silver: 8,
    bronze: 5,
  },
  {
    id: "siya-kolisi",
    name: "Siya Kolisi",
    sport: "Rugby",
    country: "South Africa",
    countryCode: "za",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 8,
    silver: 4,
    bronze: 3,
  },
  {
    id: "kai-lenny",
    name: "Kai Lenny",
    sport: "Big Wave Surfing",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 11,
    silver: 5,
    bronze: 4,
  },
  {
    id: "leticia-bufoni",
    name: "Leticia Bufoni",
    sport: "Skateboarding",
    country: "Brazil",
    countryCode: "br",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 6,
    silver: 3,
    bronze: 3,
  },
  {
    id: "trent-alexander-arnold",
    name: "Trent Alexander-Arnold",
    sport: "Football",
    country: "England",
    countryCode: "gb",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 8,
    silver: 5,
    bronze: 2,
  },
  {
    id: "lucia-martino",
    name: "Lucía Martiño",
    sport: "Surfing",
    country: "Spain",
    countryCode: "es",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 4,
    silver: 3,
    bronze: 2,
  },
  {
    id: "henrik-harlaut",
    name: "Henrik Harlaut",
    sport: "Freestyle Skiing",
    country: "Sweden",
    countryCode: "se",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 8,
    silver: 5,
    bronze: 2,
  },
  {
    id: "tom-pidcock",
    name: "Tom Pidcock",
    sport: "Mountain Biking",
    country: "Great Britain",
    countryCode: "gb",
    avatar:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 6,
    silver: 4,
    bronze: 2,
  },
  {
    id: "dominic-thiem",
    name: "Dominic Thiem",
    sport: "Tennis",
    country: "Austria",
    countryCode: "at",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 17,
    silver: 11,
    bronze: 4,
  },
  {
    id: "justine-dupont",
    name: "Justine Dupont",
    sport: "Big Wave Surfing",
    country: "France",
    countryCode: "fr",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 7,
    silver: 3,
    bronze: 2,
  },
  {
    id: "sergio-perez",
    name: "Sergio Pérez",
    sport: "Formula 1",
    country: "Mexico",
    countryCode: "mx",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
    gold: 6,
    silver: 12,
    bronze: 21,
  },
];

function MedalIcon({ variant }: { variant: "gold" | "silver" | "bronze" }) {
  if (variant === "gold") {
    return (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Ribbon Left */}
        <path d="M7 2L10.5 10.5H8.2L4.8 2H7Z" fill="#F59E0B" />
        {/* Ribbon Right */}
        <path d="M17 2L13.5 10.5H15.8L19.2 2H17Z" fill="#D97706" />
        {/* Ribbon Center Fold */}
        <path d="M10.5 10.5H13.5L12 12L10.5 10.5Z" fill="#B45309" />
        {/* Outer Ring */}
        <circle
          cx="12"
          cy="16"
          r="6"
          fill="#F59E0B"
          stroke="#D97706"
          strokeWidth="0.8"
        />
        {/* Inner Coin */}
        <circle cx="12" cy="16" r="4.6" fill="#FDE68A" />
        {/* Embossed Star */}
        <path
          d="M12 13.6L12.7 15.1L14.3 15.3L13.1 16.4L13.4 18L12 17.1L10.6 18L10.9 16.4L9.7 15.3L11.3 15.1L12 13.6Z"
          fill="#D97706"
        />
      </svg>
    );
  }
  if (variant === "silver") {
    return (
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Ribbon Left */}
        <path d="M7 2L10.5 10.5H8.2L4.8 2H7Z" fill="#94A3B8" />
        {/* Ribbon Right */}
        <path d="M17 2L13.5 10.5H15.8L19.2 2H17Z" fill="#64748B" />
        {/* Ribbon Center Fold */}
        <path d="M10.5 10.5H13.5L12 12L10.5 10.5Z" fill="#475569" />
        {/* Outer Ring */}
        <circle
          cx="12"
          cy="16"
          r="6"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth="0.8"
        />
        {/* Inner Coin */}
        <circle cx="12" cy="16" r="4.6" fill="#F1F5F9" />
        {/* Embossed Star */}
        <path
          d="M12 13.6L12.7 15.1L14.3 15.3L13.1 16.4L13.4 18L12 17.1L10.6 18L10.9 16.4L9.7 15.3L11.3 15.1L12 13.6Z"
          fill="#64748B"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.12)]"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Ribbon Left */}
      <path d="M7 2L10.5 10.5H8.2L4.8 2H7Z" fill="#D97706" />
      {/* Ribbon Right */}
      <path d="M17 2L13.5 10.5H15.8L19.2 2H17Z" fill="#B45309" />
      {/* Ribbon Center Fold */}
      <path d="M10.5 10.5H13.5L12 12L10.5 10.5Z" fill="#78350F" />
      {/* Outer Ring */}
      <circle
        cx="12"
        cy="16"
        r="6"
        fill="#CD7F32"
        stroke="#9A3412"
        strokeWidth="0.8"
      />
      {/* Inner Coin */}
      <circle cx="12" cy="16" r="4.6" fill="#FFEDD5" />
      {/* Embossed Star */}
      <path
        d="M12 13.6L12.7 15.1L14.3 15.3L13.1 16.4L13.4 18L12 17.1L10.6 18L10.9 16.4L9.7 15.3L11.3 15.1L12 13.6Z"
        fill="#9A3412"
      />
    </svg>
  );
}

export default function AthletesSection() {
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sports = ["All", ...Array.from(new Set(ATHLETES.map((a) => a.sport)))];

  const filteredAthletes =
    selectedSport === "All"
      ? ATHLETES
      : ATHLETES.filter((a) => a.sport === selectedSport);

  const displayedAthletes = filteredAthletes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAthletes.length;

  return (
    <section className="w-full text-neutral-900 font-sans py-12 sm:py-16 md:py-20 lg:py-[5vw] px-4 sm:px-8 lg:px-[4vw]">
      <div className="w-full max-w-7xl lg:max-w-none mx-auto space-y-8 lg:space-y-10">
        {/* Section Header with Title and Category Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div>
            <Heading
              as="h2"
              text={"All Athletes"}
              highlight="Athletes"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight leading-[1.08]"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Custom Category Dropdown */}
            <div ref={dropdownRef} className="relative z-30 inline-block">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-900 font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer min-w-[240px] justify-between"
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="text-neutral-400 font-normal text-xs uppercase tracking-wider">
                    Category:
                  </span>
                  <span className="truncate">
                    {selectedSport === "All" ? "All Categories" : selectedSport}
                  </span>
                </span>
                <svg
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-300 shrink-0 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50">
                  {sports.map((sport) => {
                    const isSelected = selectedSport === sport;
                    const count =
                      sport === "All"
                        ? ATHLETES.length
                        : ATHLETES.filter((a) => a.sport === sport).length;
                    return (
                      <button
                        key={sport}
                        type="button"
                        onClick={() => {
                          setSelectedSport(sport);
                          setVisibleCount(8);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm sm:text-base font-semibold flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                          isSelected
                            ? "bg-secondary/10 text-secondary font-bold"
                            : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                        }`}
                      >
                        <span className="truncate">
                          {sport === "All" ? "All Categories" : sport}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-mono ml-2">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 border-b border-neutral-200/80 text-xs sm:text-sm font-semibold text-neutral-400 select-none">
            <div className="col-span-5 sm:col-span-4 text-left">Name</div>
            <div className="col-span-3 sm:col-span-4 text-center">Sport</div>
            <div className="col-span-4 sm:col-span-4 text-right">Medals</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-neutral-100">
            {displayedAthletes.map((athlete) => {
              const detail = getAthleteBySlug(athlete.id);
              const hasAnyMedals =
                (athlete.gold !== undefined && athlete.gold > 0) ||
                (athlete.silver !== undefined && athlete.silver > 0) ||
                (athlete.bronze !== undefined && athlete.bronze > 0);

              const rowInner = (
                <>
                  {/* 1. Name Column (Avatar + Name with Country Flag on side) */}
                  <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5 sm:gap-3.5 pr-2 min-w-0">
                    {/* Avatar */}
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 bg-neutral-100 ring-1 ring-neutral-200/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={athlete.avatar}
                        alt={athlete.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Name + Country Flag */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-neutral-900 text-xs sm:text-sm md:text-base leading-snug truncate group-hover:text-primary transition-colors">
                        {athlete.name}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://flagcdn.com/w40/${athlete.countryCode.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${athlete.countryCode.toLowerCase()}.png 2x`}
                        alt={athlete.country}
                        title={athlete.country}
                        className="w-5 h-3.5 sm:w-5.5 sm:h-4 object-cover rounded-xs border border-black/10 shadow-2xs shrink-0"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* 2. Sport Column (Centered) */}
                  <div className="col-span-3 sm:col-span-4 flex items-center justify-center min-w-0">
                    <span className="inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold bg-neutral-100 text-neutral-700 group-hover:bg-neutral-200/70 group-hover:text-neutral-900 transition-colors truncate">
                      {athlete.sport}
                    </span>
                  </div>

                  {/* 3. Medals Column (Right: Gold, Silver, Bronze conditionally rendered) */}
                  <div className="col-span-4 sm:col-span-4 flex items-center justify-end gap-3 sm:gap-4 md:gap-5">
                    {hasAnyMedals ? (
                      <>
                        {/* Gold */}
                        {athlete.gold !== undefined && athlete.gold > 0 && (
                          <div
                            className="flex items-center gap-1.5 sm:gap-2"
                            title={`${athlete.gold} Gold Medals`}
                          >
                            <MedalIcon variant="gold" />
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm md:text-base">
                              {athlete.gold}
                            </span>
                          </div>
                        )}

                        {/* Silver */}
                        {athlete.silver !== undefined && athlete.silver > 0 && (
                          <div
                            className="flex items-center gap-1.5 sm:gap-2"
                            title={`${athlete.silver} Silver Medals`}
                          >
                            <MedalIcon variant="silver" />
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm md:text-base">
                              {athlete.silver}
                            </span>
                          </div>
                        )}

                        {/* Bronze */}
                        {athlete.bronze !== undefined && athlete.bronze > 0 && (
                          <div
                            className="flex items-center gap-1.5 sm:gap-2"
                            title={`${athlete.bronze} Bronze Medals`}
                          >
                            <MedalIcon variant="bronze" />
                            <span className="font-bold text-neutral-900 text-xs sm:text-sm md:text-base">
                              {athlete.bronze}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm text-neutral-400 font-medium">
                        —
                      </span>
                    )}
                  </div>
                </>
              );

              const rowClassName =
                "group grid grid-cols-12 items-center px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 transition-colors duration-150 hover:bg-neutral-50/70 cursor-pointer";

              return detail ? (
                <Link
                  key={athlete.id}
                  href={`/athletes/${detail.slug}`}
                  className={rowClassName}
                >
                  {rowInner}
                </Link>
              ) : (
                <div key={athlete.id} className={rowClassName}>
                  {rowInner}
                </div>
              );
            })}
          </div>
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            {/* <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-full bg-secondary hover:bg-secondary/90 text-white font-bold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Load More</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button> */}
            <Button
              label="Load More"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="text-xs md:text-sm"
            />
          </div>
        )}
      </div>
    </section>
  );
}
