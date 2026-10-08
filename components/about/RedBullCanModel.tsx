"use client";

import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGLTF, Center } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface RedBullCanModelProps {
  rotate: boolean;
  setRotate: (v: boolean) => void;
  [key: string]: any;
}

// Controls which side of the can faces the camera first.
// Rotating around the Y-axis turns the can horizontally:
// - Math.PI (180°) turns the can 180 degrees to show the opposite (front) side
// - Math.PI * 1.15 to fine-tune the front logo directly facing center
const INITIAL_Y_ROTATION = Math.PI * 1.9;

export function RedBullCanModel({
  rotate,
  setRotate,
  ...props
}: RedBullCanModelProps) {
  const { nodes, materials } = useGLTF("/models/redbull.glb") as any;

  const [isMobile, setIsMobile] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Click trigger: 360-degree spin on the Y axis, returning to front facing
  useEffect(() => {
    if (rotate && rotationGroupRef.current) {
      gsap.to(rotationGroupRef.current.rotation, {
        y: rotationGroupRef.current.rotation.y + 2 * Math.PI,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => setRotate(false),
      });
    }
  }, [rotate, setRotate]);

  // Scroll animation: continuous scrub rotation and scale landing in the center box
  useLayoutEffect(() => {
    if (!rotationGroupRef.current || !groupRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isDesktop: "(min-width: 800px)",
          isMobile: "(max-width: 799px)",
        },
        (context) => {
          const mobile = context.conditions?.isMobile;

          // 1. Rotation animation: 360° sideways spin on Y, while slightly tilting towards the left
          const targetRotX = 0.16;
          const targetRotY = INITIAL_Y_ROTATION + 2 * Math.PI + 0.42; // Full 360° spin sideways
          const targetRotZ = 0.30; // Positive Z rotation tilts top towards the left

          gsap.fromTo(
            rotationGroupRef.current!.rotation,
            { x: 0, y: INITIAL_Y_ROTATION, z: 0 },
            {
              x: targetRotX,
              y: targetRotY,
              z: targetRotZ,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero-content-two",
                start: "top bottom",
                end: "top top",
                scrub: 1,
                immediateRender: false,
              },
            }
          );

          // 2. Position animation: move the can to the left on desktop, or top on mobile
          const targetPosX = mobile ? 0 : -1.65;
          const targetPosY = mobile ? 0.65 : 0;

          gsap.fromTo(
            groupRef.current!.position,
            { x: 0, y: 0, z: 0 },
            {
              x: targetPosX,
              y: targetPosY,
              z: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero-content-two",
                start: "top bottom",
                end: "top top",
                scrub: 1,
                immediateRender: false,
              },
            }
          );

          // 3. Scale animation: prominent hero showcase scale
          const initialScale = mobile ? 0.22 : 0.29;
          const targetScale = mobile ? 0.20 : 0.28;

          gsap.fromTo(
            groupRef.current!.scale,
            { x: initialScale, y: initialScale, z: initialScale },
            {
              x: targetScale,
              y: targetScale,
              z: targetScale,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero-content-two",
                start: "top bottom",
                end: "top top",
                scrub: 1,
                immediateRender: false,
              },
            }
          );
        }
      );
    });

    return () => ctx.revert();
  }, [isMobile]);

  // Materials configuration
  const labelMaterial = materials["silver.003"];
  const metalMaterial =
    materials["silver.002"] ||
    new THREE.MeshStandardMaterial({
      color: "#e8e8e8",
      metalness: 0.9,
      roughness: 0.15,
    });

  if (labelMaterial) {
    labelMaterial.metalness = 0.68;
    labelMaterial.roughness = 0.30;
  }

  if (metalMaterial) {
    metalMaterial.metalness = 0.82;
    metalMaterial.roughness = 0.35;
  }

  const initialScale = isMobile ? 0.22 : 0.29;

  return (
    <group ref={groupRef} scale={initialScale} {...props} dispose={null}>
      {/* rotation={[0, INITIAL_Y_ROTATION, 0]} controls which face of the can is visible initially */}
      <group ref={rotationGroupRef} rotation={[0, INITIAL_Y_ROTATION, 0]}>
        <Center>
          {/* Main printed can body */}
          {nodes.BezierCurve001 && (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.BezierCurve001.geometry}
              material={labelMaterial || metalMaterial}
              scale={115.096}
            />
          )}

          {/* Top/bottom rims */}
          {nodes.Circle001 && (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Circle001.geometry}
              material={metalMaterial}
              scale={115.096}
            />
          )}

          {/* Pull tab / top lid */}
          {nodes.Plane027 && (
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Plane027.geometry}
              material={metalMaterial}
              scale={115.096}
            />
          )}
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload("/models/redbull.glb");
