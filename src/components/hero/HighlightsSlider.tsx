"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayIcon } from "./icons";
import styles from "./Hero.module.css";

const INTERVAL_MS = 2000;

const slides = [
  {
    title: ["Professional Journey", "Highlights"],
    image: "/images/journey-thumb.jpg",
    alt: "Two engineers in hard hats talking at a solar farm",
  },
  {
    title: ["Inside Our Solar", "Farm Projects"],
    image: "/images/slide-panels.jpg",
    alt: "Rows of solar panels on a ground-mounted solar farm",
  },
  {
    title: ["Powering Rail", "With Clean Energy"],
    image: "/images/slide-train.jpg",
    alt: "A red freight train passing a solar farm",
  },
  {
    title: ["From Open Fields", "to Clean Power"],
    image: "/images/slide-fields.jpg",
    alt: "Green fields behind a row of solar panels",
  },
];

export default function HighlightsSlider() {
  const [{ active, previous }, setSlide] = useState<{ active: number; previous: number | null }>({
    active: 0,
    previous: null,
  });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setSlide((s) => (s.active === next ? s : { active: next, previous: s.active }));
  }, []);

  const restartTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setSlide((s) => ({ active: (s.active + 1) % slides.length, previous: s.active }));
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [restartTimer]);

  const slideState = (i: number) => {
    if (i === active) return styles.slideActive;
    if (i === previous) return styles.slideLeaving;
    return styles.slideWaiting;
  };

  return (
    <div className={styles.side}>
      <div className={styles.cardStack}>
        <span className={`${styles.ghost} ${styles.ghost3}`} />
        <span className={`${styles.ghost} ${styles.ghost2}`} />
        <span className={`${styles.ghost} ${styles.ghost1}`} />

        <div className={styles.cardViewport}>
          {slides.map((slide, i) => (
            <article
              key={slide.image}
              className={`${styles.card} ${slideState(i)}`}
              aria-hidden={i !== active}
              id={`highlight-${i}`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                width={193}
                height={171}
                quality={90}
                loading="eager"
                className={styles.thumb}
              />
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>
                  {slide.title[0]}
                  <br />
                  {slide.title[1]}
                </h2>
                <button type="button" className={styles.play} tabIndex={i === active ? 0 : -1}>
                  <PlayIcon className={styles.playIcon} />
                  Play Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.bars} role="tablist" aria-label="Highlights">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`highlight-${i}`}
            aria-label={`${slide.title.join(" ")}`}
            className={i === active ? `${styles.bar} ${styles.barActive}` : styles.bar}
            onClick={() => {
              goTo(i);
              restartTimer();
            }}
          />
        ))}
      </div>
    </div>
  );
}
