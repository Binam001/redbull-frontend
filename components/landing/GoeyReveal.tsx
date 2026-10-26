"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

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

    let rafId: number | null = null;
    let isActive = false;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let lastStampPos = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
    };

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

    const startEffect = () => {
      if (isActive) return;
      const rect = container.getBoundingClientRect();
      mouse = { x: rect.width / 2, y: rect.height / 2 };
      targetMouse = { x: rect.width / 2, y: rect.height / 2 };
      lastStampPos = { x: rect.width / 2, y: rect.height / 2 };

      window.addEventListener("mousemove", handlePointerMove);
      rafId = requestAnimationFrame(updateLoop);
      isActive = true;
    };

    const stopEffect = () => {
      if (!isActive) return;
      window.removeEventListener("mousemove", handlePointerMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (smudgeBlobs) {
        while (smudgeBlobs.firstChild) {
          smudgeBlobs.removeChild(smudgeBlobs.firstChild);
        }
      }
      isActive = false;
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        startEffect();
      } else {
        stopEffect();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      stopEffect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden font-sans select-none lg:cursor-crosshair cursor-default"
      >
        <svg className="hidden lg:block absolute w-0 h-0 pointer-events-none">
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
          </div>
          <div className="absolute bottom-16 z-10 space-y-6">
            <h1 className="uppercase text-3xl sm:text-4xl md:text-5xl lg:text-[5vw] tracking-tight text-white leading-[1.08]">
              Find Your Wiiings
            </h1>
          </div>
        </div>

        {/* Foreground Surface Layer with Smudge Mask (reveals on top of content when hovered on desktop) */}
        <div
          className="hero-content-foreground hidden lg:block absolute inset-0 overflow-hidden pointer-events-none select-none z-30"
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
