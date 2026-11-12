import Link from "next/link";
import { BackToTop, ThemeSwitch } from "@/components/FooterControls";
import { Logo } from "@/components/Logo";
import { nav, site, socials } from "@/content/site";

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 text-[15px] text-nav transition-colors hover:text-ink";

/** Arrow that slides in on hover. */
function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="-translate-x-1 text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
    >
      {external ? "↗" : "→"}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="container-site pt-12 pb-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-x-6">
          <span className="hidden md:block" />

          <nav aria-label="Footer">
            <p className="text-[13px] text-muted">Site</p>
            <ul className="mt-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                    <Arrow />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] text-muted">Elsewhere</p>
            <ul className="mt-2">
              {socials.map((s) => {
                const external = s.href.startsWith("http");
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className={linkClass}
                    >
                      {s.label}
                      <Arrow external={external} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <ThemeSwitch />
            <BackToTop />
          </div>
        </div>

        {/* Big wordmark: static, per the brand rules (only the hero cursor blinks) */}
        <Link href="/" aria-label="ermsDev home" className="mt-20 block w-fit">
          <Logo size="clamp(56px, 12vw, 200px)" />
        </Link>

        <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-line pt-6 text-[13px] text-muted">
          <p>
            © {site.copyrightYear} {site.person}
          </p>
          <p>Designed and built by me, in Next.js.</p>
        </div>
      </div>
    </footer>
  );
}
