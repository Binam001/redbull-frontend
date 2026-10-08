"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

const YOUTUBE_VIDEO_ID = "-09Ed-KrCUw";

const EventsVideo = () => {
    const sectionRef = useRef<HTMLElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<any>(null);

    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hasUserUnmuted, setHasUserUnmuted] = useState(false);
    const [showMutePrompt, setShowMutePrompt] = useState(true);
    const isInViewRef = useRef(false);

    // Send command to YouTube iframe via postMessage as reliable direct communication
    const sendIframeCommand = useCallback((func: string, args: any[] = []) => {
        if (iframeRef.current?.contentWindow) {
            try {
                iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({
                        event: "command",
                        func: func,
                        args: args,
                    }),
                    "*"
                );
            } catch (err) {
                console.error("Error sending command to iframe:", err);
            }
        }
    }, []);

    // Initialize YouTube Iframe Player API for state sync & fine-grained control
    useEffect(() => {
        let isMounted = true;

        const initPlayer = () => {
            if (!window.YT || !window.YT.Player || playerRef.current || !iframeRef.current) return;

            try {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    events: {
                        onReady: (event: any) => {
                            if (!isMounted) return;
                            setIsReady(true);
                            // If user is already looking at the section when player is ready, autoplay muted
                            if (isInViewRef.current) {
                                event.target.mute();
                                event.target.playVideo();
                                setIsPlaying(true);
                            }
                        },
                        onStateChange: (event: any) => {
                            if (!isMounted) return;
                            // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
                            if (event.data === 1) {
                                setIsPlaying(true);
                            } else if (event.data === 2 || event.data === 0) {
                                setIsPlaying(false);
                            }
                        },
                    },
                });
            } catch (err) {
                console.error("YouTube Player init error:", err);
            }
        };

        if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            const existingScript = document.getElementById("yt-iframe-api-script");
            if (!existingScript) {
                const tag = document.createElement("script");
                tag.id = "yt-iframe-api-script";
                tag.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(tag);
            }

            const prevCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevCallback) prevCallback();
                if (isMounted) initPlayer();
            };
        }

        return () => {
            isMounted = false;
            if (playerRef.current?.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (_) { }
                playerRef.current = null;
            }
        };
    }, []);

    // Listen to postMessage from the iframe for volume / state updates
    useEffect(() => {
        const handleWindowMessage = (event: MessageEvent) => {
            try {
                const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                if (!data) return;

                if (data.event === "onStateChange") {
                    if (data.info === 1) setIsPlaying(true);
                    if (data.info === 2 || data.info === 0) setIsPlaying(false);
                }

                if (data.event === "infoDelivery" && data.info) {
                    if (typeof data.info.muted === "boolean") {
                        setIsMuted(data.info.muted);
                        if (!data.info.muted) {
                            setHasUserUnmuted(true);
                            setShowMutePrompt(false);
                        }
                    }
                }
            } catch (_) {
                // Non-JSON message from other extensions or tools, ignore
            }
        };

        window.addEventListener("message", handleWindowMessage);
        return () => window.removeEventListener("message", handleWindowMessage);
    }, []);

    // IntersectionObserver: Autoplay when scrolled to this section, pause when scrolled away
    useEffect(() => {
        const target = sectionRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    isInViewRef.current = entry.isIntersecting;

                    if (entry.isIntersecting) {
                        // User scrolled into view: play without sound first (or keep unmuted if user manually unmuted)
                        if (!hasUserUnmuted) {
                            sendIframeCommand("mute");
                            if (playerRef.current?.mute) {
                                playerRef.current.mute();
                            }
                            setIsMuted(true);
                        }
                        sendIframeCommand("playVideo");
                        if (playerRef.current?.playVideo) {
                            playerRef.current.playVideo();
                        }
                        setIsPlaying(true);
                    } else {
                        // User scrolled out of view: pause video
                        sendIframeCommand("pauseVideo");
                        if (playerRef.current?.pauseVideo) {
                            playerRef.current.pauseVideo();
                        }
                        setIsPlaying(false);
                    }
                });
            },
            {
                threshold: 0.35, // Trigger when 35% of the video section is visible
            }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [sendIframeCommand, hasUserUnmuted]);

    // Toggle Mute / Sound
    const handleToggleSound = () => {
        if (isMuted) {
            // Unmute
            sendIframeCommand("unMute");
            sendIframeCommand("setVolume", [100]);
            if (playerRef.current?.unMute) {
                playerRef.current.unMute();
                playerRef.current.setVolume(100);
            }
            setIsMuted(false);
            setHasUserUnmuted(true);
            setShowMutePrompt(false);
        } else {
            // Mute
            sendIframeCommand("mute");
            if (playerRef.current?.mute) {
                playerRef.current.mute();
            }
            setIsMuted(true);
        }
    };

    return (
        <section
            ref={sectionRef}
            className="w-full text-black px-4 sm:px-8 md:px-12 lg:px-24 relative overflow-hidden min-h-screen lg:h-[120vh] flex flex-col justify-between py-6 sm:py-8 lg:py-8"
        >
            {/* Background Red Bull glow & grid lines */}
            {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary/15 via-secondary/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />
      </div> */}

            <div className="relative z-10 flex flex-col flex-1 min-h-0">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 sm:mb-6 shrink-0">
                    <div>
                        {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Fan Anthem Spotlight
            </div> */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                            Feel The Babal Energy
                        </h2>
                        <p className="text-xs sm:text-sm md:text-lg text-black/70 leading-relaxed font-medium max-w-xl mt-3">
                            Immerse yourself in the thunderous roar of Red Bull fans. Crank up the passion with the official Babal Fan Anthem for Nepal Premier League.
                        </p>
                    </div>

                    {/* Quick Sound Toggle Action */}
                    {/* <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggleSound}
                            className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md ${isMuted
                                ? "bg-white text-neutral-900 hover:bg-neutral-100 shadow-white/10 hover:scale-105"
                                : "bg-primary text-white hover:bg-primary/90 shadow-primary/30"
                                }`}
                            title={isMuted ? "Unmute video" : "Mute video"}
                        >
                            {isMuted ? (
                                <>
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                    </svg>
                                    <span>Tap for Sound</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                        />
                                    </svg>
                                    <span>Sound Active</span>
                                </>
                            )}
                        </button>
                    </div> */}
                </div>

                {/* Video Player Theater Container */}
                <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black w-full flex-1 min-h-[800px] max-h-[calc(100vh-220px)] mt-8">
                    {/* YouTube IFrame with Full Controls & API */}
                    <iframe
                        ref={iframeRef}
                        id="events-youtube-player"
                        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&mute=1&controls=1&rel=0&playsinline=1&modestbranding=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
                        title="Red Bull NPL Babal Fan Anthem"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full object-cover"
                    />

                    {/* Floating Subtle Status Pill (Top Left, non-blocking) */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 pointer-events-none z-20 flex items-center gap-2">
                        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium shadow-md">
                            <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-neutral-400"}`} />
                            {isPlaying ? (isMuted ? "Playing (Muted)" : "Playing") : "Paused"}
                        </span>
                    </div>

                    {/* Floating "Click to Unmute" Prompt Badge when playing muted */}
                    {isPlaying && isMuted && showMutePrompt && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 animate-fade-in pointer-events-auto">
                            <button
                                onClick={handleToggleSound}
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/95 hover:bg-primary text-white text-xs font-semibold tracking-wide shadow-lg shadow-primary/30 border border-white/20 transition-all hover:scale-105 cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                </svg>
                                <span>Click to unmute</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Video Footnote & Details */}
                {/* <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">RED BULL Nepal</span>
                        <span>•</span>
                        <span>NPL Babal Fan Anthem</span>
                        <span>•</span>
                        <span className="text-neutral-500">Official Video</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Autoplays muted on scroll • Full controls available</span>
                    </div>
                </div> */}
            </div>
        </section>
    );
};

export default EventsVideo;