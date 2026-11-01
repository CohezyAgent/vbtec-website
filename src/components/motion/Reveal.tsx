"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

export type RevealMode = "self" | "group" | "wipe" | "custom";

type Props = {
  as?: ElementType;
  children?: ReactNode;
  /**
   * self   – the element itself rises & fades in (default)
   * group  – every descendant with `data-reveal-item` rises in, staggered
   * wipe   – every `data-reveal-item` uncovers bottom→top (clip-path), staggered
   * custom – only sets data-ready / data-visible; your CSS module does the rest
   */
  mode?: RevealMode;
  threshold?: number;
  rootMargin?: string;
  /** Stagger between items in ms (group/wipe). */
  stagger?: number;
  /** Delay before the first item in ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
  [key: `data-${string}`]: string | undefined;
  [key: `aria-${string}`]: string | undefined;
};

/**
 * The one shared in-view trigger (04 §4.3). Sets `data-reveal` + `data-ready` on mount
 * and `data-visible` once in view. CSS hides content only under
 * `[data-ready]:not([data-visible])`, so without JS everything is visible.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  mode = "self",
  threshold = 0.25,
  rootMargin = "0px 0px -10% 0px",
  stagger,
  delay,
  className,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (mode === "group" || mode === "wipe") {
      el.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((item, i) => {
        if (!item.style.getPropertyValue("--i")) item.style.setProperty("--i", String(i));
      });
    }
    // Already in view at mount (above the fold): show without hiding first.
    const r = el.getBoundingClientRect();
    const alreadyVisible = r.top < window.innerHeight * 0.9 && r.bottom > 0;
    el.dataset.ready = "true";
    if (alreadyVisible) {
      // Next frame so the transition still plays for content that mounts in view.
      requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.visible = "true")));
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, threshold, rootMargin]);

  const vars: Record<string, string> = {};
  if (stagger !== undefined) vars["--reveal-stagger"] = `${stagger}ms`;
  if (delay !== undefined) vars["--reveal-delay"] = `${delay}ms`;

  return (
    <Tag ref={ref} data-reveal={mode} className={className} style={{ ...vars, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
