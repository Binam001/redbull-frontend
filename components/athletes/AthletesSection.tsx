"use client";

import React, { useState, useRef, useEffect } from "react";
import Heading from "../shared/Heading";

export interface Athlete {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  sport: string;
  avatar: string;
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
  },
  {
    id: "armand-duplantis",
    name: "Armand Duplantis",
    sport: "Pole Vault",
    country: "Sweden",
    countryCode: "se",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "eileen-gu",
    name: "Eileen Gu",
    sport: "Freestyle Skiing",
    country: "China",
    countryCode: "cn",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "marc-marquez",
    name: "Marc Márquez",
    sport: "MotoGP",
    country: "Spain",
    countryCode: "es",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "chloe-kim",
    name: "Chloe Kim",
    sport: "Snowboarding",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "carissa-moore",
    name: "Carissa Moore",
    sport: "Surfing",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "siya-kolisi",
    name: "Siya Kolisi",
    sport: "Rugby",
    country: "South Africa",
    countryCode: "za",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "kai-lenny",
    name: "Kai Lenny",
    sport: "Big Wave Surfing",
    country: "United States",
    countryCode: "us",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "leticia-bufoni",
    name: "Leticia Bufoni",
    sport: "Skateboarding",
    country: "Brazil",
    countryCode: "br",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "trent-alexander-arnold",
    name: "Trent Alexander-Arnold",
    sport: "Football",
    country: "England",
    countryCode: "gb",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "lucia-martino",
    name: "Lucía Martiño",
    sport: "Surfing",
    country: "Spain",
    countryCode: "es",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "henrik-harlaut",
    name: "Henrik Harlaut",
    sport: "Freestyle Skiing",
    country: "Sweden",
    countryCode: "se",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "tom-pidcock",
    name: "Tom Pidcock",
    sport: "Mountain Biking",
    country: "Great Britain",
    countryCode: "gb",
    avatar:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "dominic-thiem",
    name: "Dominic Thiem",
    sport: "Tennis",
    country: "Austria",
    countryCode: "at",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "justine-dupont",
    name: "Justine Dupont",
    sport: "Big Wave Surfing",
    country: "France",
    countryCode: "fr",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&h=300&q=80",
  },
  {
    id: "sergio-perez",
    name: "Sergio Pérez",
    sport: "Formula 1",
    country: "Mexico",
    countryCode: "mx",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
  },
];

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
      <div className="w-full max-w-7xl lg:max-w-none mx-auto space-y-8 lg:space-y-12">
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

        {/* 2-Column Grid with Increased Card Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {displayedAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="group relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 lg:p-6 rounded-3xl bg-neutral-50/70 hover:bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-sm"
            >
              {/* Online Avatar (Enlarged) */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 bg-neutral-200 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0 pr-2">
                {/* 1st Row: Athlete Name + Country Flag on the right */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-neutral-900 group-hover:text-primary transition-colors duration-200 leading-tight">
                    {athlete.name}
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w40/${athlete.countryCode.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w80/${athlete.countryCode.toLowerCase()}.png 2x`}
                    alt={athlete.country}
                    title={athlete.country}
                    className="w-6 h-4 sm:w-7 sm:h-4.5 object-cover rounded-xs shadow-xs shrink-0 border border-black/10 inline-block align-middle"
                    loading="lazy"
                  />
                </div>

                {/* 2nd Row: Sport Only */}
                <p className="font-semibold text-neutral-400 group-hover:text-neutral-700 transition-colors duration-200 mt-1.5 sm:mt-2">
                  {athlete.sport}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-4 sm:pt-6">
            <button
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
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
