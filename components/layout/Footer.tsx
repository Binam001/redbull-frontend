"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SparklesCore } from "../shared/Sparkles";

interface FooterLink {
  label: string;
  href?: string;
  isExternal?: boolean;
}

interface FooterSection {
  title: string;
  type?: "links" | "address";
  items: FooterLink[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Energy Drinks", href: "/energy-drinks/red-bull-250ml" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Careers", href: "/career" },
      { label: "Company", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Location",
    type: "address",
    items: [
      {
        label: "Maharajgunj,\nKathmandu, Nepal",
        href: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23762.23085371139!2d85.32150772974944!3d27.70874025757573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb193854e20abb%3A0x8ff36d1f00e10346!2sMaharajgunj%2C%20Kathmandu%2C%20Bagmati%20Province%2044600!5e0!3m2!1sen!2snp!4v1792751300565!5m2!1sen!2snp",
        isExternal: true,
      },
      { label: "01-4546409", href: "tel:014546409" },
    ],
  },
  {
    title: "Socials",
    items: [
      {
        label: "Facebook",
        href: "https://facebook.com/redbull",
        isExternal: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/red-bull",
        isExternal: true,
      },
      {
        label: "Instagram",
        href: "https://instagram.com/redbull",
        isExternal: true,
      },
    ],
  },
];

function LinkIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17L17 7M17 7H7M17 7V17"
      />
    </svg>
  );
}

const FooterContent = () => {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden min-h-[92vh] flex flex-col justify-between pt-16 sm:pt-20 pb-6 px-6 sm:px-10 lg:px-16 z-10">
      {/* Background Secondary (#233971) Blue Glow Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Layer 1: Ambient Atmospheric Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 95% 75% at 50% 82%, rgba(35, 57, 113, 0.65) 0%, rgba(35, 57, 113, 0.42) 32%, rgba(20, 32, 68, 0.18) 58%, transparent 85%)",
            filter: "blur(70px)",
          }}
        />

        {/* Layer 2: Primary Curved Dome Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 50% 84%, rgba(48, 82, 175, 0.95) 0%, rgba(35, 57, 113, 0.85) 28%, rgba(26, 44, 92, 0.45) 55%, rgba(12, 20, 45, 0.08) 78%, transparent 100%)",
            filter: "blur(50px)",
          }}
        />

        {/* Layer 3: Hot Saturated Core Highlight behind Logo & Slogan */}
        <div
          className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[85vw] max-w-5xl h-[55%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 70% at 50% 65%, rgba(65, 115, 230, 0.95) 0%, rgba(45, 78, 165, 0.8) 30%, rgba(35, 57, 113, 0.4) 60%, transparent 85%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* Main Content (relative z-10) */}
      <div className="relative z-10 w-full flex flex-col justify-between flex-1">
        {/* Top Section: Links (Navigation & Company), Location & Socials matching the reference layout */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6 sm:gap-x-10 lg:gap-16 pt-2 sm:pt-4">
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={idx} className="text-left flex flex-col items-start">
              <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight mb-3.5">
                {section.title}
              </h4>

              <ul className="space-y-3.5 text-sm sm:text-[15px] font-medium text-white/80 text-left">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {!item.href ? (
                      <span className="whitespace-pre-line text-white/70">{item.label}</span>
                    ) : item.isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-end gap-1.5 text-white/70 hover:text-white group transition-colors duration-200"
                      >
                        <span className="whitespace-pre-line text-left">{item.label}</span>
                        <LinkIcon className="w-3.5 h-3.5 mb-0.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                      </a>
                    ) : item.href.startsWith("tel:") || item.href.startsWith("mailto:") ? (
                      <a
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-white/70 hover:text-white group transition-colors duration-200"
                      >
                        <span className="whitespace-pre-line text-left">{item.label}</span>
                        <LinkIcon className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1.5 hover:text-white group transition-colors duration-200"
                      >
                        <span className="whitespace-pre-line text-left">{item.label}</span>
                        <LinkIcon className="w-3.5 h-3.5 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom / Dome Section: Red Bull Logo on bottom and Unleash Your BABAAL Energy */}
        <div className="w-full flex flex-col items-center justify-center text-center my-auto py-2 sm:py-3 select-none">
          <div className="relative w-24 sm:w-32 md:w-40 lg:w-120 aspect-4/2 drop-shadow-[0_0_35px_rgba(48,82,175,0.9)]">
            <Image
              src="/logo.svg"
              alt="Red Bull Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight sm:tracking-tighter uppercase drop-shadow-[0_0_35px_rgba(48,82,175,0.85)] mt-1 sm:mt-2 leading-none">
            Unleash Your BABAAL Energy!!
          </h2>
        </div>

        {/* Bottom Bar Section: Copyright on left, WebX on right */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/20 pt-4 sm:pt-5 mx-auto">
          {/* Copyright */}
          <span className="text-xs xl:text-[0.9vw] font-medium tracking-wide text-center sm:text-left select-none text-white/80">
            Copyright © {new Date().getFullYear()} Red Bull. All Rights
            Reserved.
          </span>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <p className="text-xs xl:text-[0.9vw] text-white/80">
              Designed & Developed by
            </p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.webxnepal.com"
            >
              <div className="relative w-[12vw] md:w-[6vw] xl:w-[3vw]">
                <Image
                  src="/webx-white-logo.png"
                  alt="WebX Logo"
                  width={200}
                  height={100}
                  className="w-full h-auto md:mb-1"
                />
                <div
                  className="absolute -bottom-[100%] left-1/2 -translate-x-1/2 w-full h-full z-40 border-none outline-none"
                  style={{ border: "none", outline: "none" }}
                >
                  {/* Gradients */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-white to-transparent h-px w-[120%]" />

                  {/* Core component */}
                  <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={1200}
                    className="w-full h-full"
                    particleColor="#e4e3e2"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on contact page
  if (pathname?.startsWith("/contact")) {
    return null;
  }

  return <FooterContent />;
};

export default Footer;
