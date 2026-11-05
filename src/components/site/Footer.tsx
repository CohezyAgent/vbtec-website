import Link from "next/link";
import { FACTS_DISCLAIMER } from "@/content/facts";
import { footerColumns, site } from "@/content/site";
import { routes } from "@/lib/routes";
import CtaPill from "@/components/ui/CtaPill";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, PlusIcon } from "@/components/ui/icons";
import Reveal from "@/components/motion/Reveal";
import styles from "./Footer.module.css";

/** Site footer (04 §5.3, 01 §3). Static year from site.copyrightYear (no Date in render). */
export default function Footer() {
  return (
    <footer className={styles.footer} data-header-tone="dark">
      <div className={styles.top}>
        <p className={styles.promise}>{site.promise}</p>
        <CtaPill href={routes.lead()} variant="lime">
          Gratis berekening
        </CtaPill>
      </div>

      <div className={styles.columns}>
        {footerColumns.map((col) => (
          <div key={col.title} className={styles.col}>
            <p className={`${styles.colTitle} ${styles.desktopOnly}`}>{col.title}</p>
            <ul className={`${styles.links} ${styles.desktopOnly}`}>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <details className={`${styles.acc} ${styles.mobileOnly}`}>
              <summary className={styles.accSummary}>
                {col.title}
                <span className={styles.plus} aria-hidden="true">
                  <PlusIcon />
                </span>
              </summary>
              <ul className={styles.links}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}

        <div className={`${styles.col} ${styles.contact}`}>
          <p className={styles.colTitle}>Contact</p>
          <ul className={styles.contactList}>
            <li>
              <MapPinIcon className={styles.contactIcon} />
              <span>
                {site.address.street}, {site.address.postalCode} {site.address.city}
              </span>
            </li>
            <li>
              <PhoneIcon className={styles.contactIcon} />
              <a href={site.phoneHref} className={styles.link}>
                {site.phone}
              </a>
            </li>
            <li>
              <MailIcon className={styles.contactIcon} />
              <a href={`mailto:${site.email}`} className={styles.link}>
                {site.email}
              </a>
            </li>
            <li>
              <ClockIcon className={styles.contactIcon} />
              <span>
                {site.openingHours.map((o) => (
                  <span key={o.days} className={styles.hours}>
                    {o.days}: {o.hours}
                  </span>
                ))}
              </span>
            </li>
          </ul>
          <p className={styles.small}>
            {site.areaLabel}
            <br />
            BTW {site.vat}
          </p>
        </div>
      </div>

      <ul className={styles.trust} aria-label="Kwaliteit">
        {site.trustLabels.map((t) => (
          <li key={t} className={styles.trustTag}>
            {t}
          </li>
        ))}
        {site.isPlaceholder && <li className={styles.placeholder}>Voorbeeldgegevens – worden vervangen door de echte bedrijfsgegevens</li>}
      </ul>

      <div className={styles.bottom}>
        <p>
          © {site.copyrightYear} {site.name}
        </p>
        <Link href={routes.privacy()} className={styles.link}>
          Privacy
        </Link>
        {/* Plain <a> (not Link), so the GitHub Pages base path is added by hand. */}
        <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${routes.sitemapXml()}`} className={styles.link}>
          Sitemap
        </a>
        <p className={styles.disclaimer}>{FACTS_DISCLAIMER}</p>
      </div>

      <Reveal mode="custom" threshold={0.2} className={styles.wordmarkWrap} aria-hidden="true">
        <span className={styles.wordmark}>VBTEC</span>
      </Reveal>
    </footer>
  );
}
