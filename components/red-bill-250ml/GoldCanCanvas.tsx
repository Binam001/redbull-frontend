"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { GoldCanModel } from "./GoldCanModel";

interface GoldCanCanvasProps {
  rotate?: boolean;
  setRotate?: (v: boolean) => void;
}

export default function GoldCanCanvas({
  rotate = false,
  setRotate = () => {},
}: GoldCanCanvasProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
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
          <ambientLight intensity={1.8} />
          <directionalLight position={[4, 6, 4]} intensity={2.8} color="#ffffff" />
          <directionalLight position={[-4, 4, -2]} intensity={1.8} color="#ffeedd" />
          <directionalLight position={[0, 0, 7]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[0, -5, 4]} intensity={1.2} color="#ffffff" />

          <Float
            rotationIntensity={0.12}
            floatingRange={[-0.02, 0.02]}
            floatIntensity={0.5}
            speed={1.2}
          >
            <GoldCanModel rotate={rotate} setRotate={setRotate} />
          </Float>

          <Environment preset="warehouse" />
        </Suspense>
      </Canvas>
    </div>
  );
}
