import Link from "next/link";
import type { ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import type { ImageInput, LinkItem } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import { FactNote } from "@/components/ui/Facts";
import { ArrowUpRight } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import SplitTracker from "./SplitTracker";
import styles from "./StickySplit.module.css";

export type StickySplitStep = {
  eyebrow?: string;
  title: string;
  titleAs?: "h2" | "h3";
  /** Long text allowed (Prose px scale, max 46ch). */
  body: ReactNode;
  media: { kind: "image"; image: ImageInput; caption?: string } | { kind: "node"; node: ReactNode };
  factKeys?: FactKey[];
  links?: LinkItem[];
  id?: string;
};

export type StickySplitProps = {
  intro?: IntroProps;
  steps: StickySplitStep[];
  bg: "W" | "D";
  id?: string;
};

/**
 * Geometry D – sticky text + scrolling media. Each chapter's text sticks while its media
 * scrolls past; the active chapter is full strength, the others dim. ≤900px: text then media.
 */
export default function StickySplit({ intro, steps, bg, id }: StickySplitProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : undefined;
  return (
    <Section bg={bg} id={id} labelledBy={intro ? titleId : undefined}>
      {intro && <SectionIntro {...intro} tone={tone} titleId={titleId} className={styles.intro} />}
      <SplitTracker className={`${styles.list} ${bg === "D" ? styles.dark : ""}`}>
        {steps.map((step, i) => {
          const H = step.titleAs ?? (intro ? "h3" : "h2");
          return (
            <li key={step.title} id={step.id} className={styles.row} data-split-row data-active={i === 0 ? "true" : undefined}>
              <div className={styles.text}>
                <div className={styles.sticky}>
                  <p className={styles.eyebrow}>
                    <span className={styles.count}>
                      {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                    </span>
                    {step.eyebrow && <span> · {step.eyebrow}</span>}
                  </p>
                  <H className={styles.title}>{step.title}</H>
                  <div className={styles.body}>{step.body}</div>
                  {step.factKeys && step.factKeys.length > 0 && <FactNote keys={step.factKeys} tone={tone} className={styles.note} />}
                  {step.links && step.links.length > 0 && (
                    <ul className={styles.links}>
                      {step.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className={styles.link}>
                            {l.label} <ArrowUpRight className={styles.linkIcon} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <Reveal mode="custom" threshold={0.1} className={styles.media}>
                {step.media.kind === "image" ? (
                  <figure className={styles.figure}>
                    <SmartImage image={step.media.image} fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.mediaImage} />
                    {step.media.caption && <figcaption className={styles.caption}>{step.media.caption}</figcaption>}
                  </figure>
                ) : (
                  <div className={styles.node}>{step.media.node}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </SplitTracker>
    </Section>
  );
}
