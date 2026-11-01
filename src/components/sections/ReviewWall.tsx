import type { Review } from "@/content/types";
import type { ServiceSlug } from "@/content/registry";
import { isPlaceholder as reviewsArePlaceholder, PLACEHOLDER_LABEL, reviewSummary } from "@/content/reviews";
import Section from "@/components/ui/Section";
import SectionIntro, { type IntroProps } from "@/components/ui/SectionIntro";
import { PlaceholderBadge } from "@/components/ui/Bits";
import { ReviewCard } from "@/components/ui/cards";
import Reveal from "@/components/motion/Reveal";
import styles from "./ReviewWall.module.css";

export type ReviewWallProps = {
  intro: IntroProps;
  reviews: Review[];
  /** marquee = 2 rows moving in opposite directions · static = masonry + "Meer reviews". */
  variant: "marquee" | "static";
  bg: "W" | "D";
  /** Only shown when reviews are real (00 §2.9). */
  summary?: { score: string; count: string; source: string };
  /** Put reviews mentioning this product first. */
  filterProduct?: ServiceSlug;
  /** Static: how many are visible before "Meer reviews" (default 6; 3 on mobile). */
  initial?: number;
  id?: string;
};

type CardTone = "grey" | "dark" | "lime" | "white";

/**
 * Geometry J – review wall. While reviews are placeholders: label "Voorbeeldreviews", no score,
 * no platform name, never Review schema. Reduced motion → the marquee becomes static.
 */
export default function ReviewWall({ intro, reviews, variant, bg, summary, filterProduct, initial = 6, id }: ReviewWallProps) {
  const tone = bg === "D" ? "dark" : "light";
  const titleId = id ? `${id}-title` : "reviews-title";
  const sorted = filterProduct
    ? [...reviews.filter((r) => r.products.includes(filterProduct)), ...reviews.filter((r) => !r.products.includes(filterProduct))]
    : reviews;
  const showSummary = !reviewsArePlaceholder && (summary ?? reviewSummary);
  const sum = showSummary ? (summary ?? reviewSummary)! : null;
  const cardTone = (i: number): CardTone => (i % 4 === 3 ? (bg === "D" ? "white" : "dark") : bg === "D" ? "dark" : "grey");

  const badge = reviewsArePlaceholder ? <PlaceholderBadge label={PLACEHOLDER_LABEL} tone={tone} /> : null;

  return (
    <Section bg={bg} id={id} labelledBy={titleId} contained={variant === "static"} className={styles.section}>
      <div className={variant === "marquee" ? styles.introPad : undefined}>
        <SectionIntro {...intro} tone={tone} titleId={titleId} aside={badge} />
      </div>

      {variant === "marquee" ? (
        <div className={styles.marquee}>
          {[0, 1].map((row) => {
            const items = sorted.filter((_, i) => i % 2 === row);
            return (
              <div key={row} className={`${styles.row} ${row === 1 ? styles.reverse : ""}`}>
                <ul className={styles.rowTrack}>
                  {sum && row === 0 && (
                    <li className={styles.cell}>
                      <SummaryCard {...sum} />
                    </li>
                  )}
                  {items.map((r, i) => (
                    <li key={r.id} className={styles.cell}>
                      <ReviewCard review={r} tone={cardTone(i + row)} />
                    </li>
                  ))}
                </ul>
                <ul className={`${styles.rowTrack} ${styles.clone}`} aria-hidden="true">
                  {items.map((r, i) => (
                    <li key={r.id} className={styles.cell} inert>
                      <ReviewCard review={r} tone={cardTone(i + row)} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <Reveal as="ul" mode="group" stagger={120} className={styles.masonry}>
            {sum && (
              <li className={styles.masonryItem} data-reveal-item>
                <SummaryCard {...sum} />
              </li>
            )}
            {sorted.slice(0, initial).map((r, i) => (
              <li key={r.id} className={`${styles.masonryItem} ${i >= 3 ? styles.mobileHidden : ""}`} data-reveal-item>
                <ReviewCard review={r} tone={cardTone(i)} />
              </li>
            ))}
          </Reveal>
          {sorted.length > 3 && (
            <details className={`${styles.more} ${sorted.length <= initial ? styles.moreMobileOnly : ""}`}>
              <summary className={`${styles.moreButton} ${bg === "D" ? styles.moreDark : ""}`}>Meer reviews</summary>
              <ul className={styles.masonry}>
                {sorted.slice(3).map((r, i) => (
                  <li key={r.id} className={`${styles.masonryItem} ${i + 3 < initial ? styles.desktopHidden : ""}`}>
                    <ReviewCard review={r} tone={cardTone(i + 3)} />
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </Section>
  );
}

function SummaryCard({ score, count, source }: { score: string; count: string; source: string }) {
  return (
    <div className={styles.summary}>
      <p className={styles.summaryScore}>{score}</p>
      <p className={styles.summaryText}>
        op basis van {count} reviews · {source}
      </p>
    </div>
  );
}
