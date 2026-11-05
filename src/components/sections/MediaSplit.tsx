import type { ReactNode } from "react";
import type { Bg, Cta, ImageInput } from "@/content/types";
import Section from "@/components/ui/Section";
import CtaPill, { TextLink } from "@/components/ui/CtaPill";
import { CheckList } from "@/components/ui/Bits";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import styles from "./MediaSplit.module.css";

export type MediaSplitItem = {
  eyebrow?: string;
  /** Dark first part of the two-tone heading. */
  title: string;
  /** Muted second part (own line). */
  titleMuted?: string;
  /** One or two short sentences. Phones show only this. */
  text: ReactNode;
  /** Max. 3 short bullets – desktop only. */
  points?: string[];
  cta?: Cta;
  secondary?: { href: string; label: string };
  image: ImageInput;
  /** Glass chip on the photo: a key number + label. */
  chip?: { value: string; label: string };
  /** Overrides the automatic alternation. */
  side?: "left" | "right";
};

export type MediaSplitProps = {
  id?: string;
  bg?: Extract<Bg, "W" | "L">;
  /** Side of the photo in the first row; the rows after it alternate. */
  start?: "left" | "right";
  items: MediaSplitItem[];
  /** First row's heading level (rows after it use h3 when a section title sits above). */
  as?: "h2" | "h3";
  /** Optional section heading above the rows. */
  intro?: { eyebrow?: string; title: string; titleMuted?: string };
};

/**
 * Title + photo left or right, short copy on the other side (round 4: less text, more rhythm).
 * Rows alternate sides. Phones: photo, heading, one line and the CTA – nothing else.
 */
export default function MediaSplit({ id, bg = "W", start = "right", items, as, intro }: MediaSplitProps) {
  const titleId = id ? `${id}-title` : undefined;
  const rowAs = as ?? (intro ? "h3" : "h2");
  return (
    <Section bg={bg} id={id} labelledBy={intro ? titleId : undefined} className={styles.section}>
      {intro && (
        <Reveal className={styles.intro}>
          {intro.eyebrow && <p className={styles.eyebrow}>{intro.eyebrow}</p>}
          <h2 id={titleId} className={styles.introTitle}>
            {intro.title}
            {intro.titleMuted && <span className={styles.muted}> {intro.titleMuted}</span>}
          </h2>
        </Reveal>
      )}
      <div className={styles.rows}>
        {items.map((item, i) => {
          const side = item.side ?? ((i % 2 === 0) === (start === "right") ? "right" : "left");
          const H = rowAs;
          return (
            <Reveal key={item.title} mode="group" stagger={110} className={`${styles.row} ${side === "left" ? styles.imageLeft : ""}`}>
              <div className={styles.copy}>
                {item.eyebrow && (
                  <p className={styles.eyebrow} data-reveal-item>
                    {item.eyebrow}
                  </p>
                )}
                <H className={styles.title} data-reveal-item>
                  {item.title}
                  {item.titleMuted && <span className={styles.muted}> {item.titleMuted}</span>}
                </H>
                <div className={styles.text} data-reveal-item>
                  {typeof item.text === "string" ? <p>{item.text}</p> : item.text}
                </div>
                {item.points && item.points.length > 0 && (
                  <div className="desktop-only" data-reveal-item>
                    <CheckList items={item.points.slice(0, 3)} className={styles.points} />
                  </div>
                )}
                {(item.cta || item.secondary) && (
                  <div className={styles.actions} data-reveal-item>
                    {item.cta && (
                      <CtaPill href={item.cta.href} variant={item.cta.variant ?? "ink"}>
                        {item.cta.label}
                      </CtaPill>
                    )}
                    {item.secondary && (
                      <span className="desktop-only">
                        <TextLink href={item.secondary.href}>{item.secondary.label}</TextLink>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.media} data-reveal-item>
                <SmartImage image={item.image} fill sizes="(max-width: 900px) 100vw, 52vw" className={styles.photo} imgClassName={styles.img} />
                {item.chip && (
                  <p className={styles.chip}>
                    <span className={styles.chipValue}>{item.chip.value}</span>
                    <span className={styles.chipLabel}>{item.chip.label}</span>
                  </p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
