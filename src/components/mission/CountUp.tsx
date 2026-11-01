"use client";

import { useEffect, useRef } from "react";

type Props = { to: number; suffix?: string; delay?: number; duration?: number };

/** Counts up from 0 when the surrounding fade-in wrapper becomes visible. */
export default function CountUp({ to, suffix = "", delay = 900, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>("[data-hold-fade]");
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer = 0;
    const set = (n: number) => (el.textContent = `${n}${suffix}`);

    const run = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      if (!host.dataset.visible) {
        set(0);
        return;
      }
      timer = window.setTimeout(() => {
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          set(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(host, { attributes: true, attributeFilter: ["data-visible"] });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [to, suffix, delay, duration]);

  return (
    <span ref={ref}>
      {to}
      {suffix}
    </span>
  );
}
