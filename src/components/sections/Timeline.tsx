import type { CSSProperties, ReactNode } from "react";
import type { Cta, ImageInput } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import { Tag } from "@/components/ui/Bits";
import SmartImage from "@/components/ui/SmartImage";
import TimelineTrack from "./TimelineTrack";
import styles from "./Timeline.module.css";

export type TimelineStep = {
  title: string;
  body: ReactNode;
  duration?: string;
  cost?: string;
  /** Milestone label (story/regulation timelines), shown instead of the number. */
  date?: string;
  image?: ImageInput;
  whoDoesWhat?: { jij: string; wij: string };
  /** Heading level for the step title (default h3; use "h2" on /hoe-we-werken). */
  titleAs?: "h2" | "h3";
};

export type TimelineProps = {
  intro: IntroProps;
  steps: TimelineStep[];
  bg: "D" | "W";
  cta?: Cta;
  id?: string;
};

/**
 * Geometry E – vertical timeline. A hairline at the eyebrow column fills lime (on D) / ink
 * (on W) with scroll; nodes fill when the line reaches them; steps slide in from the line.
 */
export default function Timeline({ intro, steps, bg, cta, id }: TimelineProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "timeline-title";
  return (
    <Section bg={bg} id={id} labelledBy={titleId}>
      <SectionIntro {...intro} tone={tone} titleId={titleId} />
      <TimelineTrack className={`${styles.track} ${bg === "D" ? styles.dark : ""}`}>
        <span className={styles.line} aria-hidden="true">
          <span className={styles.fill} />
        </span>
        <ol className={styles.steps}>
          {steps.map((step, i) => {
            const H = step.titleAs ?? "h3";
            return (
              <li key={step.title} className={styles.step} data-timeline-step style={{ "--i": i } as CSSProperties}>
                <span className={styles.node} aria-hidden="true" />
                <div className={styles.content}>
                  <p className={styles.num}>{step.date ?? String(i + 1).padStart(2, "0")}</p>
                  <H className={styles.title}>{step.title}</H>
                  {(step.duration || step.cost) && (
                    <ul className={styles.chips}>
                      {step.duration && (
                        <li>
                          <Tag size="sm" tone={tone === "dark" ? "ring" : "light"}>
                            {step.duration}
                          </Tag>
                        </li>
                      )}
                      {step.cost && (
                        <li>
                          <Tag size="sm" tone="lime">
                            {step.cost}
                          </Tag>
                        </li>
                      )}
                    </ul>
                  )}
                  <div className={styles.body}>{step.body}</div>
                  {step.whoDoesWhat && (
                    <dl className={styles.who}>
                      <div>
                        <dt>Wat jij doet</dt>
                        <dd>{step.whoDoesWhat.jij}</dd>
                      </div>
                      <div>
                        <dt>Wat wij doen</dt>
                        <dd>{step.whoDoesWhat.wij}</dd>
                      </div>
                    </dl>
                  )}
                </div>
                {step.image && (
                  <div className={styles.photo}>
                    <SmartImage image={step.image} ratio="4/3" sizes="(max-width: 900px) 90vw, 26vw" />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </TimelineTrack>
      {cta && (
        <div className={styles.cta}>
          <CtaPill href={cta.href} variant={cta.variant ?? (bg === "D" ? "lime" : "ink")}>
            {cta.label}
          </CtaPill>
        </div>
      )}
    </Section>
  );
}
