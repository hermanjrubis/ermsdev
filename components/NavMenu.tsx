"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/Icon";
import { socials, type NavItem } from "@/content/site";

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

      {/* Two bars that cross into an X */}
      <button
        type="button"
        className="order-last inline-flex size-11 items-center justify-center text-nav hover:text-link-hover sm:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className="relative block h-3.5 w-5">
          <span
            className={`absolute top-0 left-0 h-[2px] w-5 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-[2px] bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              open ? "w-5 -translate-y-[6px] -rotate-45" : "w-3.5"
            }`}
          />
        </span>
      </button>

      {/* Backdrop: fades in, tap to close */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 top-[72px] bottom-0 z-30 bg-paper/70 transition-opacity duration-300 motion-reduce:transition-none sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel: slides open, links drop in one after another */}
      <div
        id={panelId}
        inert={!open}
        className={`absolute inset-x-0 top-full z-40 grid border-b bg-paper transition-[grid-template-rows,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:hidden ${
          open ? "grid-rows-[1fr] border-line" : "grid-rows-[0fr] border-transparent"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="container-site pt-2 pb-4">
            {items.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li
                  key={item.href}
                  style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                  className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                  }`}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`${linkBase} -mx-[14px] w-[calc(100%+28px)] text-[22px] tracking-[-0.02em] ${active ? "text-ink" : "text-nav"}`}
                  >
                    {active ? (
                      <span aria-hidden="true" className="mr-2 inline-block h-[2px] w-3 bg-accent" />
                    ) : null}
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li
              style={{ transitionDelay: open ? `${80 + items.length * 55}ms` : "0ms" }}
              className={`mt-2 flex items-center gap-1 border-t border-line pt-3 transition-all duration-300 motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  aria-label={s.label}
                  className="-ml-2 inline-flex size-11 items-center justify-center text-muted transition-colors hover:text-ink first:ml-[-10px]"
                >
                  <Icon name={s.icon} className="size-5" />
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
