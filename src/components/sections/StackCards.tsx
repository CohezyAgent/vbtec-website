import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import type { ImageInput, LinkItem } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import { FactNote } from "@/components/ui/Facts";
import { ArrowUpRight } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import StackScroller from "./StackScroller";
import styles from "./StackCards.module.css";

export type StackCard = {
  eyebrow?: string;
  title: string;
  body?: ReactNode;
  /** D = deep green card · G = grey #eee card · I = photo card. */
  tone: "D" | "G" | "I";
  image?: ImageInput;
  factKeys?: FactKey[];
  link?: LinkItem;
  /** Free content at the bottom of the card (e.g. a ReviewCard quote). */
  footer?: ReactNode;
};

export type StackCardsProps = {
  intro: IntroProps;
  /** Under the intro in the sticky column (e.g. <KortAntwoord>). */
  aside?: ReactNode;
  cards: StackCard[];
  bg: "W" | "D";
  /** Sticky stacking on desktop (counts as a pin). Default true. */
  pinned?: boolean;
  id?: string;
};

/**
 * Geometry B – sticky stacked cards. The intro column stays put; each card sticks a
 * little lower than the previous one and slides over it; covered cards scale to 0.94
 * and dim. ≤900px / reduced motion / short screens: a plain vertical list.
 */
export default function StackCards({ intro, aside, cards, bg, pinned = true, id }: StackCardsProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "stack-title";
  return (
    <Section bg={bg} id={id} labelledBy={titleId} className={pinned ? styles.pinned : undefined}>
      <div className={styles.layout}>
        <div className={styles.side}>
          <SectionIntro {...intro} tone={tone} titleId={titleId} className={styles.intro} />
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
        <StackScroller className={styles.stack}>
          {cards.map((card, i) => (
            <li key={card.title} className={styles.slot} style={{ "--i": i, "--n": cards.length } as CSSProperties} data-stack-card>
              <article className={`${styles.card} ${styles[`tone_${card.tone}`]} ${bg === "D" ? styles.onD : ""}`}>
                {card.tone === "I" && card.image && (
                  <SmartImage image={card.image} fill sizes="(max-width: 900px) 100vw, 55vw" className={styles.cardImage} />
                )}
                <Reveal mode="group" stagger={90} className={styles.cardContent}>
                  <span className={styles.count} aria-hidden="true" data-reveal-item>
                    {String(i + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                  </span>
                  {card.eyebrow && (
                    <p className={styles.eyebrow} data-reveal-item>
                      {card.eyebrow}
                    </p>
                  )}
                  <h3 className={styles.title} data-reveal-item>
                    {card.title}
                  </h3>
                  {card.body && (
                    <div className={`${styles.body} desktop-only`} data-reveal-item>
                      {card.body}
                    </div>
                  )}
                  {(card.factKeys?.length || card.link || card.footer) && (
                    <div className={styles.bottom} data-reveal-item>
                      {card.footer}
                      {card.factKeys && card.factKeys.length > 0 && (
                        <FactNote keys={card.factKeys} tone={card.tone === "G" ? "light" : "dark"} />
                      )}
                      {card.link && (
                        <Link href={card.link.href} className={styles.link}>
                          {card.link.label} <ArrowUpRight className={styles.linkIcon} />
                        </Link>
                      )}
                    </div>
                  )}
                </Reveal>
                <span className={styles.dim} aria-hidden="true" />
              </article>
            </li>
          ))}
        </StackScroller>
      </div>
    </Section>
  );
}
