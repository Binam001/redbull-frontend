"use client";

import React from "react";
import { motion } from "framer-motion";

interface EventsHeroProps {
  title?: string;
  description?: string;
  kicker?: string;
}

export default function EventsHero({
  title = "WHERE LEGENDS ARE BORN",
  description = "Experience the world's most electrifying sports spectacles live as athletes shatter boundaries and defy gravity.",
}: EventsHeroProps) {
  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden select-none bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transform scale-100 will-change-transform"
      >
        <source src="/videos/events-hero-1.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Gradient Vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/60 via-transparent to-black/40" />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-transparent to-black/50" />

      {/* Bottom-Right Glassmorphism Card */}
      <div className="absolute right-4 bottom-8 sm:right-8 sm:bottom-10 md:right-12 md:bottom-12 lg:right-16 lg:bottom-14 z-20 w-[calc(100%-2rem)] max-w-sm sm:max-w-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-white/[0.08] backdrop-blur-xl sm:backdrop-blur-2xl p-6 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/30 hover:bg-white/[0.12]"
        >
          {/* Subtle Glass Sheen Highlight */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/30" />
          <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-2.5 sm:gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase leading-tight font-primary">
              {title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-sans">
              {description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
