"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Center, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface HeroTryCanCanvasProps {
  scrollProgressRef: React.RefObject<number>;
}

// Initial front-facing angle for the Red Bull logo
const INITIAL_Y_ROTATION = Math.PI * 1.9;

function HeroCanModel({
  scrollProgressRef,
}: {
  scrollProgressRef: React.RefObject<number>;
}) {
  const { nodes, materials } = useGLTF("/models/redbull.glb") as any;

  const groupRef = useRef<THREE.Group>(null);
  const idleSpinRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Premium specular metallic surfaces matching CarbonatedHero
  const labelMaterial = materials["silver.003"];
  const metalMaterial =
    materials["silver.002"] ||
    new THREE.MeshStandardMaterial({
      color: "#e8e8e8",
      metalness: 0.9,
      roughness: 0.15,
    });

  if (labelMaterial) {
    labelMaterial.metalness = 0.72;
    labelMaterial.roughness = 0.28;
  }

  if (metalMaterial) {
    metalMaterial.metalness = 0.85;
    metalMaterial.roughness = 0.32;
  }

  // Smooth, unique multi-axis choreographic rotation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const p = scrollProgressRef.current ?? 0;
    const time = state.clock.getElapsedTime();

    // 1. Ambient continuous spin (accumulates smoothly)
    idleSpinRef.current += delta * 0.35;

    // 2. Multi-axis dynamic rotation targets based on scroll progression:
    // Y: 1 full 360° revolution across the scroll journey, starting and landing front-facing
    const targetY =
      INITIAL_Y_ROTATION +
      p * (Math.PI * 2) +
      idleSpinRef.current +
      mouseRef.current.x * 0.25;

    // X: Dynamic pitch/tumbling motion: tilts gently to catch reflections, then returns upright
    const targetX =
      Math.sin(p * Math.PI * 2) * 0.2 +
      0.06 -
      mouseRef.current.y * 0.2;

    // Z: Aerodynamic banking lean: rocks smoothly as it spins
    const targetZ =
      Math.sin(p * Math.PI * 2) * 0.15 +
      Math.sin(time * 1.2) * 0.04;

    // 3. Smooth spring damping (buttery-smooth at 60/120fps)
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetX,
      5,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetY,
      5,
      delta
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetZ,
      5,
      delta
    );

    // 4. Subtle scale respiration (expands slightly when spinning past hero text)
    const targetScale = 0.30 + Math.sin(p * Math.PI) * 0.025;
    groupRef.current.scale.x = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      4,
      delta
    );
    groupRef.current.scale.y = THREE.MathUtils.damp(
      groupRef.current.scale.y,
      targetScale,
      4,
      delta
    );
    groupRef.current.scale.z = THREE.MathUtils.damp(
      groupRef.current.scale.z,
      targetScale,
      4,
      delta
    );
  });

  return (
    <group ref={groupRef} scale={0.30} position={[0, -0.05, 0]} dispose={null}>
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
  );
}

useGLTF.preload("/models/redbull.glb");

export default function HeroTryCanCanvas({
  scrollProgressRef,
}: HeroTryCanCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
      <Canvas
        style={{
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
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
          <ambientLight intensity={1.7} />
          <directionalLight position={[5, 8, 6]} intensity={3.5} />
          <directionalLight position={[-5, 4, 4]} intensity={2.5} color="#ffffff" />
          <directionalLight position={[0, 0, 7]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[0, -5, 4]} intensity={1.2} color="#ffffff" />

          {/* Zero-G floating levitation */}
          <Float
            rotationIntensity={0.12}
            floatingRange={[-0.03, 0.03]}
            floatIntensity={0.5}
            speed={1.3}
          >
            <HeroCanModel scrollProgressRef={scrollProgressRef} />
          </Float>

          <Environment
            preset="studio"
            environmentRotation={[0, 0, 0.25 * Math.PI]}
            environmentIntensity={0.25}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
