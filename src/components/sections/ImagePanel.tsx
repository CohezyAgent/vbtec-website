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
  /** Quote variant: small before → after chip (e.g. monthly bill). */
  result?: { before: string; after: string; unit: string };
  placeholderBadge?: string;
  id?: string;
};

/**
 * Geometry C – framed full-bleed photo with one glass panel. Frame wipes open, the photo
 * settles and drifts slowly (parallax), the panel rises. Mobile: panel becomes a solid
 * deep-green block below the photo.
 * Quote variant: a compact white card (quote, name, before → after chip, CTA) so the photo
 * carries the story; `body` is not shown there.
 */
export default function ImagePanel({ image, align, eyebrow, title, titleAs = "h2", body, cta, secondary, quote, result, placeholderBadge, id }: ImagePanelProps) {
  const H = titleAs;
  const titleId = id ? `${id}-title` : undefined;
  if (quote) {
    return (
      <section id={id} className={styles.frame} data-header-tone="dark" aria-labelledby={titleId}>
        <Reveal mode="custom" threshold={0.15} className={`${styles.stage} ${styles.stageQuote}`}>
          <div className={styles.media}>
            <SmartImage image={image} fill sizes="100vw" quality={90} parallax className={styles.image} />
          </div>
          {placeholderBadge && <PlaceholderBadge label={placeholderBadge} tone="dark" className={styles.badge} />}
          <div className={`${styles.panel} ${styles.card} ${align === "left" ? styles.left : styles.right}`}>
            <div className={styles.cardHead}>
              {eyebrow && <p className={styles.cardEyebrow}>{eyebrow}</p>}
              <H id={titleId} className={styles.cardTitle}>
                {title}
              </H>
            </div>
            <figure className={styles.quote}>
              <QuoteIcon className={styles.cardMark} />
              <blockquote className={styles.cardQuote}>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption className={styles.cardBy}>
                <span className={styles.avatar} aria-hidden="true">
                  {quote.name.charAt(0)}
                </span>
                <span>
                  <span className={styles.cardName}>{quote.name}</span>
                  <span className={styles.cardPlace}>{result ? quote.place : [quote.place, quote.meta].filter(Boolean).join(" · ")}</span>
                </span>
              </figcaption>
            </figure>
            {result && (
              <p className={styles.result}>
                <span className={styles.resultBefore}>{result.before}</span>
                <span className={styles.resultArrow} aria-hidden="true">
                  →
                </span>
                <span className={styles.resultAfter}>{result.after}</span>
                <span className={styles.resultUnit}>{result.unit} · indicatief</span>
              </p>
            )}
            {(cta || secondary) && (
              <div className={styles.cardActions}>
                {cta && (
                  <CtaPill href={cta.href} variant={cta.variant === "lime" || !cta.variant ? "ink" : cta.variant} size="sm">
                    {cta.label}
                  </CtaPill>
                )}
                {secondary && (
                  <Link href={secondary.href} className={styles.cardLink}>
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
  return (
    <section id={id} className={styles.frame} data-header-tone="dark" aria-labelledby={titleId}>
      <Reveal mode="custom" threshold={0.15} className={styles.stage}>
        <div className={styles.media}>
          <SmartImage image={image} fill sizes="100vw" quality={90} parallax className={styles.image} />
        </div>
        {placeholderBadge && <PlaceholderBadge label={placeholderBadge} tone="dark" className={styles.badge} />}
        <div className={`${styles.panel} ${align === "left" ? styles.left : styles.right}`}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <H id={titleId} className={styles.title}>
            {title}
          </H>
          {body && <div className={styles.body}>{body}</div>}
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
