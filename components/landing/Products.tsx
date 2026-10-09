"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface MarketingCardItem {
    id: string;
    title: string;
    description: string;
    defaultImage: string;
    hoverImage: string;
    href: string;
}

const MARKETING_CARDS: MarketingCardItem[] = [
    {
        id: "card-1",
        title: "Blackcurrant<br />Blueberry Refreshment",
        description:
            "Red Bull Carbonated Blackcurrant Blueberry 330ml pairs lively carbonation with the rich, fruity taste of blackcurrant and blueberry. Smooth, refreshing, and ready to enjoy, it’s a flavorful choice for work, study, gaming, or time on the move—whenever you want a refreshing drink with an energizing boost.",
        defaultImage: "/images/home/hero/hover-long-can.jpg",
        hoverImage: "/images/home/hero/long-can.jpg",
        href: "/energy-drinks/carbonated-blackcurrant-blueberry-330ml",
    },
    {
        id: "card-2",
        title: "Everyday Energy<br />with Red Bull Gold",
        description:
            "Meet Red Bull Gold 250ml—a convenient companion for busy days and active routines. Made with high-quality ingredients, including taurine and B-group vitamins, it brings together amino acids and carbohydrates in a crisp, refreshing drink. Keep a can close for the moments that call for focus, movement, and a little extra energy.",
        defaultImage: "/images/home/hero/hover-short-can.jpg",
        hoverImage: "/images/home/hero/short-can.jpg",
        href: "/energy-drinks/red-bull-250ml",
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

// Simplex Noise Dissolve Fragment Shader replicated from drinkzoi.co
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
            gl.STATIC_DRAW
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
            gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, image);
            return tex;
        }

        let tex1: WebGLTexture | null = null;
        let tex2: WebGLTexture | null = null;
        let isMounted = true;

        const img1 = new Image();
        img1.crossOrigin = "anonymous";
        function render() {
            if (!gl) return;
            gl.uniform1f(uMixRatioLoc, mixRatioRef.current);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        if (onRegisterRender) {
            onRegisterRender(render);
        }

        img1.onload = () => {
            if (!isMounted || !gl) return;
            tex1 = createTexture(img1, 0);
            gl.uniform1i(uTexture1Loc, 0);
            gl.uniform2f(uTexRes1Loc, img1.naturalWidth || 1000, img1.naturalHeight || 1000);
            render();
        };
        img1.src = defaultSrc;
        if (img1.complete) {
            img1.onload(new Event("load"));
        }

        const img2 = new Image();
        img2.crossOrigin = "anonymous";
        img2.onload = () => {
            if (!isMounted || !gl) return;
            tex2 = createTexture(img2, 1);
            gl.uniform1i(uTexture2Loc, 1);
            gl.uniform2f(uTexRes2Loc, img2.naturalWidth || 1000, img2.naturalHeight || 1000);
            render();
        };
        img2.src = hoverSrc;
        if (img2.complete) {
            img2.onload(new Event("load"));
        }

        function resize() {
            if (!canvas || !gl) return;
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uPlaneResLoc, canvas.width, canvas.height);
            render();
        }
        resize();
        window.addEventListener("resize", resize);

        // Initial paint
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

    return <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />;
}

