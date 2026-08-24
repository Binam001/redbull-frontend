"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import ParagraphAnimation from "../shared/ParagraphAnimation";
import { useResponsive } from "@/hooks/useMediaQuery";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MountainAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isSmallerDevice } = useResponsive();

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
        defaults: { force3D: true },
      });

      tl.fromTo(".cloud1-layer", { y: 100 }, { y: -800 }, 0)
        .fromTo(".cloud2-layer", { y: -150 }, { y: -500 }, 0)
        .fromTo(".cloud3-layer", { y: -50 }, { y: -650 }, 0);
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none z-150"
    >
      <div className="absolute inset-x-0 bottom-0 w-full h-full bg-linear-to-t from-white via-transparent via-40% to-transparent z-200" />
      {/* Background Parallax Layers - Using CSS for better mobile GPU acceleration */}
      <div className="absolute inset-0 z-160 pointer-events-none">
        <img
          src="/images/home/mountain3.png"
          className="absolute bottom-0 left-0 w-full h-full object-cover will-change-transform"
          alt=""
        />
        <img
          src="/images/home/cloud-2.png"
          className="cloud2-layer absolute top-0 left-0 w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-170"
          alt=""
        />
        <img
          src="/images/home/cloud-2.png"
          className="cloud1-layer absolute top-0 -right-[20%] w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-170 opacity-80"
          alt=""
        />
        <img
          src="/images/home/cloud-2.png"
          className="cloud3-layer absolute top-1/2 -left-[20%] w-240 lg:w-360 h-220 lg:h-330 object-contain will-change-transform z-170"
          alt=""
        />
      </div>
    </div>
  );
};

export default MountainAnimation;
