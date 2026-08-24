"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register plugins safely in the browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

const BungeeSection = () => {
  const currentStart = 1;
  const currentEnd = 91;
  const currentFolder = "/images/bungee-frames-1";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
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

      let splitH2: SplitText | null = null;
      let splitP: SplitText | null = null;

      if (textRef.current) {
        const h2 = textRef.current.querySelector("h2");
        const p = textRef.current.querySelector("p");

        if (h2) splitH2 = new SplitText(h2, { type: "lines" });
        if (p) splitP = new SplitText(p, { type: "lines" });

        const textLines = [
          ...(splitH2?.lines || []),
          ...(splitP?.lines || []),
        ] as HTMLElement[];

        if (textLines.length > 0) {
          // Set initial state: opacity 0, shifted right, tilted left
          gsap.set(textLines, { opacity: 0, x: 150, skewX: 15 });

          // Entry: slide from right, tilt left, fade in, stagger (non-overlapping)
          tl.fromTo(
            textLines,
            { opacity: 0, x: 150, skewX: 15 },
            {
              opacity: 1,
              x: 0,
              skewX: 0,
              stagger: 0.008,
              duration: 0.08,
              ease: "power2.out",
            },
            0.28,
          );

          // Exit: slide to right, tilt right, fade out, stagger (non-overlapping)
          tl.to(
            textLines,
            {
              opacity: 0,
              x: 150,
              skewX: -15,
              stagger: 0.008,
              duration: 0.08,
              ease: "power2.in",
            },
            0.58,
          );
        }
      }

      // Mountain & Clouds parallax rising at the end of the bungee jump
      tl.fromTo(
        ".mountain-layer",
        { yPercent: 100 },
        { yPercent: 0, ease: "power1.out", duration: 0.9 },
        1.1,
      );

      tl.fromTo(
        ".cloud1-layer",
        { y: 350, opacity: 0 },
        { y: -300, opacity: 0.8, ease: "power1.out", duration: 1.1 },
        0.9,
      )
        .fromTo(
          ".cloud2-layer",
          { y: 250, opacity: 0 },
          { y: -200, opacity: 1, ease: "power1.out", duration: 1.1 },
          0.9,
        )
        .fromTo(
          ".cloud3-layer",
          { y: 400, opacity: 0 },
          { y: -450, opacity: 1, ease: "power1.out", duration: 1.1 },
          0.9,
        );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => {
        if (splitH2) splitH2.revert();
        if (splitP) splitP.revert();
      };
    },
    {
      scope: containerRef,
      dependencies: [isReady, totalFrames],
    },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-linear-to-r from-[#C1BEB6] via-[#BDBAB2] to-[#B6B1A7] h-dvh overflow-hidden select-none"
    >
      <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="relative w-full h-full object-cover object-top z-10"
        />

        {/* Parallax Mountain & Clouds Layers at the End of Bungee Jump */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {/* Mountain at the bottom */}
          <img
            src="/images/home/mountain3.png"
            className="mountain-layer absolute bottom-0 left-0 w-full h-full object-cover object-bottom will-change-transform z-20"
            alt=""
          />

          {/* Clouds on top of the mountain */}
          <img
            src="/images/home/cloud-2.png"
            className="cloud2-layer absolute top-0 left-0 w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-30"
            alt=""
          />
          <img
            src="/images/home/cloud-2.png"
            className="cloud1-layer absolute top-0 -right-[20%] w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-30 opacity-80"
            alt=""
          />
          <img
            src="/images/home/cloud-2.png"
            className="cloud3-layer absolute top-1/2 -left-[20%] w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-30"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default BungeeSection;
