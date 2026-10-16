"use client";

import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeadingProps {
  /** The text content to display (alternative to passing children) */
  text?: string;
  /** React children (supports plain strings, *highlight* markdown, or nested <span>) */
  children?: React.ReactNode;
  /** Word(s) or phrase(s) to highlight in red (primary color). Can be a string, string array, or RegExp */
  highlight?: string | string[] | RegExp;
  /** Semantic HTML tag to render. Defaults to "h2" */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
  /** Overall container className (typography, alignment, font size, tracking, leading, etc.) */
  className?: string;
  /** Base text color class. Defaults to "text-secondary" (Red Bull Navy #233971) */
  baseClassName?: string;
  /** Highlight text color class. Defaults to "text-primary" (Red Bull Red #cb2026) */
  highlightClassName?: string;
  /** Animation duration per character in seconds. Defaults to 0.75 */
  animationDuration?: number;
  /** GSAP easing curve. Defaults to "back.out(1.4)" for signature bounce */
  ease?: string;
  /** Stagger delay between characters. Defaults to 0.018 */
  stagger?: number;
  /** Initial Y percent displacement. Defaults to 110 */
  yPercent?: number;
  /** Initial rotation angle in degrees. Defaults to 0 */
  rotate?: number;
  /** Delay before animation starts (seconds). Defaults to 0 */
  delay?: number;
  /** Whether to trigger the animation when scrolled into view. Defaults to true */
  triggerOnScroll?: boolean;
  /** ScrollTrigger start position. Defaults to "top 85%" */
  scrollStart?: string;
  /** Custom scroll trigger element ref if different from heading */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Callback fired when the animation completes */
  onComplete?: () => void;
}

interface CharItem {
  char: string;
  isHighlight: boolean;
  customClass?: string;
}

interface WordItem {
  chars: CharItem[];
}

/**
 * Parses children / text prop and highlight rules into structured words and characters
 */
function parseContent(
  textProp?: string,
  childrenProp?: React.ReactNode,
  highlightProp?: string | string[] | RegExp,
): { words: WordItem[]; plainText: string } {
  const rawSegments: { text: string; isHighlight?: boolean; customClass?: string }[] = [];

  const highlightTerms: string[] = [];
  let highlightRegex: RegExp | null = null;

  if (highlightProp instanceof RegExp) {
    highlightRegex = highlightProp;
  } else if (Array.isArray(highlightProp)) {
    highlightTerms.push(...highlightProp.filter(Boolean));
  } else if (typeof highlightProp === "string" && highlightProp.trim()) {
    highlightTerms.push(highlightProp.trim());
  }

  if (highlightTerms.length > 0 && !highlightRegex) {
    // Sort longer phrases first to greedily match full phrases
    const escaped = highlightTerms
      .sort((a, b) => b.length - a.length)
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    highlightRegex = new RegExp(`(${escaped.join("|")})`, "i");
  }

  const processWithRegex = (str: string, explicitClass?: string) => {
    if (!str) return;
    if (!highlightRegex) {
      rawSegments.push({ text: str, isHighlight: false, customClass: explicitClass });
      return;
    }

    const parts = str.split(highlightRegex);
    for (const part of parts) {
      if (!part) continue;
      const isMatch = highlightRegex.test(part);
      highlightRegex.lastIndex = 0;
      rawSegments.push({
        text: part,
        isHighlight: isMatch,
        customClass: explicitClass,
      });
    }
  };

  const processString = (str: string, explicitHighlight?: boolean, explicitClass?: string) => {
    if (!str) return;

    if (explicitHighlight !== undefined) {
      rawSegments.push({ text: str, isHighlight: explicitHighlight, customClass: explicitClass });
      return;
    }

    // Check for *highlight* inline markdown syntax (e.g., "The *Questions* on Your Mind")
    if (str.includes("*")) {
      const parts = str.split(/(\*[^*]+\*)/g);
      for (const part of parts) {
        if (!part) continue;
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          rawSegments.push({
            text: part.slice(1, -1),
            isHighlight: true,
            customClass: explicitClass,
          });
        } else {
          processWithRegex(part, explicitClass);
        }
      }
      return;
    }

    processWithRegex(str, explicitClass);
  };

  const walkNodes = (node: React.ReactNode) => {
    if (node === null || node === undefined || typeof node === "boolean") return;

    if (typeof node === "string" || typeof node === "number") {
      processString(String(node));
      return;
    }

    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{
        children?: React.ReactNode;
        className?: string;
      }>;
      const childProps = element.props || {};
      const className = childProps.className || "";

      // Detect if user passed <span className="text-primary"> or similar
      const isExplicitHighlight =
        className.includes("text-primary") ||
        className.includes("highlight") ||
        className.includes("text-red");

      React.Children.forEach(childProps.children, (child) => {
        if (typeof child === "string" || typeof child === "number") {
          processString(
            String(child),
            isExplicitHighlight ? true : undefined,
            className || undefined,
          );
        } else {
          walkNodes(child);
        }
      });
      return;
    }

    if (Array.isArray(node)) {
      node.forEach(walkNodes);
      return;
    }
  };

  if (childrenProp !== undefined && childrenProp !== null) {
    walkNodes(childrenProp);
  } else if (textProp) {
    processString(textProp);
  }

  // Convert raw segments into words of individual characters
  const words: WordItem[] = [];
  let currentChars: CharItem[] = [];

  for (const seg of rawSegments) {
    const chars = seg.text.split("");
    for (const ch of chars) {
      if (/\s/.test(ch)) {
        if (currentChars.length > 0) {
          words.push({ chars: currentChars });
          currentChars = [];
        }
      } else {
        currentChars.push({
          char: ch,
          isHighlight: !!seg.isHighlight,
          customClass: seg.customClass,
        });
      }
    }
  }

  if (currentChars.length > 0) {
    words.push({ chars: currentChars });
  }

  const plainText = words.map((w) => w.chars.map((c) => c.char).join("")).join(" ");

  return { words, plainText };
}

