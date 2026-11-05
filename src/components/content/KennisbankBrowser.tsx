"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./KennisbankBrowser.module.css";

export type KbEntry = { slug: string; href: string; title: string; teaser: string; author?: string; keywords?: string };
export type KbCategory = { key: string; title: string; intro: string; entries: KbEntry[] };

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Builder 3 – /kennisbank: anchor chips per category, client-side search across title and
 * Kort antwoord, and a typographic list per category (h2). Everything is server-rendered; the
 * search only hides rows (no query-string URLs).
 */
export default function KennisbankBrowser({ categories, contactHref }: { categories: KbCategory[]; contactHref: string }) {
  const [q, setQ] = useState("");
  const inputId = useId();
  const query = norm(q.trim());

  const matches = useMemo(() => {
    const m = new Set<string>();
    for (const c of categories)
      for (const e of c.entries) if (!query || norm(`${e.title} ${e.teaser} ${c.title} ${e.keywords ?? ""}`).includes(query)) m.add(e.slug);
    return m;
  }, [categories, query]);

  const total = categories.reduce((n, c) => n + c.entries.length, 0);

  return (
    <div className={styles.root}>
      <div className={styles.tools}>
        <div className={styles.search}>
          <label htmlFor={inputId} className={styles.searchLabel}>
            Zoek in de kennisbank
          </label>
          <div className={styles.searchField}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              id={inputId}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="bv. capaciteitstarief, SCOP, premie"
              className={styles.input}
              autoComplete="off"
            />
          </div>
          <p className={styles.count} aria-live="polite">
            {query ? `${matches.size} van ${total} artikels` : `${total} artikels in ${categories.length} categorieën`}
          </p>
        </div>
        <nav aria-label="Categorieën" className={styles.anchors}>
          <ul>
            {categories.map((c) => (
              <li key={c.key}>
                <a href={`#${c.key}`} className={styles.anchor}>
                  {c.title}
                  <span className={styles.anchorCount}>{c.entries.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {categories.map((c) => {
        const shown = c.entries.filter((e) => matches.has(e.slug)).length;
        return (
          <section key={c.key} id={c.key} className={styles.category} hidden={shown === 0} aria-labelledby={`${c.key}-title`}>
            <div className={styles.catHead}>
              <h2 id={`${c.key}-title`} className={styles.catTitle}>
                {c.title}
              </h2>
              <p className={`${styles.catIntro} desktop-only`}>{c.intro}</p>
            </div>
            <ol className={styles.list}>
              {c.entries.map((e, i) => (
                <li key={e.slug} hidden={!matches.has(e.slug)} className={styles.row}>
                  <Link href={e.href} className={styles.rowLink}>
                    <span className={styles.idx} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.rowBody}>
                      <span className={styles.rowTitle}>{e.title}</span>
                      <span className={styles.rowTeaser}>{e.teaser}</span>
                      {e.author && <span className={styles.rowMeta}>{e.author}</span>}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        );
      })}

      {query && matches.size === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Daar hebben we (nog) geen artikel over.</p>
          <p>
            Stel je vraag gerust rechtstreeks aan een ingenieur. Vaak is het antwoord voor jouw woning toch anders dan in een algemeen artikel.{" "}
            <Link href={contactHref}>Stel je vraag</Link>
          </p>
        </div>
      )}
    </div>
  );
}
