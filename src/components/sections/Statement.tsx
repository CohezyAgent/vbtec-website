import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Cta } from "@/content/types";
import Section from "@/components/ui/Section";
import CtaPill from "@/components/ui/CtaPill";
import { KortAntwoord } from "@/components/ui/Facts";
import { ArrowUpRight } from "@/components/ui/icons";
import Reveal from "@/components/motion/Reveal";
import WordReveal from "@/components/motion/WordReveal";
import styles from "./Statement.module.css";

export type StatementPill = { label: string; href?: string; tone?: "grey" | "dark" | "lime" };

export type StatementProps = {
  eyebrow?: string;
  /** The big statement (statement-xl, word reveal). */
  text: string;
  /** Default: "p" when `heading` is given (visual quote), else "h2". */
  textAs?: "h2" | "p";
  /** Separate plain-language H2 under the visual quote (AEO). */
  heading?: string;
  /** Words that get the highlight sweep (lime-pale on W/L, lime text on D). */
  highlight?: string[];
  support?: ReactNode;
  /** Up to 6 "doubt" pills (non-link) or link pills (e.g. comparisons). */
  pills?: StatementPill[];
  bg: "W" | "D" | "L";
  cta?: Cta;
  /** Scroll-scrubbed reading-along reveal (where CSS scroll timelines exist). */
  scrub?: boolean;
  kortAntwoord?: ReactNode;
  /** Compact band (CtaBand): less height, smaller type. */
  compact?: boolean;
  id?: string;
};

/** Geometry G – big centred statement with word reveal; also the compact CtaBand. */
export default function Statement({ eyebrow, text, textAs, heading, highlight, support, pills, bg, cta, scrub, kortAntwoord, compact, id }: StatementProps) {
  const tone = bg === "D" ? "dark" : "light";
  const as = textAs ?? (heading ? "p" : "h2");
  const titleId = id ? `${id}-title` : undefined;
  return (
    <Section bg={bg} id={id} labelledBy={as === "h2" || heading ? titleId : undefined} className={`${styles.section} ${compact ? styles.compact : ""}`}>
      <div className={`${styles.inner} ${bg === "D" ? styles.dark : ""} ${bg === "L" ? styles.lime : ""}`}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <WordReveal
          as={as}
          id={as === "h2" ? titleId : undefined}
          text={text}
          highlight={highlight}
          scrub={scrub}
          tone={bg === "L" ? "lime" : tone}
          className={`${styles.text} ${as === "p" ? styles.quote : ""}`}
        />
        {heading && (
          <h2 id={titleId} className={styles.heading}>
            {heading}
          </h2>
        )}
        {support && <div className={styles.support}>{support}</div>}
        {kortAntwoord && (
          <div className={styles.kort}>
            <KortAntwoord tone={tone}>{kortAntwoord}</KortAntwoord>
          </div>
        )}
        {pills && pills.length > 0 && (
          <Reveal as="ul" mode="group" stagger={90} delay={500} className={styles.pills}>
            {pills.slice(0, 6).map((p, i) => {
              const toneCls = styles[`pill_${p.tone ?? (bg === "L" ? "dark" : bg === "D" ? "dark" : "grey")}`];
              return (
                <li key={p.label} data-reveal-item style={{ "--i": i } as CSSProperties} className={i >= 3 ? styles.pillExtra : undefined}>
                  {p.href ? (
                    <Link href={p.href} className={`${styles.pill} ${styles.pillLink} ${toneCls}`}>
                      {p.label}
                      <ArrowUpRight className={styles.pillArrow} />
                    </Link>
                  ) : (
                    <span className={`${styles.pill} ${toneCls}`}>
                      <span className={styles.qm} aria-hidden="true">
                        “
                      </span>
                      {p.label}
                      <span className={styles.qm} aria-hidden="true">
                        ”
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </Reveal>
        )}
        {cta && (
          <div className={styles.cta}>
            <CtaPill href={cta.href} variant={cta.variant ?? (bg === "D" ? "lime" : "ink")}>
              {cta.label}
            </CtaPill>
          </div>
        )}
      </div>
    </Section>
  );
}

/** Compact CTA band (privacy, 404): Statement with `compact` and a CTA. */
export function CtaBand({ text, cta, bg = "D", eyebrow, support, id }: { text: string; cta: Cta; bg?: "W" | "D" | "L"; eyebrow?: string; support?: ReactNode; id?: string }) {
  return <Statement text={text} cta={cta} bg={bg} eyebrow={eyebrow} support={support} compact id={id} />;
}
