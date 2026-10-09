"use client";

import React, { useEffect, useRef } from "react";

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uDarkColor;
  uniform vec3 uMidtoneColor;
  uniform vec3 uHighlightColor;
  uniform vec3 uMouseColor;
  uniform float uNoiseScale;
  uniform float uAmplitude;
  uniform float uGain;
  uniform float uLacunarity;
  uniform float uRotationSpeed;
  uniform vec2 uMouse;
  uniform float uSpeed;
  uniform float uMouseSpeed;
  uniform float uMouseNoise;
  uniform float uMouseFactor;
  uniform float uMouseDistortion;
  uniform float uBrightness;
  uniform vec2 uResolution;
  uniform float uLoadTransition;

  float random(vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    f = f * f * (3.0 - 2.0 * f);
    return mix(a, b, f.x) + (random(i + vec2(0.0, 1.0)) - a) * f.y * (1.0 - f.x) + (random(i + vec2(1.0)) - b) * f.x * f.y;
  }

  float fbm(vec2 _st) {
    float value = 0.0;
    float amplitude = uAmplitude;
    float gain_modifier = uGain * uLoadTransition;
    float lacunarity = uLacunarity;
    vec2 shift = vec2(100.2 * sin(uSpeed * uTime));
    mat2 rot = mat2(-cos(uRotationSpeed), -sin(uRotationSpeed), sin(uRotationSpeed), cos(uRotationSpeed));
    for (int i = 0; i < 5; ++i) {
      value += amplitude * noise(_st);
      _st = rot * _st * lacunarity + shift;
      amplitude *= gain_modifier;
    }
    return value;
  }

  vec3 painting(vec2 p) {
    float l = fbm(p + fbm(p));
    return mix(
      mix(uDarkColor, uMidtoneColor, l * 1.2),
      mix(uMidtoneColor, uHighlightColor, (l - 0.4) * 1.2),
      smoothstep(0.0, 1.0, l)
    ) * uBrightness;
  }

  vec2 nnoise(vec2 uv) {
    vec2 uv2 = uv;
    uv2.y = uv2.y + fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    return uv2 - uv;
  }

  float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float m = 2.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        g = g + 0.5 + 0.5 * sin(uTime * 0.5 + 6.2831 * (floor(vec2(noise(n + g), noise(n + g + vec2(1.0))) * 4.0) / 4.0)) - f;
        m = min(m, dot(g, g));
      }
    }
    return pow(sqrt(m), 3.0);
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 aspectUV = vUv;
    aspectUV.x *= aspect;
    float d = length(aspectUV - uMouse * vec2(aspect, 1.0));
    float mouseEffectFactor = smoothstep(uMouseFactor, 0.0, d);
    vec2 distortedUV = vUv;
    float mDist = smoothstep(uMouseDistortion, 0.0, d);
    for (int i = 0; i < 3; i++) {
      distortedUV -= nnoise(distortedUV) * uMouseNoise * mDist;
    }
    vec3 distortedColor = mix(painting(vUv * uNoiseScale), painting(distortedUV * uNoiseScale), mouseEffectFactor);
    distortedColor = mix(
      mix(distortedColor, distortedColor * 1.5, mouseEffectFactor),
      mix(uMidtoneColor * 0.1236, uMouseColor * 0.7, pow(clamp(uMouseSpeed, 0.0, 1.0), 0.5)),
      mouseEffectFactor * 0.8
    );
    float v = voronoi(aspectUV * 2.0);
    distortedColor = mix(distortedColor, mix(uMidtoneColor, uHighlightColor, v * 2.0), mouseEffectFactor);
    distortedColor = mix(
      distortedColor / vec3(12.92),
      pow((distortedColor + vec3(0.055)) / vec3(1.055), vec3(2.4)),
      step(vec3(0.04045), distortedColor)
    ) * 1.5;
    gl_FragColor = vec4(distortedColor, 1.0);
  }
