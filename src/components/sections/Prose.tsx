import type { ReactNode } from "react";
import type { FactKey } from "@/content/facts";
import type { TeamMember } from "@/content/types";
import { AuthorBox, UpdatedAt } from "@/components/ui/Content";
import { SourcesList } from "@/components/ui/Facts";
import TocNav from "./TocNav";
import styles from "./Prose.module.css";

export type TocItem = { id: string; label: string };

export type ProseProps = {
  toc?: TocItem[];
  children: ReactNode;
  author?: TeamMember;
  updatedAt?: string;
  sources?: FactKey[];
  /** Hairline + extra space above (W after W exception, 04 §3.1-1b). */
  hairline?: boolean;
  id?: string;
};

/**
 * Long-form reading layout (blog, kennisbank, privacy, project story): W, 68ch column at
 * the 503u line, sticky TOC in the eyebrow column (desktop) / collapsible "Inhoud" (mobile).
 * Typography uses fixed px (19px/1.65). Children: plain HTML (h2/h3/p/ul/ol/blockquote/
 * table/figure) or <ArticleBody blocks={…} />.
 */
export default function Prose({ toc, children, author, updatedAt, sources, hairline, id }: ProseProps) {
  return (
    <section id={id} className={`${styles.section} ${hairline ? styles.hairline : ""}`} data-header-tone="light">
      <div className={styles.grid}>
        <aside className={styles.side}>
          {toc && toc.length > 1 && <TocNav items={toc} />}
        </aside>
        <div className={styles.main}>
          {(author || updatedAt) && (
            <div className={styles.meta}>{author ? <AuthorBox member={author} updatedAt={updatedAt ?? ""} /> : updatedAt && <UpdatedAt date={updatedAt} />}</div>
          )}
          <div className={styles.prose}>{children}</div>
          {sources && sources.length > 0 && <SourcesList keys={sources} className={styles.sources} />}
        </div>
      </div>
    </section>
  );
}

/** The long-form typography on its own (e.g. inside a custom section). */
export function ProseText({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.prose} ${className ?? ""}`}>{children}</div>;
}
