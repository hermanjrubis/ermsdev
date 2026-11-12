"use client";

import { useRef, type ReactNode } from "react";
import { LanyardSlot } from "@/components/lanyard/LanyardSlot";

/**
 * Full-width hero. The text sits in the left column; the right column is an
 * empty anchor the lanyard hangs from. The 3D canvas covers the whole hero,
 * so the card can be dragged anywhere across it.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={stageRef} aria-labelledby="hero-heading" className="relative">
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0" />
      <div className="container-site relative grid items-center lg:min-h-[max(660px,calc(100svh-72px))] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="py-16 sm:py-24">{children}</div>
        <div ref={anchorRef} className="hidden h-full lg:block" aria-hidden="true" />
      </div>
      <LanyardSlot stageRef={stageRef} anchorRef={anchorRef} />
    </section>
  );
}
