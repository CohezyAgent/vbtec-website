"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HoldAndFade.module.css";

type Props = { children: ReactNode };

/**
 * Used for the section right after the doubts section. That section overlaps
 * the doubts section's pinned screen; instead of sliding up from below it is
 * held at the top of the screen, invisible, and fades in once the hand video
 * has flicked the pile away ("doubts:hand" event) or when you scroll past.
 */
export default function HoldAndFade({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let handDone = false;
    let shift = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!motion.matches) {
        el.style.transform = "";
        el.dataset.visible = "true";
        return;
      }
      const naturalTop = el.getBoundingClientRect().top - shift;
      const holding = naturalTop > 0 && naturalTop < window.innerHeight * 1.5;
      shift = holding ? -naturalTop : 0;
      el.style.transform = shift ? `translateY(${shift}px)` : "";
      const visible = handDone || naturalTop <= 0;
      if (visible) el.dataset.visible = "true";
      else delete el.dataset.visible;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onHand = (e: Event) => {
      handDone = Boolean((e as CustomEvent<boolean>).detail);
      request();
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    window.addEventListener("doubts:hand", onHand);
    motion.addEventListener("change", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("doubts:hand", onHand);
      motion.removeEventListener("change", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={styles.hold} data-hold-fade>
      {children}
    </div>
  );
}
