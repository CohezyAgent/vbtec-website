import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Lexend } from "next/font/google";
import StepsReveal from "./StepsReveal";
import {
  ArrowUpRight,
  BoltIcon,
  ChartUpIcon,
  GearCycleIcon,
  TurbineIcon,
} from "./icons";
import styles from "./Services.module.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-lexend",
});

const steps = [
  {
    title: "Energy Assessment",
    body: "We review your energy usage, site condition, available space, and future energy goals.",
    image: "/images/step-assessment.jpg",
    alt: "An engineer in a hard hat measuring a site near the sea with a wind turbine behind",
    Icon: BoltIcon,
  },
  {
    title: "Custom System Design",
    body: "We design the right mix of solar, wind, battery storage and EV charging for your site.",
    image: "/images/step-design.jpg",
    alt: "Two engineers in hard hats discussing a small solar panel",
    Icon: GearCycleIcon,
  },
  {
    title: "Expert Installation",
    body: "Our certified team installs your system safely and connects it properly to the grid.",
    image: "/images/step-installation.jpg",
    alt: "An installer in a safety harness fitting solar panels on a roof",
    Icon: TurbineIcon,
  },
  {
    title: "Monitor & Save",
    body: "We monitor performance, maintain your system, and help you track clean energy savings.",
    image: "/images/step-install.jpg",
    alt: "A technician checking an inverter under a solar panel array",
    Icon: ChartUpIcon,
  },
];

export default function ServicesSection() {
  return (
    <section
      className={`${styles.section} ${lexend.variable}`}
      aria-labelledby="services-heading"
    >
      <div className={styles.stage}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>How We Work</p>
          <h2 id="services-heading" className={styles.heading}>
            From strategy to implementation, we help businesses create
            meaningful environmental and economic impact.
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
                  <p className={styles.cardBody}>{body}</p>
                </div>
              </article>
              <span className={styles.stepBar} aria-hidden="true">
                <span className={styles.stepFill} />
              </span>
            </li>
          ))}
        </StepsReveal>

        <div className={styles.ctaWrap}>
          <Link href="#contact" className={styles.cta}>
            <span>Start Your Energy Assessment</span>
            <span className={styles.ctaCircle}>
              <ArrowUpRight className={styles.ctaArrow} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
