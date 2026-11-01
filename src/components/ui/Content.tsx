import Link from "next/link";
import type { ReactNode } from "react";
import type { CalloutKind, Cta, TeamMember } from "@/content/types";
import type { FactKey } from "@/content/facts";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import CtaPill from "./CtaPill";
import { FactNote } from "./Facts";
import SmartImage from "./SmartImage";
import styles from "./Content.module.css";

const calloutLabel: Record<CalloutKind, string> = {
  rekenvoorbeeld: "Rekenvoorbeeld",
  mythe: "Veelgehoord",
  eerlijk: "Eerlijk is eerlijk",
  info: "Goed om te weten",
};

/** Box that breaks long text (Prose only): rekenvoorbeeld · mythe · eerlijk · info. */
export function Callout({
  kind,
  title,
  children,
  factKeys,
}: {
  kind: CalloutKind;
  title?: string;
  children: ReactNode;
  factKeys?: FactKey[];
}) {
  return (
    <aside className={`${styles.callout} ${styles[`callout_${kind}`]}`}>
      <p className={styles.calloutLabel}>{calloutLabel[kind]}</p>
      {title && <p className={styles.calloutTitle}>{title}</p>}
      <div className={styles.calloutBody}>{children}</div>
      {factKeys && factKeys.length > 0 && <FactNote keys={factKeys} variant="footnote" tone={kind === "rekenvoorbeeld" ? "dark" : "light"} />}
    </aside>
  );
}

/** Small CTA card inside long text or the house diagram. */
export function InlineCta({ title, body, cta, tone = "light" }: { title: string; body?: string; cta: Cta; tone?: "light" | "dark" }) {
  return (
    <aside className={`${styles.inlineCta} ${tone === "dark" ? styles.inlineCtaDark : ""}`}>
      <div>
        <p className={styles.inlineCtaTitle}>{title}</p>
        {body && <p className={styles.inlineCtaBody}>{body}</p>}
      </div>
      <CtaPill href={cta.href} variant={cta.variant ?? (tone === "dark" ? "lime" : "ink")} size="sm">
        {cta.label}
      </CtaPill>
    </aside>
  );
}

/** Author card (team member) + "Laatst bijgewerkt". Links to /team#slug. */
export function AuthorBox({ member, updatedAt, compact }: { member: TeamMember; updatedAt: string; compact?: boolean }) {
  return (
    <div className={`${styles.author} ${compact ? styles.authorCompact : ""}`}>
      <span className={styles.authorAvatar}>
        {member.image ? (
          <SmartImage image={member.image} sizes="64px" ratio="1/1" />
        ) : (
          <span aria-hidden="true">{member.name.charAt(0)}</span>
        )}
      </span>
      <div className={styles.authorText}>
        <p className={styles.authorName}>
          <Link href={routes.team(member.slug)}>{member.name}</Link>
          <span className={styles.authorRole}> · {member.role}</span>
        </p>
        {!compact && member.bio && <p className={styles.authorBio}>{member.bio}</p>}
        <p className={styles.authorDate}>
          Laatst bijgewerkt: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </p>
      </div>
    </div>
  );
}

/** "Laatst bijgewerkt: 1 november 2026" line. */
export function UpdatedAt({ date, tone = "light" }: { date: string; tone?: "light" | "dark" }) {
  return (
    <p className={`${styles.updated} ${tone === "dark" ? styles.updatedDark : ""}`}>
      Laatst bijgewerkt: <time dateTime={date}>{formatDate(date)}</time>
    </p>
  );
}
