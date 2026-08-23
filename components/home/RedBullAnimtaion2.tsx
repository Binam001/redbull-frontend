"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RedBullModel2 } from "@/components/home/RedBullModel2";

gsap.registerPlugin(ScrollTrigger);

const { degToRad } = THREE.MathUtils;

interface AnimValues {
  can1PosX: number;
  can1PosY: number;
  can1PosZ: number;
  can1RotX: number;
  can1RotY: number;
  can1RotZ: number;
  can1Scale: number;
  can2PosX: number;
  can2PosY: number;
  can2PosZ: number;
  can2RotX: number;
  can2RotY: number;
  can2RotZ: number;
}

interface SceneProps {
  animValues: React.MutableRefObject<AnimValues>;
}

const Scene = ({ animValues }: SceneProps) => {
  const can1Ref = useRef<THREE.Group>(null);
  const can2Ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (can1Ref.current) {
      can1Ref.current.position.set(
        animValues.current.can1PosX,
        animValues.current.can1PosY,
        animValues.current.can1PosZ
      );
      can1Ref.current.rotation.set(
        animValues.current.can1RotX,
        animValues.current.can1RotY,
        animValues.current.can1RotZ
      );
      can1Ref.current.scale.setScalar(animValues.current.can1Scale);
    }

    if (can2Ref.current) {
      can2Ref.current.position.set(
        animValues.current.can2PosX,
        animValues.current.can2PosY,
        animValues.current.can2PosZ
      );
      can2Ref.current.rotation.set(
        animValues.current.can2RotX,
        animValues.current.can2RotY,
        animValues.current.can2RotZ
      );
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1} />
      <Environment preset="apartment" />

      {/* 1. Top-Left Front Can (Animated to left side on scroll) */}
      <group ref={can1Ref}>
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.2}>
          <Center>
            <RedBullModel2 scale={1.2} />
          </Center>
        </Float>
      </group>

      {/* 2. Bottom-Right Back Can */}
      <group ref={can2Ref}>
        <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.18}>
          <Center>
            <RedBullModel2 scale={1.2} />
          </Center>
        </Float>
      </group>
    </>
  );
};

const RedBullAnimtaion2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const animValues = useRef<AnimValues>({
    // Can 1 initial transform
    can1PosX: -0.6,
    can1PosY: 0,
    can1PosZ: 0.4,
    can1RotX: degToRad(10),
    can1RotY: degToRad(175),
    can1RotZ: degToRad(-20),
    can1Scale: 1,

    // Can 2 initial transform
    can2PosX: 0.42,
    can2PosY: -0.3,
    can2PosZ: -0.15,
    can2RotX: degToRad(30),
    can2RotY: degToRad(180),
    can2RotZ: degToRad(10),
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
        },
      });

      // Animate Can 1 to the left side with 3D rotation
      tl.to(
        animValues.current,
        {
          can1PosX: -1.7,
          can1PosY: 0,
          can1PosZ: 0.8,
          can1RotX: degToRad(15),
          can1RotY: degToRad(175 + 360), // full 360 degree spin around Y
          can1RotZ: degToRad(-35),
          can1Scale: 1.15,
          ease: "power1.inOut",
        },
        0
      );

      // Fade & scale background text slightly
      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            opacity: 0.15,
            scale: 0.9,
            ease: "power1.inOut",
          },
          0
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-secondary overflow-hidden select-none flex items-center justify-center"
    >
      {/* Background Bold Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1
          ref={textRef}
          className="text-[17vw] font-black uppercase text-[#fed4ce] tracking-tight leading-none opacity-90 select-none text-center whitespace-nowrap"
          style={{
            fontFamily:
              "Impact, 'Arial Black', 'Astoria-Classic-light', sans-serif",
          }}
        >
          REFRESHING
        </h1>
      </div>

      {/* 3D Canvas with the two Red Bull cans */}
      <div className="relative w-full h-full z-10">
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 42 }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <Scene animValues={animValues} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default RedBullAnimtaion2;
