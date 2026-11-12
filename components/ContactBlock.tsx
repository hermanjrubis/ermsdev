"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

/** Big email link with a copy button that confirms in place. */
export function ContactBlock() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  }

  return (
    <div className="grid gap-y-8 md:grid-cols-[96px_minmax(0,1fr)] md:gap-x-6">
      <span className="hidden md:block" />
      <div>
        <a
          href={`mailto:${site.email}`}
          className="group inline-flex items-baseline text-[clamp(24px,2.6vw,40px)] leading-tight font-medium tracking-[-0.035em] break-all"
        >
          {site.email}
          <span
            aria-hidden="true"
            className="ml-[0.12em] inline-block h-[0.13em] w-[0.48em] bg-accent transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </a>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 text-sm">
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-11 items-center border border-line px-4 font-medium transition-colors hover:border-ink"
          >
            {copied ? "Copied" : "Copy email"}
          </button>
          <a
            href={`https://github.com/${site.github}`}
            target="_blank"
            rel="noreferrer"
            className="text-link inline-flex min-h-11 items-center gap-1 font-medium"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <span role="status" className="sr-only">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
