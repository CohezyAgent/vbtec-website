import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import CountUp from "./CountUp";
import { EyeIcon, SolarPanelIcon } from "./icons";
import styles from "./Mission.module.css";

const tags = ["#innovation", "#ontime", "#skilledteam", "#qualityfirst"];

const STATEMENT =
  "We are a forward-thinking solar energy company dedicated to delivering reliable affordable, and sustainable power solutions.";

const v = (vars: Record<string, number>) => vars as CSSProperties;

export default function MissionSection() {
  return (
    <section className={styles.section} aria-labelledby="mission-heading">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Our Mission</p>
        <h2 id="mission-heading" className={styles.statement}>
          {STATEMENT.split(" ").map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className={styles.word} style={v({ "--w": i })}>
                {word}
              </span>
            </Fragment>
          ))}
        </h2>
      </div>

      <div className={styles.cards}>
        <article className={`${styles.card} ${styles.statCard}`} style={v({ "--c": 0 })}>
          <div className={styles.cardTop}>
            <p className={styles.statLabel}>Solar Panel Usage</p>
            <span className={`${styles.iconCircle} ${styles.iconDark}`}>
              <SolarPanelIcon className={styles.icon} />
            </span>
          </div>
          <div className={styles.statBottom}>
            <span className={styles.goalPill}>Annual Goal</span>
            <p className={styles.statNumber}>
              <CountUp to={200} suffix="+" />
            </p>
            <p className={styles.statCaption}>Homes powered worldwide</p>
          </div>
        </article>

        <article className={`${styles.card} ${styles.visionCard}`} style={v({ "--c": 1 })}>
          <Image
            src="/images/vision-team.jpg"
            alt="An engineer and a site manager in hard hats inspecting solar panels"
            fill
            sizes="(max-width: 900px) 100vw, 30vw"
            quality={90}
            className={styles.visionImage}
          />
          <span className={`${styles.iconCircle} ${styles.iconGlass}`}>
            <EyeIcon className={styles.icon} />
          </span>
          <div className={styles.visionText}>
            <h3 className={styles.visionTitle}>Our Vision</h3>
            <p className={styles.visionBody}>
              Deliver high-quality products and{" "}
              <br />
              services that exceed customer{" "}
              <br />
              expectations.
            </p>
          </div>
        </article>

        <article className={`${styles.card} ${styles.valuesCard}`} style={v({ "--c": 2 })}>
          <p className={styles.valuesText}>
            We continuously improve{" "}
            <br />
            our products and services{" "}
            <br />
            for better results.
          </p>
          <ul className={styles.tags}>
            {tags.map((tag, i) => (
              <li key={tag} className={styles.tag} style={v({ "--t": i })}>
                {tag}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
