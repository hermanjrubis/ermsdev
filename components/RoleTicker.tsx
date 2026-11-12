"use client";

import { useEffect, useState } from "react";

type RoleTickerProps = {
  roles: readonly string[];
  /** Wait this long (ms) before the first role starts erasing. */
  startAfter?: number;
  className?: string;
};

/**
 * "> full-stack web developer_" — types and erases each role like a terminal,
 * with the brand's blinking underscore as the cursor. Static with reduced motion.
 */
export function RoleTicker({ roles, startAfter = 3000, className }: RoleTickerProps) {
  const [text, setText] = useState(roles[0] ?? "");

  useEffect(() => {
    if (roles.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let length = roles[0].length;
    let erasing = true;
    let timer = 0;

    const tick = () => {
      const word = roles[index];
      if (erasing) {
        length -= 1;
        setText(word.slice(0, length));
        if (length === 0) {
          erasing = false;
          index = (index + 1) % roles.length;
          timer = window.setTimeout(tick, 280);
        } else {
          timer = window.setTimeout(tick, 26);
        }
        return;
      }
      const next = roles[index];
      length += 1;
      setText(next.slice(0, length));
      if (length === next.length) {
        erasing = true;
        timer = window.setTimeout(tick, 2600);
      } else {
        // Uneven key timing reads as a person typing, not a machine
        timer = window.setTimeout(tick, 45 + Math.random() * 70);
      }
    };

    timer = window.setTimeout(tick, startAfter);
    return () => window.clearTimeout(timer);
  }, [roles, startAfter]);

  return (
    <p className={className}>
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden="true" className="inline-flex items-baseline whitespace-nowrap">
        <span className="mr-[0.5ch] text-muted">&gt;</span>
        <span>{text || "​"}</span>
        <span className="logo-cursor" data-blink="true" />
      </span>
    </p>
  );
}
