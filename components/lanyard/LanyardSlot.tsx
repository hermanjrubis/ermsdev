"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

// three.js + the physics engine are large, so they load only when the card is shown.
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

const DESKTOP = "(min-width: 1024px)";

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

type LanyardSlotProps = {
  /** The hero section: the canvas covers it and listens for pointer events on it. */
  stageRef: RefObject<HTMLElement | null>;
  /** Empty column the strap hangs above (its horizontal centre). */
  anchorRef: RefObject<HTMLElement | null>;
};

/**
 * Desktop only: on phones, dragging the card would fight with scrolling.
 * Physics pauses when the hero is scrolled out of view.
 */
export function LanyardSlot({ stageRef, anchorRef }: LanyardSlotProps) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
  const [visible, setVisible] = useState(true);
  const [initialRatio, setInitialRatio] = useState<number | null>(null);
  // Where the strap hangs, as a fraction of the hero width. Kept live on resize.
  const ratioRef = useRef(0.75);

  useEffect(() => {
    const stage = stageRef.current;
    const anchor = anchorRef.current;
    if (!isDesktop || !stage || !anchor) return;

    const measure = () => {
      const s = stage.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      if (s.width === 0) return;
      ratioRef.current = (a.left + a.width / 2 - s.left) / s.width;
      setInitialRatio((r) => r ?? ratioRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(anchor);

    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(stage);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [isDesktop, stageRef, anchorRef]);

  if (!isDesktop || initialRatio === null) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      <Lanyard
        active={visible}
        stageRef={stageRef}
        ratioRef={ratioRef}
        initialRatio={initialRatio}
      />
    </div>
  );
}
