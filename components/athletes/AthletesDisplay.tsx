"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

interface CardData {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    description: string;
    defaultImage: string;
    hoverImage: string;
}

const CARDS: CardData[] = [
    {
        id: "card-1",
        slug: "formula-1",
        title: "Formula 1<br />Grand Prix",
        subtitle: "Scuderia Racing",
        description:
            "Precision aerodynamics meet raw asphalt adrenaline. Pushing cutting-edge engineering past 340 km/h to capture the checkered flag.",
        defaultImage: "/images/home/athletes/hover-athlete-1.jpg",
        hoverImage: "/images/home/athletes/athlete-1.jpg",
    },
    {
        id: "card-2",
        slug: "freestyle-motocross",
        title: "Freestyle<br />Motocross",
        subtitle: "X-Fighters Division",
        description:
            "Launching forty feet into thin air, defying gravity with heart-stopping tsunami flips and uncompromising two-wheeled mastery.",
        defaultImage: "/images/home/athletes/hover-athlete-2.jpg",
        hoverImage: "/images/home/athletes/athlete-2.jpg",
    },
    {
        id: "card-3",
        slug: "ocean-surfing",
        title: "Big Wave<br />Ocean Surfing",
        subtitle: "Heavy Water Elite",
        description:
            "Carving towering 50-foot monster swells where split-second composure and raw nerve separate immortality from wipeout.",
        defaultImage: "/images/home/athletes/hover-athlete-3.jpg",
        hoverImage: "/images/home/athletes/athlete-3.jpg",
    },
    {
        id: "card-4",
        slug: "backcountry-snowboarding",
        title: "Backcountry<br />Snowboarding",
        subtitle: "Alpine Freeride",
        description:
            "Untouched powder corridors and sheer glacier drops. Navigating extreme mountain frontiers with fearless speed and razor precision.",
        defaultImage: "/images/home/athletes/hover-athlete-1.jpg",
        hoverImage: "/images/home/athletes/athlete-1.jpg",
    },
    {
        id: "card-5",
        slug: "street-skateboarding",
        title: "Urban Street<br />Skateboarding",
        subtitle: "Street League Pro",
        description:
            "Transforming raw city concrete into an arena of technical innovation, balance, and relentless boundary-pushing skate progression.",
        defaultImage: "/images/home/athletes/hover-athlete-2.jpg",
        hoverImage: "/images/home/athletes/athlete-2.jpg",
    },
    {
        id: "card-6",
        slug: "rock-climbing",
        title: "Alpine Cliff<br />Rock Climbing",
        subtitle: "Vertical Horizons",
        description:
            "Ascending sheer monolithic granite walls with unyielding grip, pure mental clarity, and zero margin for error.",
        defaultImage: "/images/home/athletes/hover-athlete-3.jpg",
        hoverImage: "/images/home/athletes/athlete-3.jpg",
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

// Simplex Noise Dissolve Fragment Shader replicated from SvgPathHoverCardGrid
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
            gl.uniform2f(uTexRes1Loc, img1.naturalWidth || 1000, img1.naturalHeight || 1000);
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
            gl.uniform2f(uTexRes2Loc, img2.naturalWidth || 1000, img2.naturalHeight || 1000);
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

    return <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />;
}

export default function AthletesDisplay() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Separate animation mixRatio ref for each of the 6 cards
    const mixRatioRefs = useRef<React.MutableRefObject<number>[]>(
        CARDS.map(() => ({ current: 0 }))
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

    // Cleanup active GSAP tweens on unmount
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
            className="w-full text-neutral-900 font-sans selection:bg-neutral-200 py-16 sm:py-20 lg:py-[5vw] px-4 sm:px-8 lg:px-[5vw]"
        >
            <div className="w-full lg:max-w-none mx-auto">
                {/* Section Header */}
                <header className="w-full mb-10 sm:mb-14 lg:mb-[3.2vw] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        {/* <span className="text-primary font-bold text-xs sm:text-sm lg:text-[0.85vw] uppercase tracking-widest block mb-2">
                            World-Class Roster
                        </span> */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                            Our <span className="text-primary">Athletes</span>
                        </h2>
                    </div>
                    {/* <p className="text-neutral-500 text-sm sm:text-base lg:text-[0.95vw] max-w-md lg:max-w-[28vw] leading-relaxed">
                        Precision, nerve, and relentless dedication. Meet the champions redefining the limits of human achievement.
                    </p> */}
                </header>

                {/* 3x3 Grid (6 Athlete Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-[1.8vw]">
                    {CARDS.map((card, idx) => (
                        <Link
                            key={card.id}
                            href={`/athletes/${card.slug}`}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            onMouseLeave={() => handleMouseLeave(idx)}
                            className="athlete-card group relative w-full aspect-[3/4.1] cursor-pointer will-change-transform shadow-xl select-none block"
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

                            {/* Resting Tag Badge at bottom (fades out smoothly on hover) */}
                            <div className="absolute bottom-5 left-5 right-5 lg:bottom-[1.3vw] lg:left-[1.3vw] lg:right-[1.3vw] z-10 flex items-center justify-between pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                <div className="bg-black/50 backdrop-blur-md px-3.5 py-1.5 lg:px-[0.9vw] lg:py-[0.4vw] rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                                    <span className="w-1.5 h-1.5 lg:w-[0.4vw] lg:h-[0.4vw] rounded-full bg-[#cb2026]" />
                                    <span className="text-white text-xs lg:text-[0.72vw] font-semibold tracking-wider uppercase">
                                        {card.subtitle}
                                    </span>
                                </div>
                            </div>

                            {/* Editorial Copy Reveal on Hover */}
                            <div
                                className="athlete-card-copy absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-[2vw] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                style={{
                                    background:
                                        "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.52) 55%, transparent 100%)",
                                }}
                            >
                                {/* <span
                                    className="text-[#cb2026] font-bold text-xs lg:text-[0.75vw] uppercase tracking-widest mb-1.5 lg:mb-[0.4vw] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                >
                                    {card.subtitle}
                                </span> */}
                                <h3
                                    className="text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[2vw] leading-[0.95] tracking-tight mb-2.5 lg:mb-[0.7vw] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                    style={{ fontFamily: "'BeausiteClassic-Medium', sans-serif" }}
                                    dangerouslySetInnerHTML={{ __html: card.title }}
                                />
                                <p
                                    className="text-white/80 font-light text-xs sm:text-sm md:text-[0.92rem] lg:text-[0.82vw] leading-[1.38] transform translate-y-3 group-hover:translate-y-0 transition-transform duration-700 delay-75 ease-[cubic-bezier(0.19,1,0.22,1)]"
                                    style={{ fontFamily: "'BeausiteClassic-Light', sans-serif" }}
                                >
                                    {card.description}
                                </p>

                                {/* Clean & Minimal View Profile CTA */}
                                <div className="mt-3.5 lg:mt-[0.9vw] inline-flex items-center gap-1.5 text-xs lg:text-[0.75vw] text-white/90 font-semibold uppercase tracking-wider group-hover:text-white transition-colors duration-300">
                                    <span className="text-white">View Athlete Profile</span>
                                    <svg
                                        className="w-3.5 h-3.5 lg:w-[0.8vw] lg:h-[0.8vw] transform group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Scoped Styles for Hover Clip-Path and Lift Transition */}
            <style jsx>{`
                .athlete-card {
                    clip-path: inset(0 round 24px);
                    transition: clip-path 0.75s cubic-bezier(0.19, 1, 0.22, 1),
                        transform 0.4s cubic-bezier(0.19, 1, 0.22, 1),
                        box-shadow 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .athlete-card:hover {
                    clip-path: inset(0 round 36px);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
                    transform: translateY(-4px);
                }
            `}</style>
        </section>
    );
}