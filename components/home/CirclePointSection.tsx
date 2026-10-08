"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import "@/lib/three-setup";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RedBullModel2 } from "@/components/home/RedBullModel2";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const { degToRad } = THREE.MathUtils;

const tags = [
  {
    id: "vitamin-c",
    name: "VITAMIN C",
    description:
      "Contributes to normal energy-yielding metabolism and reduction of tiredness. Protects cells from oxidative stress.",
    extra: "Increases iron absorption and supports healthy immune response.",
    baseAngle: 0, // Right
  },
  {
    id: "potassium",
    name: "POTASSIUM",
    description:
      "Essential electrolyte that supports normal functioning of the nervous system and healthy muscle function.",
    extra: "Contributes to the maintenance of optimal fluid balance.",
    baseAngle: 72, // Top-Right / Top
  },
  {
    id: "magnesium",
    name: "MAGNESIUM",
    description:
      "Helps maintain electrolyte balance, normal protein synthesis, and supports psychological performance.",
    extra: "Essential mineral required for sustained cellular energy.",
    baseAngle: 144, // Top-Left
  },
  {
    id: "folic-acid",
    name: "FOLIC ACID",
    description:
      "Supports normal blood formation, immune system function, and plays a vital role in cellular renewal.",
    extra: "Promotes healthy tissue recovery and cognitive endurance.",
    baseAngle: 216, // Bottom-Left
  },
  {
    id: "vitamin-b",
    name: "VITAMIN B GROUP",
    description:
      "B-complex vitamins (B3, B5, B6, B12) contribute to normal vitality and help eliminate fatigue during peak focus.",
    extra: "Boosts mental agility and optimizes metabolism.",
    baseAngle: 288, // Bottom / Bottom-Right
  },
];

interface ModelSceneProps {
  canRotation: React.MutableRefObject<{ y: number; x: number }>;
}

const ModelScene = ({ canRotation }: ModelSceneProps) => {
  const modelGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (modelGroupRef.current) {
      const mouseRotY = state.pointer.x * 0.2;
      const mouseRotX = -state.pointer.y * 0.15;

      modelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.y,
        canRotation.current.y + mouseRotY,
        0.08,
      );
      modelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        modelGroupRef.current.rotation.x,
        canRotation.current.x + mouseRotX,
        0.08,
      );
    }
  });

  return (
    <>
      <ambientLight intensity={1.4} />
      <Environment preset="warehouse" />

      <group ref={modelGroupRef} position={[0, 0, 0]}>
        <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.15}>
          <Center>
            <RedBullModel2 scale={1.25} />
          </Center>
        </Float>
      </group>
    </>
  );
};

const CirclePointSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const tagElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const crosshairElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const canRotation = useRef({
    x: degToRad(6),
    y: degToRad(180),
  });

  const angleRef = useRef({ value: 0 });
  const [radius, setRadius] = useState(250);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768;
        setRadius(isMobile ? 160 : 250);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const updatePositions = (currentAngle: number, currentRadius: number) => {
    tags.forEach((tag, i) => {
      const totalAngleRad = degToRad(tag.baseAngle + currentAngle);

      // 1. Crosshair on the circle rim
      const cx = Math.cos(totalAngleRad) * currentRadius;
      const cy = Math.sin(totalAngleRad) * currentRadius;
      if (crosshairElementsRef.current[i]) {
        crosshairElementsRef.current[i]!.style.transform =
          `translate(${cx}px, ${cy}px)`;
      }

      // 2. Tag Pill (revolves in orbit, always stays 100% horizontal)
      const tx = Math.cos(totalAngleRad) * (currentRadius + 44);
      const ty = Math.sin(totalAngleRad) * (currentRadius + 44);
      if (tagElementsRef.current[i]) {
        tagElementsRef.current[i]!.style.transform =
          `translate(${tx}px, ${ty}px)`;
      }
    });
  };

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // Initialize positions
      updatePositions(angleRef.current.value, radius);

      gsap.to(angleRef.current, {
        value: 180,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
          refreshPriority: 5,
          onUpdate: (self) => {
            const progress = self.progress;

            // Update active index (switches cleanly every 1/5th of scroll)
            const idx = Math.min(
              Math.floor(progress * tags.length),
              tags.length - 1,
            );
            setActiveIndex(idx);

            // Update orbital positions while keeping pill text straight horizontal
            updatePositions(angleRef.current.value, radius);
          },
        },
      });
    },
    { dependencies: [radius], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#e8e9ea] text-black overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* Background Soft Blueprint Grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Right Details Info Card */}
      {/* <div className="absolute top-8 right-6 md:top-14 md:right-14 z-30 max-w-xs md:max-w-sm pointer-events-auto">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-black/10 p-5 md:p-6 shadow-sm space-y-3 transition-all duration-300">
          <div className="flex items-center justify-between border-b border-black/10 pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
              Ingredient 0{activeIndex + 1}
            </span>
            <span className="size-2 rounded-full bg-[#f25b19] animate-pulse" />
          </div>

          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black leading-tight">
            {tags[activeIndex].name}
          </h3>

          <p className="text-xs md:text-sm text-black/80 font-mono leading-relaxed">
            {tags[activeIndex].description}
          </p>

          <p className="text-[11px] md:text-xs text-black/60 font-mono leading-relaxed pt-1">
            {tags[activeIndex].extra}
          </p>
        </div>
      </div> */}

      {/* Center Circular Orbit Stage */}
      <div className="relative size-[340px] sm:size-[440px] md:size-[520px] flex items-center justify-center z-20 pointer-events-none">
        {/* Fixed Circular Track Outline */}
        <div className="absolute inset-0 rounded-full border border-black/30 pointer-events-none" />

        {/* Orbiting Elements (Crosshairs and Horizontal Tags) */}
        {tags.map((tag, index) => {
          const totalAngleRad = degToRad(
            tag.baseAngle + angleRef.current.value,
          );
          const cx = Math.cos(totalAngleRad) * radius;
          const cy = Math.sin(totalAngleRad) * radius;
          const tx = Math.cos(totalAngleRad) * (radius + 44);
          const ty = Math.sin(totalAngleRad) * (radius + 44);

          return (
            <React.Fragment key={tag.id}>
              {/* 1. Crosshair "+" Tick Mark (revolves on track) */}
              <div
                ref={(el) => {
                  crosshairElementsRef.current[index] = el;
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
                style={{
                  transform: `translate(${cx}px, ${cy}px)`,
                  willChange: "transform",
                }}
              >
                <span className="font-mono text-base font-bold text-black select-none">
                  +
                </span>
              </div>

              {/* 2. Tag Pill (revolves around circle, ALWAYS straight horizontal) */}
              <div
                ref={(el) => {
                  tagElementsRef.current[index] = el;
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                style={{
                  transform: `translate(${tx}px, ${ty}px)`,
                  willChange: "transform",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer whitespace-nowrap ${
                    activeIndex === index
                      ? "bg-black text-white scale-105 shadow-md ring-2 ring-black/20"
                      : "bg-white/85 hover:bg-white text-black/80 hover:text-black border border-black/15"
                  }`}
                >
                  {tag.name}
                </button>
              </div>
            </React.Fragment>
          );
        })}

        {/* 3D Red Bull Model at Dead Center */}
        <div className="absolute inset-0 z-20 pointer-events-auto flex items-center justify-center">
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 40 }}
            dpr={[1, 2]}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
              <ModelScene canRotation={canRotation} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default CirclePointSection;
