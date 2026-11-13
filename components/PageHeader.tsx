import { Fragment, type CSSProperties } from "react";

type PageHeaderProps = { title: string; intro?: string };

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

/**
 * The single h1 for inner pages. The title's words rise out of their own masks
 * one after another, then the intro follows.
 */
export function PageHeader({ title, intro }: PageHeaderProps) {
  const words = title.split(" ");
  return (
    <header className="container-site pt-16 sm:pt-24">
      <h1 className="text-[clamp(36px,4.2vw,64px)] leading-[1.02] tracking-[-0.04em]">
        <span className="sr-only">{title}</span>
        <span aria-hidden="true">
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="word-mask">
                <span className="word-rise" style={delay(i * 70)}>
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      </h1>
      {intro ? (
        <p className="enter mt-5 max-w-[60ch] text-[17px] text-muted" style={delay(220 + words.length * 70)}>
          {intro}
        </p>
      ) : null}
    </header>
  );
}
