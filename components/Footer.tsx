import { site, socials } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-line">
      <div className="container-site grid gap-4 py-8 text-[13px] text-muted sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <p>
          © {site.copyrightYear} {site.person}
        </p>
        <p className="sm:text-center">Designed and built by me, in Next.js.</p>
        <ul className="-mx-3 flex flex-wrap items-center sm:justify-end">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex min-h-11 items-center px-3 transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
