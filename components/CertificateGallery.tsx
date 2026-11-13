"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Certificate } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Certificate index. Each row has a framed preview that leans toward the cursor;
 * clicking it opens a full-screen viewer with zoom, keyboard navigation and the PDF.
 */
export function CertificateGallery({ certificates }: { certificates: Certificate[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ol className="border-t border-line">
        {certificates.map((cert, i) => (
          <li key={cert.slug} className="reveal">
            <CertificateRow cert={cert} index={i} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ol>

      <AnimatePresence>
        {open !== null ? (
          <Viewer
            key="viewer"
            certificates={certificates}
            index={open}
            onIndex={setOpen}
            onClose={() => setOpen(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

function CertificateRow({
  cert,
  index,
  onOpen,
}: {
  cert: Certificate;
  index: number;
  onOpen: () => void;
}) {
  return (
    <article className="group grid gap-x-6 gap-y-8 border-b border-line py-10 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.25fr)] md:py-14">
      <p aria-hidden="true" className="text-[13px] text-muted tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </p>

      <div className="flex flex-col md:min-h-full">
        <p className="text-[13px] text-muted">
          {cert.kind} · <span className="tabular-nums">{cert.date}</span>
        </p>
        <h2 className="mt-3 flex items-baseline text-[clamp(22px,2vw,28px)] leading-tight tracking-[-0.025em]">
          <span
            aria-hidden="true"
            className="inline-block h-[0.13em] w-0 shrink-0 bg-accent transition-all duration-200 group-hover:mr-[0.3em] group-hover:w-[0.48em] motion-reduce:transition-none"
          />
          <span>{cert.title}</span>
        </h2>
        <p className="mt-2 text-[15px] text-nav">{cert.issuer}</p>

        <dl className="mt-8 max-w-[440px] border-t border-line text-[14px]">
          {cert.details.map((d) => (
            <div key={d.label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-line py-3">
              <dt className="text-muted">{d.label}</dt>
              <dd className="text-ink">{d.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-medium md:mt-auto md:pt-10">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex min-h-11 items-center gap-2 border border-ink px-5 transition-colors hover:bg-ink hover:text-paper"
          >
            View certificate
          </button>
          <a href={cert.pdf} download className="text-link inline-flex min-h-11 items-center gap-1.5">
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <TiltPreview cert={cert} onOpen={onOpen} />
    </article>
  );
}

/** The certificate on a dotted "desk". It leans toward the cursor and shows a View label. */
function TiltPreview({ cert, onOpen }: { cert: Certificate; onOpen: () => void }) {
  const reduced = useReducedMotion();
  const stiff = { stiffness: 180, damping: 18, mass: 0.5 };
  const rx = useSpring(0, stiff);
  const ry = useSpring(0, stiff);
  const lx = useMotionValue(0);
  const ly = useMotionValue(0);
  const [hover, setHover] = useState(false);

  function onMove(e: PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height;
    lx.set(e.clientX - r.left);
    ly.set(e.clientY - r.top);
    if (reduced) return;
    ry.set((px - 0.5) * 10);
    rx.set((0.5 - py) * 8);
  }

  function onLeave() {
    setHover(false);
    rx.set(0);
    ry.set(0);
  }

  const portrait = cert.image.height > cert.image.width;

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`View ${cert.title} certificate`}
      className="relative flex aspect-[4/3] w-full cursor-none items-center justify-center overflow-hidden border border-line [perspective:1100px] max-md:cursor-pointer"
    >
      <span aria-hidden="true" className="grid-base absolute inset-0 opacity-70" />

      <motion.span
        className="relative block border border-line bg-paper"
        style={{
          rotateX: rx,
          rotateY: ry,
          height: portrait ? "84%" : undefined,
          width: portrait ? undefined : "80%",
          aspectRatio: `${cert.image.width} / ${cert.image.height}`,
        }}
        animate={{ scale: hover && !reduced ? 1.025 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Image
          src={cert.image.src}
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 90vw"
          className="object-contain"
        />
        <CropMarks />
      </motion.span>

      {/* Cursor label */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-10 flex items-center gap-2 bg-ink px-3 py-2 text-[12px] font-medium text-paper max-md:hidden"
        style={{ x: lx, y: ly, translateX: "-50%", translateY: "-50%" }}
        initial={false}
        animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.6 }}
        transition={{ duration: 0.18, ease: EASE }}
      >
        <span className="size-1.5 bg-accent" />
        View
      </motion.span>
    </button>
  );
}

function CropMarks() {
  const mark = "absolute size-3 border-muted";
  return (
    <span aria-hidden="true">
      <span className={`${mark} -top-2 -left-2 border-t border-l`} />
      <span className={`${mark} -top-2 -right-2 border-t border-r`} />
      <span className={`${mark} -bottom-2 -left-2 border-b border-l`} />
      <span className={`${mark} -right-2 -bottom-2 border-r border-b`} />
    </span>
  );
}

/** Full-screen viewer: click to zoom, move to pan, arrows to switch, Esc to close. */
function Viewer({
  certificates,
  index,
  onIndex,
  onClose,
}: {
  certificates: Certificate[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const cert = certificates[index];
  const count = certificates.length;
  const reduced = useReducedMotion();
  const [zoomed, setZoomed] = useState(false);
  const [dir, setDir] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ox = useMotionValue(50);
  const oy = useMotionValue(50);
  const origin = useMotionTemplate`${ox}% ${oy}%`;

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setZoomed(false);
      onIndex((index + step + count) % count);
    },
    [count, index, onIndex],
  );

  // Lock page scroll, move focus in, and give it back on close
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (zoomed) setZoomed(false);
        else onClose();
      } else if (e.key === "ArrowRight" && count > 1) go(1);
      else if (e.key === "ArrowLeft" && count > 1) go(-1);
      else if (e.key.toLowerCase() === "z") setZoomed((z) => !z);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go, onClose, zoomed]);

  function aim(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    ox.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    oy.set(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      className="fixed inset-0 z-50 flex flex-col bg-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
    >
      {/* Top bar */}
      <div className="container-site flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line">
        <p className="min-w-0 truncate text-[13px] text-muted">
          <span className="text-ink tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span className="tabular-nums"> / {String(count).padStart(2, "0")}</span>
          <span className="max-sm:hidden"> · {cert.issuer}</span>
        </p>
        <p aria-live="polite" className="text-[12px] text-muted max-md:hidden">
          {zoomed ? "Move to look around · click or Esc to zoom out" : "Click to zoom · ← → to switch · Esc to close"}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="-mr-3 inline-flex min-h-11 items-center gap-3 px-3 text-[14px] font-medium hover:text-link-hover"
        >
          <span className="max-sm:sr-only">Close</span>
          <span aria-hidden="true" className="relative size-4">
            <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute top-1/2 left-0 h-[1.5px] w-full -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      {/* Stage */}
      <div
        className={`relative min-h-0 flex-1 overflow-hidden ${zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in"}`}
        onPointerMove={aim}
        onPointerDown={aim}
        onClick={() => setZoomed((z) => !z)}
      >
        <span aria-hidden="true" className="grid-base absolute inset-0 opacity-60" />
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={cert.slug}
            className="absolute inset-4 sm:inset-8"
            custom={dir}
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: dir * 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: dir * -48, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.div
              className="relative size-full"
              style={{ transformOrigin: origin }}
              animate={{ scale: zoomed ? 2.2 : 1 }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            >
              <Image
                src={cert.image.src}
                alt={`${cert.kind}: ${cert.title}, issued by ${cert.issuer}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Bottom bar */}
      <div className="container-site flex shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-line py-4">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium tracking-[-0.01em]">{cert.title}</p>
          <p className="text-[13px] text-muted">
            {cert.kind} · {cert.date}
          </p>
        </div>

        <div className="-mx-3 flex flex-wrap items-center text-[14px] font-medium">
          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous certificate"
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-3 hover:text-link-hover"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next certificate"
                className="inline-flex min-h-11 min-w-11 items-center justify-center px-3 hover:text-link-hover"
              >
                →
              </button>
              <span aria-hidden="true" className="mx-2 h-5 w-px bg-line" />
            </>
          ) : null}
          <a
            href={cert.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-1 px-3 hover:text-link-hover"
          >
            Open PDF <span aria-hidden="true">↗</span>
          </a>
          <a
            href={cert.pdf}
            download
            className="inline-flex min-h-11 items-center gap-1 px-3 hover:text-link-hover"
          >
            Download <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
