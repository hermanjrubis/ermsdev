import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NavMenu } from "@/components/NavMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { nav } from "@/content/site";

export function Navbar() {
  return (
    <header className="relative border-b border-line bg-paper">
      <nav aria-label="Main" className="container-site flex h-[72px] items-center justify-between gap-4">
        {/* Static logo in the navbar: no blink */}
        <Link
          href="/"
          aria-label="ermsDev home"
          className="-ml-1 inline-flex min-h-11 items-center px-1"
        >
          <Logo size={24} />
        </Link>

        <div className="-mr-[11px] flex items-center">
          <NavMenu items={nav} />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
