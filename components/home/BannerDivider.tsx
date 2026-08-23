"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RedBullModel3 from "./RedBullModel3";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const { degToRad } = THREE.MathUtils;

interface AnimValues {
  posX: number;
  posY: number;
  posZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
}

interface ModelSceneProps {
  animValues: React.MutableRefObject<AnimValues>;
}

const ModelScene = ({ animValues }: ModelSceneProps) => {
  const modelGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.position.set(
        animValues.current.posX,
        animValues.current.posY,
        animValues.current.posZ,
      );

      modelGroupRef.current.rotation.x = animValues.current.rotX;
      modelGroupRef.current.rotation.y = animValues.current.rotY;
      modelGroupRef.current.rotation.z = animValues.current.rotZ;

      modelGroupRef.current.scale.setScalar(animValues.current.scale);
    }
  });

  return (
    <>
      <ambientLight intensity={1.6} />
      <Environment preset="warehouse" />
      <group ref={modelGroupRef}>
        <Center>
          <RedBullModel3 scale={1} />
        </Center>
      </group>
    </>
  );
};

const BannerDivider = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const animValues = useRef<AnimValues>({
    posX: -1.35,
    posY: 0.78,
    posZ: 0,
    rotX: degToRad(10),
    rotY: degToRad(-40),
    rotZ: degToRad(0),
    scale: 1,
  });

  useGSAP(
    () => {
      if (!containerRef.current || !canvasRef.current) return;

      const isMobile = window.innerWidth < 768;

      animValues.current.posX = isMobile ? -0.4 : -1.35;
      animValues.current.posY = 0.78;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: canvasRef.current,
          pinSpacing: false,
          onRefresh: (self) => {
            const spacer = (self as any).pinSpacer;
            if (spacer && spacer.style) {
              spacer.style.setProperty("pointer-events", "none", "important");
            }
          },
        },
      });

      // Step 1: Section 1 -> Section 2 (Can moves from Left to Right)
      tl.fromTo(
        animValues.current,
        {
          posX: isMobile ? -0.5 : -1.5,
          posY: 0.78,
          posZ: 0,
          rotX: degToRad(5),
          rotY: degToRad(-40),
          rotZ: degToRad(0),
          scale: 1,
        },
        {
          posX: isMobile ? 0.5 : 1.5,
          posY: 0,
          posZ: 0,
          rotX: degToRad(20),
          rotY: degToRad(125),
          rotZ: degToRad(0),
          scale: 1,
          ease: "power1.inOut",
          duration: 0.8,
        },
        0,
      );

      // Step 2: Section 2 -> Section 3 (Can moves from Right to Left)
      tl.to(
        animValues.current,
        {
          posX: isMobile ? -0.5 : -1.5,
          posY: 0,
          posZ: 0,
          rotX: degToRad(10),
          rotY: degToRad(330),
          rotZ: degToRad(0),
          scale: 1,
          ease: "power1.inOut",
          duration: 1,
        },
        0.8,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#e8e9ea] text-black overflow-hidden select-none z-10"
    >
      {/* Pinned 3D Canvas Layer */}
      <div
        ref={canvasRef}
        className="w-full h-screen absolute top-0 left-0 pointer-events-none z-20"
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 38 }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ModelScene animValues={animValues} />
          </Suspense>
        </Canvas>
      </div>

      {/* ----------------- SECTION 1: Can on Left, Content on Right ----------------- */}
      <section className="relative w-full h-[50vh] flex items-center py-8 z-10 bg-secondary">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 xl:gap-12">
          {/* Left Spacer for 3D Can */}
          <div className="w-full md:w-1/2 h-full hidden md:block" />

          {/* Right: Tagline */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-white font-['Orbitron',_var(--font-primary),_sans-serif]">
              RED BULL
              <br />
              <span className="text-primary">GIVES YOU</span>
              <br />
              WINGS.
            </h2>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: Content on Left, Can on Right ----------------- */}
      <section className="relative w-full h-screen flex items-center z-10">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left: Section 2 Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-secondary font-['Orbitron',_var(--font-primary),_sans-serif]">
              UNLEASH
              <br />
              <span className="text-primary">YOUR FULL</span>
              <br />
              POTENTIAL.
            </h2>

            <p className="text-sm md:text-base text-black/70 max-w-md leading-relaxed font-mono">
              Appreciated worldwide by top athletes, busy professionals, and
              driven creators pursuing peak performance.
            </p>
          </div>

          {/* Right Spacer for 3D Can */}
          <div className="w-full md:w-1/2 h-full hidden md:block" />
        </div>
      </section>

      {/* ----------------- SECTION 3: Can on Left, Content on Right ----------------- */}
      <section className="relative w-full h-screen flex items-center z-10">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left Spacer for 3D Can */}
          <div className="w-full md:w-1/2 h-full hidden md:block" />

          {/* Right: Section 3 Content */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-5 md:gap-6">
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-secondary font-['Orbitron',_var(--font-primary),_sans-serif]">
              ALWAYS READY
              <br />
              <span className="text-primary">FOR THE</span>
              <br />
              NEXT LEVEL.
            </h2>

            <p className="text-sm md:text-base text-black/70 max-w-md leading-relaxed font-mono">
              From intense training sessions to gaming marathons and everyday
              conquests. Premium energy whenever challenges arise.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BannerDivider;
