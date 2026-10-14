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
        currentIndex > 0 ? ATHLETES[currentIndex - 1] : ATHLETES[ATHLETES.length - 1];
    const nextAthlete =
        currentIndex < ATHLETES.length - 1 ? ATHLETES[currentIndex + 1] : ATHLETES[0];

    return (
        <article className="w-full  text-neutral-900 pt-28 sm:pt-32 lg:pt-[8vw] pb-20 sm:pb-24 lg:pb-[6vw] px-4 sm:px-8 lg:px-[5vw]">
            <div className="w-full lg:max-w-none mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-[2vw]">
                {/* ── Top Bar: Back Link & Category Badge ── */}
                <div className="w-full flex items-center justify-between">
                    <Link
                        href="/athletes"
                        className="group inline-flex items-center gap-2 text-xs sm:text-sm lg:text-[0.85vw] font-semibold text-neutral-600 hover:text-primary uppercase tracking-wider transition-colors duration-200 cursor-pointer pl-24"
                    >
                        <span className="w-7 h-7 sm:w-8 sm:h-8 lg:w-[2vw] lg:h-[2vw] rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                            <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[0.9vw] lg:h-[0.9vw] -translate-x-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </span>
                        <span>Back to Athletes</span>
                    </Link>

                    {/* <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#cb2026] animate-pulse" />
                        <span className="text-xs sm:text-sm lg:text-[0.78vw] font-medium text-neutral-500 uppercase tracking-widest">
                            {athlete.subtitle} • {athlete.sport}
                        </span>
                    </div> */}
                </div>

                {/* ── Header & Visual Showcase Group ── */}
                <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-[1.2vw]">
                    {/* Athlete Headline & Description Paragraph */}
                    <header className="w-full max-w-4xl lg:max-w-[60vw] pl-24">
                        {/* <span className="text-[#cb2026] font-bold text-xs sm:text-sm lg:text-[0.85vw] uppercase tracking-widest block mb-2 sm:mb-3">
                            {athlete.discipline}
                        </span> */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08] mb-2 sm:mb-3">
                            {athlete.name}
                        </h1>
                        <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-2xl lg:max-w-[48vw]">
                            {athlete.description}
                        </p>
                    </header>

                    {/* Visual Showcase (Balanced Dual Editorial Layout) */}
                    <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-[1.5vw] mt-1 sm:mt-2">
                        {/* Action Shot */}
                        <div className="relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-[30vw] w-full rounded-2xl sm:rounded-3xl lg:rounded-[1.4vw] overflow-hidden bg-neutral-900 group shadow-sm">
                            <Image
                                src={athlete.actionImage || athlete.hoverImage}
                                alt={`${athlete.name} action capture`}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-white text-[11px] lg:text-[0.68vw] font-semibold tracking-wider uppercase shadow-sm">
                                    Action Capture
                                </span>
                            </div>
                        </div>

                        {/* Portrait Shot */}
                        <div className="relative h-[320px] sm:h-[400px] md:h-[460px] lg:h-[30vw] w-full rounded-2xl sm:rounded-3xl lg:rounded-[1.4vw] overflow-hidden bg-neutral-900 group shadow-sm">
                            <Image
                                src={athlete.portraitImage || athlete.defaultImage}
                                alt={`${athlete.name} portrait`}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-white text-[11px] lg:text-[0.68vw] font-semibold tracking-wider uppercase shadow-sm">
                                    Athlete Portrait
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── Minimalist Stats Grid ── */}
                {/* <section className="w-full bg-white border border-neutral-200/90 rounded-2xl sm:rounded-3xl lg:rounded-[1.5vw] p-6 sm:p-10 lg:p-[2.5vw] shadow-xs">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-[2vw]">
                        {athlete.stats.map((stat, i) => (
                            <div
                                key={i}
                                className="flex flex-col justify-between border-l-2 border-neutral-200 pl-4 sm:pl-6 lg:pl-[1.2vw] py-1"
                            >
                                <span className="text-xs lg:text-[0.75vw] text-neutral-500 uppercase tracking-widest font-semibold block mb-2">
                                    {stat.label}
                                </span>
                                <div className="text-2xl sm:text-4xl lg:text-[2.6vw] font-bold text-neutral-950 tracking-tight font-mono leading-none mb-1">
                                    {stat.value}
                                </div>
                                {stat.detail && (
                                    <span className="text-xs lg:text-[0.78vw] text-neutral-600 font-light">
                                        {stat.detail}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </section> */}

                {/* ── Editorial Story & Career Milestones (Left Aligned to Match Heading) ── */}
                <section className="w-full max-w-4xl lg:max-w-[60vw] flex flex-col gap-8 sm:gap-10 lg:gap-[2.5vw] pt-2 sm:pt-4">
                    {/* Narrative Biography */}
                    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-[1.2vw]">
                        <h2 className="text-2xl sm:text-3xl lg:text-[2vw] font-bold text-secondary tracking-tight leading-tight">
                            The Mindset & Trajectory
                        </h2>

                        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-[1vw] text-neutral-700 text-sm sm:text-base md:text-lg lg:text-[1.05vw] font-light leading-relaxed">
                            {athlete.bio.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Career Milestones */}
                    <div className="pt-6 sm:pt-8 border-t border-neutral-200">
                        <h3 className="text-2xl sm:text-3xl lg:text-[2vw] font-bold text-secondary tracking-tight leading-tight mb-6 sm:mb-8">
                            Career Milestones
                        </h3>
                        <div className="flex flex-col gap-3">
                            {athlete.highlights.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 bg-white border border-neutral-200/70 rounded-xl lg:rounded-[0.8vw] hover:border-neutral-400 transition-colors duration-200 shadow-2xs"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm sm:text-base lg:text-[0.9vw] font-bold text-[#cb2026]">
                                            {item.year}
                                        </span>
                                        <span className="text-sm sm:text-base lg:text-[0.92vw] font-semibold text-neutral-900">
                                            {item.title}
                                        </span>
                                    </div>
                                    <span className="text-xs sm:text-sm lg:text-[0.8vw] text-neutral-500 mt-1 sm:mt-0 font-medium">
                                        {item.event}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── Bottom Navigation Bar (Previous / Next Athlete) ── */}
                {/* <nav
                    aria-label="Athlete navigation"
                    className="w-full pt-10 sm:pt-14 lg:pt-[3vw] mt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <Link
                        href={`/athletes/${prevAthlete.slug}`}
                        className="group w-full sm:w-auto flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-xl lg:rounded-[0.9vw] hover:border-neutral-900 transition-all duration-200 cursor-pointer"
                    >
                        <span className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all duration-200">
                            <svg className="w-4 h-4 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </span>
                        <div className="text-left">
                            <span className="text-[11px] lg:text-[0.68vw] text-neutral-400 uppercase tracking-wider block">
                                Previous Athlete
                            </span>
                            <span className="text-sm lg:text-[0.9vw] font-bold text-neutral-900 group-hover:text-[#cb2026] transition-colors">
                                {prevAthlete.name}
                            </span>
                        </div>
                    </Link>

                    <Link
                        href="/athletes"
                        className="text-xs lg:text-[0.78vw] font-semibold text-neutral-500 hover:text-neutral-900 uppercase tracking-widest py-2 px-4 rounded-full border border-neutral-200 hover:border-neutral-900 transition-colors"
                    >
                        View All Athletes
                    </Link>

                    <Link
                        href={`/athletes/${nextAthlete.slug}`}
                        className="group w-full sm:w-auto flex items-center justify-end sm:justify-start gap-3 p-4 bg-white border border-neutral-200 rounded-xl lg:rounded-[0.9vw] hover:border-neutral-900 transition-all duration-200 cursor-pointer"
                    >
                        <div className="text-right">
                            <span className="text-[11px] lg:text-[0.68vw] text-neutral-400 uppercase tracking-wider block">
                                Next Athlete
                            </span>
                            <span className="text-sm lg:text-[0.9vw] font-bold text-neutral-900 group-hover:text-[#cb2026] transition-colors">
                                {nextAthlete.name}
                            </span>
                        </div>
                        <span className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all duration-200">
                            <svg className="w-4 h-4 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                </nav> */}
            </div>
        </article>
    );
}
