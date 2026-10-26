"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";
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
    hoverImage: "/images/athletes/athlete-2-back.webp",
    defaultImage: "/images/athletes/athlete-2.webp",
  },
  {
    id: "card-2",
    title: "Freestyle<br />Motocross",
    subtitle: "X-Fighters Division",
    name: "Mike Carter",
    description:
      "Launching forty feet into thin air, defying gravity with heart-stopping tsunami flips and uncompromising two-wheeled mastery.",
    hoverImage: "/images/athletes/athlete-3-back.webp",
    defaultImage: "/images/athletes/athlete-3.webp",
  },
  {
    id: "card-3",
    title: "Big Wave<br />Ocean Surfing",
    subtitle: "Heavy Water Elite",
    name: "Emily Blunt",
    description:
      "Carving towering 50-foot monster swells where split-second composure and raw nerve separate immortality from wipeout.",
    hoverImage: "/images/athletes/athlete-1-back.webp",
    defaultImage: "/images/athletes/athlete-1.webp",
  },
  {
    id: "card-4",
    title: "World Marathon<br />Major",
    subtitle: "Endurance Elite",
    name: "Varun Dev",
    description:
      "Pushing physiological thresholds over 42.195 km of grueling asphalt, where pace precision and mental fortitude redefine human endurance.",
    hoverImage: "/images/home/hero/adventure-5.webp",
    defaultImage: "/images/athletes/athlete-4.webp",
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
  precision highp float;
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

  vec2 getCoverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
    float planeAspect = planeRes.x / max(planeRes.y, 1.0);
    float texAspect = texRes.x / max(texRes.y, 1.0);
    vec2 scale = vec2(
      min(planeAspect / texAspect, 1.0),
      min(texAspect / planeAspect, 1.0)
    );
    return vec2(
      (uv.x - 0.5) * scale.x + 0.5,
      (uv.y - 0.5) * scale.y + 0.5
    );
  }

  void main() {
    vec2 uv1 = getCoverUV(vUv, uPlaneResolution, uTextureResolution1);
    vec2 uv2 = getCoverUV(vUv, uPlaneResolution, uTextureResolution2);
    
    vec4 color1 = texture2D(uTexture1, uv1);
    vec4 color2 = texture2D(uTexture2, uv2);

    float noiseVal = (snoise() + 1.0) * 0.5;
    float edge = 0.2;
    float threshold = mixRatio * (1.0 + 2.0 * edge) - edge;
    float dissolve = smoothstep(threshold - edge, threshold + edge, noiseVal);
    
    vec3 finalColor = mix(color2.rgb, color1.rgb, dissolve);
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
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

    gl.uniform1i(uTexture1Loc, 0);
    gl.uniform1i(uTexture2Loc, 1);
    gl.uniform2f(uTexRes1Loc, 1000, 1000);
    gl.uniform2f(uTexRes2Loc, 1000, 1000);

    let tex1: WebGLTexture | null = null;
    let tex2: WebGLTexture | null = null;
    let isMounted = true;

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

    function render() {
      if (!gl || !tex1 || !tex2) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tex2);
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
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uPlaneResLoc, canvas.width, canvas.height);
      render();
    }

    let loaded1 = false;
    let loaded2 = false;

    const checkBothLoaded = () => {
      if (loaded1 && loaded2 && isMounted) {
        setIsReady(true);
        resize();
      }
    };

    const img1 = new Image();
    img1.crossOrigin = "anonymous";
    img1.onload = () => {
      if (!isMounted || !gl) return;
      tex1 = createTexture(img1, 0);
      gl.uniform2f(
        uTexRes1Loc,
        img1.naturalWidth || 1000,
        img1.naturalHeight || 1000,
      );
      loaded1 = true;
      checkBothLoaded();
    };
    img1.src = defaultSrc;
    if (img1.complete && img1.naturalWidth > 0) {
      img1.onload(new Event("load"));
    }

    const img2 = new Image();
    img2.crossOrigin = "anonymous";
    img2.onload = () => {
      if (!isMounted || !gl) return;
      tex2 = createTexture(img2, 1);
      gl.uniform2f(
        uTexRes2Loc,
        img2.naturalWidth || 1000,
        img2.naturalHeight || 1000,
      );
      loaded2 = true;
      checkBothLoaded();
    };
    img2.src = hoverSrc;
    if (img2.complete && img2.naturalWidth > 0) {
      img2.onload(new Event("load"));
    }

    resize();
    window.addEventListener("resize", resize);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
          })
        : null;
    if (ro && canvas) {
      ro.observe(canvas);
    }

    return () => {
      isMounted = false;
      ro?.disconnect();
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
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
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

  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setActiveCardIndex((prev) => {
      const isCurrentlyActive = prev === index;
      const nextIndex = isCurrentlyActive ? null : index;

      if (nextIndex !== null) {
        handleMouseEnter(index);
      } else {
        handleMouseLeave(index);
      }

      if (prev !== null && prev !== index) {
        handleMouseLeave(prev);
      }

      return nextIndex;
    });
  };

  // Close active card on mobile when tapping outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        if (activeCardIndex !== null) {
          handleMouseLeave(activeCardIndex);
          setActiveCardIndex(null);
        }
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [activeCardIndex]);

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
      className="w-full selection:bg-neutral-200 overflow-hidden"
    >
      {/* Header with Title and Carousel Controls */}
      <header className="w-full mb-4 md:mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3vw] tracking-tight text-secondary leading-[1.08]">
            Our <br className="md:hidden" />
            Elite<span className="text-primary"> Champions</span>
          </h1>
        </div>
        {showViewAllButton && (
          <div className="flex justify-center items-center">
            <Button label="View Athletes" href="/athletes" />
          </div>
        )}
      </header>

      {/* Responsive Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div className="w-full py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-5 xl:gap-6">
          {CARDS.slice(0, 4).map((card, idx) => {
            const isActive = activeCardIndex === idx;
            return (
              <div key={card.id} className="w-full min-w-0">
                <div
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.matchMedia("(hover: hover)").matches
                    ) {
                      handleMouseEnter(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.matchMedia("(hover: hover)").matches
                    ) {
                      if (activeCardIndex !== idx) {
                        handleMouseLeave(idx);
                      }
                    }
                  }}
                  className={`athlete-card group relative w-full aspect-[3/4.1] cursor-pointer will-change-transform select-none rounded-[24px] overflow-hidden ${
                    isActive ? "is-active" : ""
                  }`}
                >
                  {/* Instant Fallback / Base Image + WebGL Canvas with Simplex Noise Dissolve Shader */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-[inherit] bg-neutral-900">
                    <NextImage
                      src={card.defaultImage}
                      alt={card.name || "Athlete"}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover pointer-events-none select-none"
                    />
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
                        <div
                          className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 select-none transition-opacity duration-500 pt-[60%] ${
                            isActive
                              ? "opacity-0"
                              : "opacity-100 group-hover:opacity-0"
                          }`}
                        >
                          <div className="flex flex-col items-center text-center font-black uppercase text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.3)]">
                            <span className="text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1]">
                              {first}
                            </span>
                            {last && (
                              <span className="text-2xl md:text-3xl lg:text-[1.7vw] tracking-[0.65em] sm:tracking-[0.75em] lg:tracking-[0.85em] -mr-[0.65em] sm:-mr-[0.75em] lg:-mr-[0.85em] leading-[1.1] mt-1 sm:mt-1.5">
                                {last}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                  {/* Editorial Copy Reveal on Hover / Click (Exact Products.tsx style) */}
                  <div
                    className={`athlete-card-copy absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.48) 55%, transparent 100%)",
                    }}
                  >
                    <h3
                      className={`text-white font-medium text-2xl sm:text-3xl md:text-4xl leading-[0.95] tracking-tight mb-2.5 transform transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                        isActive
                          ? "translate-y-0"
                          : "translate-y-3 group-hover:translate-y-0"
                      }`}
                      dangerouslySetInnerHTML={{ __html: card.title }}
                    />
                    <p
                      className={`text-white/80 font-light text-xs sm:text-sm md:text-[0.92rem] leading-[1.35] transform transition-transform duration-700 delay-75 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                        isActive
                          ? "translate-y-0"
                          : "translate-y-3 group-hover:translate-y-0"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoped Styles for Hover and Lift Transition */}
      <style jsx>{`
        .athlete-card {
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>
    </section>
  );
}
