"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { className?: string; children: ReactNode };

/** Marks each step visible when it scrolls into view; CSS handles the fade. */
export default function StepsReveal({ className, children }: Props) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    list.dataset.ready = "true";
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.25 },
    );
    Array.from(list.children).forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}
