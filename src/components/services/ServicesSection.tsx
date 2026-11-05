import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { routes } from "@/lib/routes";
import StepsReveal from "./StepsReveal";
import {
  ArrowUpRight,
  BoltIcon,
  ChartUpIcon,
  GearCycleIcon,
  TurbineIcon,
} from "./icons";
import styles from "./Services.module.css";

// Copy direction: docs/spec/05-pages.md §1 row 5. Builder 1 may move it to content/home.ts.
const steps = [
  {
    title: "Gratis berekening",
    body: "Je vertelt ons hoe je woont en wat je verbruikt. Een ingenieur rekent jouw scenario's uit – ook 'niets doen'.",
    image: "/images/step-assessment.jpg",
    alt: "Een ingenieur met helm meet een terrein op",
    Icon: BoltIcon,
  },
  {
    title: "Plaatsbezoek & meting",
    body: "We komen kijken naar je dak, je meterkast, je radiatoren en je isolatie. Zo kloppen de cijfers voor jouw woning.",
    image: "/images/step-design.jpg",
    alt: "Twee mensen met een helm bespreken een zonnepaneel",
    Icon: GearCycleIcon,
  },
  {
    title: "Voorstel met scenario's",
    body: "Je krijgt de combinaties naast elkaar, met kosten, premies en terugverdientijd. Jij beslist, zonder druk.",
    image: "/images/step-installation.jpg",
    alt: "Een installateur met valbeveiliging plaatst zonnepanelen op een dak",
    Icon: TurbineIcon,
  },
  {
    title: "Installatie & opvolging",
    body: "Onze eigen ploeg installeert en stelt alles slim af. Daarna volgen we je opbrengst mee op. Start hieronder ↓",
    image: "/images/step-install.jpg",
    alt: "Een technieker controleert een omvormer onder zonnepanelen",
    Icon: ChartUpIcon,
  },
];

export default function ServicesSection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="services-heading"
      data-header-tone="dark"
    >
      <div className={styles.stage}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Zo werken we</p>
          <h2 id="services-heading" className={styles.heading}>
            Van je jaarafrekening naar een installatie die écht opbrengt – in vier stappen.
          </h2>
        </div>

        <StepsReveal className={styles.steps}>
          {steps.map(({ title, body, image, alt, Icon }, i) => (
            <li
              key={title}
              className={styles.step}
              style={{ "--i": i } as CSSProperties}
            >
              <article className={styles.card}>
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(max-width: 900px) 90vw, 22vw"
                  quality={90}
                  className={styles.cardImage}
                />
                <div className={styles.panel}>
                  <span className={styles.iconCircle}>
                    <Icon className={styles.icon} />
                  </span>
                  <h3 className={styles.cardTitle}>
                    {i + 1}. {title}
                  </h3>
                  <p className={`${styles.cardBody} mobile-clamp-2`}>{body}</p>
                </div>
              </article>
              <span className={styles.stepBar} aria-hidden="true">
                <span className={styles.stepFill} />
              </span>
            </li>
          ))}
        </StepsReveal>

        <div className={styles.ctaWrap}>
          <a href={routes.lead()} className={styles.cta}>
            <span>Start met stap 1</span>
            <span className={styles.ctaCircle} aria-hidden="true">
              <ArrowUpRight className={styles.ctaArrow} />
            </span>
          </a>
          <Link href={routes.hoeWeWerken()} className={styles.textLink}>
            Lees hoe we werken
          </Link>
        </div>
      </div>
    </section>
  );
}
