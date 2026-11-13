import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ProjectList } from "@/components/ProjectList";
import { projects } from "@/content/site";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <PageTransition>
      <PageHeader
        title="Projects"
        intro="Web apps, an Android app and a school site. Most of them started as a problem someone near me actually had."
      />
      <div className="container-site mt-14">
        <ProjectList projects={projects} headingLevel="h2" />
      </div>
    </PageTransition>
  );
}
