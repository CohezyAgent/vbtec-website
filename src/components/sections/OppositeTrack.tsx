"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll driver for StickySplit variant="opposite". The wrapper is n viewports tall; its
 * stage sticks while the text cells move up and the media cells move down. Writes
 * `--s` (eased step position, 0 → n-1) and `--p` (0 → 1) on the wrapper and marks the
 * nearest row with data-active – no React re-renders. CSS turns all of it off ≤900px and
 * for reduced motion.
 */
export default function OppositeTrack({ count, className, stageClassName, listClassName, progressClassName, children }: { count: number; className?: string; stageClassName?: string; listClassName?: string; progressClassName?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-split-row]"));
    let frame = 0;
    let active = -1;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      // Hold on each step for a while, then glide to the next (smoothstep over the middle 60%).
      const raw = p * (count - 1);
      const i = Math.min(count - 1, Math.floor(raw));
      const f = Math.min(1, Math.max(0, (raw - i - 0.2) / 0.6));
      const s = i + f * f * (3 - 2 * f);
      el.style.setProperty("--s", s.toFixed(4));
      el.style.setProperty("--p", p.toFixed(4));
      const next = Math.round(s);
      if (next !== active) {
        active = next;
        rows.forEach((row, k) => (k === next ? (row.dataset.active = "true") : delete row.dataset.active));
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  return (
    <div ref={ref} className={className} style={{ "--n": count, "--s": 0, "--p": 0 } as CSSProperties}>
      <div className={stageClassName}>
        <ol className={listClassName}>{children}</ol>
        <span className={progressClassName} aria-hidden="true" />
      </div>
    </div>
  );
}
