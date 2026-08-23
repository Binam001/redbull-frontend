"use client";

import * as React from "react";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!text1Ref.current || !text2Ref.current || texts.length < 2) return;

    const el1 = text1Ref.current;
    const el2 = text2Ref.current;

    let textIndex = 0;
    let morphProgress = 0;
    let cooldownRemaining = cooldownTime;
    let animId: number;
    let prevTime = performance.now();

    // Initialize: el1 = current visible text, el2 = next text (hidden)
    el1.textContent = texts[0];
    el2.textContent = texts[1];
    el1.style.opacity = "100%";
    el1.style.filter = "";
    el2.style.opacity = "0%";
    el2.style.filter = "blur(100px)";

    function applyMorph(fraction: number) {
      // fraction goes from 0 → 1
      // el1 (old text) goes from fully visible → blurred out
      // el2 (new text) goes from blurred out → fully visible

      // Clamp to safe range to prevent division-by-zero in blur calc
      const f = Math.max(0.005, Math.min(0.995, fraction));
      const inv = 1 - f;

      // New text fading in
      const blur2 = Math.min(8 / f - 8, 100);
      el2.style.filter = `blur(${Math.max(0, blur2).toFixed(1)}px)`;
      el2.style.opacity = `${(Math.pow(f, 0.4) * 100).toFixed(1)}%`;

      // Old text fading out
      const blur1 = Math.min(8 / inv - 8, 100);
      el1.style.filter = `blur(${Math.max(0, blur1).toFixed(1)}px)`;
      el1.style.opacity = `${(Math.pow(inv, 0.4) * 100).toFixed(1)}%`;
    }

    function resetAfterMorph() {
      // Morph complete: el2 is now the visible text
      // Swap: copy el2 content to el1, advance index, set el2 to next
      textIndex = (textIndex + 1) % texts.length;
      el1.textContent = texts[textIndex];
      el2.textContent = texts[(textIndex + 1) % texts.length];

      // Reset styles: el1 visible, el2 hidden
      el1.style.opacity = "100%";
      el1.style.filter = "";
      el2.style.opacity = "0%";
      el2.style.filter = "blur(100px)";

      // Reset morph state
      morphProgress = 0;
      cooldownRemaining = cooldownTime;
    }

    function tick(now: number) {
      animId = requestAnimationFrame(tick);

      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;

      if (cooldownRemaining > 0) {
        // In cooldown phase: el1 is fully visible, el2 is hidden
        cooldownRemaining -= dt;
        return;
      }

      // Morphing phase
      morphProgress += dt;
      const fraction = morphProgress / morphTime;

      if (fraction >= 1) {
        // Morph finished
        resetAfterMorph();
      } else {
        applyMorph(fraction);
      }
    }

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={`absolute inline-block select-none text-center ${textClassName ?? ""}`}
          style={{ opacity: "100%" }}
        />
        <span
          ref={text2Ref}
          className={`absolute inline-block select-none text-center ${textClassName ?? ""}`}
          style={{ opacity: "0%" }}
        />
      </div>
    </div>
  );
}

export default GooeyText;
