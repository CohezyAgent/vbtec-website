"use client";

import { useEffect, useState, type RefObject } from "react";

export type InViewOptions = { threshold?: number; rootMargin?: string; once?: boolean };

/**
 * True once the element enters the viewport (04 §4.2: threshold 0.25,
 * rootMargin "0px 0px -10% 0px"). With `once: false` it toggles back.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { threshold = 0.25, rootMargin = "0px 0px -10% 0px", once = true }: InViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin, once]);

  return inView;
}

/** Imperative variant: marks `el` with data-visible once in view. Returns a cleanup. */
export function observeOnce(
  el: Element,
  onVisible: () => void,
  { threshold = 0.25, rootMargin = "0px 0px -10% 0px" }: Omit<InViewOptions, "once"> = {},
): () => void {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        onVisible();
        io.disconnect();
      }
    },
    { threshold, rootMargin },
  );
  io.observe(el);
  return () => io.disconnect();
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
