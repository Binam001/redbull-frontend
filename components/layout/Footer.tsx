"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navLinks } from "@/constants";
import { SparklesCore } from "../shared/Sparkles";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/redbull",
    handle: "@redbull",
  },
  { name: "YouTube", href: "https://youtube.com/redbull", handle: "Red Bull" },
  { name: "TikTok", href: "https://tiktok.com/@redbull", handle: "@redbull" },
  { name: "X / Twitter", href: "https://x.com/redbull", handle: "@redbull" },
  {
    name: "Facebook",
    href: "https://facebook.com/redbull",
    handle: "Red Bull",
  },
];

const Footer = () => {
  return (
    <footer className="relative w-full h-screen overflow-hidden select-none text-white">
      {/* Background Mountain Visual */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/footer-1.webp"
          alt="Mountain Visual"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle top gradient overlay to maximize readability against the sky */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Main Footer Header Overlay: Nav on Left, Socials on Right */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between pt-8 xl:pt-16 pb-8 p-x pointer-events-none">
        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16 pointer-events-auto">
          {/* ================= LEFT: Navigation Links ================= */}
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/20 backdrop-blur-md font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
              {/* <span className="size-1.5 rounded-full bg-primary animate-pulse" /> */}
              <span>Navigation</span>
            </div>

            <nav className="flex flex-col items-start gap-2.5 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider font-['Orbitron',_var(--font-primary),_sans-serif] text-white/90 hover:text-white transition-colors duration-200"
                >
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                    {link.name}
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary text-sm">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* ================= RIGHT: Social Links ================= */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/20 backdrop-blur-md font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
              {/* <span className="size-1.5 rounded-full bg-[#f59e0b] animate-pulse" /> */}
              <span>Connect</span>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2.5 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wider font-['Orbitron',_var(--font-primary),_sans-serif] text-white/90 hover:text-white transition-colors duration-200"
                >
                  <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary text-sm hidden md:inline-block">
                    ↗
                  </span>
                  <span className="group-hover:-translate-x-1.5 md:group-hover:-translate-x-1.5 transition-transform duration-200">
                    {social.name}
                  </span>
                  <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-primary text-sm md:hidden">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-background/80 pt-8">
          {/* Copyright */}
          <span className="text-xs xl:text-[0.9vw] font-medium tracking-wide text-center sm:text-left select-none">
            Copyright © {new Date().getFullYear()} Lumina. All Rights Reserved.
          </span>

          <div className="flex flex-col md:flex-row items-center gap-2">
            <p className="text-xs xl:text-[0.9vw]">Designed & Developed by</p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.webxnepal.com"
            >
              <div className="relative w-[12vw] md:w-[6vw] xl:w-[3vw]">
                <Image
                  src={"/webx-white-logo.png"}
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
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-white to-transparent h-px w-[120%]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-white to-transparent h-px w-[120%]" />

                  {/* Core component */}
                  <SparklesCore
                    background="transparent"
                    minSize={0.4}
                    maxSize={1}
                    particleDensity={1200}
                    className="w-full h-full"
                    particleColor={"#e4e3e2"}
                    // particleColor={isDarkTheme ? "#e4e3e2" : "#000000"}
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

export default Footer;
