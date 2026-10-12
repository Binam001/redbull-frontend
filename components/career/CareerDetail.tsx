"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { CareerJob } from "@/constants/careers";
import Button from "../shared/Button";

interface CareerDetailProps {
    job: CareerJob;
}

export default function CareerDetail({ job }: CareerDetailProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        address: "",
        linkedin: "",
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
        <section className="relative w-full bg-white text-zinc-900 py-12 sm:py-16 lg:py-[5vw] px-4 sm:px-8 lg:px-[5vw]">
            <div className="w-full  mx-auto flex flex-col gap-8 lg:gap-[2.5vw]">
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
                    <span className="text-zinc-900 truncate">{job.title}</span>
                </nav>

                {/* 2-Column Layout Matching Screenshot */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-[3.5vw] items-start">
                    {/* ================= LEFT COLUMN: APPLY NOW FORM ================= */}
                    <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8 lg:gap-[1.8vw]">
                        {/* Section Header */}
                        <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-[0.7vw]">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                                Apply Now
                            </h2>
                            <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-2xl">
                                We&apos;re excited that you want to join our team as a{" "}
                                <span className="font-semibold text-zinc-900">
                                    {job.title}
                                </span>
                                . Complete the application below and our talent acquisition crew
                                will reach out to you.
                            </p>
                        </div>

                        {/* Submission Success State */}
                        {isSubmitted ? (
                            <div className="p-8 sm:p-10 lg:p-[2.5vw] rounded-2xl bg-white border border-emerald-200 shadow-sm flex flex-col items-center text-center gap-4">
                                <div className="w-14 h-14 lg:w-[3.8vw] lg:h-[3.8vw] rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <svg
                                        className="w-7 h-7 lg:w-[2vw] lg:h-[2vw]"
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
                                <h3 className="text-xl sm:text-2xl lg:text-[1.5vw] font-bold text-zinc-900">
                                    Application Submitted!
                                </h3>
                                <p className="text-zinc-600 text-sm sm:text-base lg:text-[0.95vw] max-w-lg leading-relaxed">
                                    Thank you,{" "}
                                    <span className="font-semibold text-zinc-900">
                                        {formData.fullName}
                                    </span>
                                    ! We have received your application for{" "}
                                    <span className="font-semibold text-zinc-900">
                                        {job.title}
                                    </span>
                                    . Our recruiting team will review your profile and reach out via{" "}
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
                                            linkedin: "",
                                        });
                                        setResumeFile(null);
                                    }}
                                    className="mt-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all cursor-pointer"
                                >
                                    Submit Another Application
                                </button>
                            </div>
                        ) : (
                            /* Application Form */
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5 sm:gap-6 lg:gap-[1.4vw]"
                            >
                                {/* Full Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-[1.2vw]">
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="fullName"
                                            className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
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
                                            className="w-full px-4 py-3 sm:py-3.5 lg:px-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="email"
                                            className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
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
                                            className="w-full px-4 py-3 sm:py-3.5 lg:px-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number & Age */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-[1.2vw]">
                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="phone"
                                            className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
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
                                            className="w-full px-4 py-3 sm:py-3.5 lg:px-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label
                                            htmlFor="age"
                                            className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
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
                                            placeholder="Your age (e.g. 26)"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 sm:py-3.5 lg:px-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Address, City, State, Zip Code */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="address"
                                        className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
                                    >
                                        Address, City, State, Zip Code{" "}
                                        <span className="text-primary">*</span>
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        rows={3}
                                        placeholder="Enter your current residential address, city, state, postal code"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 sm:py-3.5 lg:px-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y"
                                    />
                                </div>

                                {/* LinkedIn Profile Link */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="linkedin"
                                        className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
                                    >
                                        LinkedIn Profile Link{" "}
                                        <span className="text-primary">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                            <svg
                                                className="w-4 h-4 lg:w-[1vw] lg:h-[1vw] text-[#0077B5]"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="linkedin"
                                            name="linkedin"
                                            type="url"
                                            required
                                            placeholder="https://www.linkedin.com/in/yourprofile"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 sm:py-3.5 lg:pl-[2.6vw] lg:pr-[1.1vw] lg:py-[0.8vw] rounded-xl border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 text-sm sm:text-base lg:text-[0.95vw] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Resume PDF Upload */}
                                <div className="flex flex-col gap-1.5">
                                    <label
                                        htmlFor="resumePdf"
                                        className="text-xs sm:text-sm lg:text-[0.82vw] font-medium text-zinc-700"
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
                                            className={`w-full border-2 border-dashed rounded-2xl p-6 sm:p-8 lg:p-[2vw] flex flex-col items-center justify-center text-center cursor-pointer transition-all ${fileError
                                                ? "border-red-400 bg-red-50/50"
                                                : "border-zinc-300 bg-white hover:border-primary hover:bg-red-50/20"
                                                }`}
                                        >
                                            <div className="w-12 h-12 lg:w-[3vw] lg:h-[3vw] rounded-full bg-red-50 text-primary flex items-center justify-center mb-3">
                                                <svg
                                                    className="w-6 h-6 lg:w-[1.5vw] lg:h-[1.5vw]"
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
                                            <p className="text-sm sm:text-base lg:text-[0.95vw] font-semibold text-zinc-900">
                                                Click to upload your resume or drag & drop
                                            </p>
                                            <p className="text-xs sm:text-sm lg:text-[0.8vw] text-zinc-500 mt-1">
                                                PDF file format only (Max 10MB)
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="w-full border border-emerald-300 bg-emerald-50/50 rounded-2xl p-4 sm:p-5 lg:p-[1.2vw] flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 lg:w-[2.5vw] lg:h-[2.5vw] rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    PDF
                                                </div>
                                                <div className="flex flex-col text-left truncate">
                                                    <span className="text-sm sm:text-base lg:text-[0.95vw] font-semibold text-zinc-900 truncate">
                                                        {resumeFile.name}
                                                    </span>
                                                    <span className="text-xs lg:text-[0.78vw] text-zinc-500">
                                                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="p-2 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                                                title="Remove file"
                                            >
                                                <svg
                                                    className="w-5 h-5 lg:w-[1.2vw] lg:h-[1.2vw]"
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
                                        <p className="text-xs sm:text-sm text-red-500 font-medium mt-1">
                                            {fileError}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    {/* <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto px-8 py-3.5 sm:py-4 lg:px-[2.5vw] lg:py-[1vw] rounded-xl bg-primary text-white font-semibold text-base lg:text-[1.1vw] hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                    />
                                                </svg>
                                                <span>Submitting Application...</span>
                                            </>
                                        ) : (
                                            <span>Submit Application</span>
                                        )}
                                    </button> */}
                                    <Button
                                        label={isSubmitting ? "Submitting..." : "Apply Now"}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="rounded-full"
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    {/* ================= RIGHT COLUMN: JOB DETAILS SIDEBAR CARD ================= */}
                    <aside className="lg:col-span-4 w-full sticky top-28">
                        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 lg:p-[2vw] flex flex-col gap-6 lg:gap-[1.5vw]">
                            {/* Card Heading */}
                            <h3 className="text-xl sm:text-2xl lg:text-[1.5vw] font-bold text-zinc-950 pb-4 border-b border-zinc-100">
                                Job Details
                            </h3>

                            {/* Details List Matching Screenshot */}
                            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-[1.3vw]">
                                {/* Department */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                                            <path d="M6 6h10" />
                                            <path d="M6 10h10" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Department
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.department}
                                        </span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
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
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Location
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Job Type */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect width="18" height="18" x="3" y="4" rx="2" />
                                            <path d="M3 10h18" />
                                            <path d="M16 2v4" />
                                            <path d="M8 2v4" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Job Type
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Qualifications */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m18 16 4-4-4-4" />
                                            <path d="m6 8-4 4 4 4" />
                                            <path d="m14.5 4-5 16" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Qualifications
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.qualifications}
                                        </span>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                            <path d="M4 22h16" />
                                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Experience
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.experience}
                                        </span>
                                    </div>
                                </div>

                                {/* Offered Salary */}
                                <div className="flex items-start gap-3.5 lg:gap-[0.9vw]">
                                    <div className="w-9 h-9 lg:w-[2.4vw] lg:h-[2.4vw] rounded-xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
                                        <svg
                                            className="w-4 h-4 lg:w-[1.1vw] lg:h-[1.1vw]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 2v20" />
                                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs sm:text-sm lg:text-[0.82vw] font-semibold text-zinc-900">
                                            Offered Salary
                                        </span>
                                        <span className="text-xs sm:text-sm lg:text-[0.85vw] text-zinc-500 font-medium mt-0.5">
                                            {job.salary}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
