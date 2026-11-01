import type { ReactNode } from "react";
import { PlusIcon } from "./icons";
import styles from "./Accordion.module.css";

export type AccordionItem = { title: ReactNode; body: ReactNode; id?: string };

/**
 * <details>/<summary> accordion – content stays in the DOM (AEO). Used by Faq and
 * "Bekijk aannames". The "+" circle rotates to "×"; the panel opens with a grid-rows trick
 * where `::details-content` is supported.
 */
export default function Accordion({
  items,
  tone = "light",
  defaultOpen,
  headingLevel,
  className,
}: {
  items: AccordionItem[];
  tone?: "light" | "dark";
  /** Index of the item open on load. */
  defaultOpen?: number;
  /** Wrap the summary text in an h3 (FAQ questions). */
  headingLevel?: "h3" | "h4";
  className?: string;
}) {
  const H = headingLevel;
  return (
    <div className={`${styles.list} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}>
      {items.map((item, i) => (
        <details key={item.id ?? i} id={item.id} className={styles.item} open={defaultOpen === i || undefined}>
          <summary className={styles.summary}>
            {H ? <H className={styles.title}>{item.title}</H> : <span className={styles.title}>{item.title}</span>}
            <span className={styles.plus} aria-hidden="true">
              <PlusIcon />
            </span>
          </summary>
          <div className={styles.panel}>
            <div className={styles.body}>{item.body}</div>
          </div>
        </details>
      ))}
    </div>
  );
}
