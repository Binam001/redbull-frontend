"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import useEmblaCarousel from "embla-carousel-react";
import Button from "../shared/Button";

interface CardData {
  id: string;
  title: string;
  subtitle: string;
  name: string;
  description: string;
  defaultImage: string;
  hoverImage: string;
}

const CARDS: CardData[] = [
  {
    id: "card-1",
    title: "Formula 1<br />Grand Prix",
    subtitle: "Scuderia Racing",
    name: "Monika Grace",
    description:
      "Precision aerodynamics meet raw asphalt adrenaline. Pushing cutting-edge engineering past 340 km/h to capture the checkered flag.",
    defaultImage: "/images/athletes/athlete-2-back.webp",
    hoverImage: "/images/athletes/athlete-2.webp",
  },
  {
    id: "card-2",
    title: "Freestyle<br />Motocross",
    subtitle: "X-Fighters Division",
    name: "Mike Carter",
    description:
      "Launching forty feet into thin air, defying gravity with heart-stopping tsunami flips and uncompromising two-wheeled mastery.",
    defaultImage: "/images/athletes/athlete-3-back.webp",
    hoverImage: "/images/athletes/athlete-3.webp",
  },
  {
    id: "card-3",
    title: "Big Wave<br />Ocean Surfing",
    subtitle: "Heavy Water Elite",
    name: "Emily Blunt",
    description:
      "Carving towering 50-foot monster swells where split-second composure and raw nerve separate immortality from wipeout.",
    defaultImage: "/images/athletes/athlete-1-back.webp",
    hoverImage: "/images/athletes/athlete-1.webp",
  },
  {
    id: "card-4",
    title: "World Marathon<br />Major",
    subtitle: "Endurance Elite",
    name: "Varun Dev",
    description:
      "Pushing physiological thresholds over 42.195 km of grueling asphalt, where pace precision and mental fortitude redefine human endurance.",
    defaultImage: "/images/home/hero/adventure-5.webp",
    hoverImage: "/images/athletes/athlete-4.webp",
  },
];

