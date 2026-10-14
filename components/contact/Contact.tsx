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
    <section className="relative w-full min-h-screen bg-black text-white flex items-center justify-center overflow-hidden py-24 sm:py-28 lg:py-[5vw] px-4 sm:px-8 lg:px-[5vw] select-none">
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
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 w-full lg:max-w-[90vw] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0">
        {/* Left Column: Quote & Direct Contact Details */}
        <div className="w-full lg:w-[28vw] flex flex-col justify-center space-y-6 sm:space-y-8 lg:space-y-[1.8vw] text-left pt-6 sm:pt-10 lg:pt-[4vw] xl:pt-[6vw]">
          <blockquote className="space-y-3 sm:space-y-4 lg:space-y-[0.6vw] max-w-xl lg:max-w-none">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.2vw] font-medium tracking-tight text-white leading-tight lg:leading-[1.18]">
              “Great things happen when people are given the energy to go further.”
            </h1>
            <footer className="text-sm sm:text-base lg:text-[0.9vw] text-white/70 font-normal">
              — Red Bull Nepal
            </footer>
          </blockquote>

          {/* Elegant Frosted Contact Details Card */}
          <div className="max-w-md lg:max-w-none w-full lg:w-[24vw] rounded-2xl sm:rounded-3xl lg:rounded-[1.2vw] bg-white/[0.07] border border-white/20 backdrop-blur-xl p-5 sm:p-6 lg:p-[1.2vw] shadow-[0_20px_45px_rgba(0,0,0,0.4)] space-y-4 lg:space-y-[0.8vw]">
            {/* Address */}
            <div className="flex items-start gap-3.5 lg:gap-[0.7vw]">
              <div className="w-9 h-9 lg:w-[2vw] lg:h-[2vw] rounded-xl lg:rounded-[0.5vw] bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white/80 mt-0.5 lg:mt-[0.1vw]">
                <svg className="w-4 h-4 lg:w-[0.95vw] lg:h-[0.95vw] text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] lg:text-[0.6vw] font-semibold uppercase tracking-wider text-white/50">Address</span>
                <span className="text-xs sm:text-sm lg:text-[0.8vw] font-medium text-white/95 leading-snug">Maharajgunj, Kathmandu, Nepal</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Phone */}
            <div className="flex items-center gap-3.5 lg:gap-[0.7vw]">
              <div className="w-9 h-9 lg:w-[2vw] lg:h-[2vw] rounded-xl lg:rounded-[0.5vw] bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white/80">
                <svg className="w-4 h-4 lg:w-[0.95vw] lg:h-[0.95vw] text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] lg:text-[0.6vw] font-semibold uppercase tracking-wider text-white/50">Phone</span>
                <a
                  href="tel:014546409"
                  className="text-xs sm:text-sm lg:text-[0.8vw] font-medium text-white/95 hover:text-white transition-colors duration-200"
                >
                  01-4546409
                </a>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Email */}
            <div className="flex items-center gap-3.5 lg:gap-[0.7vw]">
              <div className="w-9 h-9 lg:w-[2vw] lg:h-[2vw] rounded-xl lg:rounded-[0.5vw] bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-white/80">
                <svg className="w-4 h-4 lg:w-[0.95vw] lg:h-[0.95vw] text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] lg:text-[0.6vw] font-semibold uppercase tracking-wider text-white/50">Email</span>
                <a
                  href="mailto:info@sarasbeverages.com"
                  className="text-xs sm:text-sm lg:text-[0.8vw] font-medium text-white/95 hover:text-white transition-colors duration-200"
                >
                  info@sarasbeverages.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphism Floating Form Card (same style as left card) */}
        <div className="w-full max-w-xl lg:w-[33vw] lg:max-w-none flex justify-center lg:justify-end pt-12">
          <div className="relative w-full bg-white/[0.07] border border-white/20 backdrop-blur-xl rounded-3xl lg:rounded-[1.5vw] px-6 sm:px-8 md:px-10 lg:px-[2.2vw] py-8 sm:py-10 md:py-11 lg:py-[2.2vw] shadow-[0_20px_45px_rgba(0,0,0,0.4)] overflow-hidden">
            <form onSubmit={handleSubmit} className="relative z-10 space-y-5 sm:space-y-6 lg:space-y-[1.1vw] [color-scheme:dark]">
              {/* Row 1: Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-[0.9vw]">
                <div className="flex flex-col space-y-1.5 lg:space-y-[0.3vw]">
                  <label
                    htmlFor="name"
                    className="text-[11px] sm:text-xs lg:text-[0.65vw] font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
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
                    className="w-full [color-scheme:dark] bg-white/[0.07] hover:bg-white/[0.12] focus:bg-white/[0.16] border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-xl lg:rounded-[0.6vw] px-4 py-3 lg:px-[0.9vw] lg:py-[0.6vw] text-sm lg:text-[0.8vw] text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-1.5 lg:space-y-[0.3vw]">
                  <label
                    htmlFor="phoneNumber"
                    className="text-[11px] sm:text-xs lg:text-[0.65vw] font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
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
                    className="w-full [color-scheme:dark] bg-white/[0.07] hover:bg-white/[0.12] focus:bg-white/[0.16] border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-xl lg:rounded-[0.6vw] px-4 py-3 lg:px-[0.9vw] lg:py-[0.6vw] text-sm lg:text-[0.8vw] text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Address & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-[0.9vw]">
                <div className="flex flex-col space-y-1.5 lg:space-y-[0.3vw]">
                  <label
                    htmlFor="address"
                    className="text-[11px] sm:text-xs lg:text-[0.65vw] font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
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
                    className="w-full [color-scheme:dark] bg-white/[0.07] hover:bg-white/[0.12] focus:bg-white/[0.16] border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-xl lg:rounded-[0.6vw] px-4 py-3 lg:px-[0.9vw] lg:py-[0.6vw] text-sm lg:text-[0.8vw] text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>

                <div className="flex flex-col space-y-1.5 lg:space-y-[0.3vw]">
                  <label
                    htmlFor="email"
                    className="text-[11px] sm:text-xs lg:text-[0.65vw] font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
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
                    className="w-full [color-scheme:dark] bg-white/[0.07] hover:bg-white/[0.12] focus:bg-white/[0.16] border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-xl lg:rounded-[0.6vw] px-4 py-3 lg:px-[0.9vw] lg:py-[0.6vw] text-sm lg:text-[0.8vw] text-white placeholder:text-white/50 outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="flex flex-col space-y-1.5 lg:space-y-[0.3vw]">
                <label
                  htmlFor="message"
                  className="text-[11px] sm:text-xs lg:text-[0.65vw] font-semibold uppercase tracking-wider text-white/90 drop-shadow-sm"
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
                  className="w-full [color-scheme:dark] bg-white/[0.07] hover:bg-white/[0.12] focus:bg-white/[0.16] border border-white/20 focus:border-white/50 focus:ring-1 focus:ring-white/30 rounded-xl lg:rounded-[0.6vw] px-4 py-3 lg:px-[0.9vw] lg:py-[0.6vw] text-sm lg:text-[0.8vw] text-white placeholder:text-white/50 outline-none resize-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] backdrop-blur-md selection:bg-white/30 selection:text-white"
                />
              </div>

              {/* Row 4: Agreement Checkbox */}
              <div className="flex items-center gap-2.5 lg:gap-[0.5vw] pt-1 lg:pt-[0.2vw]">
                <input
                  id="agreement"
                  type="checkbox"
                  required
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 lg:w-[0.9vw] lg:h-[0.9vw] rounded lg:rounded-[0.2vw] bg-white/20 border-white/40 text-red-600 focus:ring-0 cursor-pointer accent-[#cb2026]"
                />
                <label htmlFor="agreement" className="text-xs lg:text-[0.7vw] text-white/90 select-none cursor-pointer">
                  I agree to Red Bull&apos;s <span className="text-white font-medium underline underline-offset-2">Terms of Service</span> and <span className="text-white font-medium underline underline-offset-2">Privacy Policy</span>.
                </label>
              </div>

              {/* Row 5: Action Button & Feedback */}
              <div className="pt-3 sm:pt-4 lg:pt-[0.8vw] flex flex-col items-center justify-center space-y-2 lg:space-y-[0.4vw]">
                <Button
                  label="Submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full lg:px-[2.2vw] lg:py-[0.6vw] lg:text-[0.85vw]"
                />

                {submitted && (
                  <span className="text-[11px] lg:text-[0.7vw] text-emerald-400 font-medium tracking-wide text-center">
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