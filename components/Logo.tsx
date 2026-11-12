type LogoProps = {
  /** Font size (px number, or any CSS length such as a clamp()). Everything is in em, so this one value scales it. */
  size?: number | string;
  /** Blink the underscore like a console cursor. Hero and loading states only. */
  blink?: boolean;
  className?: string;
};

/**
 * ermsDev wordmark: geometric "e" + "rmsDev" + underscore cursor on the baseline.
 * Decorative (aria-hidden). Give the surrounding link or heading the accessible name.
 */
export function Logo({ size = 24, blink = false, className }: LogoProps) {
  return (
    <span
      className={className ? `logo ${className}` : "logo"}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      <svg
        className="logo-e"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="butt"
        focusable="false"
      >
        <path d="M6 24 H40 M40 24 A16 16 0 1 0 33.2 37.1" />
      </svg>
      <span>rmsDev</span>
      <span className="logo-cursor" data-blink={blink} />
    </span>
  );
}
