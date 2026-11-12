import {
  siAndroidstudio,
  siAnthropic,
  siClaude,
  siCloudinary,
  siCss,
  siExpress,
  siFigma,
  siFirebase,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siMaplibre,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siOpenjdk,
  siOpenstreetmap,
  siReact,
  siTailwindcss,
  siThreedotjs,
  siSupabase,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { techStack } from "@/content/site";

// Simple Icons (CC0). To add a tool: import its icon here and add it to `techStack` in content/site.ts.
const ICONS: Record<string, SimpleIcon> = {
  html5: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  express: siExpress,
  tailwindcss: siTailwindcss,
  threedotjs: siThreedotjs,
  firebase: siFirebase,
  supabase: siSupabase,
  cloudinary: siCloudinary,
  maplibre: siMaplibre,
  openstreetmap: siOpenstreetmap,
  openjdk: siOpenjdk,
  androidstudio: siAndroidstudio,
  figma: siFigma,
  git: siGit,
  github: siGithub,
  vercel: siVercel,
  claude: siClaude,
  anthropic: siAnthropic,
  npm: siNpm,
};

type Tool = (typeof techStack)[number];

function ToolMark({ tool }: { tool: Tool }) {
  const icon = ICONS[tool.icon];
  return (
    <span className="group flex items-center gap-3.5 text-muted transition-colors duration-200 hover:text-ink">
      {icon ? (
        <svg viewBox="0 0 24 24" className="size-10 shrink-0" fill="currentColor" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      ) : null}
      <span className="text-[15px] font-medium whitespace-nowrap text-nav group-hover:text-ink">
        {tool.name}
      </span>
    </span>
  );
}

/**
 * Two rows of logos drifting in opposite directions. Logos are one colour
 * (the text colour), so the band stays black and white like the rest of the site.
 * Slows down on hover; stands still with reduced motion.
 */
export function TechMarquee() {
  const half = Math.ceil(techStack.length / 2);
  const rows = [techStack.slice(0, half), techStack.slice(half)];

  return (
    <section aria-labelledby="stack-heading" className="reveal border-y border-line py-12">
      <div className="container-site mb-9">
        <h2 id="stack-heading" className="text-[13px] font-medium tracking-normal text-muted">
          Tools I build with
        </h2>
      </div>

      {/* Readable list for screen readers; the moving rows repeat items, so they are hidden */}
      <ul className="sr-only">
        {techStack.map((tool) => (
          <li key={tool.name}>{tool.name}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="space-y-8">
        {rows.map((row, i) => (
          <InfiniteSlider key={i} gap={64} duration={45} durationOnHover={120} reverse={i === 1}>
            {row.map((tool) => (
              <ToolMark key={tool.name} tool={tool} />
            ))}
          </InfiniteSlider>
        ))}
      </div>
    </section>
  );
}
