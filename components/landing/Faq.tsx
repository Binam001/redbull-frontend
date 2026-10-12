"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface FAQItem {
    id: number;
    question: string;
    answers: string[];
}

const faqLists: FAQItem[] = [
    {
        id: 1,
        question: "When is the best time to drink Red Bull?",
        answers: [
            "Red Bull is appreciated worldwide by top athletes, busy professionals, students, and drivers on long journeys. Whether you need renewed focus before an intense workout, alert energy on the road, or a sharp mind during demanding projects, Red Bull vitalizes body and mind whenever you need it most.",
        ],
    },
    {
        id: 2,
        question: "What are the key ingredients inside a can of Red Bull?",
        answers: [
            "Every can contains high-grade caffeine for alertness, taurine (an amino acid naturally occurring in the human body and daily diet), essential B-group vitamins (B3, B5, B6, B12) to support energy metabolism, real sugars, and pristine Alpine water.",
        ],
    },
    {
        id: 3,
        question: "Can Red Bull be used during sports and high-intensity training?",
        answers: [
            "Yes! World champions and elite athletes across Formula 1, extreme sports, football, and endurance athletics rely on Red Bull. Its balanced formulation helps increase endurance capacity, optimize reaction speed, and maintain sharp focus during high-intensity performance.",
        ],
    },
    {
        id: 4,
        question: "Does Red Bull really give you wings?",
        answers: [
            "It gives you the energy, stamina, and mental drive to reach higher and push past your limits. 'Gives You Wings' isn't just a slogan—it's the mindset of breaking boundaries and turning ambition into reality.",
        ],
    },
];

