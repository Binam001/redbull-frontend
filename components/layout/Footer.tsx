"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { SparklesCore } from "../shared/Sparkles";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Register plugins safely in the browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const FooterContent = () => {
  const currentStart = 1;
  const currentEnd = 116;
  const currentFolder = "/compressed-footer";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = currentEnd - currentStart + 1;

  // 1. Preload sequence frames
  useEffect(() => {
    setIsReady(false); // Reset ready status on path changes
    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loaded += 1;
      if (loaded === totalFrames) {
        setIsReady(true);
        // Find the first successfully loaded frame to size the canvas
        const firstValidImg = loadedImages.find((img) => img.naturalWidth > 0);
        if (canvasRef.current && firstValidImg) {
          const canvas = canvasRef.current;
          canvas.width = firstValidImg.naturalWidth;
          canvas.height = firstValidImg.naturalHeight;
          const context = canvas.getContext("2d");
          if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(firstValidImg, 0, 0, canvas.width, canvas.height);
          }
        }
      }
    };

    for (let i = currentStart; i <= currentEnd; i++) {
      const img = new window.Image();
      img.src = `${currentFolder}/${i}.webp`;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Don't block if a frame fails
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, [currentStart, currentEnd, totalFrames, currentFolder]);

  // 2. Scroll Scrub GSAP Timeline
  useGSAP(
    () => {
      if (!isReady || imagesRef.current.length === 0) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const obj = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=200%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          refreshPriority: 1,
        },
      });

      // Frame scrubbing animation (scrubs over the full duration of 2)
      tl.to(
        obj,
        {
          frame: totalFrames - 1,
          ease: "none",
          duration: 2,
          onUpdate: () => {
            const frameIndex = Math.round(obj.frame);
            const img = imagesRef.current[frameIndex];
            if (img && img.complete && img.naturalWidth > 0) {
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              }
            }
          },
        },
        0,
      );

      // Initial states set via GSAP
      if (gradientRef.current) {
        gsap.set(gradientRef.current, { y: "100%", opacity: 0 });
      }
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { opacity: 0 });
      }
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 0, y: 20 });
      }

      // Curved red gradient glow rises up
      if (gradientRef.current) {
        tl.to(
          gradientRef.current,
          {
            y: "0%",
            opacity: 1,
            ease: "power1.out",
            duration: 1.5,
          },
          0.3,
        );
      }

      // Overlay smoothly dims during scrub, and transitions to FULLY BLACK at the end
      if (overlayRef.current) {
        tl.to(
          overlayRef.current,
          {
            opacity: 0.45,
            ease: "power1.out",
            duration: 0.8,
          },
          0.3,
        );

        tl.to(
          overlayRef.current,
          {
            opacity: 1,
            ease: "power2.inOut",
            duration: 0.9,
          },
          1.1,
        );
      }

      // Content (links, logo, gives you wings, copyright) smoothly fades in when gradient & overlay are fully done
      if (contentRef.current) {
        tl.to(
          contentRef.current,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.6,
          },
          1.4,
        );
      }

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    {
      scope: containerRef,
      dependencies: [isReady, totalFrames],
    },
  );

  return (
    <footer className="w-full">
      <div
        ref={containerRef}
        className="relative w-full h-dvh overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-transparent z-[12] pointer-events-none" />
        <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="relative w-full h-full object-cover object-top z-10"
          />

          {/* Cinematic black overlay that smoothly transitions to fully black when reaching the end */}
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black pointer-events-none z-[15] will-change-[opacity]"
          />

          {/* Seamless Curved Primary #cb2026 Gradient Glow perfectly blending into the pitch-black overlay */}
          <div
            ref={gradientRef}
            className="absolute inset-x-0 bottom-0 h-[72vh] pointer-events-none z-20 will-change-transform overflow-visible"
            style={{
              maskImage: "linear-gradient(to top, black 0%, black 58%, transparent 98%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, black 58%, transparent 98%)",
            }}
          >
            {/* Layer 1: Ambient Atmospheric Glow - vast, velvety diffusion seamlessly fading into black */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 95% 85% at 50% 100%, rgba(203, 32, 38, 0.45) 0%, rgba(203, 32, 38, 0.3) 28%, rgba(170, 18, 24, 0.15) 52%, rgba(120, 8, 12, 0.05) 74%, rgba(50, 2, 4, 0.01) 88%, transparent 100%)",
                filter: "blur(60px)",
              }}
            />

            {/* Layer 2: Primary Curved Dome - defined half-circle arch rising behind the logo with exponential falloff */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 72% 70% at 50% 100%, rgba(255, 45, 55, 0.95) 0%, rgba(203, 32, 38, 0.88) 22%, rgba(203, 32, 38, 0.6) 42%, rgba(180, 16, 22, 0.3) 62%, rgba(140, 10, 15, 0.1) 78%, rgba(60, 3, 6, 0.015) 90%, transparent 100%)",
                filter: "blur(40px)",
              }}
            />

            {/* Layer 3: Hot Saturated Core Highlight - vibrant energetic bloom directly behind logo & slogan */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85vw] max-w-5xl h-[60%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 65% 80% at 50% 100%, rgba(255, 60, 70, 0.98) 0%, rgba(225, 28, 35, 0.82) 28%, rgba(203, 32, 38, 0.42) 58%, rgba(150, 12, 16, 0.1) 82%, transparent 100%)",
                filter: "blur(45px)",
              }}
            />
          </div>

          {/* Complete Footer Content: Revealed smoothly when gradient and overlay are done */}
          <div
            ref={contentRef}
            className="absolute inset-0 z-30 flex flex-col justify-between pt-8 sm:pt-10 md:pt-12 pb-5 px-6 sm:px-10 md:px-14 lg:px-20 text-white font-sans pointer-events-auto will-change-[opacity,transform] overflow-y-auto"
          >
            {/* Top Section: Links (Navigation & Company), Location & Socials matching the reference layout */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6 sm:gap-x-10 lg:gap-16 pt-2 sm:pt-4">
              {/* Column 1: Navigation */}
              <div>
                <ul className="space-y-3.5 text-sm sm:text-[15px] font-medium text-white/80 text-center">
                  <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight mb-3.5">
                    Links
                  </h4>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors duration-200"
                    >

                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/energy-drinks/red-bull-250ml"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Energy Drinks
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/events"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Events
                    </Link>
                  </li>

                </ul>
              </div>

              {/* Column 2: Company */}
              <div>
                <ul className="space-y-3.5 text-sm sm:text-[15px] font-medium text-white/80 text-center">
                  <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight mb-3.5">
                    Links
                  </h4>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors duration-200"
                    >

                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/career"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Company
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Location */}
              <div className="text-center">
                <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight mb-3.5">
                  Location
                </h4>
                <div className="space-y-1.5 text-sm sm:text-[15px] text-white/70">
                  <p>Uttardhoka, Lazimpat,</p>
                  <p>Kathmandu, Nepal</p>
                  <p className="pt-2">
                    <a
                      href="tel:+9779703464314"
                      className="hover:text-white transition-colors duration-200"
                    >
                      +977 970 3464314
                    </a>
                  </p>
                </div>
              </div>

              {/* Column 4: Socials */}
              <div className="text-center">
                <h4 className="text-sm sm:text-xl font-bold text-white tracking-tight mb-3.5">
                  Socials
                </h4>
                <ul className="space-y-3.5 text-sm sm:text-[15px] text-white/70">
                  <li>
                    <a
                      href="https://facebook.com/redbull"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/company/red-bull"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com/redbull"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom / Dome Section: Red Bull Logo on bottom and below it GIVES YOU WiiiNGS */}
            <div className="w-full flex flex-col items-center justify-center text-center my-auto py-2 sm:py-3 select-none">
              <div className="relative w-24 sm:w-32 md:w-40 lg:w-120 aspect-4/2 drop-shadow-[0_0_35px_rgba(203,32,38,0.9)]">
                <Image
                  src="/logo.svg"
                  alt="Red Bull Logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tight sm:tracking-tighter uppercase drop-shadow-[0_0_35px_rgba(203,32,38,0.85)] mt-1 sm:mt-2 leading-none">
                Unleash Your BABAAL <br /> Energy!!
              </h2>
            </div>

            {/* Bottom Bar Section: Copyright on left, WebX on right */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/20 pt-4 sm:pt-5 mx-auto">
              {/* Copyright */}
              <span className="text-xs xl:text-[0.9vw] font-medium tracking-wide text-center sm:text-left select-none text-white/80">
                Copyright © {new Date().getFullYear()} Red Bull. All Rights Reserved.
              </span>

              <div className="flex flex-col md:flex-row items-center gap-2">
                <p className="text-xs xl:text-[0.9vw] text-white/80">Designed & Developed by</p>
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
                      />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
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