`;

interface FluidBackgroundProps {
  className?: string;
}

export default function FluidBackground({ className = "" }: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const mouseSmooth = useRef({ x: 0.5, y: 0.5 });
  const mouseSpeed = useRef<number>(0);
  const prevMouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error("Shader compile error:", glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "uTime");
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uMouseLoc = gl.getUniformLocation(program, "uMouse");
    const uMouseSpeedLoc = gl.getUniformLocation(program, "uMouseSpeed");
    const uDarkColorLoc = gl.getUniformLocation(program, "uDarkColor");
    const uMidtoneColorLoc = gl.getUniformLocation(program, "uMidtoneColor");
    const uHighlightColorLoc = gl.getUniformLocation(program, "uHighlightColor");
    const uMouseColorLoc = gl.getUniformLocation(program, "uMouseColor");
    const uNoiseScaleLoc = gl.getUniformLocation(program, "uNoiseScale");
    const uAmplitudeLoc = gl.getUniformLocation(program, "uAmplitude");
    const uGainLoc = gl.getUniformLocation(program, "uGain");
    const uLacunarityLoc = gl.getUniformLocation(program, "uLacunarity");
    const uRotationSpeedLoc = gl.getUniformLocation(program, "uRotationSpeed");
    const uSpeedLoc = gl.getUniformLocation(program, "uSpeed");
    const uMouseFactorLoc = gl.getUniformLocation(program, "uMouseFactor");
    const uMouseDistortionLoc = gl.getUniformLocation(program, "uMouseDistortion");
    const uMouseNoiseLoc = gl.getUniformLocation(program, "uMouseNoise");
    const uBrightnessLoc = gl.getUniformLocation(program, "uBrightness");
    const uLoadTransitionLoc = gl.getUniformLocation(program, "uLoadTransition");

    gl.uniform3f(uDarkColorLoc, 0.05, 0.13, 0.2);
    gl.uniform3f(uMidtoneColorLoc, 0.34, 0.5, 0.59);
    gl.uniform3f(uHighlightColorLoc, 0.48, 0.62, 0.75);
    gl.uniform3f(uMouseColorLoc, 0.05, 0.13, 0.2);
    gl.uniform1f(uNoiseScaleLoc, 3.1739);
    gl.uniform1f(uAmplitudeLoc, 0.5217);
    gl.uniform1f(uGainLoc, 0.2826);
    gl.uniform1f(uLacunarityLoc, 2.0);
    gl.uniform1f(uRotationSpeedLoc, 0.0);
    gl.uniform1f(uSpeedLoc, 0.0049);
    gl.uniform1f(uMouseFactorLoc, 0.5478);
    gl.uniform1f(uMouseDistortionLoc, 0.15);
    gl.uniform1f(uMouseNoiseLoc, 0.05);
    gl.uniform1f(uBrightnessLoc, 0.95);
    gl.uniform1f(uLoadTransitionLoc, 1.0);

    let animationFrameId: number = 0;
    const startTime = performance.now();
    let isIntersecting = true;

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResLoc, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current.x = Math.max(0, Math.min(1, normX));
      mousePos.current.y = Math.max(0, Math.min(1, normY));
    }
    window.addEventListener("mousemove", handleMouseMove);

    function render(currentTime: number) {
      if (!gl || !isIntersecting) {
        animationFrameId = 0;
        return;
      }
      const elapsed = (currentTime - startTime) * 0.001;

      mouseSmooth.current.x += (mousePos.current.x - mouseSmooth.current.x) * 0.075;
      mouseSmooth.current.y += (mousePos.current.y - mouseSmooth.current.y) * 0.075;

      const dx = mouseSmooth.current.x - prevMouse.current.x;
      const dy = mouseSmooth.current.y - prevMouse.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetSpeed = dist * 25.0;
      mouseSpeed.current += (targetSpeed - mouseSpeed.current) * 0.08;
      prevMouse.current.x = mouseSmooth.current.x;
      prevMouse.current.y = mouseSmooth.current.y;

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mouseSmooth.current.x, mouseSmooth.current.y);
      gl.uniform1f(uMouseSpeedLoc, Math.min(mouseSpeed.current, 1.0));

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
}
