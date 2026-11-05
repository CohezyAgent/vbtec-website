import type { CSSProperties, ReactNode } from "react";
import type { BreadcrumbItem, Cta, ImageInput, TeamMember } from "@/content/types";
import type { FactKey } from "@/content/facts";
import { fact, formatFactValue } from "@/content/facts";
import { site } from "@/content/site";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CtaPill, { TextLink } from "@/components/ui/CtaPill";
import { PlaceholderBadge, Tag } from "@/components/ui/Bits";
import { AuthorBox, UpdatedAt } from "@/components/ui/Content";
import { FactNote, KortAntwoord, TrustLine } from "@/components/ui/Facts";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";
import styles from "./PageHero.module.css";

export type PageHeroProps = {
  /** image = framed photo hero (78svh, dark header) · type = typographic hero on white. */
  variant: "image" | "type";
  breadcrumb?: BreadcrumbItem[];
  /** Current path, for the BreadcrumbList JSON-LD. */
  path?: string;
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  image?: ImageInput;
  cta?: Cta;
  secondaryCta?: Cta;
  trustLine?: boolean;
  /** Image variant: glass card (key number left, zoomed product right) under a Google badge. */
  showcase?: { image: ImageInput; value: string; label: string; zoom?: number; avatars?: string[]; avatarsLabel?: string };
  /** Glass card bottom-right (image variant). `k` = fact shown big; or pass `value`. */
  factCard?: { k?: FactKey; title: string; value?: ReactNode; image?: ImageInput };
  kortAntwoord?: ReactNode;
  kortAntwoordFacts?: FactKey[];
  chips?: string[];
  updatedAt?: string;
  author?: TeamMember;
  placeholderBadge?: string;
  /** Type variant: grid or form rendered below the intro, inside the same W section. */
  children?: ReactNode;
  id?: string;
};

/** First section of every non-home page (04 §2 fixed blocks). Holds the page's only H1. */
export default function PageHero(props: PageHeroProps) {
  return props.variant === "image" ? <ImageHero {...props} /> : <TypeHero {...props} />;
}

function ImageHero({ breadcrumb, path, eyebrow, title, lead, image, cta, secondaryCta, showcase, factCard, chips, updatedAt, placeholderBadge, id }: PageHeroProps) {
  // Full-screen hero: trust line and "laatst bijgewerkt" live in the strip under it,
  // together with the breadcrumb, so the hero itself stays calm.
  return (
    <section id={id} className={styles.frame} data-header-tone="dark" aria-labelledby="page-title">
      <div className={styles.hero}>
        {image && <SmartImage image={image} fill sizes="100vw" preload quality={90} className={styles.bg} />}
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.bottom}>
          <Reveal mode="group" stagger={120} className={styles.copy}>
            {(eyebrow || placeholderBadge) && (
              <div className={styles.badges} data-reveal-item>
                {eyebrow && <span className={styles.badge}>{eyebrow}</span>}
                {placeholderBadge && <PlaceholderBadge label={placeholderBadge} tone="dark" />}
              </div>
            )}
            <h1 id="page-title" className={styles.titleImage} data-reveal-item>
              {title}
            </h1>
            {lead && (
              <div className={`${styles.leadImage} desktop-only`} data-reveal-item>
                {lead}
              </div>
            )}
            {chips && chips.length > 0 && (
              <ul className={`${styles.chips} desktop-only`} data-reveal-item>
                {chips.map((c) => (
                  <li key={c}>
                    <Tag tone="ring" size="sm">
                      {c}
                    </Tag>
                  </li>
                ))}
              </ul>
            )}
            {(cta || secondaryCta) && (
              <div className={styles.actions} data-reveal-item>
                {cta && (
                  <CtaPill href={cta.href} variant={cta.variant ?? "hero"} block>
                    {cta.label}
                  </CtaPill>
                )}
                {secondaryCta && (
                  <span className="desktop-only">
                    <TextLink href={secondaryCta.href} tone="dark">
                      {secondaryCta.label}
                    </TextLink>
                  </span>
                )}
              </div>
            )}
          </Reveal>
          {/* Phones: badge, heading and CTA only – the glass card is desktop-only. */}
          <div className="desktop-only" style={{ display: "contents" }}>{showcase ? <Showcase {...showcase} /> : factCard && <FactCard {...factCard} />}</div>
        </div>
      </div>
      {(breadcrumb || updatedAt) && (
        <div className={styles.below}>
          {breadcrumb && <Breadcrumbs items={breadcrumb} currentPath={path} />}
          {updatedAt && <UpdatedAt date={updatedAt} />}
        </div>
      )}
    </section>
  );
}

