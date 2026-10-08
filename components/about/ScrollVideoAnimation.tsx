"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useResponsive } from "@/hooks/useMediaQuery";

const VideoAnimation = ({ children }: { children?: ReactNode }) => {
  const { isSmallerDevice } = useResponsive();

  const currentStart = isSmallerDevice ? 1 : 1;
  const currentEnd = isSmallerDevice ? 90 : 90;
  const currentFolder = isSmallerDevice
    ? "/compressed"
    : "/compressed";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(-1);
  const [isReady, setIsReady] = useState(false);

  const totalFrames = currentEnd - currentStart + 1;

  const renderFrame = (index: number) => {
    if (index === lastFrameRef.current) return;

    const img = imagesRef.current[index];
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== img.naturalWidth ||
      canvas.height !== img.naturalHeight
    ) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastFrameRef.current = index;
  };

  // 1. Preload sequence frames
  useEffect(() => {
    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];
    lastFrameRef.current = -1;

    const handleImageLoad = () => {
      loaded += 1;
      if (loaded === totalFrames) {
        setIsReady(true);
      }
    };

    for (let i = currentStart; i <= currentEnd; i++) {
      const img = new window.Image();
      const frameFileName = String(i);
      img.src = `${currentFolder}/${frameFileName}.webp`;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Don't block if a frame fails
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      setIsReady(false);
    };
  }, [currentStart, currentEnd, totalFrames, currentFolder]);

  // 2. Scroll scrub GSAP timeline — gsap/ScrollTrigger is loaded lazily,
  // client-side only: importing it at module scope crashes Next's SSR
  // module collection.
  useEffect(() => {
    if (!isReady || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    renderFrame(0);

    let ctxGsap: gsap.Context | undefined;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger);
      ctxGsap = gsap.context(() => {
        const obj = { frame: 0 };

        // No GSAP `pin` here: the visual pin is native CSS `position: sticky`
        // on the inner viewport slice (present from first paint, in the JSX
        // below). `pin: true` would insert its spacer lazily — only once this
        // effect finally runs, which is after all 150 frames finish
        // preloading — so the page would sit ~200vh too short until then and
        // everything below would jump down the instant it appeared. The
        // outer container's 300vh height is likewise set synchronously in
        // the JSX, not computed here, so the scroll region exists immediately.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
            },
          })
          .to(
            obj,
            {
              frame: totalFrames - 1,
              ease: "none",
              duration: 2,
              onUpdate: () => {
                renderFrame(Math.round(obj.frame));
              },
            },
            0,
          );
      }, container);
    });

    return () => ctxGsap?.revert();
  }, [isReady, totalFrames, isSmallerDevice]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="relative w-full h-full object-cover object-center z-0"
        />
        {children && <div className="absolute inset-0 z-10">{children}</div>}
      </div>
    </div>
  );
};

export default VideoAnimation;
