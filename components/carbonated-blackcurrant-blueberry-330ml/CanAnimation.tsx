"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  titleRef: React.RefObject<HTMLDivElement | null>;
  phase1DetailsRef: React.RefObject<HTMLDivElement | null>;
  phase2DetailsRef: React.RefObject<HTMLDivElement | null>;
}

function CanScene({
  sectionRef,
  titleRef,
  phase1DetailsRef,
  phase2DetailsRef,
}: CanSceneProps) {
  const canGroupRef = useRef<THREE.Group>(null);
  const introGroupRef = useRef<THREE.Group>(null);
  const mouseGroupRef = useRef<THREE.Group>(null);
  const mouseTargetRef = useRef({ x: 0, y: 0, z: 0 });
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

  // Desktop-only mouse interaction confined strictly to this section
  useEffect(() => {
    const checkIsDesktop = () => {
      if (typeof window === "undefined") return false;
      return (
        window.innerWidth >= 1024 &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    };

    let isDesktop = checkIsDesktop();

    const resetMouse = () => {
      mouseTargetRef.current = { x: 0, y: 0, z: 0 };
    };

    const handleResize = () => {
      isDesktop = checkIsDesktop();
      if (!isDesktop) {
        resetMouse();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const section = sectionRef.current;
      if (!isDesktop || !section) {
        resetMouse();
        return;
      }

      const rect = section.getBoundingClientRect();

      // If mouse is outside this section (e.g. moved to section below or above), immediately stop interaction
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        resetMouse();
        return;
      }

      // Normalized coordinates from -1 to 1 relative to section bounds
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Slightly rotate can in the opposite direction of mouse movement
      // Mouse moves right (nx > 0) -> can turns left (negative Y)
      // Mouse moves down (ny > 0) -> can tilts up (negative X)
      // Mouse moves right (nx > 0) -> can leans subtly opposite (positive Z)
      mouseTargetRef.current = {
        x: -ny * degToRad(8),
        y: -nx * degToRad(12),
        z: nx * degToRad(5),
      };
    };

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      // If this section is scrolled out of viewport, reset mouse interaction
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        resetMouse();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", resetMouse);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", resetMouse);
    };
  }, [sectionRef]);

  // Frame-by-frame smooth physics dampening for mouse hover tilt
  useFrame((_, delta) => {
    const mouseGroup = mouseGroupRef.current;
    if (!mouseGroup) return;

    const damping = Math.min(delta * 4, 0.1);
    mouseGroup.rotation.x = THREE.MathUtils.lerp(
      mouseGroup.rotation.x,
      mouseTargetRef.current.x,
      damping,
    );
    mouseGroup.rotation.y = THREE.MathUtils.lerp(
      mouseGroup.rotation.y,
      mouseTargetRef.current.y,
      damping,
    );
    mouseGroup.rotation.z = THREE.MathUtils.lerp(
      mouseGroup.rotation.z,
      mouseTargetRef.current.z,
      damping,
    );
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
      // PAGE OPEN INTRO: Can rises spinning from the bottom into hero pose
      // ========================================================
      const introGroup = introGroupRef.current;
      if (introGroup) {
        if (typeof window !== "undefined" && window.scrollY > 50) {
          introGroup.position.set(0, 0, 0);
          introGroup.rotation.set(0, 0, 0);
        } else {
          gsap.fromTo(
            introGroup.position,
            { y: -4.5 },
            {
              y: 0,
              duration: 1.8,
              ease: "power3.out",
              delay: 0.1,
            },
          );
          gsap.fromTo(
            introGroup.rotation,
            {
              x: degToRad(25),
              y: -Math.PI,
              z: degToRad(23),
            },
            {
              x: 0,
              y: 0,
              z: 0,
              duration: 1.8,
              ease: "power3.out",
              delay: 0.1,
            },
          );
        }
      }

      // ========================================================
      // PHASE 1 (0 -> 0.35): First scroll - Straighten, zoom, dim & spotlight top label
      // ========================================================

      // 1. Instant rotation & vertical straightening
      tl.fromTo(
        canGroup.rotation,
        {
          x: degToRad(-25), // Tilted forward towards camera revealing top rim ellipse
          y: degToRad(-22), // 3/4 front view displaying Red Bull branding
          z: degToRad(-23), // Bold diagonal lean matching reference
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

      // Fade out bottom-left title early on first scroll
      if (titleRef.current) {
        tl.to(
          titleRef.current,
          {
            opacity: 0,
            ease: "power2.out",
            duration: 0.12,
          },
          0,
        );
      }

      // Reveal Phase 1 label details later, once title has vanished and spotlight lands
      if (phase1DetailsRef.current) {
        tl.fromTo(
          phase1DetailsRef.current,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.15,
          },
          0.2,
        );
      }

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
        { intensity: 0, angle: 0.4 },
        {
          intensity: 3.8, // Enhanced soft intensity for wider radius
          angle: 0.4, // Increased spotlight radius to cover the full label table
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
          y: -0.1,
          z: 0.4,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Softly adjust the beam angle to stay broad for the lower details
      tl.fromTo(
        spotLight,
        { angle: 0.4 },
        {
          angle: 0.46,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.5,
      );

      // Fade out Phase 1 details as the scene transitions to Phase 2
      if (phase1DetailsRef.current) {
        tl.to(
          phase1DetailsRef.current,
          {
            opacity: 0,
            x: -20,
            ease: "power2.inOut",
            duration: 0.25,
          },
          0.5,
        );
      }

      // Reveal Phase 2 label details on the center-right side as spotlight illuminates lower label
      if (phase2DetailsRef.current) {
        tl.fromTo(
          phase2DetailsRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            ease: "power2.out",
            duration: 0.3,
          },
          0.55,
        );
      }
    },
    {
      dependencies: [sectionRef, titleRef, phase1DetailsRef, phase2DetailsRef],
    },
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
        angle={0.4}
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
        color="#cb2026"
      />

      <group
        ref={introGroupRef}
        position={[0, -4.5, 0]}
        rotation={[degToRad(25), -Math.PI, degToRad(23)]}
      >
        <group
          ref={canGroupRef}
          position={[0, -0.75, 0]}
          scale={0.34}
          rotation={[degToRad(-25), degToRad(-22), degToRad(-23)]}
        >
          <group ref={mouseGroupRef}>
            <Center>
              <CarbonatedRedbullCan />
            </Center>
          </group>
        </group>
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
  const titleRef = useRef<HTMLDivElement>(null);
  const phase1DetailsRef = useRef<HTMLDivElement>(null);
  const phase2DetailsRef = useRef<HTMLDivElement>(null);

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

      {/* Center-left Phase 1 Highlight Details */}
      <div
        ref={phase1DetailsRef}
        className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-16 xl:left-24 z-20 pointer-events-none select-none flex flex-col gap-6 md:gap-8 max-w-xs sm:max-w-sm lg:max-w-md opacity-0"
      >
        {/* High Caffeine */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(203,32,38,0.9)]" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold text-white tracking-tight leading-snug">
              High Caffeine{" "}
              <span className="text-primary font-bold text-base sm:text-xl lg:text-[1.35vw] block sm:inline">
                (24.24 mg/100ml)
              </span>
            </span>
          </div>
        </div>

        {/* Calories */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(203,32,38,0.9)]" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold text-white tracking-tight leading-snug">
              Calories <span className="text-primary font-bold">200</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center-right Phase 2 Highlight Details */}
      <div
        ref={phase2DetailsRef}
        className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 lg:left-auto lg:right-16 xl:right-24 z-20 pointer-events-none select-none flex flex-col gap-6 md:gap-8 max-w-xs sm:max-w-sm lg:max-w-md opacity-0"
      >
        {/* Sodium */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(203,32,38,0.9)]" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold text-white tracking-tight leading-snug">
              Sodium <span className="text-primary font-bold">100mg</span>
            </span>
          </div>
        </div>

        {/* Carbohydrate */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(203,32,38,0.9)]" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold text-white tracking-tight leading-snug">
              Carbohydrate <span className="text-primary font-bold">49g</span>
            </span>
          </div>
        </div>

        {/* Protein */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(203,32,38,0.9)]" />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2vw] font-bold text-white tracking-tight leading-snug">
              Protein <span className="text-primary font-bold">2g</span>
            </span>
          </div>
        </div>
      </div>

      {/* top-left label in text-primary */}
      <div
        ref={titleRef}
        className="absolute top-16 md:top-32 lg:top-[30%] left-4 md:left-8 lg:left-16 xl:left-24 z-20 pointer-events-none select-none"
      >
        <h2 className="text-primary font-bold text-xl md:text-3xl lg:text-[3.5vw] uppercase">
          Unleash the <br /> Unexpected
        </h2>
      </div>

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
          <CanScene
            sectionRef={sectionRef}
            titleRef={titleRef}
            phase1DetailsRef={phase1DetailsRef}
            phase2DetailsRef={phase2DetailsRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanAnimation;
