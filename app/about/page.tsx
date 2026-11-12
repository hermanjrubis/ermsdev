import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { about } from "@/content/site";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About" />

      <div className="container-site mt-8">
        <div className="max-w-[68ch] space-y-5 text-lg">
          {about.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <Section id="toolbox" title="Toolbox">
        <ul className="flex flex-wrap gap-2">
          {about.toolbox.map((tool, i) => (
            <li key={`${tool}-${i}`} className="border border-line px-3 py-1.5 text-nav">
              {tool}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="experience" title="Experience">
        <ol className="divide-y divide-line border-y border-line">
          {about.experience.map((item, i) => (
            <li key={i} className="grid gap-1 py-5 sm:grid-cols-[200px_1fr] sm:gap-6">
              <p className="text-sm text-muted sm:pt-1">{item.period}</p>
              <div>
                <h3 className="text-lg">
                  {item.role} · {item.organization}
                </h3>
                <p className="mt-1 text-muted">{item.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
