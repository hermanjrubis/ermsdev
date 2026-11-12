import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { contactChannels, site } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        intro="Email is the fastest way to reach me. For anything school-related, use my STI email."
      />

      <div className="container-site mt-12">
        <dl className="divide-y divide-line border-y border-line">
          {contactChannels.map((c) => {
            const external = c.href.startsWith("http");
            return (
              <div key={c.label} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="flex items-center gap-2.5 text-sm text-muted sm:pt-1">
                  <Icon name={c.icon} className="size-4" />
                  {c.label}
                </dt>
                <dd>
                  <a
                    href={c.href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="text-link inline-flex min-h-11 items-center text-lg font-medium break-all"
                  >
                    {c.value}
                  </a>
                </dd>
              </div>
            );
          })}
          <div className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
            <dt className="text-sm text-muted sm:pt-1">Based in</dt>
            <dd className="text-lg">{site.location}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
