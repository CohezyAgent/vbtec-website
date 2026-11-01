"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Marks the [data-split-row] closest to the viewport centre with data-active. */
export default function SplitTracker({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-split-row]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            rows.forEach((r) => (r === e.target ? (r.dataset.active = "true") : delete r.dataset.active));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
