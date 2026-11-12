import Link from "next/link";
import type { CSSProperties } from "react";
import { ContactBlock } from "@/components/ContactBlock";
import { GithubActivity } from "@/components/GithubActivity";
import { HeroStage } from "@/components/HeroStage";
import { ProjectList } from "@/components/ProjectList";
import { RoleTicker } from "@/components/RoleTicker";
import { Section } from "@/components/Section";
import { TechMarquee } from "@/components/TechMarquee";
import { TypedHeading, typingDuration } from "@/components/TypedHeading";
import { Icon } from "@/components/Icon";
import { contactChannels, projects, site } from "@/content/site";

const headingLines = [site.greeting, site.person];
const heroLinks = ["GitHub", "Instagram", "Email"]
  .map((label) => contactChannels.find((c) => c.label === label))
  .filter((c) => c !== undefined);
const typed = typingDuration(headingLines);

/** Stagger content in after the heading finishes typing. */
const after = (ms: number) => ({ "--delay": `${typed + ms}ms` }) as CSSProperties;

export default function HomePage() {
  return (
    <>
      <HeroStage>
        <TypedHeading
          id="hero-heading"
          lines={headingLines}
          lineClassNames={[
            "mb-5 text-[15px] leading-none font-normal tracking-normal text-muted",
            "sm:whitespace-nowrap",
          ]}
          className="text-[clamp(34px,3.4vw,56px)] leading-[1.04] tracking-[-0.035em]"
        />

        <div className="enter mt-4" style={after(0)}>
          <RoleTicker
            roles={site.roles}
            startAfter={typed + 2600}
            className="text-[15px] font-medium"
          />
        </div>

        <p
          className="enter mt-10 max-w-[34ch] text-[clamp(18px,1.3vw,21px)] leading-snug text-nav"
          style={after(120)}
        >
          {site.tagline}
        </p>

        <div className="enter mt-10 flex flex-wrap items-center gap-3" style={after(240)}>
          <Link
            href="#projects"
            className="group inline-flex min-h-11 items-center gap-2 bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-nav"
          >
            See my work
            <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </Link>
          <Link
            href="#contact"
            className="inline-flex min-h-11 items-center border border-muted px-4 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Get in touch
          </Link>
        </div>

        <ul
          className="enter mt-14 flex flex-wrap items-center gap-x-6 text-[13px] text-muted"
          style={after(360)}
        >
          {heroLinks.map((c) => {
            const external = c.href.startsWith("http");
            return (
              <li key={c.label}>
                <a
                  href={c.href}
                  {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-ink"
                >
                  <Icon name={c.icon} className="size-4" />
                  <span className="sr-only">{c.label}: </span>
                  {c.value}
                </a>
              </li>
            );
          })}
        </ul>
      </HeroStage>

      <TechMarquee />

      <Section
        id="projects"
        index="01"
        title="Projects"
        description="Hover a project to see its front page."
        action={
          <Link href="/projects" className="text-link inline-flex min-h-11 items-center font-medium">
            All projects
          </Link>
        }
      >
        <ProjectList projects={projects} />
      </Section>

      <Section
        id="activity"
        index="02"
        title="GitHub activity"
        description="The last year of commits, pulled from GitHub every hour."
        action={
          <a
            href={`https://github.com/${site.github}`}
            target="_blank"
            rel="noreferrer"
            className="text-link inline-flex min-h-11 items-center font-medium"
          >
            @{site.github}
          </a>
        }
      >
        <GithubActivity />
      </Section>

      <Section
        id="contact"
        index="03"
        title="Contact"
        description="Have something you want built, or a role you think I'd fit? Email is the fastest way to reach me."
      >
        <ContactBlock />
      </Section>
    </>
  );
}
