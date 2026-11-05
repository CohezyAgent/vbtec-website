import type { ImageKey } from "@/content/images";
import { site } from "@/content/site";
import { SERVICES } from "@/content/registry";
import { routes } from "@/lib/routes";
import CountUp from "@/components/motion/CountUp";
import { TextLink } from "@/components/ui/CtaPill";
import SmartImage from "@/components/ui/SmartImage";
import styles from "./RealProjects.module.css";

type Tile = { image: ImageKey; label: string; area: "a" | "b" | "c" | "d" };

const TILES: Tile[] = [
  { image: "vbtec-woning-zonnepanelen-oprit", label: "Zonnepanelen · gezinswoning", area: "a" },
  { image: "vbtec-installateurs-plat-dak", label: "Onze eigen ploeg", area: "b" },
  { image: "vbtec-woning-zonnepanelen-tuin", label: "Panelen op het tuindak", area: "c" },
  { image: "vbtec-hoeve-zonnepanelen", label: "Gerenoveerde hoeve", area: "d" },
];

const STRIP: ImageKey[] = [
  "vbtec-woning-zonnepanelen-dakkapellen",
  "vbtec-installateurs-panelen",
  "vbtec-woning-zonnepanelen-landelijk",
  "vbtec-dakrij-zonnepanelen-luchtfoto",
  "vbtec-woning-zonnepanelen-garage",
  "vbtec-warmtepomp-buitenunit",
  "vbtec-woning-zonnepanelen-veld",
  "vbtec-rijwoning-zonnepanelen-gevel",
];

/**
 * Image-led break between the products strip and the green "Herken je dit?" section:
 * a mosaic of real VB-TEC installations (photos from vbtec.be) with glass trust stats,
 * ending on a drifting photo strip that sits half on paper, half on green.
 */
export default function RealProjects({ id = "realisaties" }: { id?: string }) {
  return (
    <section id={id} className={styles.section} data-header-tone="light" aria-labelledby={`${id}-title`}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>Realisaties van VB-TEC</p>
          <h2 id={`${id}-title`} className={styles.title}>
            Echte daken.
            <span className={styles.muted}> Echte gezinnen.</span>
          </h2>
          <div className={styles.headSide}>
            <p className={styles.lead}>Woningen in heel Vlaanderen waar onze eigen ploegen aan de slag gingen. Geen renders.</p>
            <TextLink href={routes.projecten()}>Bekijk de projecten</TextLink>
          </div>
        </div>

        <div className={styles.mosaic}>
          {TILES.map((t) => (
            <figure key={t.image} className={`${styles.tile} ${styles[`area_${t.area}`]}`}>
              <SmartImage image={t.image} fill parallax sizes="(max-width: 900px) 100vw, 45vw" className={styles.tileImg} />
              <figcaption className={styles.tag}>{t.label}</figcaption>
              {t.area === "a" && (
                <div className={styles.stats}>
                  <p className={styles.stat}>
                    <CountUp to={site.calculationsCount} suffix="+" className={styles.statValue} />
                    <span className={styles.statLabel}>gezinnen doorgerekend</span>
                  </p>
                  <p className={styles.stat}>
                    <CountUp to={site.adviceAgainstPct} suffix="%" className={styles.statValue} />
                    <span className={styles.statLabel}>kreeg ook een eerlijk ‘nee’</span>
                  </p>
                  <p className={styles.stat}>
                    <span className={styles.statValue}>{SERVICES.length}</span>
                    <span className={styles.statLabel}>technieken, één aanspreekpunt</span>
                  </p>
                  <p className={styles.note}>Voorbeeldcijfers</p>
                </div>
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* Drifting strip: duplicated list so the loop is seamless; the copy is hidden from AT. */}
      <div className={styles.strip}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.row} aria-hidden={copy === 1 || undefined}>
              {STRIP.map((img) => (
                <li key={img} className={styles.thumb}>
                  <SmartImage image={img} fill sizes="(max-width: 900px) 60vw, 22vw" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
