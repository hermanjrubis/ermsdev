import { siGithub, siInstagram } from "simple-icons";

export type IconName = "github" | "instagram" | "mail" | "school";

type IconProps = { name: IconName; className?: string };

/**
 * Brand logos come from Simple Icons (filled, one colour). Mail and school
 * are plain line icons drawn to sit at the same visual weight.
 */
export function Icon({ name, className = "size-4" }: IconProps) {
  if (name === "github" || name === "instagram") {
    const icon = name === "github" ? siGithub : siInstagram;
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
        <path d={icon.path} />
      </svg>
    );
  }

  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" {...stroke}>
      {name === "mail" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="m3.5 6 8.5 7 8.5-7" />
        </>
      ) : (
        <>
          <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
          <path d="M6 11.3v4.2c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.2" />
          <path d="M22 9.5v5" />
        </>
      )}
    </svg>
  );
}
