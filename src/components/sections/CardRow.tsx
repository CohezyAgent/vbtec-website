import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Cta, ImageInput } from "@/content/types";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import CtaPill from "@/components/ui/CtaPill";
import { IconCircle, Tag } from "@/components/ui/Bits";
import { ArrowUpRight, type IconComponent } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import styles from "./CardRow.module.css";

export type CardRowItem = {
  title: string;
  body?: ReactNode;
  image?: ImageInput;
  icon?: IconComponent;
  href?: string;
  tags?: string[];
  /** Lime progress bar under the card (A2). */
  progress?: boolean;
};

export type CardRowProps = {
  /** tiles = A1 compact tile strip · photo = A2 tall photo cards with glass panel. */
  skin: "tiles" | "photo";
  intro?: IntroProps;
  items: CardRowItem[];
  /** Prefix titles with "1.", "2.", … */
  numbered?: boolean;
  bg: "W" | "D";
  cta?: Cta;
  footer?: ReactNode;
  id?: string;
};

/** Geometry A – horizontal row of 3–5 equal cards; staggered rise on view. */
export default function CardRow({ skin, intro, items, numbered, bg, cta, footer, id }: CardRowProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : undefined;
  return (
    <Section bg={bg} id={id} labelledBy={intro ? titleId : undefined}>
      {intro && <SectionIntro {...intro} tone={tone} titleId={titleId} />}
      <Reveal
        as="ol"
        mode="group"
        stagger={180}
        className={`${styles.row} ${skin === "photo" ? styles.photoRow : styles.tileRow} ${intro ? styles.afterIntro : ""}`}
        style={{ "--n": items.length } as CSSProperties}
      >
        {items.map((item, i) => (
          <li key={item.title} className={styles.item} data-reveal-item>
            {skin === "photo" ? <PhotoCard item={item} index={i} numbered={numbered} /> : <Tile item={item} index={i} numbered={numbered} dark={bg === "D"} />}
            {item.progress && (
              <span className={styles.bar} aria-hidden="true">
                <span className={styles.barFill} />
              </span>
            )}
          </li>
        ))}
      </Reveal>
      {footer && <div className={styles.footer}>{footer}</div>}
      {cta && (
        <div className={styles.cta}>
          <CtaPill href={cta.href} variant={cta.variant ?? "lime"}>
            {cta.label}
          </CtaPill>
        </div>
      )}
    </Section>
  );
}

function Wrap({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  return href ? (
    <Link href={href} className={`${className} ${styles.linked}`}>
      {children}
    </Link>
  ) : (
    <article className={className}>{children}</article>
  );
}

function PhotoCard({ item, index, numbered }: { item: CardRowItem; index: number; numbered?: boolean }) {
  const Icon = item.icon;
  return (
    <Wrap href={item.href} className={`${styles.photoCard} ${item.image ? "" : styles.noPhoto}`}>
      {item.image && <SmartImage image={item.image} fill sizes="(max-width: 900px) 90vw, 24vw" className={styles.photo} />}
      <div className={styles.panel}>
        {Icon && <IconCircle icon={Icon} fill="lime" size="md" />}
        <h3 className={styles.panelTitle}>
          {numbered && `${index + 1}. `}
          {item.title}
        </h3>
        {item.body && <div className={styles.panelBody}>{item.body}</div>}
        {item.tags && item.tags.length > 0 && (
          <ul className={styles.tags}>
            {item.tags.map((t) => (
              <li key={t}>
                <Tag tone="ring" size="sm">
                  {t}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Wrap>
  );
}

function Tile({ item, index, numbered, dark }: { item: CardRowItem; index: number; numbered?: boolean; dark: boolean }) {
  const Icon = item.icon;
  return (
    <Wrap href={item.href} className={`${styles.tile} ${dark ? styles.tileDark : ""}`}>
      {item.image && <SmartImage image={item.image} ratio="4/3" sizes="(max-width: 900px) 90vw, 20vw" className={styles.tileImage} />}
      <div className={styles.tileTop}>
        <h3 className={styles.tileTitle}>
          {numbered && <span className={styles.num}>{String(index + 1).padStart(2, "0")}</span>}
          {item.title}
        </h3>
        {Icon ? <IconCircle icon={Icon} fill={dark ? "lime" : "pale"} size="sm" /> : item.href ? <ArrowUpRight className={styles.tileArrow} /> : null}
      </div>
      {item.body && <div className={styles.tileBody}>{item.body}</div>}
      {item.tags && item.tags.length > 0 && (
        <ul className={styles.tags}>
          {item.tags.map((t) => (
            <li key={t}>
              <Tag tone={dark ? "ring" : "grey"} size="sm">
                {t}
              </Tag>
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}
