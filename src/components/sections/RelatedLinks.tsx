import Link from "next/link";
import type { LinkItem, LinkKind } from "@/content/types";
import { ArrowUpRight } from "@/components/ui/icons";
import styles from "./RelatedLinks.module.css";

const kindLabel: Record<LinkKind, string> = {
  service: "Dienst",
  comparison: "Vergelijking",
  project: "Project",
  article: "Kennisbank",
  post: "Blog",
  page: "Pagina",
};

/**
 * "Verder lezen" list of internal links (01 §5). `compact` = simple list (inside Faq);
 * otherwise a row of link tiles. Descriptive anchors only, never "klik hier".
 */
export default function RelatedLinks({
  title = "Verder lezen",
  links,
  compact,
  tone = "light",
}: {
  title?: string;
  links: LinkItem[];
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  if (links.length === 0) return null;
  return (
    <nav aria-label={title} className={[styles.wrap, compact && styles.compact, tone === "dark" && styles.dark].filter(Boolean).join(" ")}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={styles.link}>
              {l.kind && <span className={styles.kind}>{kindLabel[l.kind]}</span>}
              <span className={styles.label}>{l.label}</span>
              {l.description && !compact && <span className={styles.desc}>{l.description}</span>}
              <ArrowUpRight className={styles.icon} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
