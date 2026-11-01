"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getImage, type ImageKey } from "@/content/images";
import { routes } from "@/lib/routes";
import { ArrowUpRight } from "./icons";
import styles from "./Hero.module.css";

const INTERVAL_MS = 4000;

// Slides per docs/spec/05-pages.md §1 row 1 (Builder 1 may move them to content/home.ts).
const slides: { title: [string, string]; image: ImageKey; href: string; cta: string }[] = [
  { title: ["Gezin in Gent:", "van gasfactuur naar bijna niets"], image: "journey-thumb", href: routes.project("gezinswoning-gent-warmtepomp-pvt"), cta: "Bekijk project" },
  { title: ["PVT-panelen:", "stroom én warm water"], image: "slide-panels", href: routes.service("pvt-panelen"), cta: "Ontdek PVT" },
  { title: ["Waarom we in Kortrijk", "géén batterij plaatsten"], image: "slide-fields", href: routes.project("gezin-kortrijk-geen-batterij-advies"), cta: "Lees waarom" },
  { title: ["Zon, warmte en opslag:", "hoe het samenwerkt"], image: "service-solar", href: routes.hoeHetWerkt(), cta: "Bekijk" },
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
    // Reduced motion: no auto-advance (the bars stay usable).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
        <span className={`${styles.ghostCard} ${styles.ghost3}`} />
        <span className={`${styles.ghostCard} ${styles.ghost2}`} />
        <span className={`${styles.ghostCard} ${styles.ghost1}`} />

        <div className={styles.cardViewport}>
          {slides.map((slide, i) => {
            const img = getImage(slide.image);
            return (
              <article
                key={slide.href}
                className={`${styles.card} ${slideState(i)}`}
                aria-hidden={i !== active}
                id={`highlight-${i}`}
                inert={i !== active}
              >
                <Image src={img.src} alt={img.alt} width={193} height={171} quality={90} loading="eager" className={styles.thumb} />
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>
                    {slide.title[0]}
                    <br />
                    {slide.title[1]}
                  </h2>
                  <Link href={slide.href} className={styles.play}>
                    {slide.cta}
                    <span className={styles.playIcon} aria-hidden="true">
                      <ArrowUpRight />
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.bars} role="tablist" aria-label="Uitgelicht">
        {slides.map((slide, i) => (
          <button
            key={slide.href}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls={`highlight-${i}`}
            aria-label={slide.title.join(" ")}
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
