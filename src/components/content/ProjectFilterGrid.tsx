"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import styles from "./ProjectFilterGrid.module.css";

export type FilterOption = { value: string; label: string };
export type FilterItem = { slug: string; products: string[]; home: string; card: ReactNode };

/**
 * Builder 3 – /projecten grid with client-only filter chips (product + woningtype). No query
 * strings (02 §0.5). All cards are server-rendered; filtering only toggles `hidden`, so
 * crawlers and no-JS visitors see every project.
 */
export default function ProjectFilterGrid({
  items,
  products,
  homes,
  emptyHref,
}: {
  items: FilterItem[];
  products: FilterOption[];
  homes: FilterOption[];
  emptyHref: string;
}) {
  const [product, setProduct] = useState<string | null>(null);
  const [home, setHome] = useState<string | null>(null);

  const visible = useMemo(
    () => new Set(items.filter((i) => (!product || i.products.includes(product)) && (!home || i.home === home)).map((i) => i.slug)),
    [items, product, home],
  );
  const count = visible.size;
  const filtered = product !== null || home !== null;

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <h2 className={styles.title} id="filter-title">
          Filter op woning en techniek
        </h2>
        <div className={styles.groups} role="group" aria-labelledby="filter-title">
          <ChipGroup label="Techniek" options={products} value={product} onChange={setProduct} />
          <ChipGroup label="Woning" options={homes} value={home} onChange={setHome} />
        </div>
        <p className={styles.count} aria-live="polite">
          {count} {count === 1 ? "project" : "projecten"}
          {filtered && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => {
                setProduct(null);
                setHome(null);
              }}
            >
              Wis filters
            </button>
          )}
        </p>
      </div>

      <ul className={styles.grid}>
        {items.map((i) => (
          <li key={i.slug} hidden={!visible.has(i.slug)} className={styles.cell}>
            {i.card}
          </li>
        ))}
      </ul>

      {count === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Nog geen voorbeeld dat precies op jouw woning lijkt.</p>
          <p className={styles.emptyBody}>
            Geen probleem: elke woning is anders, en daarom rekenen we ze allemaal apart uit. Vraag een gratis berekening aan, dan krijg je jouw
            eigen scenario&apos;s.
          </p>
          <Link href={emptyHref} className={styles.emptyLink}>
            Gratis berekening voor jouw woning
          </Link>
        </div>
      )}
    </div>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: FilterOption[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}</span>
      <ul className={styles.chips}>
        <li>
          <button type="button" className={styles.chip} aria-pressed={value === null} onClick={() => onChange(null)}>
            Alle
          </button>
        </li>
        {options.map((o) => (
          <li key={o.value}>
            <button type="button" className={styles.chip} aria-pressed={value === o.value} onClick={() => onChange(value === o.value ? null : o.value)}>
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
