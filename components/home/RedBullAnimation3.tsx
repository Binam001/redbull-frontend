"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import "@/lib/three-setup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import RedBullModel3 from "./RedBullModel3";
// import { RedBullModel2 } from "@/components/home/RedBullModel2";

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

  useFrame((state) => {
    if (modelGroupRef.current) {
      // Interactive mouse parallax combined with GSAP animated transforms
      const mouseRotY = state.pointer.x * 0.25;
      const mouseRotX = -state.pointer.y * 0.15;

      modelGroupRef.current.position.set(
        animValues.current.posX,
        animValues.current.posY,
        animValues.current.posZ,
      );

      modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.x,
        animValues.current.rotX + mouseRotX,
        0.08,
      );
      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        animValues.current.rotY + mouseRotY,
        0.08,
      );
      modelGroupRef.current.rotation.z = animValues.current.rotZ;

      modelGroupRef.current.scale.setScalar(animValues.current.scale);
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1.2} />
      <Environment preset="warehouse" />

      {/* 3D Can with GSAP Animation */}
      <group ref={modelGroupRef}>
        <Float speed={2} rotationIntensity={0.12} floatIntensity={0.2}>
          <Center>
            <RedBullModel3 scale={1.1} />
          </Center>
        </Float>
      </group>
    </>
  );
};

const RedBullAnimation3 = () => {
  const animValues = useRef<AnimValues>({
    posX: 0,
    posY: 0,
    posZ: 0,
    rotX: degToRad(8),
    rotY: degToRad(0),
    rotZ: 0,
    scale: 1.1,
  });

  useGSAP(() => {
    gsap.to(animValues.current, {
      // posX: 0,
      // posY: -0.1,
      // posZ: 0.6,
      rotX: degToRad(360),
      // rotY: degToRad(180 + 360),
      // rotZ: degToRad(-15),
      scale: 0.9,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".red-bull-container",
        start: "top top",
        end: "+=100%",
        scrub: 1.5,
        pin: true,
        pinSpacing: false,
        onRefresh: (self) => {
          const spacer = (self as any).pinSpacer;
          if (spacer && spacer.style) {
            spacer.style.setProperty("pointer-events", "none", "important");
          }
        },
      },
    });
  });

  return (
    // <div className="absolute inset-0 w-full h-screen pointer-events-none z-20">
    <div className="w-full h-screen absolute top-0 left-0 pointer-events-none z-100 red-bull-container">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 40 }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <ModelScene animValues={animValues} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RedBullAnimation3;
