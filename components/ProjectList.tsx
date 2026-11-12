"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useState, type PointerEvent } from "react";
import type { Project } from "@/content/site";

type ProjectListProps = { projects: Project[]; headingLevel?: "h2" | "h3" };

const PREVIEW_W = 440;
const PREVIEW_H = 275;

/**
 * Project index. On desktop, hovering a row shows that project's front page in a
 * frame that trails the cursor. Touch screens get the screenshot inside the row.
 */
export function ProjectList({ projects, headingLevel = "h3" }: ProjectListProps) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 260, damping: 30, mass: 0.6 };
  const sx = useSpring(x, reduced ? { stiffness: 2000, damping: 100 } : spring);
  const sy = useSpring(y, reduced ? { stiffness: 2000, damping: 100 } : spring);

  function onMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== "mouse") return;
    // Sit to the right of and slightly above the cursor, flip left near the edge
    const flip = e.clientX + PREVIEW_W + 40 > window.innerWidth;
    x.set(flip ? e.clientX - PREVIEW_W - 28 : e.clientX + 28);
    y.set(e.clientY - PREVIEW_H / 2);
  }

  const shown = projects.find((p) => p.slug === active && p.preview);
  const Heading = headingLevel;

  return (
    <div onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <ol className="border-t border-line">
        {projects.map((project, i) => (
          <li key={project.slug} className="reveal">
            <article
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(project.slug)}
              className="group grid gap-x-6 gap-y-3 border-b border-line py-7 transition-colors duration-300 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.4fr)_112px] md:items-baseline"
            >
              <p aria-hidden="true" className="text-[13px] text-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </p>

              <div>
                <Heading className="flex items-baseline text-[22px] leading-tight tracking-[-0.02em]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-[0.13em] w-0 bg-accent transition-all duration-200 group-hover:mr-[0.3em] group-hover:w-[0.48em] motion-reduce:transition-none"
                  />
                  {project.title}
                </Heading>
                <p className="mt-1.5 text-[13px] text-muted">
                  {project.role}
                  {project.status ? <> · {project.status}</> : null}
                </p>
              </div>

              <div className="max-w-[60ch]">
                {project.preview ? (
                  <Image
                    src={project.preview}
                    alt={`${project.title} front page`}
                    width={1200}
                    height={750}
                    sizes="(min-width: 768px) 1px, 100vw"
                    className="mb-4 w-full border border-line md:hidden"
                  />
                ) : null}
                <p className="text-[15px] leading-relaxed text-nav">{project.summary}</p>
                <p className="mt-3 text-[13px] text-muted">
                  <span className="sr-only">Built with: </span>
                  {project.stack.join(" / ")}
                </p>
              </div>

              <div className="flex items-baseline gap-5 text-[13px] md:flex-col md:items-end md:gap-0">
                <span className="text-muted tabular-nums">{project.year}</span>
                {project.links?.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link inline-flex min-h-11 items-center gap-1 font-medium"
                  >
                    {link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>

      {/* Floating preview (desktop, mouse only). Every image stays mounted so swapping is instant. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden overflow-hidden border border-line bg-paper md:block"
        style={{ x: sx, y: sy, width: PREVIEW_W, height: PREVIEW_H }}
        initial={false}
        animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduced ? 1 : 0.94 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      >
        {projects
          .filter((p) => p.preview)
          .map((p) => (
            <Image
              key={p.slug}
              src={p.preview!}
              alt=""
              fill
              sizes={`${PREVIEW_W}px`}
              className="object-cover object-top transition-opacity duration-200"
              style={{ opacity: shown?.slug === p.slug ? 1 : 0 }}
            />
          ))}
      </motion.div>
    </div>
  );
}
