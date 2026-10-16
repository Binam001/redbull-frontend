"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { CareerJob } from "@/constants/careers";
import Button from "../shared/Button";

interface CareerDetailProps {
    job: CareerJob;
}

const PERKS = [
    {
        title: "Unlimited Energy",
        desc: "Free cold Red Bull cans, premium coffee, and healthy snacks at all hubs and event venues.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: "VIP Event Access",
        desc: "Exclusive staff passes and backstage access to Red Bull action sports, Formula 1, and music festivals.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
        ),
    },
    {
        title: "Comprehensive Health",
        desc: "Top-tier medical, vision, and mental health coverage plus generous wellness & fitness stipends.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
    },
    {
        title: "Latest Hardware",
        desc: "Top-spec MacBook Pro or high-end workstation, 4K displays, and an ergonomic home-office budget.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        title: "Continuous Growth",
        desc: "Annual personal education stipend, conference tickets, and mentorship from industry pioneers.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
        ),
    },
    {
        title: "Recharge & Flexibility",
        desc: "Flexible remote work rhythms, generous paid time off, parental leave, and company recharge days.",
        icon: (
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
];

export default function CareerDetail({ job }: CareerDetailProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        address: "",
    });

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
            setFileError("Please upload a valid PDF file (.pdf only).");
            setResumeFile(null);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setFileError("File size exceeds 10MB limit.");
            setResumeFile(null);
            return;
        }

        setFileError("");
        setResumeFile(file);
    };

    const handleRemoveFile = () => {
        setResumeFile(null);
        setFileError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!resumeFile) {
            setFileError("Please attach your resume in PDF format.");
            return;
        }

        setIsSubmitting(true);
        // Simulate async submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1200);
    };

    return (
        <section className="relative w-full bg-white text-zinc-900 pt-10 sm:pt-12 lg:pt-14 pb-16 sm:pb-20 lg:pb-28 px-4 sm:px-8 lg:px-[5vw]">
            {/* Ambient Radial Gradient Glow - Isolated in its own container so overflow-hidden doesn't break sticky */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
                <div
                    className="absolute -top-24 right-0 w-96 md:w-[45rem] lg:w-[42vw] aspect-square rounded-full opacity-60"
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(244, 63, 94, 0.16) 0%, rgba(251, 113, 133, 0.08) 40%, rgba(255, 255, 255, 0) 70%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            <div className="relative z-10 w-full mx-auto flex flex-col gap-8 lg:gap-10">
                {/* Breadcrumbs Navigation */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium">
                    <Link
                        href="/career"
                        className="hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                        <svg
                            className="w-3.5 h-3.5 lg:w-[0.8vw] lg:h-[0.8vw]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span>Back to all Careers</span>
                    </Link>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold truncate">
                        {job.title}
                    </span>
                </nav>

                {/* 2-Column Main Layout: LEFT = IN-DEPTH SPEC, RIGHT = STICKY FORM */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
                    {/* ================= LEFT COLUMN: EXTENSIVE JOB DETAILS ================= */}
                    <article className="lg:col-span-7 flex flex-col gap-10 sm:gap-12 lg:gap-14">
                        {/* 1. Header Section */}
                        <div className="flex flex-col gap-4 sm:gap-5">

                            {/* Main Title */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.8vw] font-black tracking-tight text-zinc-950 leading-[1.08]">
                                {job.title}
                            </h1>

                            {/* Lead Description */}
                            <p className="text-base sm:text-lg lg:text-[1.1vw] text-zinc-600 font-normal leading-relaxed">
                                {job.description}
                            </p>


                            {/* Mobile jump-to-form action button */}
                            <div className="lg:hidden pt-2">
                                <a
                                    href="#apply-form"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
                                >
                                    <span>Apply for this Position</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* 2. Key Role Highlights Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
                            {/* Department */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Department
                                </span>
                                <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                                    {job.department}
                                </span>
                            </div>

                            {/* Location */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Location
                                </span>
                                <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                                    {job.location}
                                </span>
                            </div>

                            {/* Employment Type */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Job Type
                                </span>
                                <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                                    {job.type}
                                </span>
                            </div>

                            {/* Experience */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Experience
                                </span>
                                <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug">
                                    {job.experience}
                                </span>
                            </div>

                            {/* Qualifications */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Education
                                </span>
                                <span className="text-sm sm:text-base font-bold text-zinc-900 leading-snug truncate" title={job.qualifications}>
                                    {job.qualifications}
                                </span>
                            </div>

                            {/* Offered Salary */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200/90 flex flex-col gap-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-xs">
                                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                                    Offered Salary
                                </span>
                                <span className="text-sm sm:text-base font-bold text-primary leading-snug">
                                    {job.salary}
                                </span>
                            </div>
                        </div>

                        {/* 3. Role Overview & Mission */}
                        <div className="flex flex-col gap-3.5 sm:gap-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight flex items-center gap-3">
                                <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                                <span>About The Role</span>
                            </h2>
                            <p className="text-sm sm:text-base lg:text-[1.05vw] text-zinc-700 leading-relaxed font-normal">
                                {job.overview ||
                                    `Join our global creative and operational ecosystem. In this position as ${job.title}, you will drive high-impact initiatives, push boundaries, and give wiiings to ideas that inspire millions of athletes and cultural leaders worldwide.`}
                            </p>
                            <p className="text-sm sm:text-base lg:text-[1.05vw] text-zinc-700 leading-relaxed font-normal">
                                You will work in a fast-paced environment where autonomy, bold innovation, and passion are celebrated. We look for individuals who take full ownership, challenge conventions, and deliver world-class execution across every single touchpoint.
                            </p>
                        </div>

                        {/* 4. Key Responsibilities */}
                        <div className="flex flex-col gap-4 sm:gap-5">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight flex items-center gap-3">
                                <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                                <span>What You&apos;ll Do</span>
                            </h2>
                            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                                Core focus areas and primary responsibilities for this role:
                            </p>

                            <ul className="flex flex-col gap-3 sm:gap-3.5">
                                {(job.responsibilities || [
                                    "Drive strategy, execution, and continuous optimization within your domain.",
                                    "Collaborate across multidisciplinary teams to ship cutting-edge solutions.",
                                    "Maintain high quality standards, clear documentation, and transparent communication.",
                                    "Translate customer and market insights into impactful, game-changing outcomes.",
                                ]).map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 text-sm sm:text-base text-zinc-800 leading-relaxed transition-all hover:bg-white hover:border-zinc-300 hover:shadow-2xs"
                                    >
                                        <div className="w-5 h-5 rounded-full bg-red-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        {/* 6. What We Offer / Perks & Benefits */}
                        <div className="flex flex-col gap-5 sm:gap-6 pt-2">
                            <div className="flex flex-col gap-1.5">
                                <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight flex items-center gap-3">
                                    <span className="w-1.5 h-6 rounded-full bg-primary shrink-0" />
                                    <span>Life At Red Bull & Benefits</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-zinc-500 font-medium">
                                    Giving wiiings to our people through premier perks, culture, and care:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {PERKS.map((perk, index) => (
                                    <div
                                        key={index}
                                        className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all flex flex-col gap-2.5"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                            {perk.icon}
                                        </div>
                                        <h3 className="text-base font-bold text-zinc-900">
                                            {perk.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                                            {perk.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* ================= RIGHT COLUMN: STICKY APPLICATION FORM ================= */}
                    <aside
                        id="apply-form"
                        className="lg:col-span-5 w-full lg:sticky lg:top-12 self-start z-30"
                    >
                        <div className="bg-white rounded-3xl border border-zinc-200  p-5 sm:p-6 lg:p-7 flex flex-col gap-3.5 sm:gap-4 lg:max-h-screen lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {/* Form Header */}
                            <div className="flex flex-col gap-1.5 pb-3 border-b border-zinc-100">

                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 leading-tight">
                                    Apply for this Position
                                </h2>

                            </div>

                            {/* Submission Success View */}
                            {isSubmitted ? (
                                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col items-center text-center gap-4 ">
                                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <svg
                                            className="w-7 h-7"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900">
                                        Application Submitted!
                                    </h3>
                                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                                        Thank you,{" "}
                                        <span className="font-semibold text-zinc-900">
                                            {formData.fullName}
                                        </span>
                                        ! We have received your application for{" "}
                                        <span className="font-semibold text-zinc-900">
                                            {job.title}
                                        </span>
                                        . We will reach out to you via{" "}
                                        <span className="font-semibold text-zinc-900">
                                            {formData.email}
                                        </span>
                                        .
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsSubmitted(false);
                                            setFormData({
                                                fullName: "",
                                                email: "",
                                                phone: "",
                                                age: "",
                                                address: "",
                                            });
                                            setResumeFile(null);
                                        }}
                                        className="mt-2 px-6 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
                                    >
                                        Submit Another Application
                                    </button>
                                </div>
                            ) : (
                                /* Application Form */
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col gap-3.5 sm:gap-4"
                                >
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="fullName"
                                            className="text-xs font-semibold text-zinc-700"
                                        >
                                            Full Name <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            required
                                            placeholder="Your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>

                                    {/* Email Address */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-zinc-700"
                                        >
                                            Email Address <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>

                                    {/* Phone Number & Age Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label
                                                htmlFor="phone"
                                                className="text-xs font-semibold text-zinc-700"
                                            >
                                                Phone Number <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                placeholder="+977 9800000000"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label
                                                htmlFor="age"
                                                className="text-xs font-semibold text-zinc-700"
                                            >
                                                Age <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                id="age"
                                                name="age"
                                                type="number"
                                                min={18}
                                                max={80}
                                                required
                                                placeholder="e.g. 26"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Residential Address */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="address"
                                            className="text-xs font-semibold text-zinc-700"
                                        >
                                            Address, City, State, Zip Code{" "}
                                            <span className="text-primary">*</span>
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            required
                                            rows={2}
                                            placeholder="Residential street address, city, state, postal code"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
                                        />
                                    </div>


                                    {/* Resume Upload (PDF only) */}
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="resumePdf"
                                            className="text-xs font-semibold text-zinc-700"
                                        >
                                            Resume (PDF only) <span className="text-primary">*</span>
                                        </label>

                                        <input
                                            ref={fileInputRef}
                                            id="resumePdf"
                                            name="resumePdf"
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        {!resumeFile ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${fileError
                                                    ? "border-red-400 bg-red-50/50"
                                                    : "border-zinc-300 bg-zinc-50/50 hover:border-primary hover:bg-red-50/20"
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-red-50 text-primary flex items-center justify-center mb-1.5">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-zinc-900">
                                                    Click to upload resume or drag & drop
                                                </p>
                                                <p className="text-[11px] text-zinc-500">
                                                    PDF only (Max 10MB)
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="w-full border border-emerald-300 bg-emerald-50/50 rounded-2xl p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2.5 truncate">
                                                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                        PDF
                                                    </div>
                                                    <div className="flex flex-col text-left truncate">
                                                        <span className="text-xs font-semibold text-zinc-900 truncate">
                                                            {resumeFile.name}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500">
                                                            {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveFile}
                                                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="Remove file"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {fileError && (
                                            <p className="text-xs text-red-500 font-medium mt-1">
                                                {fileError}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-1 flex flex-col gap-2">
                                        <Button
                                            label={isSubmitting ? "Submitting Application..." : "Submit Application"}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full rounded-full justify-center shadow-md hover:shadow-lg py-2.5"
                                        />

                                    </div>
                                </form>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
