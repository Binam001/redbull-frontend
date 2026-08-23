"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// -------------------------------------------------------------
// High-performance Simplex 3D Noise for Organic Fluid Dynamics
// -------------------------------------------------------------
function createNoise3D() {
  const F3 = 1.0 / 3.0;
  const G3 = 1.0 / 6.0;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = (i * 157 + 73) & 255;
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }
  const grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
    -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  return function noise3D(x: number, y: number, z: number): number {
    let n0 = 0,
      n1 = 0,
      n2 = 0,
      n3 = 0;
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    const z0 = z - Z0;

    let i1 = 0,
      j1 = 0,
      k1 = 0,
      i2 = 0,
      j2 = 0,
      k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1;
        j1 = 0;
        k1 = 0;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 1;
        j2 = 0;
        k2 = 1;
      }
    } else {
      if (y0 < z0) {
        i1 = 0;
        j1 = 0;
        k1 = 1;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else if (x0 < z0) {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 0;
        j2 = 1;
        k2 = 1;
      } else {
        i1 = 0;
        j1 = 1;
        k1 = 0;
        i2 = 1;
        j2 = 1;
        k2 = 0;
      }
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2.0 * G3;
    const y2 = y0 - j2 + 2.0 * G3;
    const z2 = z0 - k2 + 2.0 * G3;
    const x3 = x0 - 1.0 + 3.0 * G3;
    const y3 = y0 - 1.0 + 3.0 * G3;
    const z3 = z0 - 1.0 + 3.0 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n0 =
        t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n1 =
        t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n2 =
        t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n3 =
        t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
    }

    return 32.0 * (n0 + n1 + n2 + n3);
  };
}

const noise3D = createNoise3D();

interface FluidStreamProps {
  isPouring: boolean;
  flowProgress: number | React.MutableRefObject<number>;
  mouthRef: React.RefObject<THREE.Group | null>;
}

// -------------------------------------------------------------
// Parameters for 3D Tubular Organic Fluid Mesh
// -------------------------------------------------------------
const SLICES = 64; // Longitudinal segments along the stream
const RADIAL = 20; // Radial segments around the 3D fluid tube

// -------------------------------------------------------------
// Carbonation — Red Bull is a sparkling drink, so the stream
// carries fine bubbles entrained in the falling liquid
// -------------------------------------------------------------
const BUBBLE_COUNT = 150;

