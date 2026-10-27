"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CAREER_JOBS, CareerJob } from "@/constants/careers";
import Button from "../shared/Button";

const CATEGORIES = [
  "View all",
  "Development",
  "Design",
  "Marketing",
  "Customer Service",
  "Operations",
  "Finance",
  "Management",
] as const;

const CareerDisplay = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("View all");

  const filteredJobs: CareerJob[] =
    selectedCategory === "View all"
      ? CAREER_JOBS
      : CAREER_JOBS.filter((job) => job.category === selectedCategory);

  return (
    <section className="relative w-full text-zinc-900 py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-16 xl:px-24 overflow-hidden bg-white">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-10 sm:gap-14">
        {/* Header Information */}
        <div className="flex flex-col items-start gap-4 sm:gap-5">
          {/* Badge Pill */}
          <div className="inline-flex items-center px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border border-zinc-300/80 bg-white shadow-2xs">
            <span className="text-xs sm:text-sm font-medium text-zinc-800">
              We&apos;re hiring!
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08] capitalize">
            Be part of our <span className="text-primary">mission</span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-2xl">
            We&apos;re looking for passionate people to join us on our mission.
            We value flat hierarchies, clear communication, and full ownership
            and responsibility.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-700 hover:text-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Career Cards Grid (2 Columns Matching Reference Design) */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between select-none"
              >
                <div>
                  {/* Job Title & Location / Work Type */}
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-primary transition-colors tracking-tight">
                    {job.title}{" "}
                    <span className="font-normal text-neutral-500 text-sm sm:text-base">
                      (
                      {job.location === "100% remote"
                        ? "Remote / Hybrid"
                        : job.location}
                      )
                    </span>
                  </h3>

                  {/* Category Pill with Leading Dot */}
                  <div className="mt-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-neutral-300 bg-white text-[11px] sm:text-xs font-medium text-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                      {job.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mt-4 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {/* Apply Now Button */}
                <div className="mt-6 pt-1">
                  <Button
                    label="Apply Now"
                    href={`/career/${job.slug}`}
                    className="px-6 py-2 text-xs md:text-sm font-normal"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-16 text-center text-zinc-500 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-300">
            <p className="text-base sm:text-lg">
              No open positions under this category right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareerDisplay;
