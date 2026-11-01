"use client";

import { useEffect, type RefObject } from "react";

/**
 * Scroll progress of an element through the viewport, written to a CSS variable
 * (default `--progress`, 0 → 1) on the element itself – no React re-renders.
 * 0 = element top reaches `start` (fraction of viewport from top, default 0.8),
 * 1 = element bottom reaches `end` (default 0.5).
 * One rAF per frame, passive listeners (04 §4.3). Optional onProgress callback.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    start = 0.8,
    end = 0.5,
    varName = "--progress",
    onProgress,
  }: { start?: number; end?: number; varName?: string; onProgress?: (p: number) => void } = {},
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = r.top - vh * start;
      const total = r.height + vh * start - vh * end;
      const p = Math.min(1, Math.max(0, -from / Math.max(1, total)));
      el.style.setProperty(varName, p.toFixed(4));
      onProgress?.(p);
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
  }, [ref, start, end, varName, onProgress]);
}
