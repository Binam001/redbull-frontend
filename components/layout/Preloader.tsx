"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingText } from "@/components/shared/FloatingText";

const taglines = [
  "For the one who believes",
  "For the one who dares to fly",
  "For the one who refuses to give up",
  "For the one champion",
];

const Preloader = () => {
  const [showButtons, setShowButtons] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleEnter = (withAudio: boolean) => {
    sessionStorage.setItem("hasEnteredSite", "true");
    localStorage.setItem("audioPreference", withAudio ? "on" : "off");
    (window as Window & { hasEnteredIntro?: boolean }).hasEnteredIntro = true;
    window.dispatchEvent(new Event("audioPreferenceChanged"));

    setIsExiting(true);
  };

  if (isLoaded) return null;

  return (
    <AnimatePresence onExitComplete={() => setIsLoaded(true)}>
      {!isExiting && (
        <motion.div
          key="preloader-overlay"
          initial={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-between py-12 px-6 select-none will-change-transform"
        >
          {/* Center Stage: Floating / Wave Tagline Transition or Buttons */}
          <div className="relative w-full flex flex-col items-center justify-center text-center my-auto min-h-[220px]">
            {!showButtons ? (
              <FloatingText
                texts={taglines}
                animationDuration={0.7}
                ease="back.out(1)"
                stagger={0.015}
                holdTime={0.7}
                onComplete={() => setShowButtons(true)}
                containerClassName="w-full min-h-[120px]"
                textClassName="text-3xl sm:text-4xl md:text-5xl xl:text-[3vw] font-black tracking-tight leading-tight uppercase text-black font-['Orbitron',_var(--font-primary),_sans-serif] whitespace-nowrap"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8 flex flex-col items-center"
              >
                <div className="space-y-2">
                  <FloatingText
                    animationDuration={0.7}
                    ease="back.out(1)"
                    stagger={0.02}
                    containerClassName="w-full"
                    textClassName="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-black font-['Orbitron',_var(--font-primary),_sans-serif] whitespace-nowrap"
                  >
                    GIVES YOU WINGS
                  </FloatingText>
                  <p className="font-mono text-xs md:text-sm text-black/60 tracking-wider">
                    CHOOSE YOUR EXPERIENCE TO ENTER
                  </p>
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
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
