"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CAREER_JOBS, CareerJob } from "@/constants/careers";

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
        <section className="relative w-full  text-zinc-900 py-16 sm:py-24 lg:py-[6vw] px-4 sm:px-8 lg:px-[5vw] overflow-hidden">
            {/* Top-Right Soft Ambient Radial Glow */}
            <div
                className="absolute -top-16 -right-16 sm:top-0 sm:right-0 w-72 sm:w-96 md:w-[36rem] lg:w-[34vw] aspect-square rounded-full pointer-events-none -z-0"
                style={{
                    background:
                        "radial-gradient(circle at center, rgba(244, 63, 94, 0.22) 0%, rgba(251, 113, 133, 0.12) 35%, rgba(255, 255, 255, 0) 70%)",
                    filter: "blur(48px)",
                }}
            />

            <div className="relative z-10 w-full  mx-auto flex flex-col gap-10 sm:gap-14 lg:gap-[3.5vw]">
                {/* Header Information */}
                <div className="flex flex-col items-start gap-4 sm:gap-5 lg:gap-[1.2vw]">
                    {/* Badge Pill */}
                    <div className="inline-flex items-center px-3.5 py-1 sm:px-4 sm:py-1.5 lg:px-[0.9vw] lg:py-[0.3vw] rounded-full border border-zinc-300/80 bg-white shadow-2xs">
                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-800">
                            We&apos;re hiring!
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08] capitalize">
                        Be part of our <span className="text-primary">mission</span>
                    </h2>

                    {/* Subtitle Description */}
                    <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-2xl lg:max-w-[46vw]">
                        We&apos;re looking for passionate people to join us on our mission. We
                        value flat hierarchies, clear communication, and full ownership and
                        responsibility.
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:gap-[0.6vw] pt-1">
                    {CATEGORIES.map((category) => {
                        const isActive = selectedCategory === category;
                        return (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 sm:px-5 sm:py-2 lg:px-[1.1vw] lg:py-[0.45vw] rounded-full text-xs sm:text-sm lg:text-[0.85vw] font-medium transition-all duration-200 cursor-pointer border ${isActive
                                    ? "bg-primary text-white border-secondary/20"
                                    : "bg-white text-zinc-700 border-zinc-300/90 hover:border-secondary/80 hover:text-secondary"
                                    }`}
                            >
                                {category}
                            </button>
                        );
                    })}
                </div>

                {/* Job Openings List */}
                <div className="flex flex-col border-t border-zinc-200">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job) => (
                            <Link
                                key={job.id}
                                href={`/career/${job.slug}`}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 lg:gap-[1.8vw] py-6 sm:py-8 lg:py-[2vw] border-b border-zinc-200 transition-colors"
                            >
                                {/* Left Content */}
                                <div className="flex flex-col items-start text-left">
                                    <h3 className="text-xl sm:text-2xl lg:text-[1.45vw] font-bold text-zinc-900 group-hover:text-primary transition-colors tracking-tight">
                                        {job.title}
                                    </h3>
                                    <p className="text-zinc-600 text-sm sm:text-base lg:text-[0.95vw] mt-1.5 sm:mt-2 lg:mt-[0.45vw] leading-relaxed">
                                        {job.description}
                                    </p>

                                    {/* Badges: Location & Contract */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:gap-[0.6vw] mt-3.5 sm:mt-4 lg:mt-[0.9vw]">
                                        {/* Remote / Location Badge */}
                                        <div className="inline-flex items-center gap-1.5 lg:gap-[0.35vw] px-3 py-1 sm:px-3.5 sm:py-1.5 lg:px-[0.8vw] lg:py-[0.28vw] rounded-full border border-zinc-300/80 bg-white text-xs sm:text-sm lg:text-[0.78vw] font-medium text-zinc-700">
                                            <svg
                                                className="w-3.5 h-3.5 lg:w-[0.85vw] lg:h-[0.85vw] text-primary shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <span>{job.location}</span>
                                        </div>

                                        {/* Full-time / Type Badge */}
                                        <div className="inline-flex items-center gap-1.5 lg:gap-[0.35vw] px-3 py-1 sm:px-3.5 sm:py-1.5 lg:px-[0.8vw] lg:py-[0.28vw] rounded-full border border-zinc-300/80 bg-white text-xs sm:text-sm lg:text-[0.78vw] font-medium text-zinc-700">
                                            <svg
                                                className="w-3.5 h-3.5 lg:w-[0.85vw] lg:h-[0.85vw] text-primary shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            <span>{job.type}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Apply Action */}
                                <div className="flex items-center sm:self-center shrink-0 pt-1 sm:pt-0">
                                    <span className="inline-flex items-center gap-1.5 lg:gap-[0.4vw] text-base sm:text-lg lg:text-[1.1vw] font-semibold text-zinc-900 group-hover:text-primary transition-colors">
                                        <span>Apply Now</span>
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[1.1vw] lg:h-[1.1vw] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <line x1="7" y1="17" x2="17" y2="7" />
                                            <polyline points="7 7 17 7 17 17" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="py-12 sm:py-16 text-center text-zinc-500">
                            <p className="text-base sm:text-lg lg:text-[1.1vw]">
                                No open positions under this category right now.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CareerDisplay;