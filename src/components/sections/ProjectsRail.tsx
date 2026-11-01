import type { Project } from "@/content/types";
import { routes } from "@/lib/routes";
import { ProjectCard } from "@/components/ui/cards";
import type { IntroProps } from "@/components/ui/SectionIntro";
import Rail from "./Rail";

/** Rail of ProjectCards + "Alle projecten" + CTA end card (05 §1 row 10). */
export default function ProjectsRail({
  projects,
  intro = { eyebrow: "Projecten", title: "Gezinnen zoals jij. Hun factuur vóór en na." },
  bg = "D",
  endCard = true,
  id,
}: {
  projects: Project[];
  intro?: IntroProps;
  bg?: "W" | "D";
  endCard?: boolean;
  id?: string;
}) {
  if (projects.length === 0) return null;
  return (
    <Rail
      id={id}
      bg={bg}
      kind="project"
      intro={intro}
      items={projects.map((p) => (
        <ProjectCard key={p.slug} project={p} tone={bg === "D" ? "dark" : "light"} />
      ))}
      viewAll={{ href: routes.projecten(), label: "Alle projecten" }}
      endCard={endCard ? { label: "Zo'n berekening voor jouw woning?", href: routes.lead(), body: "Gratis, vrijblijvend en berekend door een ingenieur." } : undefined}
    />
  );
}
