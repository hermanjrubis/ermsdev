import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageTransition } from "@/components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <PageHeader title="Page not found" intro="That page doesn't exist, or it has moved." />
      <div className="container-site mt-8">
        <Link href="/" className="text-link inline-flex min-h-11 items-center font-medium">
          Back to home
        </Link>
      </div>
    </PageTransition>
  );
}
