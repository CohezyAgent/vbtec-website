"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sets --progress (0 → 1) on the track as its middle passes the viewport centre and marks
 * each [data-timeline-step] with data-on once the fill reaches its node.
 */
export default function TimelineTrack({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.dataset.ready = "true";
    const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-timeline-step]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
      el.style.setProperty("--progress", p.toFixed(4));
      steps.forEach((s) => {
        if (s.getBoundingClientRect().top + 14 < line) s.dataset.on = "true";
        else delete s.dataset.on;
      });
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
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