export const Heading: React.FC<HeadingProps> = ({
  text,
  children,
  highlight,
  as: Component = "h2",
  className = "",
  baseClassName = "text-secondary",
  highlightClassName = "text-primary",
  animationDuration = 0.75,
  ease = "back.out(1.4)",
  stagger = 0.018,
  yPercent = 110,
  rotate = 0,
  delay = 0,
  triggerOnScroll = true,
  scrollStart = "top 85%",
  triggerRef,
  onComplete,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  const { words, plainText } = useMemo(
    () => parseContent(text, children, highlight),
    [text, children, highlight],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll(".heading-char");
    if (!charElements || charElements.length === 0) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay,
        scrollTrigger: triggerOnScroll
          ? {
              trigger: triggerRef?.current || el,
              start: scrollStart,
              once: true,
            }
          : undefined,
        onComplete,
      });

      // Signature kinetic squash & stretch wave animation from preloader
      tl.fromTo(
        charElements,
        {
          opacity: 0,
          yPercent: yPercent,
          rotate: rotate,
          scaleY: 1.35,
          scaleX: 0.85,
          transformOrigin: "50% 0%",
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          rotate: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
        },
      );
    }, el);

    // Refresh ScrollTrigger if preloader completes while page is loaded
    const handlePreloaderComplete = () => {
      ScrollTrigger.refresh();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("preloaderComplete", handlePreloaderComplete);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("preloaderComplete", handlePreloaderComplete);
      }
      ctx.revert();
    };
  }, [
    words,
    animationDuration,
    ease,
    stagger,
    yPercent,
    rotate,
    delay,
    triggerOnScroll,
    scrollStart,
    triggerRef,
    onComplete,
  ]);

  return (
    <Component
      ref={containerRef as any}
      className={`relative select-none ${className}`}
      aria-label={plainText}
    >
      <span aria-hidden="true">
        {words.map((word, wIdx) => (
          <React.Fragment key={wIdx}>
            <span className="inline-block whitespace-nowrap overflow-hidden align-bottom pb-[0.12em] pt-[0.1em] -mb-[0.12em] -mt-[0.1em]">
              {word.chars.map((charObj, cIdx) => (
                <span
                  key={cIdx}
                  className={`inline-block heading-char will-change-transform ${
                    charObj.customClass ||
                    (charObj.isHighlight ? highlightClassName : baseClassName)
                  }`}
                  style={{ display: "inline-block" }}
                >
                  {charObj.char}
                </span>
              ))}
            </span>
            {wIdx < words.length - 1 && " "}
          </React.Fragment>
        ))}
      </span>
    </Component>
  );
};

export default Heading;