export default function FaqSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        let ctx: gsap.Context;

        const setupAnimations = () => {
            ctx?.revert();

            ctx = gsap.context(() => {
                const messages =
                    sectionRef.current?.querySelectorAll<HTMLElement>(".faq-message");
                if (!messages || messages.length === 0) return;

                // 1. Clear any prior inline styles to ensure natural expanded dimensions are measured
                messages.forEach((message) => {
                    gsap.set(message, { clearProps: "all" });
                    const row = message.parentElement as HTMLElement | null;
                    if (row) row.style.minHeight = "";
                    const copy = message.querySelectorAll<HTMLElement>(".faq-content p");
                    gsap.set(copy, { clearProps: "all" });
                    const indicator =
                        message.querySelector<HTMLElement>(".typing-indicator");
                    if (indicator) gsap.set(indicator, { clearProps: "all" });
                });

                // Force browser layout reflow before measuring
                if (sectionRef.current) {
                    void sectionRef.current.offsetHeight;
                }

                // 2. Measure natural expanded dimensions for every message bubble
                const itemData: {
                    message: HTMLElement;
                    faqRow: HTMLElement | null;
                    typingIndicator: HTMLElement | null;
                    messageCopy: NodeListOf<HTMLElement>;
                    expandedWidth: number;
                    expandedHeight: number;
                }[] = [];

                const isMobile = window.innerWidth < 768;
                const circleSize = isMobile ? 42 : 64;
                const padX = isMobile ? "1.5rem" : "2rem";
                const padTop = isMobile ? "1.25rem" : "1.5rem";
                const padBottom = isMobile ? "1.5rem" : "1.85rem";
                const radius = isMobile ? "1.75rem" : "2rem";

                messages.forEach((message) => {
                    const faqRow = message.parentElement as HTMLElement | null;
                    const typingIndicator =
                        message.querySelector<HTMLElement>(".typing-indicator");
                    const messageCopy =
                        message.querySelectorAll<HTMLElement>(".faq-content p");
                    const contentEl =
                        message.querySelector<HTMLElement>(".faq-content");

                    // Natural width & height in current viewport
                    const naturalWidth = message.offsetWidth;
                    message.style.width = `${naturalWidth}px`;

                    // Measure content height with all text
                    const contentScrollHeight = contentEl ? contentEl.scrollHeight : 0;
                    const contentOffsetHeight = contentEl ? contentEl.offsetHeight : 0;
                    const contentHeight = Math.max(contentScrollHeight, contentOffsetHeight);

                    const padTopPx = isMobile ? 20 : 24;
                    const padBottomPx = isMobile ? 24 : 32;
                    const calculatedHeight = contentHeight + padTopPx + padBottomPx + 4;

                    const naturalHeight = message.offsetHeight;
                    const scrollHeight = message.scrollHeight;

                    // Guard against any collapsed measurement glitch and ensure generous breathing room
                    const finalWidth = Math.max(naturalWidth, isMobile ? 120 : 180);
                    const finalHeight = Math.max(naturalHeight, scrollHeight, calculatedHeight, circleSize);

                    itemData.push({
                        message,
                        faqRow,
                        typingIndicator,
                        messageCopy,
                        expandedWidth: finalWidth,
                        expandedHeight: finalHeight,
                    });
                });

                // Standardize question widths so all questions have the exact same width
                const questionItems = itemData.filter((item) =>
                    item.message.classList.contains("faq-question")
                );
                if (questionItems.length > 0) {
                    const uniformQuestionWidth = Math.max(
                        ...questionItems.map((item) => item.expandedWidth)
                    );
                    questionItems.forEach((item) => {
                        item.expandedWidth = uniformQuestionWidth;
                        item.message.style.width = `${uniformQuestionWidth}px`;
                    });
                }

                // 3. Set initial collapsed state and register timelines with ScrollTrigger
                itemData.forEach(
                    ({
                        message,
                        faqRow,
                        typingIndicator,
                        messageCopy,
                        expandedWidth,
                        expandedHeight,
                    }) => {
                        if (faqRow) {
                            faqRow.style.minHeight = `${expandedHeight}px`;
                        }

                        // Collapse into an invisible circle initially (42px on mobile, 64px on desktop)
                        gsap.set(message, {
                            width: circleSize,
                            height: circleSize,
                            borderRadius: "50%",
                            padding: 0,
                            scale: 0,
                            overflow: "hidden",
                        });

                        gsap.set(messageCopy, { opacity: 0 });
                        if (typingIndicator) {
                            gsap.set(typingIndicator, { autoAlpha: 1 });
                        }

                        let collapseWhenDone = false;

                        // Timeline 1: The circle popping into view
                        const enterTimeline = gsap.timeline({ paused: true });
                        enterTimeline.to(message, {
                            scale: 1,
                            duration: 0.35,
                            ease: "back.out(1.4)",
                        });

                        // Timeline 2: Expanding from circle to full message bubble
                        const expandTimeline = gsap.timeline({
                            paused: true,
                            onReverseComplete: () => {
                                if (collapseWhenDone) {
                                    collapseWhenDone = false;
                                    enterTimeline.reverse();
                                }
                            },
                        });

                        expandTimeline
                            .to(typingIndicator, {
                                autoAlpha: 0,
                                duration: 0.2,
                            })
                            .to(message, {
                                width: expandedWidth,
                                borderRadius: radius,
                                paddingLeft: padX,
                                paddingRight: padX,
                                duration: 0.45,
                                ease: "power3.inOut",
                            })
                            .to(
                                message,
                                {
                                    height: expandedHeight,
                                    paddingTop: padTop,
                                    paddingBottom: padBottom,
                                    duration: 0.45,
                                    ease: "power3.inOut",
                                },
                                "-=0.25",
                            )
                            .to(
                                messageCopy,
                                {
                                    opacity: 1,
                                    duration: 0.3,
                                    stagger: 0.06,
                                },
                                "-=0.25",
                            )
                            // Set height to auto after expansion so multi-line text will never overflow
                            .set(message, {
                                height: "auto",
                                overflow: "visible",
                            });

                        // Use the row as trigger because its position is static and stable
                        const triggerEl = faqRow || message;

                        // Trigger 1: Pop in the circle when reaching 85% down the viewport
                        ScrollTrigger.create({
                            trigger: triggerEl,
                            start: "top 85%",
                            refreshPriority: -1,
                            onEnter: () => {
                                collapseWhenDone = false;
                                enterTimeline.play();
                            },
                            onLeaveBack: () => {
                                if (expandTimeline.progress() > 0) {
                                    collapseWhenDone = true;
                                } else {
                                    enterTimeline.reverse();
                                }
                            },
                        });

                        // Trigger 2: Expand the bubble when reaching 70% down the viewport
                        ScrollTrigger.create({
                            trigger: triggerEl,
                            start: "top 70%",
                            refreshPriority: -1,
                            onEnter: () => expandTimeline.play(),
                            onLeaveBack: () => {
                                message.style.height = `${expandedHeight}px`;
                                message.style.overflow = "hidden";
                                expandTimeline.reverse();
                            },
                        });
                    },
                );

                ScrollTrigger.sort();
                ScrollTrigger.refresh();
            }, sectionRef);
        };

        if (typeof document !== "undefined" && document.fonts) {
            document.fonts.ready.then(() => {
                setupAnimations();
            });
        } else {
            setupAnimations();
        }

        // Re-run setup after web fonts and external assets finish loading
        const fontTimer = setTimeout(() => {
            setupAnimations();
        }, 500);

        // Refresh after short delay so any pinned sections above (e.g. HeroTry) have settled
        const timer1 = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);

        const timer2 = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 800);

        let lastWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setupAnimations();
            }, 200);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(fontTimer);
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", handleResize);
            ctx?.revert();
            if (sectionRef.current) {
                const msgs =
                    sectionRef.current.querySelectorAll<HTMLElement>(".faq-message");
                msgs.forEach((m) => {
                    gsap.set(m, { clearProps: "all" });
                    if (m.parentElement) m.parentElement.style.minHeight = "";
                });
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="faq relative w-full flex flex-col gap-8 xl:gap-16 justify-center items-center text-center overflow-hidden py-28"
        >
            <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700;1,800;1,900&family=Host+Grotesk:ital,wght@0,600;0,700;0,800;1,600;1,700;1,800&display=swap");

        @keyframes typing-jump {
          0%, 60%, 100% {
            -webkit-transform: translate3d(0, 0, 0);
            transform: translate3d(0, 0, 0);
            opacity: 0.35;
          }
          30% {
            -webkit-transform: translate3d(0, -6px, 0);
            transform: translate3d(0, -6px, 0);
            opacity: 1;
          }
        }

        .typing-indicator span {
          display: inline-block;
          width: 0.35rem;
          height: 0.35rem;
          border-radius: 9999px;
          animation: typing-jump 1.2s infinite ease-in-out;
          -webkit-animation: typing-jump 1.2s infinite ease-in-out;
          will-change: transform, opacity;
        }

        @media (min-width: 768px) {
          @keyframes typing-jump {
            0%, 60%, 100% {
              -webkit-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0);
              opacity: 0.35;
            }
            30% {
              -webkit-transform: translate3d(0, -8px, 0);
              transform: translate3d(0, -8px, 0);
              opacity: 1;
            }
          }

          .typing-indicator span {
            width: 0.55rem;
            height: 0.55rem;
          }
        }

        .typing-indicator span:nth-child(1) {
          -webkit-animation-delay: 0s !important;
          animation-delay: 0s !important;
        }

        .typing-indicator span:nth-child(2) {
          -webkit-animation-delay: 0.2s !important;
          animation-delay: 0.2s !important;
        }

        .typing-indicator span:nth-child(3) {
          -webkit-animation-delay: 0.4s !important;
          animation-delay: 0.4s !important;
        }
      `}</style>

            {/* Section Title */}
            {/* <h2 className="text-3xl md:text-5xl xl:text-[3.5vw] tracking-[-0.01em] leading-[0.9] w-full md:w-[75%] text-primary">
        The Questions on Your Mind
      </h2> */}
            <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5vw] tracking-tight text-secondary leading-[1.08]">
                    The <span className="text-primary">Questions</span> on Your Mind
                </h2>
            </div>
            {/* <TextChemicalBond
        text={"The Questions on Your Mind"}
        particlesPerChar={4}
        lensRadius={80}
        textColor="var(--primary)"
        accentColor="var(--primary)"
        lineColor="var(--secondary)"
        className="text-[clamp(1.8rem,3vw,5.5rem)] text-primary uppercase text-left items-left"
      /> */}

            {/* FAQ Chat Container */}
            <div className="faq-container w-full md:w-[75vw] mx-auto flex flex-col gap-8">
                {faqLists.map((item) => (
                    <div key={item.id} className="faq-item flex flex-col gap-6 w-full">
                        {/* Question (Left-aligned) */}
                        <div className="faq-row faq-question-slot flex justify-start w-full">
                            <div className="faq-question faq-message relative overflow-hidden self-start max-w-[90%] md:max-w-[70%] px-6 md:px-8 pt-5 md:pt-6 pb-6 md:pb-7 rounded-4xl border border-secondary/20 bg-primary text-white">
                                {/* Typing Indicator */}
                                <div className="typing-indicator absolute inset-0 flex items-center justify-center gap-1 md:gap-[0.35rem] pointer-events-none">
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-white" />
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-white" />
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-white" />
                                </div>

                                {/* Content */}
                                <div className="faq-content w-max max-w-full flex flex-col gap-4 text-left font-['Host_Grotesk',sans-serif] font-bold xl:text-[1.2vw] leading-relaxed text-white">
                                    <p className="opacity-0">{item.question}</p>
                                </div>
                            </div>
                        </div>

                        {/* Answer (Right-aligned) */}
                        <div className="faq-row faq-answer-slot flex justify-end w-full">
                            <div className="faq-answer faq-message relative overflow-hidden self-start max-w-[90%] md:max-w-[70%] px-6 md:px-8 pt-5 md:pt-6 pb-6 md:pb-7.5 rounded-4xl border border-secondary/20 bg-zinc-100 text-black flex flex-col gap-4">
                                {/* Typing Indicator */}
                                <div className="typing-indicator absolute inset-0 flex items-center justify-center gap-1 md:gap-[0.35rem] pointer-events-none">
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-black/90" />
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-black/90" />
                                    <span className="inline-block size-[0.35rem] md:size-[0.55rem] rounded-full bg-black/90" />
                                </div>

                                {/* Content */}
                                <div className="faq-content w-max max-w-full flex flex-col gap-4 text-left font-['Host_Grotesk',sans-serif] font-bold xl:text-[1.2vw] leading-relaxed">
                                    {item.answers.map((answerPara, pIdx) => (
                                        <p key={pIdx} className="opacity-0">
                                            {answerPara}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}