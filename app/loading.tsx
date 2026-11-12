import { Logo } from "@/components/Logo";

/** Loading state: the second (and last) place the cursor blinks. */
export default function Loading() {
  return (
    <div role="status" className="container-site flex min-h-[50vh] items-center justify-center">
      <Logo size={46} blink />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
