"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import CarbonatedRedbullCan from "./CarbonatedRedbullCan";
import { degToRad } from "three/src/math/MathUtils.js";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CanSceneProps {
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

function CanScene({ sectionRef }: CanSceneProps) {
  const canGroupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const bottomLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLeftRef = useRef<THREE.DirectionalLight>(null);
  const rimRightRef = useRef<THREE.DirectionalLight>(null);
  const topLightRef = useRef<THREE.DirectionalLight>(null);

  const [target] = useState(() => {
    const t = new THREE.Object3D();
    t.position.set(0, 0.12, 0.4); // Aimed directly at the Nutrition Facts & Calories table in Phase 1
    return t;
  });

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canGroup = canGroupRef.current;
      const spotLight = spotLightRef.current;
      const ambientLight = ambientLightRef.current;
      const mainLight = mainLightRef.current;
      const fillLight = fillLightRef.current;
      const bottomLight = bottomLightRef.current;
      const rimLeft = rimLeftRef.current;
      const rimRight = rimRightRef.current;
      const topLight = topLightRef.current;

      if (
        !section ||
        !canGroup ||
        !spotLight ||
        !ambientLight ||
        !mainLight ||
        !fillLight ||
        !bottomLight
      )
        return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: 0.2, // Snappy response with zero sluggish delay
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ========================================================
      // PHASE 1 (0 -> 0.35): First scroll - Straighten, zoom, dim & spotlight top label
      // ========================================================

      // 1. Instant rotation & vertical straightening
      tl.fromTo(
        canGroup.rotation,
        {
          x: degToRad(-10), // Tilted forward towards camera revealing top rim ellipse
          y: degToRad(-22), // 3/4 front view displaying Red Bull branding
          z: degToRad(23), // Bold diagonal lean matching reference
        },
        {
          x: 0,
          y: degToRad(-125), // Centers the Nutrition Facts table
          z: 0, // Straightens can upright
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      // 2. Zoom spotlighted area towards screen
      tl.fromTo(
        canGroup.scale,
        { x: 0.34, y: 0.34, z: 0.34 },
        {
          x: 0.36,
          y: 0.36,
          z: 0.36,
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      // 3. Move can down initially on first scroll so top label is framed under spotlight
      tl.fromTo(
        canGroup.position,
        { x: 0, y: -0.75, z: 0 },
        {
          x: 0,
          y: -1.05, // Frames top Nutrition Facts header in spotlight
          z: 0.4,
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      // 4. Surrounding lights dim down dramatically into cinematic darkness
      tl.to(
        ambientLight,
        {
          intensity: 0.02, // Deep cinematic black surround
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      tl.to(
        [mainLight, fillLight, bottomLight],
        {
          intensity: 0.01, // Completely dark surrounding
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      if (topLight) {
        tl.to(
          topLight,
          {
            intensity: 0.03, // Dim top rim highlight so top surroundings stay dark
            ease: "power2.out",
            duration: 0.35,
          },
          0,
        );
      }

      // Edge rim lights become subtle dark accents instead of washing out the sides
      if (rimLeft && rimRight) {
        tl.to(
          [rimLeft, rimRight],
          {
            intensity: 0.4, // Subtle thin edge contour, keeping sides dark
            ease: "power2.out",
            duration: 0.35,
          },
          0,
        );
      }

      // 5. Soft spotlight turns ON onto the top label with a wider radius
      tl.fromTo(
        spotLight,
        { intensity: 0, angle: 0.40 },
        {
          intensity: 3.8, // Enhanced soft intensity for wider radius
          angle: 0.40, // Increased spotlight radius to cover the full label table
          ease: "power2.out",
          duration: 0.35,
        },
        0,
      );

      // ========================================================
      // PHASE 2 (0.50 -> 0.90): Second scroll - Move can upward to spotlight the second part of label details
      // ========================================================

      // Glides can upward so warning box and manufacturer information enter the spotlight
      tl.to(
        canGroup.position,
        {
          y: -0.2,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Slightly rotate the can on Z axis to the right side while moving up
      tl.to(
        canGroup.rotation,
        {
          z: degToRad(-10), // Tilts subtly to the right side
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Adjust spotlight position subtly to follow the can without dropping too far down
      tl.fromTo(
        spotLight.position,
        { x: 0, y: 1.5, z: 2.7 },
        {
          x: -0.08,
          y: 1.15,
          z: 2.6,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Tilt spotlight target slightly down onto the warning section
      tl.fromTo(
        target.position,
        { x: 0, y: 0.12, z: 0.4 },
        {
          x: -0.08,
          y: -0.10,
          z: 0.4,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Softly adjust the beam angle to stay broad for the lower details
      tl.fromTo(
        spotLight,
        { angle: 0.40 },
        {
          angle: 0.46,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );
    },
    { dependencies: [sectionRef] },
  );

  return (
    <>
      <primitive object={target} />

      {/* Surrounding ambient light: moody contrast instead of flat bright washout */}
      <ambientLight ref={ambientLightRef} intensity={0.28} />

      {/* General surrounding directional lights with natural contrast */}
      <directionalLight
        ref={mainLightRef}
        position={[3.5, 5, 4]}
        intensity={0.85}
        color="#ffffff"
      />
      <directionalLight
        ref={fillLightRef}
        position={[-3.5, 3, -1.5]}
        intensity={0.28}
        color="#e0f2fe"
      />
      <directionalLight
        ref={bottomLightRef}
        position={[0, -4, 3]}
        intensity={0.15}
        color="#ffffff"
      />

      {/* Soft snoot spotlight angled from above to eliminate camera reflection glare */}
      <spotLight
        ref={spotLightRef}
        position={[0, 1.5, 2.7]}
        target={target}
        angle={0.40}
        penumbra={1.0}
        intensity={0}
        distance={7}
        decay={1.2}
        color="#ffffff"
      />

      {/* Top rim specular highlight on the can lid and lip catching the forward tilt */}
      <directionalLight
        ref={topLightRef}
        position={[0, 4.2, 0.8]}
        intensity={0.85}
        color="#e0f2fe"
      />

      {/* Vibrant electric cyan-blue left rim light catching the edge curve */}
      <directionalLight
        ref={rimLeftRef}
        position={[-3.8, 1.8, -2.0]}
        intensity={1.5}
        color="#00d2ff"
      />

      {/* Royal blue right rim light outlining the opposite silhouette */}
      <directionalLight
        ref={rimRightRef}
        position={[3.8, 1.8, -2.0]}
        intensity={1.3}
        color="#3b82f6"
      />

      <group
        ref={canGroupRef}
        position={[0, -0.75, 0]}
        scale={0.34}
        rotation={[degToRad(-10), degToRad(-22), degToRad(23)]}
      >
        <Center>
          <CarbonatedRedbullCan />
        </Center>
      </group>
    </>
  );
}

interface CanAnimationProps {
  className?: string;
}

const CanAnimation = ({ className = "" }: CanAnimationProps) => {
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`relative w-full h-svh bg-[#030712] ${className}`} />
    );
  }

  return (
    <div
      ref={sectionRef}
      className={`relative w-full h-svh flex items-center justify-center overflow-hidden bg-[#030712] ${className}`}
    >
      {/* Subtle atmospheric backdrop radial glow matching reference */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(14,42,88,0.22)_0%,rgba(3,7,18,0.92)_60%,#030712_100%)]" />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 35 }}
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
          antialias: true,
          alpha: true,
        }}
      >
        <Suspense fallback={null}>
          <CanScene sectionRef={sectionRef} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanAnimation;
