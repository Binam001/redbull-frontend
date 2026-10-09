"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../shared/Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    message: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        message: "",
      });
      setAgreed(false);

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 800);
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex items-center justify-center overflow-hidden py-24 sm:py-28 lg:py-20 px-6 sm:px-10 lg:px-24 select-none">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact/contact-2.jpg"
          alt="Contact Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Dark filmic / vignette overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" /> */}
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full  grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
        {/* Left Column: Quote & Direct Contact Pill */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8 text-left">
          <blockquote className="space-y-4 max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl  font-medium tracking-tight text-white ">
              “Great things happen when people are given the energy to go further.”
            </h1>
            <footer className="text-sm sm:text-base text-white font-normal">
              — Red Bull Nepal
            </footer>
          </blockquote>

          {/* Email Capsule Pill */}
          <div>
            <a
              href="mailto:contact@redbull.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs sm:text-sm text-white/90 hover:bg-white/15 hover:border-white/40 transition-all duration-300 shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@redbull.com</span>
            </a>
          </div>
        </div>

        {/* Right Column: White Glassmorphism Floating Form Card */}
        <div className="lg:col-span-7 xl:col-span-7 w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-white/[0.22] via-white/[0.14] to-white/[0.08] backdrop-blur-2xl backdrop-saturate-150 border border-white/30 rounded-3xl px-6 sm:px-8 md:px-10 py-8 sm:py-11 md:py-12 shadow-[0_25px_60px_rgba(0,0,0,0.45),0_0_35px_rgba(255,255,255,0.08),inset_0_1px_1px_rgba(255,255,255,0.6)] overflow-hidden">
            {/* Specular glass reflection rim at top */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

            {/* Ambient soft glow highlights */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-white/15 blur-3xl" />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 [color-scheme:dark]">
              {/* Row 1: Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
                  >
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full [color-scheme:dark] bg-white/[0.10] hover:bg-white/[0.15] focus:bg-white/[0.20] border border-white/25 focus:border-white/60 focus:ring-1 focus:ring-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="phoneNumber"
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
                  >
                    PHONE NUMBER
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+977..."
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full [color-scheme:dark] bg-white/[0.10] hover:bg-white/[0.15] focus:bg-white/[0.20] border border-white/25 focus:border-white/60 focus:ring-1 focus:ring-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Address & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="address"
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
                  >
                    ADDRESS
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Your address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full [color-scheme:dark] bg-white/[0.10] hover:bg-white/[0.15] focus:bg-white/[0.20] border border-white/25 focus:border-white/60 focus:ring-1 focus:ring-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
                  >
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full [color-scheme:dark] bg-white/[0.10] hover:bg-white/[0.15] focus:bg-white/[0.20] border border-white/25 focus:border-white/60 focus:ring-1 focus:ring-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell us about your message..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full [color-scheme:dark] bg-white/[0.10] hover:bg-white/[0.15] focus:bg-white/[0.20] border border-white/25 focus:border-white/60 focus:ring-1 focus:ring-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none resize-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                />
              </div>

              {/* Row 4: Agreement Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="agreement"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/20 border-white/40 text-red-600 focus:ring-0 cursor-pointer accent-[#cb2026]"
                />
                <label htmlFor="agreement" className="text-xs text-white/90 select-none cursor-pointer">
                  I agree to Red Bull&apos;s <span className="text-white font-medium underline underline-offset-2">Terms of Service</span> and <span className="text-white font-medium underline underline-offset-2">Privacy Policy</span>.
                </label>
              </div>

              {/* Row 5: Action Button & Feedback */}
              <div className="pt-4 flex flex-col items-center justify-center space-y-2">
                <Button
                  label="Submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full"
                />

                {submitted && (
                  <span className="text-[11px] text-emerald-400 font-medium tracking-wide text-center">
                    ✓ Message received! We’ll be in touch soon.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}