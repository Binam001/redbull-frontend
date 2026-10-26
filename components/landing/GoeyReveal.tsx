"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Button from "../shared/Button";

export default function GooeyReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const smudgeBlobsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const smudgeBlobs = smudgeBlobsRef.current;
    if (!container || !smudgeBlobs) return;

    const config = {
      smoothing: 0.35,
      movementThreshold: 4,
      minRadius: 32,
      maxRadius: 80,
      expandDuration: 0.25,
      dissolveDuration: 0.55,
    };

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastStampPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isTouching = false;
    let rafId: number | null = null;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rect = container.getBoundingClientRect();
      targetMouse.x = clientX - rect.left;
      targetMouse.y = clientY - rect.top;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isTouching = true;
      handlePointerMove(e);
      // Immediately stamp at touch start
      lastStampPos = { ...targetMouse };
      mouse = { ...targetMouse };
      addBlob(targetMouse.x, targetMouse.y, 1);
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    const addBlob = (x: number, y: number, speedRatio: number = 1) => {
      if (!smudgeBlobs) return;

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "0");
      circle.setAttribute("fill", "white");

      // Prepend so newer blobs stack properly
      smudgeBlobs.prepend(circle);

      const targetRadius = gsap.utils.clamp(
        config.minRadius,
        config.maxRadius,
        config.minRadius + speedRatio * 35,
      );

      const proxy = { r: 0 };

      // GSAP Timeline for expanding then dissolving
      const tl = gsap.timeline({
        onUpdate: () => {
          circle.setAttribute("r", proxy.r.toString());
        },
        onComplete: () => {
          circle.remove();
        },
      });

      tl.to(proxy, {
        r: targetRadius,
        duration: config.expandDuration,
        ease: "power2.out",
      }).to(
        proxy,
        {
          r: 0,
          duration: config.dissolveDuration,
          ease: "power2.inOut",
        },
        `+=${0.05}`,
      );
    };

    const updateLoop = () => {
      // Lerp mouse coordinates for buttery smooth trailing
      mouse.x += (targetMouse.x - mouse.x) * config.smoothing;
      mouse.y += (targetMouse.y - mouse.y) * config.smoothing;

      const dx = mouse.x - lastStampPos.x;
      const dy = mouse.y - lastStampPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > config.movementThreshold) {
        const speed = Math.min(dist / 15, 2.5);
        addBlob(mouse.x, mouse.y, speed);
        lastStampPos = { x: mouse.x, y: mouse.y };
      }

      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden font-sans select-none cursor-crosshair"
      >
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <filter
              id="gooey-filter"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="28"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
                result="gooey"
              />
              <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
            </filter>

            <mask id="smudge-mask">
              <rect width="100%" height="100%" fill="black" />
              <g filter="url(#gooey-filter)" ref={smudgeBlobsRef} />
            </mask>
          </defs>
        </svg>

        {/* Background Content Layer */}
        <div className="hero-content-background absolute inset-0 flex flex-col items-center justify-center bg-black text-neutral-900 p-8">
          <div className="relative max-w-4xl text-center flex flex-col items-center justify-center">
            {/* Red Bull Logo Behind Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] md:w-[640px] lg:w-[1000px] aspect-[91/35] pointer-events-none select-none z-0 opacity-25">
              <Image
                src="/logo.svg"
                alt="Red Bull Logo"
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Foreground Text Content */}
          </div>
          <div className="absolute bottom-16 z-10 space-y-6">
            <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[5vw] tracking-tight text-white leading-[1.08]">
              Find Your Wiiings
            </h1>

            {/* <p className="text-xs sm:text-sm md:text-lg text-white/80 leading-relaxed font-medium max-w-xl mx-auto">
                Ready to take on what’s next? Discover the energy, events, and
                stories that bring people together to push beyond the ordinary.
              </p>

              <div className="pt-4 flex justify-center gap-4">
                <Button label="Explore Red Bull" className="rounded-full" />
              </div> */}
          </div>
        </div>

        {/* Foreground Surface Layer with Smudge Mask (reveals on top of content when hovered) */}
        <div
          className="hero-content-foreground absolute inset-0 overflow-hidden pointer-events-none select-none z-30"
          style={{
            mask: "url(#smudge-mask)",
            WebkitMask: "url(#smudge-mask)",
          }}
        >
          <Image
            src="/images/contact/contact-2.webp"
            alt="Surface Background"
            fill
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </div>
      </div>
    </div>
  );
}
