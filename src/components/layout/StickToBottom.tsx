"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { children: ReactNode };

/**
 * Scrolls normally until its bottom reaches the bottom of the screen, then
 * holds still so the next section can slide over it. Works for content that
 * is taller than the screen too.
 */
export default function StickToBottom({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: "sticky", top: 0 }}>
      {children}
    </div>
  );
}
