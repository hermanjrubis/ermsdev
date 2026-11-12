"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { NavItem } from "@/content/site";

type NavMenuProps = { items: NavItem[] };

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  "inline-flex min-h-11 items-center px-[14px] py-3 text-[15px] font-medium leading-5 transition-colors hover:text-link-hover";

// Accent underline that grows in from the left on hover and stays on the current page
const underline =
  "relative after:absolute after:inset-x-[14px] after:bottom-2 after:h-[2px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 hover:after:scale-x-100 motion-reduce:after:transition-none";

/**
 * Desktop: inline links. Mobile (< 640px): a disclosure menu, because the logo
 * plus three links at the required 14px padding does not fit in 360px.
 */
export function NavMenu({ items }: NavMenuProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <ul className="hidden items-center sm:flex">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${linkBase} ${underline} ${active ? "text-ink after:scale-x-100" : "text-nav"}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="order-last inline-flex size-11 items-center justify-center text-nav hover:text-link-hover sm:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {open ? (
            <path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="2" />
          ) : (
            <path d="M3 8h18M3 16h18" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper sm:hidden"
      >
        <ul className="container-site py-2">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`${linkBase} -mx-[14px] w-[calc(100%+28px)] ${active ? "text-ink" : "text-nav"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
