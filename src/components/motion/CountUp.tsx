"use client";

import { useEffect, useRef } from "react";

type Props = {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** ms before counting starts once in view (04: 0.3–0.9s). */
  delay?: number;
  duration?: number;
  className?: string;
};

const format = (n: number, decimals: number) =>
  new Intl.NumberFormat("nl-BE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

/**
 * Counts up to `to` when it scrolls into view (its own IntersectionObserver).
 * SSR renders the FINAL value (SEO + no-JS); JS only resets to 0 when the number is
 * below the fold at mount. Reduced motion → final value, no animation.
 */
export default function CountUp({ to, decimals = 0, prefix = "", suffix = "", delay = 300, duration = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const set = (n: number) => (el.textContent = `${prefix}${format(n, decimals)}${suffix}`);
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: keep final value

    let frame = 0;
    let timer = 0;
    set(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const factor = Math.pow(10, decimals);
            set(Math.round(to * eased * factor) / factor);
            if (p < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      set(to);
    };
  }, [to, decimals, prefix, suffix, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(to, decimals)}
      {suffix}
    </span>
  );
}
