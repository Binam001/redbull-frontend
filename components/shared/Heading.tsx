"use client";

import React, { useEffect, useMemo } from "react";

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
  /** Deprecated animation duration */
  animationDuration?: number;
  /** Deprecated GSAP easing curve */
  ease?: string;
  /** Deprecated stagger delay */
  stagger?: number;
  /** Deprecated Y percent displacement */
  yPercent?: number;
  /** Deprecated rotation angle */
  rotate?: number;
  /** Deprecated delay */
  delay?: number;
  /** Deprecated triggerOnScroll */
  triggerOnScroll?: boolean;
  /** Deprecated scrollStart */
  scrollStart?: string;
  /** Deprecated triggerRef */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Callback fired when rendered */
  onComplete?: () => void;
}

interface SegmentItem {
  text: string;
  isHighlight?: boolean;
  customClass?: string;
}

interface LineItem {
  segments: SegmentItem[];
  brClass?: string;
}

/**
 * Parses children / text prop and highlight rules into structured lines and styled segments
 */
function parseContent(
  textProp?: string,
  childrenProp?: React.ReactNode,
  highlightProp?: string | string[] | RegExp,
): { lines: LineItem[]; plainText: string } {
  const rawSegments: {
    text: string;
    isHighlight?: boolean;
    customClass?: string;
    isLineBreak?: boolean;
  }[] = [];

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

  const processString = (
    str: string,
    explicitHighlight?: boolean,
    explicitClass?: string,
  ) => {
    if (!str) return;

    // Support line breaks from <br />, newlines (\n), or literal escaped \n
    const breakPattern = /(<br\s*\/?>|\r?\n|\\n)/i;
    if (breakPattern.test(str)) {
      const parts = str.split(breakPattern);
      for (const part of parts) {
        if (!part) continue;
        if (breakPattern.test(part)) {
          rawSegments.push({ text: "\n", isLineBreak: true });
        } else {
          processString(part, explicitHighlight, explicitClass);
        }
      }
      return;
    }

    if (explicitHighlight !== undefined) {
      rawSegments.push({
        text: str,
        isHighlight: explicitHighlight,
        customClass: explicitClass,
      });
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

    if (React.isValidElement(node)) {
      if (
        node.type === "br" ||
        (typeof node.type === "string" && node.type.toLowerCase() === "br")
      ) {
        const brClass = (node.props as any)?.className || undefined;
        rawSegments.push({ text: "\n", isLineBreak: true, customClass: brClass });
        return;
      }

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

    if (typeof node === "string" || typeof node === "number") {
      processString(String(node));
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

  // Group raw segments into lines
  const lines: LineItem[] = [{ segments: [] }];
  for (const seg of rawSegments) {
    if (seg.isLineBreak) {
      lines.push({ segments: [], brClass: seg.customClass });
      continue;
    }
    const currentLine = lines[lines.length - 1];
    currentLine.segments.push({
      text: seg.text,
      isHighlight: seg.isHighlight,
      customClass: seg.customClass,
    });
  }

  const plainText = lines
    .map((l) => l.segments.map((s) => s.text).join(""))
    .join(" ");

  return { lines, plainText };
}

export const Heading: React.FC<HeadingProps> = ({
  text,
  children,
  highlight,
  as: Component = "h2",
  className = "",
  baseClassName = "text-secondary",
  highlightClassName = "text-primary",
  onComplete,
}) => {
  const { lines, plainText } = useMemo(
    () => parseContent(text, children, highlight),
    [text, children, highlight],
  );

  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <Component className={`relative ${className}`} aria-label={plainText}>
      {lines.map((line, lineIdx) => (
        <React.Fragment key={lineIdx}>
          {lineIdx > 0 && <br className={line.brClass} />}
          {line.segments.map((seg, sIdx) => {
            const colorClass =
              seg.customClass ||
              (seg.isHighlight ? highlightClassName : baseClassName);
            return (
              <span key={sIdx} className={colorClass}>
                {seg.text}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </Component>
  );
};

export default Heading;
