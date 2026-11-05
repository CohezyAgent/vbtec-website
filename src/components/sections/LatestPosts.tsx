import Link from "next/link";
import type { PostSlug } from "@/content/types";
import { postsByDate, postsBySlugs } from "@/content/blog";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import Section from "@/components/ui/Section";
import SmartImage from "@/components/ui/SmartImage";
import { ArrowUpRight } from "@/components/ui/icons";
import styles from "./LatestPosts.module.css";

type Props = {
  id?: string;
  /** Plain string, or [dark, muted] for a two-tone heading. */
  title?: string | [string, string];
  /** Specific posts (in this order); default = newest first. */
  slugs?: string[];
  /** Leave these out (e.g. the post you're reading). */
  exclude?: string[];
  limit?: number;
};

/**
 * "Nieuw op de blog" – three post cards between the lead form and the FAQ on every page
 * (image, date, title, two-line excerpt). Horizontal scroll-snap rail on mobile.
 */
export default function LatestPosts({ id = "blog", title = ["Nieuw", "op de blog"], slugs, exclude = [], limit = 3 }: Props) {
  const source = slugs?.length ? postsBySlugs(slugs as PostSlug[]) : postsByDate;
  const posts = source.filter((p) => !exclude.includes(p.slug)).slice(0, limit);
  if (posts.length === 0) return null;
  const headingId = `${id}-title`;
  const [dark, muted] = typeof title === "string" ? [title, ""] : title;

  return (
    <Section bg="W" id={id} labelledBy={headingId} className={styles.section}>
      <div className={styles.head}>
        <h2 id={headingId} className={styles.title}>
          {dark} {muted && <span className={styles.muted}>{muted}</span>}
        </h2>
        <Link href={routes.blog()} className={styles.all}>
          Alle artikels <ArrowUpRight className={styles.allIcon} />
        </Link>
      </div>
      <ul className={styles.grid}>
        {posts.map((p) => (
          <li key={p.slug} className={styles.item}>
            <Link href={routes.post(p.slug)} className={styles.card}>
              {p.image && (
                <div className={styles.media}>
                  <SmartImage image={p.image} fill sizes="(max-width: 900px) 80vw, 30vw" />
                </div>
              )}
              <div className={styles.body}>
                <p className={styles.meta}>
                  <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time>
                  {p.category && <span className={styles.cat}>{p.category}</span>}
                </p>
                <h3 className={styles.cardTitle}>{p.shortTitle ?? p.title}</h3>
                <p className={styles.excerpt}>{p.excerpt}</p>
                <span className={styles.more}>
                  Lees meer <ArrowUpRight className={styles.moreIcon} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
