import Image from "next/image";
import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { getImage } from "@/content/images";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";
import { EyeIcon, SolarPanelIcon } from "./icons";
import styles from "./Mission.module.css";

// Copy direction: docs/spec/05-pages.md §1 row 4. Builder 1 may move it to content/home.ts.
const tags = ["Merkonafhankelijk", "Altijd een scenario 'niets doen'", "Geen voorschot vóór akkoord"];

// Two-tone statement (dark, then muted) – Elexys-style.
const STATEMENT =
  "We verkopen geen toestel. We rekenen uit wat jouw woning nodig heeft – en zeggen het als iets niet loont.";
const DARK_WORDS = 4; // "We verkopen geen toestel."

/** Decorative mini bar chart on the brand card (heights in %). */
const BARS = [34, 48, 42, 60, 55, 72, 66, 84, 78, 96];

const v = (vars: Record<string, number>) => vars as CSSProperties;

export default function MissionSection() {
  const photo = getImage("ingenieur-aan-tafel");
  return (
    <Reveal as="section" mode="custom" threshold={0.2} className={styles.section} aria-labelledby="mission-heading" data-header-tone="light">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Onze aanpak</p>
        <div className={styles.introMain}>
          <h2 id="mission-heading" className={styles.statement}>
            {STATEMENT.split(" ").map((word, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className={`${styles.word} ${i >= DARK_WORDS ? styles.wordMuted : ""}`} style={v({ "--w": i })}>
                  {word}
                </span>
              </Fragment>
            ))}
          </h2>
          <Link href={routes.overOns()} className={styles.more}>
            Waarom ingenieurs rekenen in plaats van verkopers
          </Link>
        </div>
      </div>

      <div className={styles.cards}>
        <article className={`${styles.card} ${styles.statCard}`} style={v({ "--c": 0 })}>
          <div className={styles.cardTop}>
            <p className={styles.statLabel}>Ons eerlijkheidscijfer</p>
            <span className={`${styles.iconCircle} ${styles.iconLight}`}>
              <SolarPanelIcon className={styles.icon} />
            </span>
          </div>
          <div className={styles.statBottom}>
            <span className={styles.goalPill}>Eerlijk advies</span>
            <p className={styles.statNumber}>
              <CountUp to={site.adviceAgainstPct} suffix="%" delay={900} />
            </p>
            <p className={styles.statCaption}>van de berekeningen raadden we minstens één product af</p>
            {site.isPlaceholder && <p className={styles.placeholder}>Voorbeeldcijfer – wordt vervangen door het echte cijfer</p>}
          </div>
        </article>

        <article className={`${styles.card} ${styles.visionCard}`} style={v({ "--c": 1 })}>
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 100vw, 30vw" quality={90} className={styles.visionImage} />
          <span className={`${styles.iconCircle} ${styles.iconGlass}`}>
            <EyeIcon className={styles.icon} />
          </span>
          <div className={styles.visionText}>
            <h3 className={styles.visionTitle}>Ingenieurs, geen verkopers</h3>
            <p className={styles.visionBody}>
              Een ingenieur rekent jouw woning door: dak, verbruik, isolatie en tarieven. Pas daarna praten we over toestellen.
            </p>
          </div>
        </article>

        <article className={`${styles.card} ${styles.valuesCard}`} style={v({ "--c": 2 })}>
          <p className={styles.valuesText}>
            Klant eerst.{" "}
            <span className={styles.valuesMuted}>Ook als we dan minder verkopen.</span>
          </p>
          <div className={styles.bars} aria-hidden="true">
            {BARS.map((h, i) => (
              <span key={i} className={styles.bar} style={v({ "--h": h, "--b": i })} />
            ))}
          </div>
          <ul className={styles.tags}>
            {tags.map((tag, i) => (
              <li key={tag} className={styles.tag} style={v({ "--t": i })}>
                {tag}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Reveal>
  );
}
