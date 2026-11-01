import Link from "next/link";
import type { ReactNode } from "react";
import type { Cta, ImageInput, LinkItem } from "@/content/types";
import CtaPill from "@/components/ui/CtaPill";
import { PlaceholderBadge } from "@/components/ui/Bits";
import { ArrowUpRight, QuoteIcon } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import styles from "./ImagePanel.module.css";

export type ImagePanelProps = {
  image: ImageInput;
  /** Panel anchored bottom-left or bottom-right (alternate per use). */
  align: "left" | "right";
  eyebrow?: string;
  title: string;
  titleAs?: "h2" | "h3";
  body?: ReactNode;
  cta?: Cta;
  secondary?: LinkItem;
  /** Quote variant: big quote, name + place. */
  quote?: { text: string; name: string; place: string; meta?: string };
  placeholderBadge?: string;
  id?: string;
};

/**
 * Geometry C – framed full-bleed photo with one glass panel. Frame wipes open, the photo
 * settles and drifts slowly (parallax), the panel rises. Mobile: panel becomes a solid
 * deep-green block below the photo.
 */
export default function ImagePanel({ image, align, eyebrow, title, titleAs = "h2", body, cta, secondary, quote, placeholderBadge, id }: ImagePanelProps) {
  const H = titleAs;
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={styles.frame} data-header-tone="dark" aria-labelledby={titleId}>
      <Reveal mode="custom" threshold={0.15} className={styles.stage}>
        <div className={styles.media}>
          <SmartImage image={image} fill sizes="100vw" quality={90} parallax className={styles.image} />
        </div>
        {placeholderBadge && <PlaceholderBadge label={placeholderBadge} tone="dark" className={styles.badge} />}
        <div className={`${styles.panel} ${align === "left" ? styles.left : styles.right} ${quote ? styles.quotePanel : ""}`}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <H id={titleId} className={quote ? styles.quoteHeading : styles.title}>
            {title}
          </H>
          {quote ? (
            <figure className={styles.quote}>
              <QuoteIcon className={styles.quoteMark} />
              <blockquote className={styles.quoteText}>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className={styles.quoteBy}>
                <span className={styles.quoteName}>{quote.name}</span>
                <span>
                  {quote.place}
                  {quote.meta ? ` · ${quote.meta}` : ""}
                </span>
              </figcaption>
            </figure>
          ) : (
            body && <div className={styles.body}>{body}</div>
          )}
          {quote && body && <div className={styles.body}>{body}</div>}
          {(cta || secondary) && (
            <div className={styles.actions}>
              {cta && (
                <CtaPill href={cta.href} variant={cta.variant ?? "lime"} block>
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
      </Reveal>
    </section>
  );
}
