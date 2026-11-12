"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789@._-";

type ScrambleTextProps = {
  text: string;
  /** Start scrambling when this turns true (hover / focus on the parent). */
  active: boolean;
  /** Total time to resolve, ms. */
  duration?: number;
  className?: string;
};

/**
 * Letters scramble, then settle left to right, like a terminal decoding a string.
 * The real text keeps its place in the layout, so nothing around it jumps.
 * Does nothing with reduced motion.
 */
export function ScrambleText({ text, active, duration = 520, className }: ScrambleTextProps) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      setShown(text);
    };
  }, [active, text, duration]);

  return (
    <span className={`relative inline-block whitespace-nowrap ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown}
      </span>
    </span>
  );
}
