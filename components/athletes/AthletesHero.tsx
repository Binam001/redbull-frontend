"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface AthletesHeroProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

const AthletesHero: React.FC<AthletesHeroProps> = ({
  title = "Beyond Limits",
  description = "Meet the athletes redefining what's possible.",
  imageSrc = "/images/athletes-bg.png",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const smudgeBlobsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const smudgeBlobs = smudgeBlobsRef.current;
    if (!container || !smudgeBlobs) return;

    const config = {
      smoothing: 0.35,
      movementThreshold: 4,
      minRadius: 45,
      maxRadius: 110,
      expandDuration: 0.25,
      dissolveDuration: 0.7,
    };

    const initialRect = container.getBoundingClientRect();
    let mouse = { x: initialRect.width / 2, y: initialRect.height / 2 };
    let targetMouse = { x: initialRect.width / 2, y: initialRect.height / 2 };
    let lastStampPos = { x: initialRect.width / 2, y: initialRect.height / 2 };
    let rafId: number | null = null;

    const addBlob = (x: number, y: number, speedRatio: number = 1) => {
      if (!smudgeBlobs) return;

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "0");
      circle.setAttribute("fill", "black");

      smudgeBlobs.prepend(circle);

      const targetRadius = gsap.utils.clamp(
        config.minRadius,
        config.maxRadius,
        config.minRadius + speedRatio * 40
      );

      const proxy = { r: 0 };

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
        `+=${0.05}`
      );
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const rect = container.getBoundingClientRect();

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        targetMouse.x = clientX - rect.left;
        targetMouse.y = clientY - rect.top;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      handlePointerMove(e);
      lastStampPos = { ...targetMouse };
      mouse = { ...targetMouse };
      addBlob(targetMouse.x, targetMouse.y, 1.2);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    const updateLoop = () => {
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
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[580px] overflow-hidden font-sans select-none bg-black cursor-crosshair flex flex-col justify-end items-center"
    >
      {/* ── Layer 0 (Behind): Red Bull Logo Revealed Underneath Dissolved Holes ── */}
      <div className="hero-logo-underlay absolute inset-0 flex items-center justify-center bg-black pointer-events-none select-none z-0 overflow-hidden">
        {/* Ambient atmospheric backlight */}
        <div className="absolute w-[600px] sm:w-[850px] h-[400px] bg-red-600/30 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute w-[350px] sm:w-[550px] h-[300px] bg-yellow-500/20 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative w-[340px] sm:w-[540px] md:w-[740px] lg:w-[960px] xl:w-[1140px] aspect-[91/35] pointer-events-none select-none">
          <Image
            src="/logo.svg"
            alt="Red Bull Logo"
            fill
            priority
            className="object-contain drop-shadow-[0_0_80px_rgba(203,32,38,0.7)]"
          />
        </div>
      </div>

      {/* ── Layer 1 (Foreground Image): Dissolves under SVG Gooey Smudge Mask ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="athletes-dissolve-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="26"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 32 -10"
              result="gooey"
            />
          </filter>

          <mask
            id="athletes-dissolve-mask"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
          >
            {/* White background: foreground image is fully visible by default */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black gooey blobs: punch liquid holes in the image when hovered */}
            <g filter="url(#athletes-dissolve-filter)" ref={smudgeBlobsRef} />
          </mask>
        </defs>

        {/* Foreground athlete image rendered inside SVG with luminance dissolve mask */}
        <image
          href={imageSrc}
          xlinkHref={imageSrc}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#athletes-dissolve-mask)"
        />
        {/* Dark Tint & Filmic Vignette Overlays */}
        <rect
          width="100%"
          height="100%"
          fill="black"
          fillOpacity="0.45"
          mask="url(#athletes-dissolve-mask)"
        />
      </svg>

      {/* ── Layer 2 (Centered Hero Headline on Top) ── */}
      <div className="relative z-20 w-full lg:max-w-[90vw] mx-auto text-center flex flex-col gap-4 items-center justify-center pointer-events-none px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8vw] tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
          {title}
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed font-medium max-w-xl mx-auto drop-shadow-md">
          {description}
        </p>
      </div>
    </section>
  );
};

export default AthletesHero;