type PageHeaderProps = { title: string; intro?: string };

/** The single h1 for inner pages. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="container-site pt-16 sm:pt-24">
      <h1 className="text-[clamp(32px,3vw,44px)] leading-tight tracking-[-0.035em]">{title}</h1>
      {intro ? <p className="mt-4 max-w-[60ch] text-[17px] text-muted">{intro}</p> : null}
    </header>
  );
}
