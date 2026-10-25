"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Center } from "@react-three/drei";
import RedbullPouringModel from "./RedbullPouringModel";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function RedBullPouringSection() {
  const [mounted, setMounted] = useState(false);
  const [isPouring, setIsPouring] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden py-16 sm:py-24 px-4 sm:px-8">
      {/* Background Atmosphere & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(35, 57, 113, 0.45) 0%, rgba(20, 32, 68, 0.2) 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[100px]"
          style={{ background: "#cb2026" }}
        />
      </div>

      {/* Header Info */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-4">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_30px_rgba(48,82,175,0.7)] leading-tight">
          Unleash The <span className="text-[#cb2026]">Pour</span>
        </h2>
      </div>

      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-10 w-full h-full overflow-hidden flex items-center justify-center">
        {mounted ? (
          <Canvas
            camera={{ position: [0, 0, 4.8], fov: 38 }}
            dpr={[1, 2]}
            gl={{
              powerPreference: "high-performance",
              preserveDrawingBuffer: false,
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            onCreated={({ gl, scene }) => {
              // Configure studio environment synchronously before first paint
              const environment = new RoomEnvironment();
              const pmremGenerator = new THREE.PMREMGenerator(gl);
              const renderTarget = pmremGenerator.fromScene(environment);
              scene.environment = renderTarget.texture;
              // Lower neutral room environment intensity so it doesn't wash out the amber liquid into milky yellow
              scene.environmentIntensity = 0.65;
            }}
            className="w-full h-full cursor-pointer"
          >
            <Suspense fallback={null}>
              {/* Low warm ambient base to preserve deep dark-amber contrast */}
              <ambientLight intensity={0.2} color="#ffeedd" />

              {/* Crisp Specular Key Highlight */}
              <directionalLight
                position={[1.5, 2, 5]}
                intensity={1.6}
                color="#fffdf5"
              />

              {/* Rich Golden-Amber Rim & Lateral Caustic Light */}
              <directionalLight
                position={[-3, 1, 2]}
                intensity={2.2}
                color="#ff9900"
              />

              {/* Top / Lid Rim Light */}
              <directionalLight
                position={[0, 8, 2]}
                intensity={1.2}
                color="#ffe6a3"
              />

              {/* Warm Deep-Amber Stream Backlight */}
              <directionalLight
                position={[0, -2, -3]}
                intensity={3.2}
                color="#ff7700"
              />

              {/* Back Contour Light */}
              <directionalLight
                position={[2, 4, -5]}
                intensity={1.4}
                color="#ffd27d"
              />

              <Center position={[0, -0.5, 0]}>
                <RedbullPouringModel
                  isPouring={isPouring}
                  onPourStart={() => setIsPouring(true)}
                  speed={1}
                  rotation={[degToRad(10), 0, 0]}
                />
              </Center>
            </Suspense>
          </Canvas>
        ) : (
          <div className="flex items-center justify-center text-white/50 text-sm">
            Loading 3D model...
          </div>
        )}
      </div>
    </section>
  );
}
