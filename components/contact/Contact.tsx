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

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    }, 800);
  };

  return (
    <section className="relative w-full min-h-screen lg:h-screen lg:max-h-screen text-[#111111] pt-24 sm:pt-28 lg:pt-28 pb-8 lg:pb-10 px-6 sm:px-10 md:px-14 lg:px-16 xl:px-24 select-none flex flex-col justify-center overflow-x-hidden">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-stretch my-auto">
        {/* Left Column: Heading + Form */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-24">
          {/* Editorial Headline */}
          <div className="shrink-0">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5vw] xl:text-[5vw] uppercase tracking-tight text-secondary leading-[0.92]"
              style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
            >
              LET’S
              <br />
              CONTACT US
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-12">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs sm:text-sm font-black uppercase tracking-wider text-black/80"
                  style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
                >
                  NAME
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Input your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2 text-sm sm:text-base text-black placeholder:text-black/40 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs sm:text-sm font-black uppercase tracking-wider text-black/80"
                  style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Input your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2 text-sm sm:text-base text-black placeholder:text-black/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Phone Number & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="phoneNumber"
                  className="text-xs sm:text-sm font-black uppercase tracking-wider text-black/80"
                  style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
                >
                  PHONE NUMBER
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Input phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2 text-sm sm:text-base text-black placeholder:text-black/40 outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="address"
                  className="text-xs sm:text-sm font-black uppercase tracking-wider text-black/80"
                  style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
                >
                  ADDRESS
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Input your address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-black/30 focus:border-black py-2 text-sm sm:text-base text-black placeholder:text-black/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Row 3: Message */}
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="message"
                className="text-xs sm:text-sm font-black uppercase tracking-wider text-black/80"
                style={{ fontFamily: "'AcuminPro-Bold', sans-serif" }}
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                required
                placeholder="Input your message here"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-black/30 focus:border-black py-2 text-sm sm:text-base text-black placeholder:text-black/40 outline-none resize-none transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center gap-4">
              <Button
                label={isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                type="submit"
                // icon="mdi:arrow-right"
                disabled={isSubmitting}
                className="rounded-full "
              />

              {submitted && (
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 animate-fade-in">
                  ✓ Message received! We’ll be in touch soon.
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Hero Image covering the entire right vertical space */}
        <div className="lg:col-span-5 xl:col-span-5 flex w-full h-full min-h-[380px] lg:min-h-[780px]">
          <div className="relative w-full h-full min-h-[420px] lg:min-h-full rounded-3xl overflow-hidden  bg-black/5 group">
            <Image
              src="/images/contact/contact.jpg"
              alt="Contact Red Bull"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            {/* Filmic vignette overlay */}
            {/* <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none" /> */}
          </div>
        </div>
      </div>

      {/* Guarantee transparent input background even with browser autofill */}
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
          box-shadow: 0 0 0 1000px transparent inset !important;
          -webkit-text-fill-color: #000000 !important;
          caret-color: #000000 !important;
          transition: background-color 50000s ease-in-out 0s !important;
          background-color: transparent !important;
        }
      `}</style>
    </section>
  );
}