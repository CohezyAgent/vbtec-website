import Link from "next/link";
import { getImage } from "@/content/images";
import { TRUSTLINE } from "@/content/site";
import { routes } from "@/lib/routes";
import SmartImage from "@/components/ui/SmartImage";
import HighlightsSlider from "./HighlightsSlider";
import { ArrowUpRight, SolarLogo } from "./icons";
import styles from "./Hero.module.css";

// Copy direction: docs/spec/05-pages.md §1 row 1. Builder 1 may move it to content/home.ts.
// The shared site header (src/components/site) sits on top of this frame.
// Phones (<900px) get only badge, heading and the primary CTA (`desktop-only` hides the rest).
export default function Hero() {
  const bg = getImage("hero-gezin-woning");
  return (
    <section className={styles.frame} data-header-tone="dark" aria-labelledby="home-title">
      <div className={styles.hero}>
        <SmartImage image={bg} fill preload sizes="100vw" quality={90} className={styles.bgWrap} imgClassName={styles.bg} />
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.badge}>
              <SolarLogo className={styles.badgeIcon} />
              Energie-ingenieurs in Vlaanderen
            </p>
            <h1 id="home-title" className={styles.title}>
              Jouw energiefactuur,
              <br />
              zo dicht mogelijk bij €0
              <a href="#voetnoot-nul" className={`${styles.asterisk} desktop-only`} aria-label="Lees de voorwaarden bij €0">
                *
              </a>
            </h1>
            <p className={`${styles.lead} desktop-only`}>
              Onze ingenieurs rekenen uit welke combinatie van zon, warmtepomp en batterij jouw gezin het meest oplevert. En we zeggen het eerlijk als
              iets niet loont.
            </p>
            <div className={styles.actions}>
              <a href={routes.lead()} className={styles.startGroup}>
                <span className={styles.startPill}>Bereken wat jouw woning kan besparen</span>
                <span className={styles.startArrow} aria-hidden="true">
                  <ArrowUpRight className={styles.arrowIcon} />
                </span>
              </a>
              <Link href={routes.hoeHetWerkt()} className={`${styles.ghost} desktop-only`}>
                Bekijk hoe het werkt
              </Link>
            </div>
            <ul className={`${styles.trust} desktop-only`}>
              {TRUSTLINE.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p id="voetnoot-nul" className={`${styles.footnote} desktop-only`}>
              * Indicatief: tot ~€0 netto per jaar, afhankelijk van je verbruik, dak, woning en contract. Je persoonlijke berekening is bindend.
            </p>
          </div>

          <div className="desktop-only" style={{ display: "contents" }}>
            <HighlightsSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
