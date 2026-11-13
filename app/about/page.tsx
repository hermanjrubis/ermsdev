import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/CountUp";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";
import { Section } from "@/components/Section";
import { TECH_ICONS } from "@/lib/techIcons";
import { about, certificates, idCard, projects, site, techStack } from "@/content/site";

export const metadata: Metadata = { title: "About" };

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function AboutPage() {
  const words = about.statement.split(" ");
  const projectTitle = (slug: string) => projects.find((p) => p.slug === slug)?.title ?? slug;
  const toolCount = techStack.filter((t) => t.name !== "Anthropic").length;

  return (
    <PageTransition>
      <PageHeader title="About me" />

      {/* Intro: statement + bio on the left, portrait on the right */}
      <div className="container-site mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-[clamp(48px,7vw,140px)]">
        <div>
          {/* Words brighten one after another, like a sentence being read */}
          <p className="max-w-[26ch] text-[clamp(26px,2.7vw,42px)] leading-[1.18] tracking-[-0.03em]">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="word-fade" style={delay(380 + i * 32)}>
                {word}{" "}
              </span>
            ))}
          </p>

          <div className="mt-12 max-w-[60ch] space-y-5 text-[17px] leading-relaxed text-nav">
            {about.bio.map((paragraph, i) => (
              <p key={i} className="reveal">
                {paragraph}
              </p>
            ))}
          </div>

          {/* At a glance, counted from the site's own content */}
          <dl className="reveal mt-14 grid max-w-[560px] grid-cols-3 border-t border-line">
            {[
              { label: "Projects", value: projects.length, href: "/projects" },
              { label: "Certificates", value: certificates.length, href: "/certificates" },
              { label: "Tools", value: toolCount, href: "#toolbox" },
            ].map((stat) => (
              <div key={stat.label} className="border-r border-line pt-5 pr-4 last:border-r-0 [&:not(:first-child)]:pl-5">
                <dt className="text-[13px] text-muted">{stat.label}</dt>
                <dd className="mt-2">
                  <Link
                    href={stat.href}
                    className="group inline-flex items-baseline gap-1.5 text-[clamp(32px,3.4vw,48px)] leading-none tracking-[-0.04em]"
                  >
                    <CountUp value={stat.value} />
                    <span
                      aria-hidden="true"
                      className="text-[15px] text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Portrait />
      </div>

      <Section id="what-i-do" index="01" title="What I do" description="Three kinds of work, often in the same project.">
        <ol className="border-t border-line">
          {about.focus.map((item, i) => (
            <li key={item.title} className="reveal">
              <article className="group grid gap-x-6 gap-y-3 border-b border-line py-8 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.4fr)_112px] md:items-baseline">
                <p aria-hidden="true" className="text-[13px] text-muted tabular-nums">
                  {String.fromCharCode(97 + i)}.
                </p>
                <h3 className="flex items-baseline text-[22px] leading-tight tracking-[-0.02em]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-[0.13em] w-0 bg-accent transition-all duration-200 group-hover:mr-[0.3em] group-hover:w-[0.48em] motion-reduce:transition-none"
                  />
                  {item.title}
                </h3>
                <div className="max-w-[60ch]">
                  <p className="text-[15px] leading-relaxed text-nav">{item.text}</p>
                  <p className="mt-3 text-[13px] text-muted">
                    Seen in{" "}
                    {item.projects.map((slug, j) => (
                      <span key={slug}>
                        <Link href="/projects" className="text-link">
                          {projectTitle(slug)}
                        </Link>
                        {j < item.projects.length - 1 ? ", " : null}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="toolbox" index="02" title="Toolbox" description="What I reach for. Hover a tool to see its mark.">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {about.toolbox.map((group) => (
            <div key={group.label} className="reveal">
              <h3 className="border-b border-line pb-3 text-[13px] text-muted">{group.label}</h3>
              <ul>
                {group.tools.map((name) => {
                  const slug = techStack.find((t) => t.name === name)?.icon;
                  const icon = slug ? TECH_ICONS[slug] : undefined;
                  return (
                    <li
                      key={name}
                      className="group/tool flex items-center border-b border-line py-3 text-[16px] text-nav transition-colors duration-200 hover:text-ink"
                    >
                      <span className="inline-flex w-0 shrink-0 items-center overflow-hidden transition-[width] duration-300 ease-out group-hover/tool:w-7 motion-reduce:transition-none">
                        {icon ? (
                          <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
                            <path d={icon.path} />
                          </svg>
                        ) : null}
                      </span>
                      {name}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="education" index="03" title="Education">
        <div className="reveal grid gap-x-6 gap-y-3 border-y border-line py-8 md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.4fr)_112px] md:items-baseline">
          <span aria-hidden="true" />
          <div>
            <h3 className="text-[22px] leading-tight tracking-[-0.02em]">{about.education.degree}</h3>
            <p className="mt-1.5 text-[15px] text-nav">{about.education.school}</p>
          </div>
          <p className="text-[15px] leading-relaxed text-nav">
            Alongside class, I&apos;ve finished courses from Oracle Academy and SAP University Alliances.{" "}
            <Link href="/certificates" className="text-link font-medium">
              See certificates
            </Link>
          </p>
          <p className="text-[13px] text-muted md:text-right">{about.education.status}</p>
        </div>
      </Section>

      {/* Closing line */}
      <section className="container-site reveal mt-28 sm:mt-36">
        <div className="border-t border-line pt-10">
          <p className="max-w-[22ch] text-[clamp(28px,3.2vw,48px)] leading-[1.1] tracking-[-0.035em]">
            Have something in mind? I&apos;d like to hear about it.
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex min-h-11 items-center gap-3 border border-ink px-6 text-[15px] font-medium transition-colors hover:bg-ink hover:text-paper"
          >
            Get in touch
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <p className="mt-4 text-[13px] text-muted">{site.email}</p>
        </div>
      </section>
    </PageTransition>
  );
}

/** Photo from the ID card: black and white until you hover it. */
function Portrait() {
  const mark = "absolute size-3.5 border-muted";
  return (
    <figure className="enter lg:sticky lg:top-10 lg:self-start" style={delay(250)}>
      <div className="group relative">
        <div className="relative aspect-square overflow-hidden border border-line">
          <Image
            src={idCard.photo}
            alt={`Portrait of ${site.person}`}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover grayscale transition-[filter,scale] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 motion-reduce:transition-none"
          />
        </div>
        <span aria-hidden="true">
          <span className={`${mark} -top-2.5 -left-2.5 border-t border-l`} />
          <span className={`${mark} -top-2.5 -right-2.5 border-t border-r`} />
          <span className={`${mark} -bottom-2.5 -left-2.5 border-b border-l`} />
          <span className={`${mark} -right-2.5 -bottom-2.5 border-r border-b`} />
        </span>
      </div>
      <figcaption className="mt-5 flex items-baseline justify-between gap-4 text-[13px]">
        <span className="text-ink">{site.person}</span>
        <span className="text-right text-muted">{idCard.roles.join(" / ")}</span>
      </figcaption>
    </figure>
  );
}
