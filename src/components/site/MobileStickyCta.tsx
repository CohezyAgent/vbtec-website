"use client";

import { useEffect, useRef } from "react";
import { navigation } from "@/content/site";
import { LEAD_ANCHOR } from "@/lib/routes";
import { ArrowUpRight } from "@/components/ui/icons";
import styles from "./MobileMenu.module.css";

/**
 * Compact "Gratis berekening" bar at the bottom on ≤900px. Appears after one screen of
 * scrolling, hides while #berekening is in view or the menu is open. Not on /contact.
 */
export default function MobileStickyCta({ hidden }: { hidden?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let leadVisible = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const show = window.scrollY > window.innerHeight * 0.9 && !leadVisible;
      if (show) el.dataset.show = "true";
      else delete el.dataset.show;
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const lead = document.getElementById(LEAD_ANCHOR);
    const io = lead
      ? new IntersectionObserver(([e]) => {
          leadVisible = e.isIntersecting;
          request();
        })
      : null;
    if (lead) io?.observe(lead);
    update();
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={styles.sticky} data-suppressed={hidden || undefined}>
      <a href={navigation.cta.href} className={styles.stickyPill}>
        <span>{navigation.cta.label}</span>
        <span className={styles.stickyCircle} aria-hidden="true">
          <ArrowUpRight />
        </span>
      </a>
    </div>
  );
}
