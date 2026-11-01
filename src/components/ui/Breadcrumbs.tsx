import Link from "next/link";
import type { BreadcrumbItem } from "@/content/types";
import { breadcrumb } from "@/lib/schema";
import JsonLd from "./JsonLd";
import styles from "./Breadcrumbs.module.css";

/**
 * "Home › Hub › Item" (01 §4). Last item is plain text with aria-current="page".
 * Items without href (kennisbank category) render as text and are left out of the JSON-LD.
 * Emits BreadcrumbList JSON-LD unless `schema={false}`.
 */
export default function Breadcrumbs({
  items,
  tone = "light",
  currentPath,
  schema = true,
  className,
}: {
  items: BreadcrumbItem[];
  tone?: "light" | "dark";
  /** Path of the current page (for the last JSON-LD item). */
  currentPath?: string;
  schema?: boolean;
  className?: string;
}) {
  return (
    <>
      <nav aria-label="Kruimelpad" className={`${styles.nav} ${tone === "dark" ? styles.dark : ""} ${className ?? ""}`}>
        <ol className={styles.list}>
          {items.map((item, i) => {
            const last = i === items.length - 1;
            const middle = i > 0 && !last;
            return (
              <li key={`${item.label}-${i}`} className={`${styles.item} ${middle ? styles.middle : ""}`}>
                {item.href && !last ? (
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? styles.current : undefined}>
                    {item.label}
                  </span>
                )}
                {!last && (
                  <span className={styles.sep} aria-hidden="true">
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {schema && <JsonLd data={breadcrumb(items, currentPath)} />}
    </>
  );
}
