"use client";

import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CarbonatedCanModelProps {
  rotate?: boolean;
  setRotate?: (v: boolean) => void;
  [key: string]: any;
}

// Controls front-facing logo facing angle
const INITIAL_Y_ROTATION = Math.PI * 1.9;

export function CarbonatedCanModel({
  rotate = false,
  setRotate = () => { },
  ...props
}: CarbonatedCanModelProps) {
  const { nodes, materials } = useGLTF("/models/redbull.glb") as any;

  const [isMobile, setIsMobile] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const rotationGroupRef = useRef<THREE.Group>(null);
  const idleGroupRef = useRef<THREE.Group>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Continuous smooth auto-rotation and organic tilting motion on right at first,
  // dampening seamlessly as user scrolls into Section 2
  useFrame((state, delta) => {
    if (idleGroupRef.current) {
      // Full speed rotation & tilt when at top (scrollProgress near 0), smoothly fading out during transition
      const factor = Math.max(0, 1 - scrollProgressRef.current * 2.5);
      const t = state.clock.getElapsedTime();

      // Continuous spin around Y
      idleGroupRef.current.rotation.y += delta * 0.55 * factor;

      // Dynamic tilting motion: stylish diagonal lean with a gentle, organic sway
      idleGroupRef.current.rotation.z = (0.20 + Math.sin(t * 1.3) * 0.08) * factor;
      idleGroupRef.current.rotation.x = (0.12 + Math.cos(t * 1.3) * 0.06) * factor;
    }
  });

  // Click spin trigger (optional interactive trigger)
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

  // Scroll animation: travels from RIGHT to LEFT with 360° spin and landing tilt
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

          // Desktop: Starts on the RIGHT (+1.95), moves across to the LEFT (-1.8)
          // Mobile: Starts centered/upper half, moves to upper left
          const initialPosX = mobile ? 0 : 1.95;
          const initialPosY = mobile ? 0.45 : 0.05;
          const targetPosX = mobile ? 0 : -1.8;
          const targetPosY = mobile ? 0.20 : -0.42;

          // 1. Position animation (Right to Left on desktop)
          gsap.fromTo(
            groupRef.current!.position,
            { x: initialPosX, y: initialPosY, z: 0 },
            {
              x: targetPosX,
              y: targetPosY,
              z: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".carbonated-hero-scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                immediateRender: false,
                refreshPriority: 10,
                onUpdate: (self) => {
                  scrollProgressRef.current = self.progress;
                },
              },
            }
          );

          // 2. Rotation animation: 360° sideways spin on Y, while tilting towards the left (Z: 0.30, X: 0.16)
          const targetRotX = 0.16;
          const targetRotY = INITIAL_Y_ROTATION + 2 * Math.PI + 0.42;
          const targetRotZ = 0.30;

          gsap.fromTo(
            rotationGroupRef.current!.rotation,
            { x: 0, y: INITIAL_Y_ROTATION, z: 0 },
            {
              x: targetRotX,
              y: targetRotY,
              z: targetRotZ,
              ease: "none",
              scrollTrigger: {
                trigger: ".carbonated-hero-scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                immediateRender: false,
                refreshPriority: 10,
              },
            }
          );

          // 3. Scale animation
          const initialScale = mobile ? 0.185 : 0.245;
          const targetScale = mobile ? 0.175 : 0.235;

          gsap.fromTo(
            groupRef.current!.scale,
            { x: initialScale, y: initialScale, z: initialScale },
            {
              x: targetScale,
              y: targetScale,
              z: targetScale,
              ease: "none",
              scrollTrigger: {
                trigger: ".carbonated-hero-scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                immediateRender: false,
                refreshPriority: 10,
              },
            }
          );
        }
      );
    });

    return () => ctx.revert();
  }, [isMobile]);

  // Materials configuration (same high-end specular metallic surfaces as AboutHero)
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

  const initialScale = isMobile ? 0.185 : 0.245;
  const initialPosX = isMobile ? 0 : 1.95;
  const initialPosY = isMobile ? 0.45 : 0.05;

  return (
    <group
      ref={groupRef}
      scale={initialScale}
      position={[initialPosX, initialPosY, 0]}
      {...props}
      dispose={null}
    >
      {/* Scroll rotation & tilt group */}
      <group ref={rotationGroupRef} rotation={[0, INITIAL_Y_ROTATION, 0]}>
        {/* Idle smooth continuous rotation group */}
        <group ref={idleGroupRef}>
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
    </group>
  );
}

useGLTF.preload("/models/redbull.glb");
