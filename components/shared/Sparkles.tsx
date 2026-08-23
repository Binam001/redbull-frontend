"use client";

import React, { useRef, useEffect } from "react";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = ({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = "#FFFFFF",
  particleDensity = 120,
}: ParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      opacitySpeed: number;
    }> = [];

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      width = rect.width;
      height = rect.height;
      initParticles(width, height);
    };

    const initParticles = (w: number, h: number) => {
      // Calculate count based on density and area
      // A standard 400x400 area has density particles.
      const area = w * h;
      const baseArea = 400 * 400;
      const count = Math.max(
        10,
        Math.min(150, Math.round((particleDensity * area) / baseArea)),
      );

      particles = [];
      for (let i = 0; i < count; i++) {
        // Slow random drifting velocities
        const vx = (Math.random() - 0.5) * 0.3 * speed;
        const vy = (Math.random() - 0.5) * 0.3 * speed;
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: vx || 0.05,
          vy: vy || 0.05,
          radius: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.9 + 0.1,
          opacitySpeed:
            (Math.random() * 0.01 + 0.005) *
            speed *
            (Math.random() > 0.5 ? 1 : -1),
        });
      }
    };

    const animate = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Clear the canvas using pixel coordinates to prevent subpixel rounding/border artifacts
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      ctx.fillStyle = particleColor;

      particles.forEach((p) => {
        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Flicker opacity
        p.opacity += p.opacitySpeed;
        if (p.opacity > 1) {
          p.opacity = 1;
          p.opacitySpeed = -p.opacitySpeed;
        } else if (p.opacity < 0.1) {
          p.opacity = 0.1;
          p.opacitySpeed = -p.opacitySpeed;
        }

        // Draw the dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <canvas
      id={id}
      ref={canvasRef}
      className={`w-full h-full block pointer-events-none border-none outline-none ${className}`}
      style={{ border: "none", outline: "none" }}
    />
  );
};
