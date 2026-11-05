"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Cta, Href, ImageInput } from "@/content/types";
import CtaPill from "@/components/ui/CtaPill";
import { ArrowUpRight, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import styles from "./BentoShowcase.module.css";

export type BentoSlide = {
  image: ImageInput;
  /** Small line above the overlay title, e.g. "Gent · halfopen, 1974". */
  kicker: string;
  title: string;
  href?: Href;
  /** Big number card (top right of the photo). */
  metric: { label: string; value: number; prefix?: string; suffix?: string; trend: string };
  /** White card under the metric: chips + a progress bar. */
  card: { title: string; chips: string[]; progressLabel: string; progress: number };
};

export type BentoShowcaseProps = {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: Cta;
  slides: BentoSlide[];
  side: { title: string; body?: string; image: ImageInput; caption: string; href?: Href };
  /** Honest footnote, e.g. "Voorbeeldprojecten · indicatieve cijfers". */
  note?: string;
  tone?: "lilac" | "mint";
};

const INTERVAL = 6000;

/** Number that tweens to a new value whenever `to` changes (reduced motion: jumps). */
function TweenNumber({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(to);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fmt = (n: number) => `${prefix}${new Intl.NumberFormat("nl-BE").format(Math.round(n))}${suffix}`;
    const start = from.current;
    from.current = to;
    if (start === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fmt(to);
      return;
    }
    const t0 = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      el.textContent = fmt(start + (to - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, prefix, suffix]);
  return (
    <span ref={ref}>
      {prefix}
      {new Intl.NumberFormat("nl-BE").format(to)}
      {suffix}
    </span>
  );
}

/**
 * Bento showcase – coloured lead card with slide progress, a large auto-advancing photo
 * with floating data cards and an "n/total" counter, and a side column (tinted card +
 * photo card). Autoplay only while in view, paused on hover/focus, off for reduced motion.
 */
export default function BentoShowcase({ id, eyebrow, title, body, cta, slides, side, note, tone = "lilac" }: BentoShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const titleId = id ? `${id}-title` : undefined;
  const slide = slides[index];
  const count = slides.length;

  // Autoplay only while the block is on screen and motion is allowed.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [count]);

  const running = playing && !paused;
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearTimeout(t);
  }, [running, index, count]);

  const go = (i: number) => setIndex((i + count) % count);

  return (
    <section
      ref={rootRef}
      id={id}
      className={styles.section}
      data-header-tone="light"
      aria-labelledby={titleId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <p className={styles.eyebrow}>
        <span>{eyebrow}</span>
      </p>
      <Reveal mode="wipe" stagger={120} className={styles.grid}>
        {/* ── Lead card ── */}
        <div data-reveal-item className={`${styles.lead} ${tone === "mint" ? styles.mint : styles.lilac}`}>
          <div className={styles.segments}>
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                className={styles.segment}
                data-state={i < index ? "done" : i === index ? "active" : undefined}
                data-running={i === index && running ? "true" : undefined}
                aria-label={`Toon ${i + 1} van ${count}: ${s.title}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                style={{ "--dur": `${INTERVAL}ms` } as CSSProperties}
              >
                <span className={styles.segmentFill} key={i === index ? index : undefined} />
              </button>
            ))}
          </div>
          <div className={styles.leadBody}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <span className={styles.divider} aria-hidden="true" />
            <p className={styles.body}>{body}</p>
          </div>
          <div className={styles.leadFoot}>
            <CtaPill href={cta.href} variant={cta.variant ?? "white"} size="sm">
              {cta.label}
            </CtaPill>
            <div className={styles.arrows}>
              <button type="button" className={styles.arrow} onClick={() => go(index - 1)} aria-label="Vorige">
                <ChevronLeftIcon />
              </button>
              <button type="button" className={styles.arrow} onClick={() => go(index + 1)} aria-label="Volgende">
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main photo ── */}
        <div data-reveal-item className={styles.main} aria-roledescription="carousel" aria-label={title}>
          {slides.map((s, i) => (
            <div key={s.title} className={styles.slide} data-active={i === index || undefined} aria-hidden={i !== index}>
              <SmartImage image={s.image} fill sizes="(max-width: 900px) 100vw, 45vw" className={styles.slideImg} />
            </div>
          ))}
          <div className={styles.caption} aria-live={running ? "off" : "polite"}>
            <p className={styles.kicker} key={`k${index}`}>
              {slide.kicker}
            </p>
            {slide.href ? (
              <Link href={slide.href} className={styles.slideTitle} key={`t${index}`}>
                {slide.title} <ArrowUpRight className={styles.slideTitleIcon} />
              </Link>
            ) : (
              <p className={styles.slideTitle} key={`t${index}`}>
                {slide.title}
              </p>
            )}
          </div>
          <p className={styles.counter} aria-hidden="true">
            <span key={index} className={styles.counterNow}>
              {index + 1}
            </span>
            <span className={styles.counterAll}>/{count}</span>
          </p>

          <div className={styles.floats}>
            <div className={styles.metric}>
              <p className={styles.metricLabel}>{slide.metric.label}</p>
              <p className={styles.metricValue}>
                <TweenNumber to={slide.metric.value} prefix={slide.metric.prefix} />
                {slide.metric.suffix && <span className={styles.metricSuffix}>{slide.metric.suffix}</span>}
              </p>
              <p className={styles.metricTrend}>
                <ArrowUpRight className={styles.trendIcon} /> {slide.metric.trend}
              </p>
            </div>
            <div className={styles.routine}>
              <p className={styles.routineTitle}>{slide.card.title}</p>
              <ul className={styles.chips} key={index}>
                {slide.card.chips.map((c, i) => (
                  <li key={c} className={`${styles.chipItem} ${i === 0 ? styles.chipOn : ""}`} style={{ "--i": i } as CSSProperties}>
                    {c}
                  </li>
                ))}
              </ul>
              <p className={styles.progressLabel}>{slide.card.progressLabel}</p>
              <span className={styles.progress} aria-hidden="true">
                <span className={styles.progressFill} style={{ "--p": slide.card.progress } as CSSProperties} />
              </span>
            </div>
          </div>
        </div>

        {/* ── Side column ── */}
        <div data-reveal-item className={styles.side}>
          <div className={`${styles.sideCard} ${tone === "mint" ? styles.lilac : styles.mint}`}>
            <p className={styles.sideTitle}>{side.title}</p>
            {side.body && <p className={styles.sideBody}>{side.body}</p>}
          </div>
          <div className={styles.sidePhoto}>
            <SmartImage image={side.image} fill sizes="(max-width: 900px) 50vw, 20vw" className={styles.slideImg} />
            {side.href ? (
              <Link href={side.href} className={styles.sideCaption}>
                {side.caption}
                <span className={styles.sideArrow} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </Link>
            ) : (
              <p className={styles.sideCaption}>{side.caption}</p>
            )}
          </div>
        </div>
      </Reveal>
      {note && <p className={styles.note}>{note}</p>}
    </section>
  );
}
