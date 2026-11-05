"use client";

import { Children, useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import styles from "./Rail.module.css";

type Props = {
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  tone: "light" | "dark";
  kind: string;
  label: string;
};

export default function RailScroller({ header, footer, children, tone, kind, label }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    root.current?.setAttribute("data-ready", "true");
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 1;
      const visible = max > 0 ? el.clientWidth / el.scrollWidth : 1;
      bar.current?.style.setProperty("--p", p.toFixed(4));
      bar.current?.style.setProperty("--w", visible.toFixed(4));
      if (prev.current) prev.current.disabled = el.scrollLeft <= 2;
      if (next.current) next.current.disabled = el.scrollLeft >= max - 2;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    // Drag to scroll (mouse only; touch uses native swipe).
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      // Only a real drag disables the cards' pointer events (data-dragging); a plain click
      // must still reach the card link.
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.dataset.dragging = "true";
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      delete el.dataset.dragging;
    };
    const click = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("click", click, true);
    return () => {
      el.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("click", click, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("li");
    const amount = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const slides = Children.toArray(children);

  return (
    <div ref={root} className={`${styles.root} ${tone === "dark" ? styles.dark : ""}`} data-kind={kind}>
      <div className={styles.headerRow}>
        <div className={styles.headerMain}>{header}</div>
        <div className={styles.controls}>
          <button ref={prev} type="button" className={styles.arrow} onClick={() => step(-1)} aria-label="Vorige">
            <ChevronLeftIcon />
          </button>
          <button ref={next} type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Volgende">
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <ul ref={track} className={styles.track} tabIndex={0} aria-label={label} onKeyDown={onKey}>
        {slides.map((slide, i) => (
          <li key={i} className={styles.slide} style={{ ["--i" as string]: i }}>
            {slide}
          </li>
        ))}
      </ul>
      <div className={styles.bottomRow}>
        <span ref={bar} className={styles.progress} aria-hidden="true">
          <span className={styles.progressFill} />
        </span>
        {footer}
      </div>
    </div>
  );
}
