import Link from "next/link";
import type { ImageInput, Project, Review, TeamMember } from "@/content/types";
import { COMPARISONS, SERVICES, SERVICE_TAGLINES, type ComparisonSlug, type ServiceSlug } from "@/content/registry";
import { routes } from "@/lib/routes";
import { formatDate } from "@/lib/format";
import { PlaceholderBadge, Tag } from "./Bits";
import { ArrowUpRight, QuoteIcon } from "./icons";
import SmartImage from "./SmartImage";
import styles from "./Cards.module.css";

type Variant = "rail" | "grid" | "photo";
type Tone = "light" | "dark";
const serviceName = (slug: ServiceSlug) => SERVICES.find((s) => s.slug === slug)?.shortTitle ?? slug;

/** Project teaser: photo 4:3, place + home type, "€ X → € Y /maand" (indicatief), product tags. */
export function ProjectCard({ project, variant = "rail", tone = "light" }: { project: Project; variant?: Variant; tone?: Tone }) {
  return (
    <article className={`${styles.card} ${styles[variant]} ${tone === "dark" ? styles.dark : ""}`}>
      <Link href={routes.project(project.slug)} className={styles.link}>
        <span className={styles.media}>
          <SmartImage image={project.image} ratio="4/3" sizes="(max-width: 900px) 82vw, 28vw" className={styles.mediaImg} />
          {project.isPlaceholder && <PlaceholderBadge label="Voorbeeldproject" tone="dark" className={styles.mediaBadge} />}
        </span>
        <span className={styles.body}>
          <span className={styles.meta}>
            {project.place} · {project.homeType}
          </span>
          <span className={styles.figure}>
            {project.headline.before} <span className={styles.arrowTo}>→</span> {project.headline.after}
            <span className={styles.unit}> {project.headline.unit}</span>
          </span>
          <span className={styles.title}>{project.shortTitle}</span>
          <span className={styles.note}>{project.advisedAgainst ? "Eerlijk advies: we raadden iets af" : "Indicatief, op basis van hun verbruik"}</span>
        </span>
      </Link>
      <ul className={styles.tags}>
        {project.products.map((p) => (
          <li key={p}>
            <Tag size="sm" tone={tone === "dark" ? "ring" : "light"} href={routes.service(p)}>
              {serviceName(p)}
            </Tag>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Generic teaser for blog posts, kennisbank articles and mixed rails. */
export function ArticleCard({
  href,
  title,
  excerpt,
  eyebrow,
  image,
  date,
  variant = "rail",
  tone = "light",
}: {
  href: string;
  title: string;
  excerpt?: string;
  eyebrow?: string;
  image?: ImageInput;
  date?: string;
  variant?: Variant;
  tone?: Tone;
}) {
  return (
    <article className={`${styles.card} ${styles[variant]} ${tone === "dark" ? styles.dark : ""} ${image ? "" : styles.noImage}`}>
      <Link href={href} className={styles.link}>
        {image && (
          <span className={styles.media}>
            <SmartImage image={image} ratio="16/10" sizes="(max-width: 900px) 82vw, 28vw" className={styles.mediaImg} />
          </span>
        )}
        <span className={styles.body}>
          {(eyebrow || date) && (
            <span className={styles.meta}>
              {eyebrow}
              {eyebrow && date ? " · " : ""}
              {date && <time dateTime={date}>{formatDate(date)}</time>}
            </span>
          )}
          <span className={styles.titleLg}>{title}</span>
          {excerpt && <span className={styles.excerpt}>{excerpt}</span>}
          <span className={styles.more} aria-hidden="true">
            Lees verder <ArrowUpRight className={styles.moreIcon} />
          </span>
        </span>
      </Link>
    </article>
  );
}

/** Service card: Figtree name + tagline (+ optional photo and "zinvol als…" line). */
export function ServiceCard({
  slug,
  body,
  image,
  variant = "grid",
  tone = "light",
}: {
  slug: ServiceSlug;
  body?: string;
  image?: ImageInput;
  variant?: Variant;
  tone?: Tone;
}) {
  return (
    <article className={`${styles.card} ${styles[variant]} ${tone === "dark" ? styles.dark : ""} ${image ? "" : styles.noImage}`}>
      <Link href={routes.service(slug)} className={styles.link}>
        {image && (
          <span className={styles.media}>
            <SmartImage image={image} ratio="4/3" sizes="(max-width: 900px) 82vw, 28vw" className={styles.mediaImg} />
          </span>
        )}
        <span className={styles.body}>
          <span className={styles.label}>{serviceName(slug)}</span>
          <span className={styles.excerpt}>{body ?? SERVICE_TAGLINES[slug]}</span>
          <span className={styles.more} aria-hidden="true">
            Bekijk {serviceName(slug).toLowerCase()} <ArrowUpRight className={styles.moreIcon} />
          </span>
        </span>
      </Link>
    </article>
  );
}

/** Comparison card: the doubt as a question + one-line verdict teaser. */
export function ComparisonCard({ slug, verdict, variant = "grid", tone = "light" }: { slug: ComparisonSlug; verdict?: string; variant?: Variant; tone?: Tone }) {
  const c = COMPARISONS.find((x) => x.slug === slug);
  return (
    <article className={`${styles.card} ${styles[variant]} ${styles.noImage} ${styles.question} ${tone === "dark" ? styles.dark : ""}`}>
      <Link href={routes.comparison(slug)} className={styles.link}>
        <span className={styles.body}>
          <span className={styles.meta}>Vergelijking</span>
          <span className={styles.titleLg}>{c?.shortTitle ?? slug}</span>
          {verdict && <span className={styles.excerpt}>{verdict}</span>}
          <span className={styles.more} aria-hidden="true">
            Lees het eerlijke antwoord <ArrowUpRight className={styles.moreIcon} />
          </span>
        </span>
      </Link>
    </article>
  );
}

/** Team member: portrait 4:5 (silhouette until real), name, role, certifications. Anchor id = slug. */
export function TeamCard({ member, variant = "grid", tone = "light" }: { member: TeamMember; variant?: Variant; tone?: Tone }) {
  return (
    <article id={variant === "grid" ? member.slug : undefined} className={`${styles.card} ${styles[variant]} ${tone === "dark" ? styles.dark : ""}`}>
      <Link href={routes.team(member.slug)} className={styles.link}>
        <span className={`${styles.media} ${styles.portrait}`}>
          {member.image ? (
            <SmartImage image={member.image} ratio="4/5" sizes="(max-width: 900px) 82vw, 24vw" className={styles.mediaImg} />
          ) : (
            <span className={styles.silhouette} aria-hidden="true">
              <svg viewBox="0 0 100 125">
                <circle cx="50" cy="44" r="20" />
                <path d="M12 125c2-26 18-42 38-42s36 16 38 42Z" />
              </svg>
            </span>
          )}
        </span>
        <span className={styles.body}>
          <span className={styles.titleLg}>{member.name}</span>
          <span className={styles.meta}>{member.role}</span>
          {member.personalLine && <span className={styles.excerpt}>{member.personalLine}</span>}
        </span>
      </Link>
      {member.certifications && member.certifications.length > 0 && (
        <ul className={styles.tags}>
          {member.certifications.map((c) => (
            <li key={c}>
              <Tag size="sm" tone={tone === "dark" ? "ring" : "light"}>
                {c}
              </Tag>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** Review card: quote mark, quote, name + gemeente, product tags. tone: grey (#eee) · dark (D) · lime. */
export function ReviewCard({ review, tone = "grey" }: { review: Review; tone?: "grey" | "dark" | "lime" | "white" }) {
  return (
    <figure className={`${styles.review} ${styles[`review_${tone}`]}`}>
      <QuoteIcon className={styles.reviewQuote} />
      <blockquote className={styles.reviewText}>
        <p>{review.text}</p>
      </blockquote>
      <figcaption className={styles.reviewBy}>
        <span className={styles.reviewName}>{review.name}</span>
        <span className={styles.reviewPlace}>
          {review.place}
          {review.homeType ? ` · ${review.homeType}` : ""}
        </span>
      </figcaption>
      <ul className={styles.reviewTags}>
        {review.products.slice(0, 3).map((p) => (
          <li key={p}>
            <Tag size="sm" tone={tone === "dark" ? "ring" : tone === "grey" ? "grey" : "light"}>
              {serviceName(p)}
            </Tag>
          </li>
        ))}
      </ul>
    </figure>
  );
}
