"use client";

import React, { Suspense, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import "@/lib/three-setup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RedBullModel3 from "./RedBullModel3";
import FluidStream from "./FluidStream";

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
  mouthRef: React.RefObject<THREE.Group | null>;
  tiltX: React.MutableRefObject<{ val: number }>;
  isPouring: boolean;
  flowProgress: React.MutableRefObject<number>;
  onCanClick: () => void;
}

const ModelScene = ({
  animValues,
  mouthRef,
  tiltX,
  isPouring,
  flowProgress,
  onCanClick,
}: ModelSceneProps) => {
  const modelGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.position.set(
        animValues.current.posX,
        animValues.current.posY,
        animValues.current.posZ,
      );

      modelGroupRef.current.rotation.x =
        animValues.current.rotX + tiltX.current.val;
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
      <group
        ref={modelGroupRef}
        onClick={(e) => {
          e.stopPropagation();
          onCanClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <Center>
          <RedBullModel3 scale={1} />
        </Center>

        {/* Pour origin — at center of the can, slightly right */}
        <group
          ref={mouthRef}
          position={[0.15, 0.65, 0.3]}
          rotation={[degToRad(-20), 0, 0]}
        />

        {/* Invisible raycast hitbox covering the entire 3D can */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onCanClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <cylinderGeometry args={[0.9, 0.9, 2.6, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Fluid Stream simulation pouring from the can (temporarily disabled) */}
      {/* <FluidStream
        isPouring={isPouring}
        flowProgress={flowProgress}
        mouthRef={mouthRef}
      /> */}
    </>
  );
};

const ImgDivider1 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<THREE.Group>(null);

  const [isClickable, setIsClickable] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const isPouringRef = useRef(false);
  const flowProgressRef = useRef(0);
  const tiltX = useRef({ val: 0 });
  const prevProgressRef = useRef(0);

  const animValues = useRef<AnimValues>({
    posX: 0,
    posY: 0.78,
    posZ: 0,
    rotX: degToRad(10),
    rotY: degToRad(-40),
    rotZ: degToRad(0),
    scale: 1,
  });

  const togglePour = (forceState?: boolean) => {
    const nextState =
      typeof forceState === "boolean" ? forceState : !isPouringRef.current;
    isPouringRef.current = nextState;
    setIsPouring(nextState);

    // 1. Rotate can forward around X axis by 45 degrees
    gsap.killTweensOf(tiltX.current);
    gsap.to(tiltX.current, {
      val: nextState ? degToRad(45) : 0,
      duration: nextState ? 0.6 : 0.4,
      ease: nextState ? "power2.out" : "power2.inOut",
    });

    // 2. Animate fluid stream flow progress
    gsap.killTweensOf(flowProgressRef);
    gsap.to(flowProgressRef, {
      current: nextState ? 1.0 : 0.0,
      duration: nextState ? 0.7 : 0.35,
      ease: nextState ? "power2.out" : "power2.in",
    });
  };

  useGSAP(
    () => {
      if (!containerRef.current || !canvasRef.current) return;

      const isMobile = window.innerWidth < 768;

      animValues.current.posX = isMobile ? -0.4 : -1.0;
      animValues.current.posY = 0.78;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: canvasRef.current,
          pinSpacing: false,
          refreshPriority: 6,
          onUpdate: (self) => {
            // When reaching the center phase
            const atPhase3 = self.progress >= 0.55;
            setIsClickable(atPhase3);

            // Stop pour if scrolling backwards or leaving clickable zone
            const scrollingBack = self.progress < prevProgressRef.current;
            if (isPouringRef.current && (!atPhase3 || scrollingBack)) {
              togglePour(false);
            }
            prevProgressRef.current = self.progress;
          },
        },
      });

      // Step 1: Section 1 -> Section 2 (Can moves from Left to Right)
      tl.fromTo(
        animValues.current,
        {
          posX: 0,
          posY: 0.78,
          posZ: 0,
          rotX: degToRad(5),
          rotY: degToRad(-40),
          rotZ: degToRad(0),
          scale: 1,
        },
        {
          posX: isMobile ? 0.5 : 1.15,
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
          posX: isMobile ? -0.5 : -1.15,
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

      // Step 3: Can moves to Center (Clickable Phase)
      tl.to(
        animValues.current,
        {
          posX: 0,
          posY: -1.8,
          posZ: 0,
          rotX: degToRad(0),
          rotY: degToRad(420),
          rotZ: degToRad(0),
          scale: 1,
          ease: "power1.inOut",
          duration: 1,
        },
        2,
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#e8e9ea] text-black select-none z-30"
    >
      <div
        ref={canvasRef}
        className="w-full h-screen absolute top-0 left-0 z-30 pointer-events-auto"
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 30 }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ModelScene
              animValues={animValues}
              mouthRef={mouthRef}
              tiltX={tiltX}
              isPouring={isPouring}
              flowProgress={flowProgressRef}
              onCanClick={() => togglePour()}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Mountain Divider Image Content */}
      <div className="h-[70vh] relative text-background z-10 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/home/mountain-divider-1.webp"
            alt="mountain image"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ImgDivider1;
