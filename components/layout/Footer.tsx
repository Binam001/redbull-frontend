"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { SparklesCore } from "../shared/Sparkles";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks, contactLinks } from "@/constants";

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
  const textRef = useRef<HTMLHeadingElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
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

      // Initial states set via GSAP to prevent inline style parsing conflicts
      if (textRef.current) {
        gsap.set(textRef.current, { x: "-70vw", opacity: 0 });
      }
      if (gradientRef.current) {
        gsap.set(gradientRef.current, { y: "100%", opacity: 0 });
      }

      // Text travels from left with scroll and centers as video completes (slowed down and smoothed)
      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            x: "0vw",
            ease: "power1.inOut",
            duration: 1.6,
          },
          0.4,
        );

        tl.to(
          textRef.current,
          {
            opacity: 1,
            ease: "power1.out",
            duration: 0.6,
          },
          0.4,
        );
      }

      // Black overlay rises up from bottom as text enters, covering lower half fully in black with top gradient
      if (gradientRef.current) {
        tl.to(
          gradientRef.current,
          {
            y: "0%",
            opacity: 1,
            ease: "power1.out",
            duration: 1.6,
          },
          0.4,
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
        <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-transparent z-20" />
        <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="relative w-full h-full object-cover object-top z-10"
          />

          {/* Smooth black overlay gradient transitioning smoothly from black to transparent */}
          <div
            ref={gradientRef}
            className="absolute inset-x-0 bottom-0 h-[80%] pointer-events-none z-20 will-change-transform"
            style={{
              background:
                "linear-gradient(to top, #000000 0%, #000000 30%, rgba(0, 0, 0, 0.96) 38%, rgba(0, 0, 0, 0.88) 46%, rgba(0, 0, 0, 0.74) 55%, rgba(0, 0, 0, 0.55) 65%, rgba(0, 0, 0, 0.35) 75%, rgba(0, 0, 0, 0.18) 84%, rgba(0, 0, 0, 0.06) 92%, rgba(0, 0, 0, 0) 100%)",
            }}
          />

          {/* Animated Slogan on Scroll */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25 px-6 pb-24 sm:pb-32 md:pb-36 overflow-hidden">
            <h2
              ref={textRef}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-wider sm:tracking-tighter text-white text-center will-change-transform select-none max-w-5xl leading-[1.05]"
            >
              GIVES YOU WiiiNGS
            </h2>
          </div>

          {/* Bottom Footer Overlay UI */}
          <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-auto bg-linear-to-t from-[#060b0e]/95 via-[#060b0e]/85 to-transparent pt-12 pb-5 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 text-white font-sans">
            {/* Upper Links & Info Section (3 Columns) */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-4 w-full">
              {/* Col 1 (Left): Links on a row */}
              <div className="space-y-2">
                <div className="border-b border-white/60 pb-1 mb-2.5 w-14">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Links
                  </h4>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-[13px] text-white/80 font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={
                        link.href === "#"
                          ? link.dropdownItems?.[0]?.href || "#"
                          : link.href
                      }
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Col 2 (Center): Round Social Buttons */}
              <div className="flex items-center justify-start md:justify-center gap-3 pt-2 md:pt-4 self-start md:self-center">
                <div
                  // href="mailto:contact@redbull.com"
                  aria-label="Email"
                  className="size-9 sm:size-10 rounded-full border border-white/70 flex items-center justify-center text-white hover:bg-white/15 hover:border-white transition-all duration-200 backdrop-blur-xs"
                >
                  <Icon icon="mdi:email" className="size-4.5" />
                </div>
                <div
                  // href="https://facebook.com"
                  // target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="size-9 sm:size-10 rounded-full border border-white/70 flex items-center justify-center text-white hover:bg-white/15 hover:border-white transition-all duration-200 backdrop-blur-xs"
                >
                  <Icon icon="mdi:facebook" className="size-5" />
                </div>
                <div
                  // href="https://instagram.com"
                  // target="_blank"
                  // rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="size-9 sm:size-10 rounded-full border border-white/70 flex items-center justify-center text-white hover:bg-white/15 hover:border-white transition-all duration-200 backdrop-blur-xs"
                >
                  <Icon icon="mdi:instagram" className="size-4.5" />
                </div>
              </div>

              {/* Col 3 (Right): Contact Info on a single row */}
              <div className="text-left md:text-right space-y-2 flex flex-col md:items-end">
                <div className="border-b border-white/60 pb-1 mb-2.5 w-16 md:self-end">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Contact
                  </h4>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center md:justify-end gap-x-4 sm:gap-x-6 gap-y-1 text-xs sm:text-[13px] text-white/85 font-medium whitespace-nowrap">
                  {contactLinks.map((contact) => (
                    <div
                      key={contact.title}
                      // href={contact.href}
                      // target={contact.title === "Address" ? "_blank" : undefined}
                      // rel={
                      //   contact.title === "Address"
                      //     ? "noopener noreferrer"
                      //     : undefined
                      // }
                      className="flex items-center gap-1 hover:text-white transition-colors duration-200"
                    >
                      <span>{contact.detail}</span>
                      <Icon icon={contact.icon} className="size-3.5 opacity-75" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thin Divider Line */}
            {/* <div className="w-full h-px bg-white/20 my-4 sm:my-5" /> */}

            {/* Bottom Bar Section */}
            {/* <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/75">
          
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                Traffic<span className="text-[#CB2026]">Bot</span>
              </span>
              <span className="text-[10px] font-bold text-white/60">®</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-white/70">
              <Link
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                End User License Agreement
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-white transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Icon icon="logos:mastercard" className="h-3.5 w-auto" />
              <Icon icon="logos:visa" className="h-2.5 w-auto" />
              <Icon icon="logos:paypal" className="h-3.5 w-auto" />
              <Icon icon="fontisto:american-express" className="h-3.5 w-auto text-[#007AC1]" />
            </div>

            <div className="text-[11px] sm:text-xs text-white/60 text-center lg:text-right shrink-0">
              <span>
                Coded and designed by myrusdesign. All rights reserved to
                TrafficBot.uk
              </span>
            </div>
          </div> */}
            {/* Bottom Bar Section */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/20 pt-6 mt-6">
              {/* Copyright */}
              <span className="text-xs xl:text-[0.9vw] font-medium tracking-wide text-center sm:text-left select-none">
                Copyright © {new Date().getFullYear()} Red Bull. All Rights
                Reserved.
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
