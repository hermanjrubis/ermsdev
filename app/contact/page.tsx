import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { site, socials } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        intro="[ONE SENTENCE: what kind of work or messages you would like to receive.]"
      />

      <div className="container-site mt-12">
        <dl className="divide-y divide-line border-y border-line">
          <div className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
            <dt className="text-sm text-muted sm:pt-1">Email</dt>
            <dd>
              <a href={`mailto:${site.email}`} className="text-link inline-flex min-h-11 items-center text-lg font-medium break-all">
                {site.email}
              </a>
            </dd>
          </div>
          {socials.map((s) => (
            <div key={s.label} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="text-sm text-muted sm:pt-1">{s.label}</dt>
              <dd>
                <a href={s.href} className="text-link inline-flex min-h-11 items-center text-lg font-medium break-all">
                  {s.href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </dd>
            </div>
          ))}
          <div className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
            <dt className="text-sm text-muted sm:pt-1">Based in</dt>
            <dd className="text-lg">{site.location}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
