"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface CareerHeroProps {
  title?: string;
  imageSrc?: string;
}

const CareerHero: React.FC<CareerHeroProps> = ({
  title = "Make Your Mark. Move the World.",
  imageSrc = "/images/career-bg.webp",
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
      minRadius: 40,
      maxRadius: 100,
      expandDuration: 0.25,
      dissolveDuration: 0.65,
    };

    let rafId: number | null = null;
    let isActive = false;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let lastStampPos = { x: 0, y: 0 };

    const addBlob = (x: number, y: number, speedRatio: number = 1) => {
      if (!smudgeBlobs) return;

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", x.toString());
      circle.setAttribute("cy", y.toString());
      circle.setAttribute("r", "0");
      circle.setAttribute("fill", "black");

      smudgeBlobs.prepend(circle);

      const targetRadius = gsap.utils.clamp(
        config.minRadius,
        config.maxRadius,
        config.minRadius + speedRatio * 40,
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
        `+=${0.05}`,
      );
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();

      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetMouse.x = e.clientX - rect.left;
        targetMouse.y = e.clientY - rect.top;
      }
    };

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
    <section
      ref={containerRef}
      className="relative w-full h-dvh min-h-[580px] overflow-hidden bg-black xl:cursor-crosshair cursor-default flex flex-col justify-end items-center"
    >
      <div className="xl:hidden absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-20" />
      {/* ── Layer 0 (Behind): Red Bull Logo Revealed Underneath Dissolved Holes (Desktop only) ── */}
      <div className="hero-logo-underlay hidden md:flex absolute inset-0 items-center justify-center bg-black pointer-events-none select-none z-0 overflow-hidden">
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

      {/* ── Layer 1 Mobile: Static Hero Image ── */}
      <div className="md:hidden absolute inset-0 w-full h-full z-10 pointer-events-none select-none">
        <Image
          src={imageSrc}
          alt="Career Hero"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* ── Layer 1 Desktop: Dissolves under SVG Gooey Smudge Mask ── */}
      <svg
        className="hidden md:block absolute inset-0 w-full h-full pointer-events-none select-none z-10"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="career-dissolve-filter"
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
            id="career-dissolve-mask"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
          >
            {/* White background: foreground image is fully visible by default */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black gooey blobs: punch liquid holes in the image when hovered */}
            <g filter="url(#career-dissolve-filter)" ref={smudgeBlobsRef} />
          </mask>
        </defs>

        {/* Solid black base layer inside the dissolve mask: completely conceals the underlying logo until hovered */}
        <rect
          width="100%"
          height="100%"
          fill="#000000"
          mask="url(#career-dissolve-mask)"
        />

        {/* Foreground athlete image rendered inside SVG with luminance dissolve mask */}
        <image
          href={imageSrc}
          xlinkHref={imageSrc}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#career-dissolve-mask)"
        />
      </svg>

      {/* ── Layer 2 (Centered Hero Headline on Top) ── */}
      <div className="relative z-20 w-full lg:max-w-[90vw] mx-auto text-center flex flex-col gap-4 items-center justify-center pointer-events-none px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.8vw] tracking-tight leading-[1.08] text-white drop-shadow-[0_4px_32px_rgba(0,0,0,0.95)]">
          Make Your Mark. <br /> Move the World.
        </h1>
        <p className="text-xs sm:text-sm md:text-lg text-white/90 leading-relaxed font-medium max-w-xl mx-auto drop-shadow-md">
          Bring your ideas, energy, and ambition to a team that turns bold
          thinking into meaningful action.
        </p>
      </div>
    </section>
  );
};

export default CareerHero;
