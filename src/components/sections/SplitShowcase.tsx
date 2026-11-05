import Link from "next/link";
import type { CSSProperties } from "react";
import type { Cta, ImageInput, LinkItem } from "@/content/types";
import CtaPill from "@/components/ui/CtaPill";
import { ArrowUpRight, CheckIcon, type IconComponent } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import styles from "./SplitShowcase.module.css";

export type ShowcaseStat = {
  icon: IconComponent;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** 0–1: draws a small meter under the value (e.g. battery level). */
  meter?: number;
};

export type SplitShowcaseProps = {
  id?: string;
  badge: string;
  title: string;
  lead?: string;
  points: { label: string; icon?: IconComponent }[];
  cta?: Cta;
  secondary?: LinkItem;
  image: ImageInput;
  /** Glass stat cards along the bottom of the photo (max. 3). */
  stats: ShowcaseStat[];
  /** Small chip on the photo, e.g. "Voorbeelddag in juni". */
  chip?: string;
  /** Photo on the left instead of the right. */
  reverse?: boolean;
  tone?: "mint" | "lilac";
};

/**
 * Split showcase – a soft tinted card (badge, heading, icon checklist, CTA) next to a
 * full-bleed photo carrying frosted stat cards that count up on view. Mobile: stacked.
 */
export default function SplitShowcase({ id, badge, title, lead, points, cta, secondary, image, stats, chip, reverse, tone = "mint" }: SplitShowcaseProps) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={styles.section} data-header-tone="light" aria-labelledby={titleId}>
      <Reveal mode="custom" threshold={0.2} className={`${styles.grid} ${reverse ? styles.reverse : ""}`}>
        <div className={`${styles.card} ${tone === "lilac" ? styles.lilac : styles.mint}`}>
          <span className={styles.badge}>{badge}</span>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
          <ul className={styles.points}>
            {points.map(({ label, icon: Icon = CheckIcon }, i) => (
              <li key={label} className={styles.point} style={{ "--i": i } as CSSProperties}>
                <span className={styles.pointIcon} aria-hidden="true">
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
          {(cta || secondary) && (
            <div className={styles.actions}>
              {cta && (
                <CtaPill href={cta.href} variant={cta.variant ?? "ink"}>
                  {cta.label}
                </CtaPill>
              )}
              {secondary && (
                <Link href={secondary.href} className={styles.secondary}>
                  {secondary.label} <ArrowUpRight className={styles.secondaryIcon} />
                </Link>
              )}
            </div>
          )}
        </div>

        <div className={styles.media}>
          <SmartImage image={image} fill sizes="(max-width: 900px) 100vw, 50vw" quality={90} className={styles.photo} />
          {chip && (
            <span className={styles.chip}>
              <span className={styles.chipDot} aria-hidden="true" />
              {chip}
            </span>
          )}
          <ul className={styles.stats}>
            {stats.slice(0, 3).map(({ icon: Icon, value, decimals, prefix, suffix, label, meter }, i) => (
              <li key={label} className={styles.stat} style={{ "--i": i } as CSSProperties}>
                <Icon className={styles.statIcon} />
                <span className={styles.statValue}>
                  <CountUp to={value} decimals={decimals} prefix={prefix} suffix={suffix} delay={350 + i * 150} />
                </span>
                {meter !== undefined && (
                  <span className={styles.meter} aria-hidden="true">
                    <span className={styles.meterFill} style={{ "--m": meter } as CSSProperties} />
                  </span>
                )}
                <span className={styles.statLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
