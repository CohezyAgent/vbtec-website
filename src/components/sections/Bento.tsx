import type { CSSProperties, ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import { fact } from "@/content/facts";
import type { Cta, ImageInput, Review } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import { IconCircle, Tag } from "@/components/ui/Bits";
import { ReviewCard } from "@/components/ui/cards";
import { FactNote } from "@/components/ui/Facts";
import type { IconComponent } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import styles from "./Bento.module.css";

export type BentoTile =
  | {
      kind: "stat";
      /** Number to count to; or pass `k` to use a fact value (preferred). */
      to?: number;
      k?: FactKey;
      decimals?: number;
      prefix?: string;
      suffix?: string;
      label: string;
      caption?: string;
      pill?: string;
      factKeys?: FactKey[];
      icon?: IconComponent;
      /** Small "Voorbeeldcijfer"-style note for placeholder metrics. */
      placeholderNote?: string;
    }
  | { kind: "photo"; image: ImageInput; title: string; body?: ReactNode; icon?: IconComponent }
  | { kind: "grey"; title: string; body?: ReactNode; tags?: string[] }
  | { kind: "review"; review: Review }
  | { kind: "wide" | "tall"; title: string; body: ReactNode; image?: ImageInput; cta?: Cta; tone?: "grey" | "dark" | "lime" };

export type BentoProps = {
  intro: IntroProps;
  /** Max 5 tiles. Default flow: 3 × span-4; "wide" spans 8, "tall" spans 2 rows. */
  tiles: BentoTile[];
  bg?: "W" | "D";
  id?: string;
};

/** Geometry F – Mission's trio grown into a 12-column bento with the Mission entrance. */
export default function Bento({ intro, tiles, bg = "W", id }: BentoProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "bento-title";
  return (
    <Section bg={bg} id={id} labelledBy={titleId}>
      <SectionIntro {...intro} tone={tone} titleId={titleId} wordReveal={intro.wordReveal ?? typeof intro.title === "string"} />
      <Reveal mode="wipe" stagger={150} delay={400} className={`${styles.grid} ${bg === "D" ? styles.onD : ""}`}>
        {tiles.slice(0, 5).map((tile, i) => (
          <Tile key={i} tile={tile} index={i} />
        ))}
      </Reveal>
    </Section>
  );
}

function Tile({ tile, index }: { tile: BentoTile; index: number }) {
  const style = { "--c": index } as CSSProperties;
  switch (tile.kind) {
    case "stat": {
      const f = tile.k ? fact(tile.k) : null;
      const to = f ? f.value : tile.to ?? 0;
      return (
        <article className={`${styles.tile} ${styles.stat}`} style={style} data-reveal-item>
          <div className={styles.top}>
            <p className={styles.statLabel}>{tile.label}</p>
            {tile.icon && <IconCircle icon={tile.icon} fill="ring" size="lg" className={styles.pop} />}
          </div>
          <div className={styles.statBottom}>
            {tile.pill && <span className={styles.pill}>{tile.pill}</span>}
            <p className={styles.statNumber}>
              <CountUp to={to} decimals={tile.decimals ?? 0} prefix={tile.prefix} suffix={tile.suffix} delay={900} />
            </p>
            {tile.caption && <p className={styles.statCaption}>{tile.caption}</p>}
            {(tile.factKeys || tile.k) && <FactNote keys={tile.factKeys ?? [tile.k!]} variant="footnote" tone="dark" className={styles.statNote} />}
            {tile.placeholderNote && <p className={styles.placeholderNote}>{tile.placeholderNote}</p>}
          </div>
        </article>
      );
    }
    case "photo":
      return (
        <article className={`${styles.tile} ${styles.photo}`} style={style} data-reveal-item>
          <SmartImage image={tile.image} fill sizes="(max-width: 900px) 100vw, 32vw" quality={90} className={styles.photoImg} />
          {tile.icon && <IconCircle icon={tile.icon} fill="glass" size="lg" className={`${styles.photoIcon} ${styles.pop}`} />}
          <div className={styles.photoText}>
            <h3 className={styles.photoTitle}>{tile.title}</h3>
            {tile.body && <div className={styles.photoBody}>{tile.body}</div>}
          </div>
        </article>
      );
    case "grey":
      return (
        <article className={`${styles.tile} ${styles.grey}`} style={style} data-reveal-item>
          <h3 className={styles.greyTitle}>{tile.title}</h3>
          {tile.body && <div className={styles.greyBody}>{tile.body}</div>}
          {tile.tags && (
            <ul className={styles.tags}>
              {tile.tags.map((t, ti) => (
                <li key={t} className={styles.tagPop} style={{ "--t": ti } as CSSProperties}>
                  <Tag tone="grey">{t}</Tag>
                </li>
              ))}
            </ul>
          )}
        </article>
      );
    case "review":
      return (
        <div className={`${styles.tile} ${styles.review}`} style={style} data-reveal-item>
          <ReviewCard review={tile.review} tone="grey" />
        </div>
      );
    default:
      return (
        <article
          className={`${styles.tile} ${tile.kind === "wide" ? styles.wide : styles.tall} ${styles[`t_${tile.tone ?? "grey"}`]}`}
          style={style}
          data-reveal-item
        >
          {tile.image && (
            <div className={styles.wideMedia}>
              <SmartImage image={tile.image} fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
          )}
          <div className={styles.wideText}>
            <h3 className={styles.greyTitle}>{tile.title}</h3>
            <div className={styles.greyBody}>{tile.body}</div>
            {tile.cta && (
              <CtaPill href={tile.cta.href} variant={tile.cta.variant ?? (tile.tone === "dark" ? "lime" : "ink")} size="sm">
                {tile.cta.label}
              </CtaPill>
            )}
          </div>
        </article>
      );
  }
}
