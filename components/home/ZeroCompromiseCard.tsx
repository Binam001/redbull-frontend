"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import "@/lib/three-setup";
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
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 4]} intensity={2.5} color="#ffffff" />
      <directionalLight
        position={[-4, 4, -2]}
        intensity={1.5}
        color="#ffeedd"
      />
      <Environment preset="warehouse" />
      <group ref={modelGroupRef}>
        <Center>
          <RedBullModel3 scale={1} />
        </Center>
      </group>
    </>
  );
};

const ZeroCompromiseCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initial position starts directly on this bottom-left card
  const animValues = useRef<AnimValues>({
    posX: -2,
    posY: 0.7,
    posZ: 0,
    rotX: degToRad(10),
    rotY: degToRad(-40),
    rotZ: degToRad(0),
    scale: 1.1,
  });

  useGSAP(
    () => {
      if (!cardRef.current || !canvasRef.current) return;

      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "center center",
          end: "+=270%",
          scrub: 1,
          pin: canvasRef.current,
          pinSpacing: false,
        },
      });

      // Step 1: Initial (inside this Card) -> Glides across to Right Grid
      tl.fromTo(
        animValues.current,
        {
          posX: isMobile ? -0.3 : -2,
          posY: 0.7,
          posZ: 0,
          rotX: degToRad(5),
          rotY: degToRad(-40),
          rotZ: degToRad(0),
          // scale: 1.1,
        },
        {
          posX: isMobile ? 0.4 : 1.0,
          posY: 0.7,
          posZ: 0,
          rotX: degToRad(20),
          rotY: degToRad(125),
          rotZ: degToRad(0),
          // scale: 1,
          ease: "power1.inOut",
          duration: 0.8,
        },
        0,
      );

      // Step 2: Section 2 -> Section 3 (Moves from Right back to Left)
      tl.to(
        animValues.current,
        {
          posX: isMobile ? -0.5 : -2,
          posY: 0.7,
          posZ: 0,
          rotX: degToRad(10),
          rotY: degToRad(330),
          rotZ: degToRad(0),
          // scale: 1,
          ease: "power1.inOut",
          duration: 1,
        },
        0.8,
      );

      // Step 3: Moves to Final Phase
      tl.to(
        animValues.current,
        {
          posX: 0,
          posY: -1.8,
          posZ: 0,
          rotX: degToRad(0),
          rotY: degToRad(420),
          rotZ: degToRad(0),
          // scale: 1,
          ease: "power1.inOut",
          duration: 0.7,
        },
        2,
      );
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className="relative h-[280px] sm:h-[340px] md:h-[380px] rounded-[28px] sm:rounded-[32px] bg-linear-to-br from-[#161c28] via-[#0f131c] to-[#0a0d13] p-6 sm:p-8 md:p-10 flex flex-col justify-end text-white overflow-hidden shadow-lg border border-white/10"
    >
      {/* Warm Ambient Golden Spotlight Behind the 3D Can */}
      {/* <div className="absolute right-0 top-0 bottom-0 w-3/5 bg-radial from-[#FFC906]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#FFC906]/10 blur-3xl pointer-events-none" /> */}

      {/* Pinned Full Screen 3D Red Bull Canvas triggering from this card */}
      <div
        ref={canvasRef}
        className="w-screen h-screen absolute top-0 left-0 z-30 pointer-events-none"
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 30 }}
          dpr={[1, 2]}
          className="w-full h-full pointer-events-none"
        >
          <Suspense fallback={null}>
            <ModelScene animValues={animValues} />
          </Suspense>
        </Canvas>
      </div>

      {/* Card Text Content - Clean, Non-overlapping Layout */}
      <div className="relative xl:max-w-[40%] z-40 pointer-events-none space-y-2">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
          Vitalizes Body.
          <br />
          Sharpens Mind.
        </h3>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-medium pt-0.5 drop-shadow-xs">
          Engineered to give you wings whenever you need peak focus and
          unstoppable stamina.
        </p>
      </div>
    </div>
  );
};

export default ZeroCompromiseCard;
