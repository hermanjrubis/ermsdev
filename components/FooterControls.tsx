"use client";

import { useSyncExternalStore } from "react";
import { THEME_EVENT, THEME_STORAGE_KEY } from "@/lib/theme";
import { centerOf, withThemeTransition } from "@/lib/themeTransition";

/* ---------------- Theme: Light / Dark / System ---------------- */

type Mode = "light" | "dark" | "system";

function readMode(): Mode {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

function subscribeMode(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(THEME_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(THEME_EVENT, cb);
  };
}

function applyMode(mode: Mode) {
  try {
    if (mode === "system") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  } catch {}
  window.dispatchEvent(new Event(THEME_EVENT));
}

const MODES: { id: Mode; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "system", label: "System" },
];

/** Three-way theme switch. "System" clears the manual choice and follows the OS again. */
export function ThemeSwitch() {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "system" as Mode);
  return (
    <div role="group" aria-label="Colour theme" className="flex items-center text-sm">
      {MODES.map((m) => {
        const on = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            aria-pressed={on}
            onClick={(e) => {
              if (on) return;
              const { x, y } = centerOf(e.currentTarget);
              withThemeTransition(() => applyMode(m.id), x, y);
            }}
            className={`inline-flex min-h-11 items-center px-2.5 transition-colors first:pl-0 ${
              on ? "font-medium text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-[2px] bg-accent transition-all duration-200 motion-reduce:transition-none ${
                on ? "mr-1.5 w-2.5" : "w-0"
              }`}
            />
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Back to top, with how far down you are ---------------- */

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
}

function readProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
}

export function BackToTop() {
  const progress = useSyncExternalStore(subscribeScroll, readProgress, () => 0);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      className="group inline-flex min-h-11 items-center gap-3 text-sm font-medium"
    >
      <span className="relative inline-flex size-9 items-center justify-center overflow-hidden border border-line transition-colors group-hover:border-ink">
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-9 motion-reduce:transition-none">
          ↑
        </span>
        <span aria-hidden="true" className="absolute translate-y-9 transition-transform duration-300 group-hover:translate-y-0 motion-reduce:transition-none">
          ↑
        </span>
      </span>
      Back to top
      <span className="w-[4ch] text-right text-[13px] font-normal text-muted tabular-nums" aria-hidden="true">
        {progress}%
      </span>
    </button>
  );
}
