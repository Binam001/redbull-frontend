"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGLTF } from "@react-three/drei";
import NextImage from "next/image";

const STATIC_IMAGES = [
  // "/images/home/paras-khadka-4.webp",
  // "/images/home/rabindra-dhaat-1.webp",
  // "/images/home/ad-1.webp",
  // "/images/home/kavita-nepali-1.webp",
  // "/images/home/sky-diver-2.webp",
  // Hero Carousel Images
  "/images/home/hero/adventure-5.webp",
  "/images/home/hero/npl-2.webp",
  "/images/home/hero/adventure-6.webp",
  "/images/home/hero/adventure-4.webp",
  "/images/home/hero/adventure-2.webp",
  "/images/home/hero/adventure-1.webp",
];

const GLTF_MODELS = [
  "/models/red-bull-3-transformed.glb",
  "/models/redbull.glb",
];

const AUDIO_ASSETS = ["/audios/bgm.mp3"];

// Pre-generate image frame sequence paths
const footerFrames = Array.from(
  { length: 149 },
  (_, i) => `/images/footer-frames-2/${i + 1}.webp`,
);

const Preloader = () => {
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If directly loaded or refreshed from a subpage (e.g. /events), mark entered and bypass preloader
  useEffect(() => {
    if (pathname !== "/") {
      (window as Window & { hasEnteredIntro?: boolean }).hasEnteredIntro = true;
      setIsLoaded(true);
    }
  }, [pathname]);

  // Silent Background Asset Preloader
  useEffect(() => {
    // 1. Preload 3D Models in Three.js cache
    try {
      GLTF_MODELS.forEach((src) => {
        useGLTF.preload(src);
      });
    } catch {
      // Ignore in non-WebGL environments
    }

    const allImages = [...STATIC_IMAGES, ...footerFrames];

    // 2. Preload all static images & frame sequences in the background
    if (typeof window !== "undefined") {
      allImages.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }

    // 3. Preload 3D GLTF files into browser cache
    GLTF_MODELS.forEach((src) => {
      fetch(src).catch(() => {});
    });

    // 4. Preload Audio files
    AUDIO_ASSETS.forEach((src) => {
      const audio = new Audio();
      audio.src = src;
      audio.load();
    });
  }, []);

  const handleEnter = (withAudio: boolean) => {
    sessionStorage.setItem("hasEnteredSite", "true");
    localStorage.setItem("audioPreference", withAudio ? "on" : "off");
    (window as Window & { hasEnteredIntro?: boolean }).hasEnteredIntro = true;

    window.dispatchEvent(new Event("audioPreferenceChanged"));
    window.dispatchEvent(new Event("preloaderExit"));
    setIsExiting(true);
  };

  if (pathname !== "/" || isLoaded) return null;

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsLoaded(true);
        if (typeof window !== "undefined") {
          window.scrollTo(0, 0);
          window.dispatchEvent(new Event("scrollToTop"));
          window.dispatchEvent(new Event("preloaderComplete"));
          ScrollTrigger.refresh();
        }
      }}
    >
      {!isExiting && (
        <motion.div
          key="preloader-overlay"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-between py-10 sm:py-12 px-6 select-none will-change-transform"
        >
          {/* Top Logo / Brand Accent */}
          {/* <div className="w-full flex items-center justify-center opacity-60">
            <span className="font-['Orbitron',_var(--font-primary),_sans-serif] text-xs uppercase tracking-[0.3em] font-bold text-black">
              RED BULL • GIVES YOU WINGS
            </span>
          </div> */}

          {/* Center Stage: Enter Experience Controls */}
          <div className="relative w-full flex flex-col items-center justify-center text-center my-auto min-h-[220px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8 flex flex-col items-center"
            >
              <div className="space-y-4 flex flex-col items-center">
                <div className="relative w-36 sm:w-48 md:w-56 xl:w-[20vw] aspect-4/2">
                  <NextImage
                    src="/logo.svg"
                    alt="Red Bull Logo"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                {/* <p className="font-mono text-xs md:text-sm text-black/60 tracking-wider">
                  CHOOSE YOUR EXPERIENCE TO ENTER
                </p> */}
              </div>

              {/* 2 Buttons */}
              <div className="flex flex-col items-center gap-4 pt-4">
                {/* Fly with Music */}
                <button
                  type="button"
                  onClick={() => handleEnter(true)}
                  className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 rounded-full uppercase tracking-wider text-xs md:text-sm shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 cursor-pointer w-64 sm:w-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                  <span>Fly with Music</span>
                </button>

                {/* Fly without Music */}
                <button
                  type="button"
                  onClick={() => handleEnter(false)}
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-black/5 text-black/80 hover:text-black border-2 border-black/20 hover:border-black font-bold px-8 py-4 rounded-full uppercase tracking-wider text-xs md:text-sm transition-all duration-300 active:scale-95 cursor-pointer w-64 sm:w-auto"
                >
                  <span>Fly without Music</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Spacer to maintain vertical balance */}
          <div className="h-6" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
