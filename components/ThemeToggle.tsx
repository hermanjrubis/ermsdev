"use client";

import { useLayoutEffect } from "react";

import { THEME_STORAGE_KEY } from "@/lib/theme";

type Theme = "light" | "dark";

function resolvedTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Optional manual override of prefers-color-scheme.
 * The visible icon is switched in CSS (styles/tokens.css), so the server and
 * client render identical markup and there is no hydration mismatch.
 */
export function ThemeToggle() {
  // React's dev-mode Strict remount clears attributes on <html>; re-apply the saved theme.
  // No-op in production, where the inline script in app/layout.tsx has already set it.
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {}
  }, []);

  function toggle() {
    const next: Theme = resolvedTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="inline-flex size-11 items-center justify-center text-nav transition-colors hover:text-link-hover"
    >
      {/* Moon: shown in light mode */}
      <svg
        className="theme-icon-moon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
      </svg>
      {/* Sun: shown in dark mode */}
      <svg
        className="theme-icon-sun"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
      </svg>
    </button>
  );
}
