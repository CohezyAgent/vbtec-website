"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Writes `--cover` (0 → 1) on every [data-stack-card] while the NEXT card slides over it.
 * One rAF per frame, passive scroll listener; inactive ≤900px and under reduced motion.
 */
export default function StackScroller({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const mq = window.matchMedia("(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-stack-card]"));
      if (!mq.matches) {
        cards.forEach((c) => c.style.removeProperty("--cover"));
        return;
      }
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return card.style.setProperty("--cover", "0");
        const stuckTop = parseFloat(getComputedStyle(next).top) || 0;
        const nextTop = next.getBoundingClientRect().top;
        const h = card.getBoundingClientRect().height || 1;
        const p = Math.min(1, Math.max(0, 1 - (nextTop - stuckTop) / h));
        card.style.setProperty("--cover", p.toFixed(3));
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    mq.addEventListener("change", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      mq.removeEventListener("change", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
