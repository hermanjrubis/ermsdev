import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page so route changes animate: the old page lifts away quickly and
 * the new one settles in (see the page-enter / page-exit rules in globals.css).
 * The navbar and footer live outside it, so they stay put.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