export default function Products() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsWrapperRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const heroTextRef = useRef<HTMLDivElement>(null);

    // Separate animation mixRatio ref for each of the 2 cards
    const mixRatioRefs = useRef<React.MutableRefObject<number>[]>([
        { current: 0 },
        { current: 0 },
    ]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const cards = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];
        if (cards.length < 2) return;

        const card0 = cards[0];
        const card1 = cards[1];
        const heroText = heroTextRef.current;

        const ctx = gsap.context(() => {
            // Set initial fanned stack layout for 2 cards
            gsap.set(card0, { rotation: -6, xPercent: 25, yPercent: 2, transformOrigin: "bottom center", zIndex: 5 });
            gsap.set(card1, { rotation: 6, xPercent: -25, yPercent: 0, transformOrigin: "bottom center", zIndex: 10 });

            if (heroText) {
                gsap.set(heroText, { y: 35, opacity: 0 });
            }

            // Master Scroll-driven timeline pinned across the section
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: "top top",
                    end: "+=100%",
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    refreshPriority: 10,
                    onUpdate: (self) => {
                        const p = self.progress;
                        // Only enable pointer events in the interactive phase
                        cards.forEach((card) => {
                            if (p >= 0.15 && p <= 0.88) {
                                card.style.pointerEvents = "auto";
                            } else {
                                card.style.pointerEvents = "none";
                            }
                        });
                    },
                },
            });

            // 1. Entrance: Cards fan out and straighten up side-by-side
            tl.to(
                card0,
                {
                    rotation: 0,
                    xPercent: 0,
                    yPercent: 0,
                    duration: 0.35,
                    ease: "power2.out",
                },
                0
            )
                .to(
                    card1,
                    {
                        rotation: 0,
                        xPercent: 0,
                        yPercent: 0,
                        duration: 0.35,
                        ease: "power2.out",
                    },
                    0
                );

            // Heading slides into place above cards
            if (heroText) {
                tl.to(
                    heroText,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.35,
                        ease: "power2.out",
                    },
                    0
                );
            }

            // 2. Interactive Hold Phase (Hold in center for user exploration)
            tl.to({}, { duration: 0.65 });

            // 3. Exit: Cards fan back out and text slides up/out
            tl.to(
                card0,
                {
                    rotation: -6,
                    xPercent: -30,
                    yPercent: -4,
                    duration: 0.35,
                    ease: "power2.in",
                },
                ">"
            )
                .to(
                    card1,
                    {
                        rotation: 6,
                        xPercent: 30,
                        yPercent: -4,
                        duration: 0.35,
                        ease: "power2.in",
                    },
                    "<"
                );

            if (heroText) {
                tl.to(
                    heroText,
                    {
                        y: -35,
                        opacity: 0,
                        duration: 0.35,
                        ease: "power2.in",
                    },
                    "<"
                );
            }
        }, container);

        const refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);

        return () => {
            clearTimeout(refreshTimer);
            ctx.revert();
        };
    }, []);

    // Store render callbacks from each CardCanvas
    const renderFns = useRef<((() => void) | null)[]>([null, null]);

    // Hover interaction handlers using simplex dissolve animation
    const handleMouseEnter = (index: number) => {
        const ratioObj = mixRatioRefs.current[index];
        gsap.killTweensOf(ratioObj);
        gsap.to(ratioObj, {
            current: 1,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                renderFns.current[index]?.();
            },
        });
    };

    const handleMouseLeave = (index: number) => {
        const ratioObj = mixRatioRefs.current[index];
        gsap.killTweensOf(ratioObj);
        gsap.to(ratioObj, {
            current: 0,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                renderFns.current[index]?.();
            },
        });
    };

    return (
        <div className="w-full">
            <section
                ref={containerRef}
                className="relative w-full min-h-screen bg-black overflow-hidden select-none text-neutral-900"
                style={{
                    fontFamily: "'BeausiteClassic-Light', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
            >
                {/* Sticky Fullscreen Container - Positioned cleanly towards top */}
                <div className="relative w-full h-screen flex flex-col items-center justify-start overflow-hidden  ">
                    {/* Heading Above The Cards */}
                    <div
                        ref={heroTextRef}
                        className="w-full text-center mb-3 sm:mb-4 md:mb-16 z-20 will-change-transform shrink-0"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2vw] tracking-tight text-white leading-[1.08]">
                            A Taste Above The Rest
                        </h1>
                    </div>

                    {/* The 2 Marketing Cards Row */}
                    <div
                        ref={cardsWrapperRef}
                        className="relative z-10 w-full max-w-[1240px] flex items-center justify-center gap-6 sm:gap-8 md:gap-24 mx-auto px-4"
                    >
                        {MARKETING_CARDS.map((card, idx) => (
                            <Link
                                key={card.id}
                                href={card.href}
                                ref={(el) => {
                                    cardRefs.current[idx] = el;
                                }}
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onMouseLeave={() => handleMouseLeave(idx)}
                                className="marketing-card group relative block w-full max-w-[480px] lg:max-w-[500px] h-[68vh] sm:h-[72vh] md:h-[74vh] max-h-[720px] aspect-[3/4.1] cursor-pointer will-change-transform shadow-2xl shrink no-underline"
                                style={{
                                    clipPath: "inset(0 round 24px)",
                                }}
                            >
                                {/* WebGL Canvas with Simplex Noise Dissolve Shader */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-[inherit]">
                                    <CardCanvas
                                        defaultSrc={card.defaultImage}
                                        hoverSrc={card.hoverImage}
                                        mixRatioRef={mixRatioRefs.current[idx]}
                                        onRegisterRender={(fn) => {
                                            renderFns.current[idx] = fn;
                                        }}
                                    />
                                </div>

                                {/* Editorial Copy Reveal on Hover */}
                                <div
                                    className="marketing-card-copy absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                    style={{
                                        background:
                                            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)",
                                    }}
                                >
                                    <h3
                                        className="text-white font-medium text-2xl sm:text-3xl md:text-4xl leading-[0.9] tracking-tight mb-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                        style={{ fontFamily: "'BeausiteClassic-Medium', sans-serif" }}
                                        dangerouslySetInnerHTML={{ __html: card.title }}
                                    />
                                    <p
                                        className="text-white/80 font-light text-xs sm:text-sm md:text-[0.95rem] leading-[1.3] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                        style={{ fontFamily: "'BeausiteClassic-Light', sans-serif" }}
                                    >
                                        {card.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Scoped Styles for Hover Clip-Path and Transitions */}
                <style jsx>{`
        .marketing-card {
          clip-path: inset(0 round 24px);
          transition: clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1),
            transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .marketing-card:hover {
          clip-path: inset(0 round 36px);
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>
            </section>
        </div>
    );
}