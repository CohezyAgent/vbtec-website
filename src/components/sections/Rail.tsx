import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta, LinkItem } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import { ArrowUpRight } from "@/components/ui/icons";
import RailScroller from "./RailScroller";
import styles from "./Rail.module.css";

export type RailProps = {
  intro: IntroProps;
  /** Pre-rendered cards (ProjectCard, ArticleCard, TeamCard, SmartImage…). One per slide. */
  items: ReactNode[];
  /** Informational only (styling hook): project | article | team | image | mixed | room. */
  kind?: "project" | "article" | "team" | "image" | "mixed" | "room";
  bg: "W" | "D";
  viewAll?: LinkItem;
  /** Last slide = CTA card. */
  endCard?: Cta & { body?: string };
  id?: string;
};

/**
 * Geometry I – horizontal rail that bleeds off the right edge. Native scroll-snap +
 * prev/next buttons, drag on desktop, arrow keys when focused, thin progress bar.
 */
export default function Rail({ intro, items, kind = "mixed", bg, viewAll, endCard, id }: RailProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "rail-title";
  const slides = [...items];
  if (endCard) {
    slides.push(
      <div className={`${styles.endCard} ${bg === "D" ? styles.endDark : ""}`}>
        <p className={styles.endTitle}>{endCard.label}</p>
        {endCard.body && <p className={styles.endBody}>{endCard.body}</p>}
        <CtaPill href={endCard.href} variant={endCard.variant ?? "lime"} size="sm">
          Gratis berekening
        </CtaPill>
      </div>,
    );
  }
  return (
    <Section bg={bg} id={id} labelledBy={titleId} contained={false} className={styles.section}>
      <RailScroller
        tone={tone}
        kind={kind}
        label={typeof intro.title === "string" ? intro.title : "Overzicht"}
        header={<SectionIntro {...intro} tone={tone} titleId={titleId} />}
        footer={
          viewAll ? (
            <Link href={viewAll.href} className={`${styles.viewAll} ${bg === "D" ? styles.viewAllDark : ""}`}>
              {viewAll.label} <ArrowUpRight className={styles.viewAllIcon} />
            </Link>
          ) : null
        }
      >
        {slides}
      </RailScroller>
    </Section>
  );
}
