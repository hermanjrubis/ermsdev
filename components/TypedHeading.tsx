import { Fragment, type CSSProperties } from "react";

type TypedHeadingProps = {
  id?: string;
  /** Each entry renders on its own line. */
  lines: readonly string[];
  /** Classes per line, same order as `lines`. */
  lineClassNames?: readonly string[];
  className?: string;
};

type Char = { ch: string; i: number };

/** Split into lines → words → characters, numbering every character for the stagger. */
function toChars(lines: readonly string[]) {
  let i = 0;
  return lines.map((line) =>
    line.split(" ").map((word) => [...word].map((ch): Char => ({ ch, i: i++ }))),
  );
}

/**
 * The h1 types itself in on load (pure CSS, no JavaScript).
 * Screen readers get the plain sentence; the per-letter spans are hidden from them.
 */
export function TypedHeading({ id, lines, lineClassNames = [], className }: TypedHeadingProps) {
  const chars = toChars(lines);
  return (
    <h1 id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {chars.map((words, li) => (
          <span key={li} className={`block ${lineClassNames[li] ?? ""}`}>
            {words.map((letters, wi) => (
              <Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span className="inline-block whitespace-nowrap">
                  {letters.map(({ ch, i }) => (
                    <span key={i} className="type-char" style={{ "--i": i } as CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}

/** How long the typing takes, so later content can wait for it. */
export function typingDuration(lines: readonly string[]) {
  const count = lines.join("").replace(/\s/g, "").length;
  return count * 38 + 120;
}
