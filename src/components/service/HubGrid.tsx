import Link from "next/link";
import type { CSSProperties } from "react";
import type { ImageKey } from "@/content/images";
import type { ServiceSlug } from "@/content/registry";
import { routes } from "@/lib/routes";
import SmartImage from "@/components/ui/SmartImage";
import { ArrowUpRight } from "@/components/ui/icons";
import Reveal from "@/components/motion/Reveal";
import styles from "./HubGrid.module.css";

export type HubItem = { slug: ServiceSlug; name: string; tagline: string; line: string; image: ImageKey };
export type HubGroup = { key: string; title: string; intro: string; items: HubItem[] };

/**
 * /diensten groups (05 §5.1): editorial rows instead of a card grid – sticky group title
 * on the left, large service rows on the right that open up on hover.
 */
export default function HubGrid({ groups }: { groups: HubGroup[] }) {
  return (
    <div className={styles.hub}>
      {groups.map((g, gi) => (
        <section key={g.key} className={styles.group} aria-labelledby={`groep-${g.key}`}>
          <div className={styles.head}>
            <p className={styles.index} aria-hidden="true">
              {String(gi + 1).padStart(2, "0")}
            </p>
            <h2 id={`groep-${g.key}`} className={styles.groupTitle}>
              {g.title}
            </h2>
            <p className={`${styles.groupIntro} desktop-only`}>{g.intro}</p>
          </div>
          <Reveal as="ul" mode="group" stagger={120} className={styles.items}>
            {g.items.map((s, i) => (
              <li key={s.slug} data-reveal-item style={{ "--i": i } as CSSProperties}>
                <Link href={routes.service(s.slug)} className={styles.row}>
                  <span className={styles.thumb}>
                    <SmartImage image={s.image} fill sizes="(max-width: 900px) 30vw, 14vw" className={`${styles.img} ${s.image.startsWith("product-") ? styles.contain : ""}`} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.name}>{s.name}</span>
                    <span className={styles.tagline}>{s.tagline}</span>
                    <span className={`${styles.line} desktop-only`}>{s.line}</span>
                  </span>
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowUpRight className={styles.arrowIcon} />
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </section>
      ))}
    </div>
  );
}
