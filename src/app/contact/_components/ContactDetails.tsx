import { contactPage as c } from "@/content/company-pages";
import { site } from "@/content/site";
import Section from "@/components/ui/Section";
import SectionIntro from "@/components/ui/SectionIntro";
import Reveal from "@/components/motion/Reveal";
import styles from "./Contact.module.css";

// Stylised, static map of Flanders (no external embed, 05 §7.4). Shapes are approximate.
const CITIES = [
  { name: "Brugge", x: 96, y: 70 },
  { name: "Kortrijk", x: 118, y: 150 },
  { name: "Gent", x: 196, y: 102 },
  { name: "Antwerpen", x: 300, y: 58 },
  { name: "Mechelen", x: 316, y: 108 },
  { name: "Leuven", x: 368, y: 146 },
  { name: "Hasselt", x: 478, y: 112 },
];

function FlandersMap() {
  return (
    <svg viewBox="0 0 600 220" className={styles.map} role="img" aria-label="Vereenvoudigde kaart van Vlaanderen met onder meer Brugge, Kortrijk, Gent, Antwerpen, Mechelen, Leuven en Hasselt: ons werkgebied.">
      <path
        className={styles.mapShape}
        d="M22 66 72 42l58 12 56-20 64 14 52-24 70 16 62-10 66 18 46 30-10 50-48 22-50-8-38 28-52-8-48 14-50-16-50 10-52-20-50 16-48-14-38-32Z"
      />
      {CITIES.map((c, i) => (
        <g key={c.name} className={styles.city} style={{ animationDelay: `${i * 0.12}s` }}>
          <circle cx={c.x} cy={c.y} r={5} />
          <circle cx={c.x} cy={c.y} r={14} className={styles.pulse} />
          <text x={c.x + 10} y={c.y - 10}>
            {c.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** Details band (F · D): werkgebied map, response promise, opening hours, NAP card. */
export default function ContactDetails() {
  return (
    <Section bg="D" id="gegevens" labelledBy="gegevens-title">
      <SectionIntro eyebrow={c.details.eyebrow} title={c.details.title} titleId="gegevens-title" tone="dark" lead={<p>{c.details.lead}</p>} />
      <Reveal mode="group" stagger={140} className={styles.bento}>
        <article className={`${styles.tile} ${styles.tileMap}`} data-reveal-item>
          <h3 className={styles.tileTitle}>{c.details.areaTitle}</h3>
          <FlandersMap />
          <p className={styles.tileBody}>{c.details.areaBody}</p>
        </article>
        <article className={`${styles.tile} ${styles.tileLime}`} data-reveal-item>
          <p className={styles.tileKicker}>Onze belofte</p>
          <h3 className={styles.tileBig}>{c.details.responseTitle}</h3>
          <p className={styles.tileBody}>Een ingenieur belt je terug – geen callcenter, geen verkoper.</p>
        </article>
        <article className={styles.tile} data-reveal-item>
          <h3 className={styles.tileTitle}>Openingsuren</h3>
          <dl className={styles.hours}>
            {site.openingHours.map((o) => (
              <div key={o.days}>
                <dt>{o.days}</dt>
                <dd>{o.hours}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className={styles.tile} data-reveal-item>
          <h3 className={styles.tileTitle}>{site.legalName}</h3>
          <address className={styles.nap}>
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
            <br />
            <a href={site.phoneHref}>{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            Btw {site.vat}
          </address>
          <p className={styles.tilePh}>Voorbeeldgegevens</p>
        </article>
      </Reveal>
    </Section>
  );
}
