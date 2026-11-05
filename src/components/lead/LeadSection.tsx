import type { ImageInput, Review } from "@/content/types";
import { FACTS_DISCLAIMER } from "@/content/facts";
import { reviews as allReviews, isPlaceholder as reviewsPlaceholder } from "@/content/reviews";
import { site } from "@/content/site";
import { LEAD_ANCHOR } from "@/lib/routes";
import { CheckList } from "@/components/ui/Bits";
import { PhoneIcon, QuoteIcon } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import LeadForm from "./LeadForm";
import styles from "./Lead.module.css";

export const DEFAULT_HEADING = "Wat kan jouw woning besparen? We rekenen het voor je uit.";

export const LEAD_PROMISES = [
  "Berekend door een ingenieur, niet door een verkoper",
  "Eerlijk advies – ook als het niet loont",
  "Wij zoeken je premies uit",
  "Je zit nergens aan vast",
];

export type LeadSectionProps = {
  /** Route the lead comes from, e.g. "/diensten/thuisbatterij" (required). */
  bron: string;
  /** Preselected interests: service slugs and/or "advies". */
  defaultInteresse?: string[];
  heading?: string;
  subheading?: string;
  /** full = framed image + promise + form (end of every page) · contact = form card only (contact hero). */
  variant?: "full" | "contact";
  image?: ImageInput;
  /** Review quoted under the promise (default: first placeholder review). */
  review?: Review;
};

/**
 * The lead section at the end of every page (id "berekening"). Framed photo with a strong
 * deep-green overlay, promise left, white form card right (00 §2.4, 03 §6).
 */
export default function LeadSection({
  bron,
  defaultInteresse,
  heading,
  subheading = "Vertel ons kort hoe je woont. Een ingenieur maakt een berekening op maat – met alle scenario's, ook 'niets doen'. Gratis en vrijblijvend.",
  variant = "full",
  image = "woonkamer-warm-winter",
  review,
}: LeadSectionProps) {
  const quote = review ?? allReviews[0];
  const title = heading ?? (variant === "contact" ? "Vraag je gratis berekening aan." : DEFAULT_HEADING);

  if (variant === "contact") {
    return (
      <div id={LEAD_ANCHOR} className={styles.contactWrap}>
        <div className={`${styles.card} ${styles.cardFlat}`}>
          <h2 id={`${LEAD_ANCHOR}-title`} tabIndex={-1} className={styles.cardTitle}>
            {title}
          </h2>
          <p className={styles.cardIntro}>Ongeveer een minuut · 8 korte vragen</p>
          <LeadForm bron={bron} defaultInteresse={defaultInteresse} variant="contact" />
        </div>
      </div>
    );
  }

  return (
    <section id={LEAD_ANCHOR} className={styles.frame} data-header-tone="dark" aria-labelledby={`${LEAD_ANCHOR}-title`}>
      <div className={styles.stage}>
        <div className={styles.media} aria-hidden="true">
          <SmartImage image={image} fill sizes="100vw" quality={75} />
        </div>
        <div className={styles.promise}>
          <p className={styles.eyebrow}>Gratis berekening</p>
          <h2 id={`${LEAD_ANCHOR}-title`} tabIndex={-1} className={styles.heading}>
            {title}
          </h2>
          <p className={styles.sub}>{subheading}</p>
          <CheckList items={LEAD_PROMISES} tone="dark" className={styles.checks} />
          <p className={styles.phone}>
            <PhoneIcon className={styles.phoneIcon} />
            Liever bellen? <a href={site.phoneHref}>{site.phone}</a>
          </p>
          {quote && (
            <figure className={styles.quote}>
              <QuoteIcon className={styles.quoteMark} />
              <blockquote>
                <p>{quote.text}</p>
              </blockquote>
              <figcaption>
                {quote.name}, {quote.place}
                {reviewsPlaceholder && <span className={styles.quoteBadge}> · voorbeeldreview</span>}
              </figcaption>
            </figure>
          )}
          <p className={styles.disclaimer}>{FACTS_DISCLAIMER}</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardIntro}>Ongeveer een minuut · 8 korte vragen</p>
          <LeadForm bron={bron} defaultInteresse={defaultInteresse} variant="full" />
        </div>
      </div>
    </section>
  );
}
