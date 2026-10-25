"use client";

import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type GLTFResult = GLTF & {
  nodes: {
    Pepsi_Can: THREE.Mesh;
  };
  materials: {
    ["Pepsi Can.003"]: THREE.MeshStandardMaterial;
  };
};

interface GoldCanModelProps {
  rotate?: boolean;
  setRotate?: (v: boolean) => void;
  standalone?: boolean;
  [key: string]: any;
}

const { degToRad } = THREE.MathUtils;
const INITIAL_Y_ROTATION = degToRad(-40);

export function GoldCanModel({
  rotate = false,
  setRotate = () => { },
  standalone = false,
  ...props
}: GoldCanModelProps) {
  const { nodes, materials } = useGLTF(
    "/models/red-bull-3-transformed.glb",
  ) as unknown as GLTFResult;

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
      const factor = standalone ? 1 : Math.max(0, 1 - scrollProgressRef.current * 2.5);
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
    if (standalone) return;
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

          // Desktop: Starts on the RIGHT (+2.15), moves across to the LEFT (-1.8)
          // Mobile: Starts centered/upper half, moves to upper left
          const initialPosX = mobile ? 0 : 2.15;
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
                trigger: ".products-hero-scroll-container",
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
                trigger: ".products-hero-scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                immediateRender: false,
                refreshPriority: 10,
              },
            }
          );

          // 3. Scale animation
          const initialScale = mobile ? 1.45 : 1.95;
          const targetScale = mobile ? 1.35 : 1.85;

          gsap.fromTo(
            groupRef.current!.scale,
            { x: initialScale, y: initialScale, z: initialScale },
            {
              x: targetScale,
              y: targetScale,
              z: targetScale,
              ease: "none",
              scrollTrigger: {
                trigger: ".products-hero-scroll-container",
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

  const initialScale = standalone ? (isMobile ? 1.45 : 1.75) : (isMobile ? 1.45 : 1.95);
  const initialPosX = standalone ? 0 : (isMobile ? 0 : 2.15);
  const initialPosY = standalone ? (isMobile ? 0.2 : 0) : (isMobile ? 0.45 : 0.05);

  const canMesh =
    (nodes?.Pepsi_Can ||
      (nodes as any)?.["Pepsi Can"] ||
      (nodes as any)?.["Pepsi_Can"] ||
      Object.values(nodes || {}).find((n: any) => n?.isMesh)) as THREE.Mesh | undefined;

  const rawMaterial =
    materials?.["Pepsi Can.003"] ||
    (materials as any)?.["Pepsi_Can.003"] ||
    (Object.values(materials || {})[0] as THREE.MeshStandardMaterial | undefined);

  // When Environment map is disabled, default PBR metalness (1.0) absorbs diffuse light and reflects pure black.
  // By cloning the material with low metalness (0.1) and balanced roughness (0.32),
  // the gold baseColor texture is brightly and vividly illuminated by scene lights without dark shadows.
  const canMaterial = React.useMemo(() => {
    if (!rawMaterial) return undefined;
    if (standalone) {
      const cloned = rawMaterial.clone();
      cloned.metalness = 0.68;
      cloned.roughness = 0.28;
      return cloned;
    }
    return rawMaterial;
  }, [rawMaterial, standalone]);

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
            {canMesh && (
              <mesh
                name="Pepsi_Can"
                castShadow
                receiveShadow
                geometry={canMesh.geometry}
                material={canMaterial}
                scale={[11.568, 10.72, 11.786]}
              />
            )}
          </Center>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/red-bull-3-transformed.glb");
