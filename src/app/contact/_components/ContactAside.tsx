import { contactPage as c } from "@/content/company-pages";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { ReviewCard } from "@/components/ui/cards";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import styles from "./Contact.module.css";

/** Left column of the contact hero: what happens next, contact rows, one review (05 §7.4). */
export default function ContactAside() {
  const review = reviews.find((r) => r.id === "r02") ?? reviews[0];
  return (
    <div className={styles.aside}>
      <div>
        <h2 className={styles.asideTitle}>Wat er daarna gebeurt</h2>
        <ol className={styles.steps}>
          {c.nextSteps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <span>
                <strong className={styles.stepTitle}>{s.title}</strong>
                <span className={styles.stepBody}>{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <ul className={styles.rows} aria-label="Contactgegevens">
        <li>
          <a href={site.phoneHref} className={styles.row}>
            <PhoneIcon className={styles.rowIcon} />
            <span>
              <span className={styles.rowLabel}>Liever bellen?</span>
              {site.phone}
            </span>
          </a>
        </li>
        <li>
          <a href={`mailto:${site.email}`} className={styles.row}>
            <MailIcon className={styles.rowIcon} />
            <span>
              <span className={styles.rowLabel}>Mail ons</span>
              {site.email}
            </span>
          </a>
        </li>
        <li>
          <span className={styles.row}>
            <MapPinIcon className={styles.rowIcon} />
            <span>
              <span className={styles.rowLabel}>Werkgebied</span>
              {site.areaLabel}
            </span>
          </span>
        </li>
        <li>
          <span className={styles.row}>
            <ClockIcon className={styles.rowIcon} />
            <span>
              <span className={styles.rowLabel}>Bereikbaar</span>
              {site.openingHours.map((o) => `${o.days}: ${o.hours}`).join(" · ")}
            </span>
          </span>
        </li>
      </ul>

      <ReviewCard review={review} tone="grey" />
      <p className={styles.placeholder}>Voorbeeldgegevens en voorbeeldreview – worden vervangen door de echte contactgegevens.</p>
    </div>
  );
}
