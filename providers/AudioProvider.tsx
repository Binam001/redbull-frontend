"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface AudioSectionProps {
  imgClassName?: string;
  className?: string;
}

const AudioProvider = ({ imgClassName, className }: AudioSectionProps) => {
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
        className="cursor-pointer"
      >
        <Image
          src={isAudioOn ? "/icons/volume.png" : "/icons/mute.png"}
          alt="sound-bar"
          width={32}
          height={32}
          className={`size-5 ${imgClassName}`}
          unoptimized={isAudioOn}
        />
      </button>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audios/bgm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioProvider;