// Vertex Shader for Card Quad
const CARD_VERT_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Simplex Noise Dissolve Fragment Shader replicated from Products / drinkzoi.co
const CARD_FRAG_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform vec2 uPlaneResolution;
  uniform vec2 uTextureResolution1;
  uniform vec2 uTextureResolution2;
  uniform float mixRatio;

  vec3 permute(vec3 x) {
    return mod((x * 34.0 + 1.0) * x, 289.0);
  }

  float snoise() {
    vec2 v = vUv * 0.5;
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * 0.0243902439) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 ratio1 = clamp(vec2(uPlaneResolution.x / uPlaneResolution.y / (uTextureResolution1.x / uTextureResolution1.y), 1.0) / vec2(1.0, uPlaneResolution.y / uPlaneResolution.x / (uTextureResolution1.y / uTextureResolution1.x)), vec2(0.0), vec2(1.0));
    vec2 ratio2 = clamp(vec2(uPlaneResolution.x / uPlaneResolution.y / (uTextureResolution2.x / uTextureResolution2.y), 1.0) / vec2(1.0, uPlaneResolution.y / uPlaneResolution.x / (uTextureResolution2.y / uTextureResolution2.x)), vec2(0.0), vec2(1.0));
    
    // Dissolve threshold calculation
    float threshold = mixRatio * 1.2 - fract(sin(dot(vUv.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.2;
    
    vec4 color1 = texture2D(uTexture1, vec2(vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5, vUv.y * ratio1.y + (1.0 - ratio1.y) * 0.5));
    vec4 color2 = texture2D(uTexture2, vec2(vUv.x * ratio2.x + (1.0 - ratio2.x) * 0.5, vUv.y * ratio2.y + (1.0 - ratio2.y) * 0.5));
    
    float noiseVal = (snoise() + 1.0) * 0.5;
    vec3 finalColor = mix(color1.rgb, color2.rgb, smoothstep(threshold - 0.1, threshold + 0.1, noiseVal));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function CardCanvas({
  defaultSrc,
  hoverSrc,
  mixRatioRef,
  onRegisterRender,
}: {
  defaultSrc: string;
  hoverSrc: string;
  mixRatioRef: React.MutableRefObject<number>;
  onRegisterRender?: (fn: () => void) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: true });
    if (!gl) return;

    function compileShader(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, CARD_VERT_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, CARD_FRAG_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Quad geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posAttr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTexture1Loc = gl.getUniformLocation(prog, "uTexture1");
    const uTexture2Loc = gl.getUniformLocation(prog, "uTexture2");
    const uPlaneResLoc = gl.getUniformLocation(prog, "uPlaneResolution");
    const uTexRes1Loc = gl.getUniformLocation(prog, "uTextureResolution1");
    const uTexRes2Loc = gl.getUniformLocation(prog, "uTextureResolution2");
    const uMixRatioLoc = gl.getUniformLocation(prog, "mixRatio");

    // Load textures
    function createTexture(image: HTMLImageElement, unit: number) {
      const tex = gl!.createTexture();
      gl!.activeTexture(unit === 0 ? gl!.TEXTURE0 : gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        image,
      );
      return tex;
    }

    let tex1: WebGLTexture | null = null;
    let tex2: WebGLTexture | null = null;
    let isMounted = true;

    function render() {
      if (!gl) return;
      gl.uniform1f(uMixRatioLoc, mixRatioRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if (onRegisterRender) {
      onRegisterRender(render);
    }

    function resize() {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uPlaneResLoc, canvas.width, canvas.height);
      render();
    }

    const img1 = new Image();
    img1.crossOrigin = "anonymous";
    const handleLoad1 = () => {
      if (!isMounted || !gl) return;
      tex1 = createTexture(img1, 0);
      gl.uniform1i(uTexture1Loc, 0);
      gl.uniform2f(
        uTexRes1Loc,
        img1.naturalWidth || 1000,
        img1.naturalHeight || 1000,
      );
      if (canvas.width === 0 || canvas.height === 0) {
        resize();
      } else {
        render();
      }
    };
    img1.onload = handleLoad1;
    img1.src = defaultSrc;
    if (img1.complete && img1.naturalWidth > 0) {
      handleLoad1();
    }

    const img2 = new Image();
    img2.crossOrigin = "anonymous";
    const handleLoad2 = () => {
      if (!isMounted || !gl) return;
      tex2 = createTexture(img2, 1);
      gl.uniform1i(uTexture2Loc, 1);
      gl.uniform2f(
        uTexRes2Loc,
        img2.naturalWidth || 1000,
        img2.naturalHeight || 1000,
      );
      if (canvas.width === 0 || canvas.height === 0) {
        resize();
      } else {
        render();
      }
    };
    img2.onload = handleLoad2;
    img2.src = hoverSrc;
    if (img2.complete && img2.naturalWidth > 0) {
      handleLoad2();
    }

    resize();
    window.addEventListener("resize", resize);

    // Immediate initial paint
    render();

    return () => {
      isMounted = false;
      window.removeEventListener("resize", resize);
      if (gl) {
        if (tex1) gl.deleteTexture(tex1);
        if (tex2) gl.deleteTexture(tex2);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [defaultSrc, hoverSrc, mixRatioRef, onRegisterRender]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full object-cover pointer-events-none"
    />
  );
}

interface SvgPathHoverCardGridProps {
  showViewAllButton?: boolean;
}

export default function SvgPathHoverCardGrid({
  showViewAllButton = true,
}: SvgPathHoverCardGridProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Embla Carousel Hook
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Separate animation mixRatio ref for each card
  const mixRatioRefs = useRef<React.MutableRefObject<number>[]>(
    CARDS.map(() => ({ current: 0 })),
  );

  // Store render callbacks from each CardCanvas
  const renderFns = useRef<((() => void) | null)[]>(CARDS.map(() => null));

  // Hover interaction handlers using simplex dissolve animation
  const handleMouseEnter = (index: number) => {
    const ratioObj = mixRatioRefs.current[index];
    if (!ratioObj) return;
    gsap.killTweensOf(ratioObj);
    gsap.to(ratioObj, {
      current: 1,
      duration: 1.15,
      ease: "power2.out",
      onUpdate: () => {
        renderFns.current[index]?.();
      },
    });
  };

  const handleMouseLeave = (index: number) => {
    const ratioObj = mixRatioRefs.current[index];
    if (!ratioObj) return;
    gsap.killTweensOf(ratioObj);
    gsap.to(ratioObj, {
      current: 0,
      duration: 1.15,
      ease: "power2.out",
      onUpdate: () => {
        renderFns.current[index]?.();
      },
    });
  };

  // Cleanup any active GSAP tweens on unmount
  useEffect(() => {
    return () => {
      mixRatioRefs.current.forEach((refObj) => {
        gsap.killTweensOf(refObj);
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full text-neutral-900 font-sans selection:bg-neutral-200 py-8 md:py-16 overflow-hidden"
      // style={{
      //     fontFamily: "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
      // }}
    >
      {/* Header with Title and Carousel Controls */}
      <header className="w-full mb-4 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3vw] tracking-tight text-secondary leading-[1.08]">
            Our <span className="text-primary"> Athletes</span>
          </h1>
        </div>
        {showViewAllButton && (
          <div className="flex justify-center items-center">
            <Button label="View Our Athletes" href="/athletes" />
          </div>
        )}
        {/* <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
            className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center text-neutral-800 hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-800 disabled:hover:border-black/15 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 -translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            disabled={nextBtnDisabled}
            className="w-11 h-11 rounded-full border border-black/15 flex items-center justify-center text-neutral-800 hover:bg-secondary hover:text-white hover:border-secondary disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-neutral-800 disabled:hover:border-black/15 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed shadow-xs"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div> */}
      </header>

      {/* Embla Carousel Viewport */}
      {/* <div className="w-full overflow-hidden" ref={emblaRef}> */}
      <div className="w-full overflow-hidden">
        <div className="flex -ml-4 sm:-ml-5 lg:-ml-5 xl:-ml-6 py-5">
          {CARDS.slice(0, 4).map((card, idx) => (
            <div
              key={card.id}
              className="flex-[0_0_86%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 sm:pl-5 lg:pl-5 xl:pl-6 min-w-0"
            >
              <div
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="athlete-card group relative w-full aspect-[3/4.1] cursor-pointer will-change-transform shadow-xl select-none"
                style={{
                  clipPath: "inset(0 round 24px)",
                }}
              >
                {/* WebGL Canvas with Simplex Noise Dissolve Shader */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-[inherit] bg-neutral-900">
                  <CardCanvas
                    defaultSrc={card.defaultImage}
                    hoverSrc={card.hoverImage}
                    mixRatioRef={mixRatioRefs.current[idx]}
                    onRegisterRender={(fn) => {
                      renderFns.current[idx] = fn;
                    }}
                  />
                </div>

                {/* Athlete Name in Center (Stacked with wide tracking in reference poster style) */}
                {card.name &&
                  (() => {
                    const parts = card.name.trim().split(/\s+/);
                    const first = parts[0] || "";
                    const last = parts.slice(1).join(" ") || "";
                    return (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none group-hover:opacity-0 transition-opacity duration-500 pt-[60%]">
                        <div className="flex flex-col items-center text-center font-black uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]">
                          <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1]">
                            {first}
                          </span>
                          {last && (
                            <span className="text-xl sm:text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1] mt-1 sm:mt-1.5">
                              {last}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {/* Resting Tag Badge at bottom (fades out smoothly on hover) */}
                {/* <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                  <div className="bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-2 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cb2026]" />
                    <span className="text-white text-xs font-semibold tracking-wider uppercase">
                      {card.subtitle}
                    </span>
                  </div>
                </div> */}

                {/* Editorial Copy Reveal on Hover (Exact Products.tsx style) */}
                <div
                  className="athlete-card-copy absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.48) 55%, transparent 100%)",
                  }}
                >
                  {/* <span
                                        className="text-[#cb2026] font-bold text-xs uppercase tracking-widest mb-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                        style={{ fontFamily: "'BeausiteClassic-Medium', sans-serif" }}
                                    >
                                        {card.subtitle}
                                    </span> */}
                  <h3
                    className="text-white font-medium text-2xl sm:text-3xl md:text-4xl leading-[0.95] tracking-tight mb-2.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{
                      fontFamily: "'BeausiteClassic-Medium', sans-serif",
                    }}
                    dangerouslySetInnerHTML={{ __html: card.title }}
                  />
                  <p
                    className="text-white/80 font-light text-xs sm:text-sm md:text-[0.92rem] leading-[1.35] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{
                      fontFamily: "'BeausiteClassic-Light', sans-serif",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {/* {scrollSnaps.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === selectedIndex
                  ? "w-8 h-2 bg-secondary"
                  : "w-2 h-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )} */}

      {/* Scoped Styles for Hover Clip-Path and Lift Transition */}
      <style jsx>{`
        .athlete-card {
          clip-path: inset(0 round 24px);
          transition:
            clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1),
            transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
            box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .athlete-card:hover {
          clip-path: inset(0 round 36px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </section>
  );
}
