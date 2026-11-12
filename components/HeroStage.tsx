"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { LanyardSlot } from "@/components/lanyard/LanyardSlot";

/**
 * Full-width hero. The text sits in the left column; the right column is an
 * empty anchor the lanyard hangs from. The 3D canvas covers the whole hero,
 * so the card can be dragged anywhere across it.
 */
export function HeroStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Spotlight on the grid follows the mouse (not touch)
  function onPointerMove(e: PointerEvent<HTMLElement>) {
    const field = fieldRef.current;
    if (!field || e.pointerType !== "mouse") return;
    const r = field.getBoundingClientRect();
    field.style.setProperty("--mx", `${e.clientX - r.left}px`);
    field.style.setProperty("--my", `${e.clientY - r.top}px`);
    field.dataset.spot = "on";
  }

  function onPointerLeave() {
    if (fieldRef.current) fieldRef.current.dataset.spot = "off";
  }

  return (
    <section
      ref={stageRef}
      aria-labelledby="hero-heading"
      className="relative"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div ref={fieldRef} aria-hidden="true" className="grid-field pointer-events-none absolute inset-0">
        <div className="grid-fade absolute inset-0">
          <div className="grid-base absolute inset-0" />
        </div>
        <div className="grid-spot absolute inset-0">
          <div className="grid-spot-dots absolute inset-0" />
        </div>
      </div>
      <div className="container-site relative grid items-center lg:min-h-[max(660px,calc(100svh-72px))] lg:grid-cols-[minmax(0,620px)_minmax(0,500px)] lg:justify-center lg:gap-x-[clamp(48px,9vw,180px)]">
        <div className="py-16 sm:py-24">{children}</div>
        <div ref={anchorRef} className="hidden h-full lg:block" aria-hidden="true" />
      </div>
      <LanyardSlot stageRef={stageRef} anchorRef={anchorRef} />
    </section>
  );
}
