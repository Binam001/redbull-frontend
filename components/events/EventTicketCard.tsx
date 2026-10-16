"use client";

import React, { useState } from "react";
import { EventData } from "@/constants/events";

interface EventTicketCardProps {
  event: EventData;
}

export default function EventTicketCard({ event }: EventTicketCardProps) {
  const [copied, setCopied] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const formattedDate = event.date || "5 – 11 October 2026";
  const displayLocation =
    event.fullLocation || `${event.location}, ${event.country}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePurchase = (tierName: string) => {
    setPurchaseStatus(`Redirecting to checkout for ${tierName}...`);
    setTimeout(() => setPurchaseStatus(null), 2500);
  };

  return (
    <div className="relative z-30 w-full max-w-7xl mx-auto -mt-20 sm:-mt-28 md:-mt-36 px-4 sm:px-6">
      {/* ── Main Ticket Card Container ── */}
      <div className="relative bg-zinc-100 rounded-3xl  overflow-hidden">
        {/* Top & Bottom Semi-Circle Punch Cutouts for the Perforated Divider (Desktop) */}
        <div className="hidden lg:block absolute -top-4 left-[58%] -translate-x-1/2 w-8 h-8 rounded-full bg-black/90 border border-neutral-800 shadow-inner z-20 pointer-events-none" />
        <div className="hidden lg:block absolute -bottom-4 left-[58%] -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-neutral-200/80 shadow-inner z-20 pointer-events-none" />

        {/* Vertical Perforated Dashed Line (Desktop) */}
        <div className="hidden lg:block absolute top-4 bottom-4 left-[58%] border-r-2 border-dashed border-neutral-200/90 pointer-events-none z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* ══════════════ LEFT COLUMN: Event Details ══════════════ */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-6">
            <div>
              {/* Status Badge & Category Row */}
              <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-4">
                {/* Live Soon / Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full  text-secondary text-xs font-bold tracking-wider uppercase ">
                  <span className="w-2 h-2 rounded-full bg-[#cb2026] animate-pulse" />
                  <span>{event.statusCtaText || "Tickets LIVE NOW!"}</span>
                </div>

                {/* Sport Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-primary text-white">
                  {event.sport || "Official Event"}
                </div>
              </div>

              {/* Event Title */}
              <h2 className="text-2xl sm:text-3xl md:text-5xl text-secondary tracking-tight leading-tight">
                {event.title}
              </h2>

              {/* Event Meta List (Date & Time, Location) */}
              <div className="mt-6 space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#cb2026]/10 text-[#cb2026] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    {/* <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Date & Time</p> */}
                    <p className="text-sm sm:text-base font-semibold text-neutral-800">{formattedDate}</p>
                    <p className="text-xs text-neutral-500 font-medium">10:00 AM – 10:00 PM (Local Time)</p>
                  </div>
                </div>

                {/* Address / Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-[#cb2026]/10 text-[#cb2026] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    {/* <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Venue Location</p> */}
                    <p className="text-sm sm:text-base font-semibold text-neutral-800">{displayLocation}</p>
                    <p className="text-xs text-neutral-500 font-medium">{event.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share With Friends Section */}
            <div className="pt-4 border-t border-neutral-100">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">
                Share With Friends
              </p>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <button
                  type="button"
                  aria-label="Share on Facebook"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : ""
                      )}`,
                      "_blank"
                    )
                  }
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#1877F2] hover:text-white text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* X / Twitter */}
                <button
                  type="button"
                  aria-label="Share on X"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        event.title
                      )}&url=${encodeURIComponent(
                        typeof window !== "undefined" ? window.location.href : ""
                      )}`,
                      "_blank"
                    )
                  }
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>

                {/* Email */}
                <button
                  type="button"
                  aria-label="Share via Email"
                  onClick={() =>
                  (window.location.href = `mailto:?subject=${encodeURIComponent(
                    event.title
                  )}&body=${encodeURIComponent(
                    `Check out ${event.title}: ` +
                    (typeof window !== "undefined" ? window.location.href : "")
                  )}`)
                  }
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-[#EA4335] hover:text-white text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>

                {/* Copy Link Button */}
                <button
                  type="button"
                  aria-label="Copy Page Link"
                  onClick={handleCopyLink}
                  className="relative w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  {copied && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-white shadow whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Divider */}
          <div className="lg:hidden w-full relative my-2">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200" />
            <div className="w-full border-t-2 border-dashed border-neutral-200" />
          </div>

          {/* ══════════════ RIGHT COLUMN: Two Tickets (from Image 3) ══════════════ */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 bg-neutral-50/70 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Official Spectator Passes
              </span>
              {/* <span className="text-[11px] font-bold text-[#cb2026] uppercase tracking-wider">
                Limited Availability
              </span> */}
            </div>

            {/* ── Ticket 1: 10 Passes / Single Day Pass ── */}
            <div className="relative bg-[#18181b] text-white rounded-2xl p-4 sm:p-5  transition-all overflow-hidden flex items-stretch justify-between group">
              {/* Perforated Stub Notches */}
              <div className="absolute -top-2.5 right-[68px] sm:right-[76px] w-5 h-5 rounded-full bg-neutral-50 border border-neutral-300 z-10" />
              <div className="absolute -bottom-2.5 right-[68px] sm:right-[76px] w-5 h-5 rounded-full bg-neutral-50 border border-neutral-300 z-10" />

              {/* Perforated Divider Line */}
              <div className="absolute top-2.5 bottom-2.5 right-[77px] sm:right-[85px] border-r border-dashed border-neutral-700" />

              {/* Ticket Left Body */}
              <div className="flex-1 pr-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    1 DAY PASS
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">
                    Standard access to all tournament matches & fan zones.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">


                  <button
                    type="button"
                    onClick={() => handlePurchase("1 Day Pass")}
                    className="px-4 py-1.5 rounded-full bg-[#cb2026] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    Purchase
                  </button>
                  <div className="rounded px-2.5 py-0.5 bg-neutral-900/60">
                    <span className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                      Rs 1000
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Right Stub: Barcode */}
              <div className="w-[68px] sm:w-[76px] flex flex-col items-center justify-center shrink-0 pl-3">
                {/* SVG Barcode Graphic */}
                <svg className="h-16 w-10 text-white" viewBox="0 0 32 64" fill="currentColor">
                  <rect x="0" y="0" width="2" height="64" />
                  <rect x="3" y="0" width="1" height="64" />
                  <rect x="5" y="0" width="3" height="64" />
                  <rect x="9" y="0" width="1" height="64" />
                  <rect x="11" y="0" width="2" height="64" />
                  <rect x="14" y="0" width="4" height="64" />
                  <rect x="19" y="0" width="1" height="64" />
                  <rect x="21" y="0" width="3" height="64" />
                  <rect x="25" y="0" width="2" height="64" />
                  <rect x="28" y="0" width="1" height="64" />
                  <rect x="30" y="0" width="2" height="64" />
                </svg>
                <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 mt-1 uppercase">
                  RB-DAY
                </span>
              </div>
            </div>

            {/* ── Ticket 2: 40 Passes / VIP Weekend Pass ── */}
            <div className="relative bg-[#18181b] text-white rounded-2xl p-4 sm:p-5 transition-all overflow-hidden flex items-stretch justify-between group">
              {/* Perforated Stub Notches */}
              <div className="absolute -top-2.5 right-[68px] sm:right-[76px] w-5 h-5 rounded-full bg-neutral-50 border border-neutral-300 z-10" />
              <div className="absolute -bottom-2.5 right-[68px] sm:right-[76px] w-5 h-5 rounded-full bg-neutral-50 border border-neutral-300 z-10" />

              {/* Perforated Divider Line */}
              <div className="absolute top-2.5 bottom-2.5 right-[77px] sm:right-[85px] border-r border-dashed border-neutral-700" />

              {/* Ticket Left Body */}
              <div className="flex-1 pr-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                      VIP PASS
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#cb2026] text-white px-1.5 py-0.5 rounded">
                      HOT
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-medium">
                    Center-court premium seating & VIP hospitality lounge.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">


                  <button
                    type="button"
                    onClick={() => handlePurchase("VIP Pass")}
                    className="px-4 py-1.5 rounded-full bg-[#cb2026] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    Purchase
                  </button>
                  <div className=" rounded px-2.5 py-0.5 bg-neutral-900/60">
                    <span className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                      Rs 5000
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Right Stub: Barcode */}
              <div className="w-[68px] sm:w-[76px] flex flex-col items-center justify-center shrink-0 pl-3">
                {/* SVG Barcode Graphic */}
                <svg className="h-16 w-10 text-white" viewBox="0 0 32 64" fill="currentColor">
                  <rect x="0" y="0" width="3" height="64" />
                  <rect x="4" y="0" width="1" height="64" />
                  <rect x="6" y="0" width="2" height="64" />
                  <rect x="9" y="0" width="4" height="64" />
                  <rect x="14" y="0" width="1" height="64" />
                  <rect x="16" y="0" width="3" height="64" />
                  <rect x="20" y="0" width="2" height="64" />
                  <rect x="23" y="0" width="1" height="64" />
                  <rect x="25" y="0" width="3" height="64" />
                  <rect x="29" y="0" width="3" height="64" />
                </svg>
                <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 mt-1 uppercase">
                  RB-VIP
                </span>
              </div>
            </div>

            {/* Purchase Toast status if triggered */}
            {purchaseStatus && (
              <div className="mt-1 text-center text-xs font-semibold text-[#cb2026] bg-[#cb2026]/10 py-1.5 px-3 rounded-lg animate-fade-in">
                {purchaseStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
