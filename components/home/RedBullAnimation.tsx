"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import "@/lib/three-setup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import FluidStream from "@/components/home/FluidStream";
import { RedBullModel2 } from "./RedBullModel2";

gsap.registerPlugin(ScrollTrigger);

const { degToRad } = THREE.MathUtils;

interface AnimatedModelProps {
  animValues: React.MutableRefObject<{ rotationX: number }>;
  mouthRef: React.RefObject<THREE.Group | null>;
  onCanClick: () => void;
  setIsHovered: (hovered: boolean) => void;
}

const AnimatedModel = ({
  animValues,
  mouthRef,
  onCanClick,
  setIsHovered,
}: AnimatedModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = animValues.current.rotationX;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, degToRad(180), 0]}
      onClick={(e) => {
        e.stopPropagation();
        onCanClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      <Center>
        <RedBullModel2 scale={1.5} />
        {/* Mouth opening anchor on top lid of the can */}
        <group
          ref={mouthRef}
          position={[0, 1.36, 0.05]}
          rotation={[degToRad(-15), 0, 0]}
        />
      </Center>
    </group>
  );
};

const RedBullAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const flowProgressRef = useRef(0);

  const animValues = useRef({
    rotationX: 0,
  });

  useGSAP(
    () => {
      gsap.to(animValues.current, {
        rotationX: degToRad(80),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: true,
        },
      });
    },
    { scope: containerRef },
  );

  const togglePour = () => {
    const nextState = !isPouring;
    setIsPouring(nextState);

    gsap.killTweensOf(flowProgressRef);
    gsap.to(flowProgressRef, {
      current: nextState ? 1.0 : 0.0,
      duration: nextState ? 0.7 : 0.4,
      ease: nextState ? "power2.out" : "power2.in",
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative select-none overflow-hidden"
      style={{ cursor: isHovered ? "pointer" : "default" }}
    >
      {/* 3D Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="w-full h-full"
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[4, 6, 4]}
          intensity={3.2}
          color="#ffffff"
        />
        {/* <directionalLight
          position={[-4, 5, -3]}
          intensity={2.0}
          color="#ffedd5"
        /> */}
        {/* <directionalLight
          position={[0, -3, 3]}
          intensity={1.8}
          color="#f59e0b"
        />
        <pointLight
          position={[0, 0.5, 2.5]}
          intensity={2.5}
          distance={8}
          color="#fbbf24"
        /> */}

        <Suspense fallback={null}>
          <AnimatedModel
            animValues={animValues}
            mouthRef={mouthRef}
            onCanClick={togglePour}
            setIsHovered={setIsHovered}
          />

          {/* Continuous Realistic Fluid Stream Simulation */}
          <FluidStream
            isPouring={isPouring}
            flowProgress={flowProgressRef}
            mouthRef={mouthRef}
          />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default RedBullAnimation;