export const FluidStream: React.FC<FluidStreamProps> = ({
  isPouring,
  flowProgress,
  mouthRef,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const bubblesRef = useRef<THREE.Points>(null);

  // 1. Build 3D Closed Fluid Geometry
  const { geometry } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertexCount = (SLICES + 1) * (RADIAL + 1);
    const positions = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);
    const uvs = new Float32Array(vertexCount * 2);
    const idxs: number[] = [];

    // UVs setup
    let vertIdx = 0;
    for (let s = 0; s <= SLICES; s++) {
      const v = s / SLICES;
      for (let r = 0; r <= RADIAL; r++) {
        const u = r / RADIAL;
        uvs[vertIdx * 2] = u;
        uvs[vertIdx * 2 + 1] = v;
        vertIdx++;
      }
    }

    // Index buffer (quads around the 3D cylinder)
    for (let s = 0; s < SLICES; s++) {
      for (let r = 0; r < RADIAL; r++) {
        const a = s * (RADIAL + 1) + r;
        const b = a + 1;
        const c = (s + 1) * (RADIAL + 1) + r;
        const d = c + 1;
        idxs.push(a, c, b);
        idxs.push(b, c, d);
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(idxs);

    return { geometry: geo };
  }, []);

  // Mean radius of each slice, cached every frame so bubbles can be
  // placed *inside* the tube
  const sliceRadii = useMemo(() => new Float32Array(SLICES + 1), []);

  // -------------------------------------------------------------
  // 2. Carbonation bubble system (procedural sprite + points)
  // -------------------------------------------------------------
  const { bubbleGeometry, bubbleMaterial, bubbleTexture, bubbleData } =
    useMemo(() => {
      const data = Array.from({ length: BUBBLE_COUNT }, () => ({
        s: 0.04 + Math.random() * 0.86, // position along the spine (0..1)
        speed: 0.45 + Math.random() * 0.85, // how fast it is carried down
        theta: Math.random() * Math.PI * 2, // angle around the tube
        spin: (Math.random() - 0.5) * 3.0, // slow orbit inside the stream
        radialFrac: 0.2 + Math.random() * 0.7, // distance from centre (0..1)
        size: 0.006 + Math.random() * 0.013, // world-unit radius
      }));

      const g = new THREE.BufferGeometry();
      const positions = new Float32Array(BUBBLE_COUNT * 3);
      const sizes = new Float32Array(BUBBLE_COUNT);
      const alphas = new Float32Array(BUBBLE_COUNT);
      for (let i = 0; i < BUBBLE_COUNT; i++) sizes[i] = data[i].size;
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      g.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

      // Soft round bubble sprite — bright core, warm golden falloff
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0.0, "rgba(255,255,255,1)");
      grad.addColorStop(0.25, "rgba(255,246,214,0.95)");
      grad.addColorStop(0.6, "rgba(255,214,130,0.35)");
      grad.addColorStop(1.0, "rgba(255,214,130,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;

      const m = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uPixelRatio: {
            value: Math.min(
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
              2,
            ),
          },
          uScale: { value: 520.0 },
        },
        vertexShader: `
          attribute float aSize;
          attribute float aAlpha;
          uniform float uPixelRatio;
          uniform float uScale;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * uPixelRatio * (uScale / max(0.1, -mvPosition.z));
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = aAlpha;
          }
        `,
        fragmentShader: `
          uniform sampler2D uTexture;
          varying float vAlpha;
          void main() {
            vec4 tex = texture2D(uTexture, gl_PointCoord);
            gl_FragColor = vec4(tex.rgb, tex.a * vAlpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        // Bubbles read as seen *through* the transmissive fluid body
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });

      return {
        bubbleGeometry: g,
        bubbleMaterial: m,
        bubbleTexture: tex,
        bubbleData: data,
      };
    }, []);

  useEffect(() => {
    return () => {
      bubbleGeometry.dispose();
      bubbleMaterial.dispose();
      bubbleTexture.dispose();
    };
  }, [bubbleGeometry, bubbleMaterial, bubbleTexture]);

  // Pre-allocated vectors for frame updates
  const mouthPos = useMemo(() => new THREE.Vector3(), []);
  const mouthDir = useMemo(() => new THREE.Vector3(), []);
  const spinePoints = useMemo(
    () => Array.from({ length: SLICES + 1 }, () => new THREE.Vector3()),
    [],
  );
  const tangents = useMemo(
    () => Array.from({ length: SLICES + 1 }, () => new THREE.Vector3()),
    [],
  );
  const normalsF = useMemo(
    () => Array.from({ length: SLICES + 1 }, () => new THREE.Vector3()),
    [],
  );
  const binormals = useMemo(
    () => Array.from({ length: SLICES + 1 }, () => new THREE.Vector3()),
    [],
  );
  // Bubble scratch vectors
  const tmpCenter = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const tmpN = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.getElapsedTime();
    const progress =
      typeof flowProgress === "number" ? flowProgress : flowProgress.current;

    const show = !!mouthRef.current && progress > 0.005;
    if (meshRef.current) meshRef.current.visible = show;
    if (bubblesRef.current) bubblesRef.current.visible = show;
    if (!show) return;

    // Get mouth opening world coordinate & direction
    mouthRef.current.getWorldPosition(mouthPos);
    mouthRef.current.getWorldDirection(mouthDir);

    // Initial flow direction — falls mostly straight down with a slight lean
    const initFlowDir = new THREE.Vector3(0, -0.85, 0.45).normalize();
    initFlowDir.x += mouthDir.x * 0.2;
    initFlowDir.normalize();

    const maxStreamLength = 1.7;
    const currentLength = maxStreamLength * Math.min(1.0, progress * 1.1);
    const speed = 3.2;

    // -------------------------------------------------------------
    // 1. Compute 3D Fluid Spine Curve with Physics & Wave Turbulence
    // -------------------------------------------------------------
    for (let s = 0; s <= SLICES; s++) {
      const sNorm = s / SLICES; // 0 (mouth) to 1 (stream tip)
      const dist = sNorm * currentLength;
      const t = dist / speed;

      // Ballistic gravity trajectory: P(t) = P0 + V0*t + 0.5*g*t^2
      const gravity = -9.2;
      const arcY = initFlowDir.y * dist + 0.5 * gravity * (t * t);
      const arcZ = initFlowDir.z * dist * 0.4;
      const arcX = initFlowDir.x * dist * 0.15;

      // Gentle fluid wave turbulence — kept low-amplitude so the spine
      // curve never bends sharply enough for the tube to fold onto itself
      const wavePhase = time * 6.0 - sNorm * 10.0;
      const noiseAmp = Math.pow(sNorm, 0.7) * 0.03;

      const turbX =
        Math.sin(wavePhase * 0.9) * 0.01 * sNorm +
        noise3D(sNorm * 4.0, 0.5, time * 1.6) * noiseAmp;

      const turbY =
        Math.cos(wavePhase * 1.1) * 0.006 * sNorm +
        noise3D(0.2, sNorm * 4.0, time * 1.6) * (noiseAmp * 0.5);

      const turbZ =
        Math.sin(wavePhase * 1.3) * 0.009 * sNorm +
        noise3D(0.8, 0.8, sNorm * 4.0 - time * 2.0) * (noiseAmp * 0.6);

      spinePoints[s].set(
        mouthPos.x + arcX + turbX,
        mouthPos.y + arcY + turbY,
        mouthPos.z + arcZ + turbZ,
      );
    }

    // -------------------------------------------------------------
    // 2. Compute Frenet Frames (Tangents, Normals, Binormals)
    // -------------------------------------------------------------
    const referenceUp =
      Math.abs(initFlowDir.y) > 0.9
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);

    for (let s = 0; s <= SLICES; s++) {
      if (s === 0) {
        tangents[s].subVectors(spinePoints[1], spinePoints[0]).normalize();
      } else if (s === SLICES) {
        tangents[s]
          .subVectors(spinePoints[SLICES], spinePoints[SLICES - 1])
          .normalize();
      } else {
        tangents[s]
          .subVectors(spinePoints[s + 1], spinePoints[s - 1])
          .normalize();
      }

      binormals[s].crossVectors(tangents[s], referenceUp).normalize();
      normalsF[s].crossVectors(binormals[s], tangents[s]).normalize();
    }

    // -------------------------------------------------------------
    // 3. Generate 3D Fluid Ribbon Surface Vertices
    // -------------------------------------------------------------
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    let vertIdx = 0;

    for (let s = 0; s <= SLICES; s++) {
      const sNorm = s / SLICES;
      const center = spinePoints[s];
      const B = binormals[s];
      const N = normalsF[s];

      // Fluid profile: fuller body at the mouth, short waist, a wide flare
      // through the middle, then tapers to a soft point at the very tip
      let baseRadius: number;
      if (sNorm < 0.12) {
        baseRadius = THREE.MathUtils.lerp(0.08, 0.11, sNorm / 0.12);
      } else if (sNorm < 0.3) {
        baseRadius = THREE.MathUtils.lerp(0.11, 0.09, (sNorm - 0.12) / 0.18);
      } else if (sNorm < 0.7) {
        baseRadius = THREE.MathUtils.lerp(0.09, 0.22, (sNorm - 0.3) / 0.4);
      } else if (sNorm < 0.92) {
        baseRadius = THREE.MathUtils.lerp(0.22, 0.19, (sNorm - 0.7) / 0.22);
      } else {
        baseRadius = THREE.MathUtils.lerp(0.19, 0.03, (sNorm - 0.92) / 0.08);
      }

      // Gentle necking/bulging — kept subtle so the surface reads as one
      // coherent liquid mass rather than a stack of separate lumps
      const swellWave = Math.sin(sNorm * 12.0 - time * 7.0);
      const bulgeFactor = 1.0 + swellWave * 0.04 * Math.sin(sNorm * Math.PI);

      // Cache the mean radius for the bubble pass
      sliceRadii[s] = baseRadius * bulgeFactor;

      for (let r = 0; r <= RADIAL; r++) {
        const thetaBase = (r / RADIAL) * Math.PI * 2.0;
        const cosT = Math.cos(thetaBase);
        const sinT = Math.sin(thetaBase);

        // Organic 3D simplex noise deformation — low amplitude, smooth
        const noiseVal = noise3D(
          cosT * 1.1 + sNorm * 2.0,
          sinT * 1.1 - time * 1.6,
          sNorm * 3.0 - time * 1.0,
        );

        const organicRadius =
          baseRadius *
          bulgeFactor *
          (1.0 + noiseVal * 0.06 * Math.pow(sNorm, 0.4));

        // Near-circular cross-section
        const rx = organicRadius * 1.08;
        const ry = organicRadius * 0.95;

        const localX = cosT * rx;
        const localY = sinT * ry;

        const vx = center.x + (B.x * localX + N.x * localY);
        const vy = center.y + (B.y * localX + N.y * localY);
        const vz = center.z + (B.z * localX + N.z * localY);

        positions[vertIdx * 3] = vx;
        positions[vertIdx * 3 + 1] = vy;
        positions[vertIdx * 3 + 2] = vz;

        vertIdx++;
      }
    }

    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    // -------------------------------------------------------------
    // 4. Update carbonation bubbles inside the stream
    // -------------------------------------------------------------
    const bPosAttr = bubbleGeometry.attributes
      .position as THREE.BufferAttribute;
    const bAlphaAttr = bubbleGeometry.attributes
      .aAlpha as THREE.BufferAttribute;
    const bp = bPosAttr.array as Float32Array;
    const ba = bAlphaAttr.array as Float32Array;
    const streamStrength = Math.min(1, progress * 1.2);

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = bubbleData[i];

      // Entrained in the falling liquid, slightly slower than the flow —
      // reads as bubbles rising against the pour
      b.s += dt * b.speed * (0.3 + 0.7 * streamStrength);
      if (b.s > 0.9) {
        // Respawn near the mouth
        b.s = 0.04 + Math.random() * 0.04;
        b.theta = Math.random() * Math.PI * 2;
      }
      b.theta += dt * b.spin;

      // Interpolate the spine between slices for smooth motion
      const sF = b.s * SLICES;
      const i0 = Math.min(SLICES - 1, Math.floor(sF));
      const f = sF - i0;
      const i1 = i0 + 1;

      tmpCenter.lerpVectors(spinePoints[i0], spinePoints[i1], f);
      tmpB.lerpVectors(binormals[i0], binormals[i1], f).normalize();
      tmpN.lerpVectors(normalsF[i0], normalsF[i1], f).normalize();
      const radius =
        (sliceRadii[i0] + (sliceRadii[i1] - sliceRadii[i0]) * f) * b.radialFrac;

      const cx = Math.cos(b.theta) * radius;
      const cy = Math.sin(b.theta) * radius;

      bp[i * 3] = tmpCenter.x + tmpB.x * cx + tmpN.x * cy;
      bp[i * 3 + 1] = tmpCenter.y + tmpB.y * cx + tmpN.y * cy;
      bp[i * 3 + 2] = tmpCenter.z + tmpB.z * cx + tmpN.z * cy;

      // Fade in just below the mouth, fade out before the tip
      const fadeIn = THREE.MathUtils.smoothstep(b.s, 0.03, 0.12);
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(b.s, 0.72, 0.9);
      ba[i] = fadeIn * fadeOut * 0.9 * streamStrength;
    }

    bPosAttr.needsUpdate = true;
    bAlphaAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Main Continuous Golden Red Bull Fluid Body */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#ffc22b"
          emissive="#8f5c00"
          emissiveIntensity={0.25}
          roughness={0.03}
          metalness={0.0}
          transmission={0.85}
          ior={1.34}
          thickness={0.9}
          attenuationColor="#e89a00"
          attenuationDistance={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.03}
          reflectivity={0.65}
          transparent={true}
          opacity={0.93}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>

      {/* Sparkling carbonation bubbles drifting down the stream */}
      <points
        ref={bubblesRef}
        geometry={bubbleGeometry}
        material={bubbleMaterial}
        frustumCulled={false}
        renderOrder={3}
      />
    </group>
  );
};

export default FluidStream;
