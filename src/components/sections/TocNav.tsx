"use client";

import { useEffect, useRef } from "react";
import styles from "./Prose.module.css";

/** Sticky table of contents; highlights the current H2 (IntersectionObserver). */
export default function TocNav({ items }: { items: { id: string; label: string }[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const headings = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => !!h);
    const setActive = (id: string) => {
      nav.querySelectorAll<HTMLAnchorElement>("a[data-toc]").forEach((a) => {
        if (a.dataset.toc === id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    };
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [items]);

  const list = (
    <ol className={styles.tocList}>
      {items.map((i) => (
        <li key={i.id}>
          <a href={`#${i.id}`} data-toc={i.id} className={styles.tocLink}>
            {i.label}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav ref={ref} aria-label="Inhoud" className={styles.toc}>
      <p className={styles.tocTitle}>Inhoud</p>
      <div className={styles.tocDesktop}>{list}</div>
      <details className={styles.tocMobile}>
        <summary className={styles.tocSummary}>Inhoud van dit artikel</summary>
        {list}
      </details>
    </nav>
  );
}
