"use client";

import { useEffect, useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { ScrambleText } from "@/components/ScrambleText";
import { site } from "@/content/site";

const TOPICS = [
  { id: "project", label: "A project", subject: "A project I'd like to build" },
  { id: "role", label: "A job or internship", subject: "A role you might fit" },
  { id: "hello", label: "Just saying hi", subject: "Hello from your portfolio" },
] as const;

type TopicId = (typeof TOPICS)[number]["id"];

const MAX = 500;

/**
 * Left: the email itself (scrambles on hover, copies in one click).
 * Right: a small terminal-style composer that opens the visitor's email app
 * with the topic and first lines already filled in. No backend needed.
 */
export function ContactBlock() {
  const [copied, setCopied] = useState(false);
  const [hot, setHot] = useState(false);
  const [topic, setTopic] = useState<TopicId>("project");
  const [message, setMessage] = useState("");
  const ids = useId();

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

  function send(e?: FormEvent) {
    e?.preventDefault();
    const subject = TOPICS.find((t) => t.id === topic)?.subject ?? "Hello";
    const body = message.trim() ? `${message.trim()}\n\n` : "";
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send();
  }

  return (
    <div className="grid gap-y-14 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6">
      <span className="hidden md:block" />

      {/* Email */}
      <div>
        <p className="text-[13px] text-muted">Write to me directly</p>
        <a
          href={`mailto:${site.email}`}
          onPointerEnter={() => setHot(true)}
          onPointerLeave={() => setHot(false)}
          onFocus={() => setHot(true)}
          onBlur={() => setHot(false)}
          className="group mt-3 inline-flex max-w-full items-baseline text-[clamp(22px,2.2vw,36px)] leading-tight font-medium tracking-[-0.03em]"
        >
          <ScrambleText text={site.email} active={hot} className="max-w-full overflow-hidden" />
          <span
            aria-hidden="true"
            className="ml-[0.12em] inline-block h-[0.13em] w-[0.48em] shrink-0 bg-accent transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </a>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 text-sm">
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-11 min-w-[8.5rem] items-center justify-center gap-2 border border-line px-4 font-medium transition-colors hover:border-ink"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M4 12.5 9.5 18 20 6" />
                </svg>
                Copied
              </>
            ) : (
              "Copy email"
            )}
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

      {/* Composer */}
      <form onSubmit={send} aria-labelledby={`${ids}-legend`}>
        <p id={`${ids}-legend`} className="text-[13px] text-muted">
          Or start the email here
        </p>

        <fieldset className="mt-3">
          <legend className="sr-only">What is it about?</legend>
          <div className="flex flex-wrap gap-x-5">
            {TOPICS.map((t) => (
              <label key={t.id} className="group inline-flex min-h-11 cursor-pointer items-center text-sm">
                <input
                  type="radio"
                  name={`${ids}-topic`}
                  value={t.id}
                  checked={topic === t.id}
                  onChange={() => setTopic(t.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`inline-block h-[2px] bg-accent transition-all duration-200 motion-reduce:transition-none ${
                    topic === t.id ? "mr-2 w-3" : "w-0"
                  }`}
                />
                <span
                  className={`transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent ${
                    topic === t.id ? "font-medium text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {t.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-3 border border-line transition-colors focus-within:border-ink">
          <label htmlFor={`${ids}-msg`} className="sr-only">
            Your message
          </label>
          <div className="flex gap-3 p-4">
            <span aria-hidden="true" className="pt-px text-muted">
              &gt;
            </span>
            <textarea
              id={`${ids}-msg`}
              rows={4}
              maxLength={MAX}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Hi Herman, I'm working on…"
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed placeholder:text-muted focus-visible:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pl-4 text-[13px] text-muted">
            <span className="tabular-nums">
              {message.length}/{MAX}
              <span className="hidden sm:inline"> · Ctrl + Enter to send</span>
            </span>
            <button
              type="submit"
              className="group inline-flex min-h-11 items-center gap-1.5 px-4 font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Open in email
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
