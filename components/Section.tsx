import type { ReactNode } from "react";

type SectionProps = {
  /** Used for the heading id and aria-labelledby, and as the #anchor. */
  id: string;
  title: string;
  /** Section number shown before the title, e.g. "01". */
  index?: string;
  /** Muted line beside the title. */
  description?: string;
  /** Element at the end of the header row, e.g. a "View all" link. */
  action?: ReactNode;
  children: ReactNode;
};

/**
 * Swiss-style section: a hairline, then one quiet header row
 * (number, title, note, action), then the content does the talking.
 */
export function Section({ id, title, index, description, action, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="container-site reveal mt-28 scroll-mt-6 sm:mt-36"
    >
      <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-line pt-5 md:grid md:grid-cols-[96px_minmax(0,1fr)_minmax(0,1.4fr)_112px]">
        <span aria-hidden="true" className="text-[13px] text-muted tabular-nums md:col-start-1">
          {index}
        </span>
        <h2 id={headingId} className="text-xl tracking-[-0.02em] md:col-start-2">
          {title}
        </h2>
        {action ? <div className="ml-auto text-sm md:col-start-4 md:ml-0">{action}</div> : null}
        {description ? (
          <p className="w-full text-[15px] text-muted md:col-start-3 md:row-start-1 md:w-auto">
            {description}
          </p>
        ) : null}
      </header>
      <div className="mt-12">{children}</div>
    </section>
  );
}