function GoogleBadge() {
  const { score, count } = site.googleRating;
  return (
    <div className={styles.google}>
      <svg className={styles.googleIcon} viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      <span className={styles.googleText}>
        <span className={styles.stars} aria-hidden="true">
          ★★★★★
        </span>
        <span>
          <strong>{score}</strong> · {count} reviews op Google
        </span>
      </span>
    </div>
  );
}

function Showcase({ image, value, label, zoom, avatars, avatarsLabel }: NonNullable<PageHeroProps["showcase"]>) {
  return (
    <Reveal className={styles.showcase} delay={450}>
      <GoogleBadge />
      <div className={styles.glassCard}>
        <div className={styles.glassStat}>
          <p className={styles.glassValue}>{value}</p>
          <p className={styles.glassLabel}>{label}</p>
          {avatars && avatars.length > 0 && (
            <div className={styles.people}>
              <span className={styles.avatars} aria-hidden="true">
                {avatars.map((a, i) => (
                  <span key={a + i} className={styles.avatar}>
                    {a}
                  </span>
                ))}
              </span>
              {avatarsLabel && <span className={styles.peopleLabel}>{avatarsLabel}</span>}
            </div>
          )}
        </div>
        <div className={styles.productBox} style={zoom ? ({ "--zoom": zoom } as CSSProperties) : undefined}>
          <SmartImage image={image} fill sizes="(max-width: 900px) 40vw, 260px" className={styles.product} />
        </div>
      </div>
    </Reveal>
  );
}

function FactCard({ k, title, value, image }: NonNullable<PageHeroProps["factCard"]>) {
  const f = k ? fact(k) : null;
  return (
    <Reveal className={styles.factCard} delay={500}>
      {image && <SmartImage image={image} ratio="1/1" sizes="160px" className={styles.factThumb} />}
      <div className={styles.factBody}>
        <p className={styles.factValue}>
          {value ?? (f ? formatFactValue(f) : null)}
          {f && !value && <span className={styles.factUnit}> {f.unit}</span>}
        </p>
        <p className={styles.factTitle}>{title}</p>
        {k && <FactNote keys={[k]} variant="footnote" className={styles.factNote} />}
      </div>
    </Reveal>
  );
}

function TypeHero({ breadcrumb, path, eyebrow, title, lead, cta, secondaryCta, trustLine, kortAntwoord, kortAntwoordFacts, chips, updatedAt, author, placeholderBadge, children, id }: PageHeroProps) {
  return (
    <section id={id} className={styles.type} data-header-tone="light" aria-labelledby="page-title">
      <div className={styles.typeInner}>
        {breadcrumb && <Breadcrumbs items={breadcrumb} currentPath={path} className={styles.typeCrumbs} />}
        <Reveal mode="group" stagger={110} className={styles.typeGrid}>
          <div className={styles.typeAside} data-reveal-item>
            {eyebrow && <p className={styles.typeEyebrow}>{eyebrow}</p>}
            {placeholderBadge && <PlaceholderBadge label={placeholderBadge} />}
          </div>
          <div className={styles.typeMain}>
            <h1 id="page-title" className={styles.titleType} data-reveal-item>
              {title}
            </h1>
            {lead && (
              <div className={`${styles.leadType} desktop-only`} data-reveal-item>
                {lead}
              </div>
            )}
            {chips && chips.length > 0 && (
              <ul className={styles.chips} data-reveal-item>
                {chips.map((c) => (
                  <li key={c}>
                    <Tag size="sm">{c}</Tag>
                  </li>
                ))}
              </ul>
            )}
            {(author || updatedAt) && (
              <div className={styles.byline} data-reveal-item>
                {author ? <AuthorBox member={author} updatedAt={updatedAt ?? ""} compact /> : updatedAt && <UpdatedAt date={updatedAt} />}
              </div>
            )}
            {kortAntwoord && (
              <div className={`${styles.kort} desktop-only`} data-reveal-item>
                <KortAntwoord factKeys={kortAntwoordFacts}>{kortAntwoord}</KortAntwoord>
              </div>
            )}
            {(cta || secondaryCta) && (
              <div className={styles.actions} data-reveal-item>
                {cta && (
                  <CtaPill href={cta.href} variant={cta.variant ?? "ink"} block>
                    {cta.label}
                  </CtaPill>
                )}
                {secondaryCta && (
                  <span className="desktop-only">
                    <TextLink href={secondaryCta.href}>{secondaryCta.label}</TextLink>
                  </span>
                )}
              </div>
            )}
            {trustLine && (
              <div className="desktop-only" data-reveal-item>
                <TrustLine className={styles.trust} />
              </div>
            )}
          </div>
        </Reveal>
        {children && <div className={styles.typeChildren}>{children}</div>}
      </div>
    </section>
  );
}
