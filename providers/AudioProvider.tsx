"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

interface AudioSectionProps {
  imgClassName?: string;
  btnClassName?: string;
  className?: string;
  isScrolled?: boolean;
}

const AudioProvider = ({
  imgClassName,
  btnClassName,
  className,
  isScrolled = false,
}: AudioSectionProps) => {
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("audioPreference");
    interface CustomWindow extends Window {
      hasEnteredIntro?: boolean;
    }
    const hasEntered = (window as CustomWindow).hasEnteredIntro === true;

    // Only auto-play if we are on a subpage OR we have already cleared the EntrySection in this JS session
    if (saved === "on" && (pathname !== "/" || hasEntered)) {
      // Defer state update to avoid the "cascading renders" warning from React
      const timeoutId = setTimeout(() => {
        setIsAudioOn((prev) => (prev === true ? prev : true));
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [pathname]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handlePreferenceChange = () => {
      const saved = localStorage.getItem("audioPreference");
      const shouldPlay = saved === "on";
      setIsAudioOn(shouldPlay);

      // Trigger play IMMEDIATELY in the event handler (synchronous with click)
      if (shouldPlay && audioRef.current) {
        const audio = audioRef.current;
        audio.volume = 0.4;
        audio.play().catch((err) => {
          console.error("Direct play failed, will sync via effect:", err);
        });
      }
    };

    window.addEventListener("audioPreferenceChanged", handlePreferenceChange);
    return () =>
      window.removeEventListener(
        "audioPreferenceChanged",
        handlePreferenceChange,
      );
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    if (isAudioOn) {
      // This effect handles toggle button clicks and fallback
      if (audio.paused) {
        audio.volume = 1;
        audio.play().catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [isAudioOn]);

  return (
    // <div className="fixed bottom-8 right-4 md:right-8 lg:right-16 xl:right-24 z-1000">
    <div className={`flex items-center justify-center ${className}`}>
      <button
        onClick={() => {
          const newState = !isAudioOn;
          setIsAudioOn(newState);
          localStorage.setItem("audioPreference", newState ? "on" : "off");
          window.dispatchEvent(new Event("audioPreferenceChanged"));
        }}
        aria-label={isAudioOn ? "Mute Audio" : "Unmute Audio"}
        className={`lg:border-2 lg:p-2 rounded-full transition-colors duration-300 ${
          isScrolled
            ? "border-black bg-black/5 hover:bg-black/10"
            : "border-white bg-white/5 hover:bg-white/10"
        } ${btnClassName || ""}`}
      >
        {isAudioOn ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className={`size-4 transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-white"
            } ${imgClassName || ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className={`size-4 transition-colors duration-300 ${
              isScrolled ? "text-black" : "text-white"
            } ${imgClassName || ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
      </button>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audios/bgm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioProvider;
