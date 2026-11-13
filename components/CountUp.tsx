"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const format = (n: number, pad: number) => String(Math.round(n)).padStart(pad, "0");

/**
 * A number that counts up from zero the first time it scrolls into view.
 * Screen readers (and reduced motion) get the final value straight away.
 */
export function CountUp({ value, pad = 2 }: { value: number; pad?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (n) => {
        el.textContent = format(n, pad);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, value, pad]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {format(reduced ? value : 0, pad)}
      </span>
    </>
  );
}
