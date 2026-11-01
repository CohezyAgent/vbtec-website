import type { ReactNode } from "react";
import type { BreadcrumbItem, Cta, ImageInput, TeamMember } from "@/content/types";
import type { FactKey } from "@/content/facts";
import { fact, formatFactValue } from "@/content/facts";
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

function ImageHero({ breadcrumb, path, eyebrow, title, lead, image, cta, secondaryCta, trustLine, factCard, chips, updatedAt, placeholderBadge, id }: PageHeroProps) {
  return (
    <section id={id} className={styles.frame} data-header-tone="dark" aria-labelledby="page-title">
      <div className={styles.hero}>
        {image && <SmartImage image={image} fill sizes="100vw" preload quality={90} className={styles.bg} />}
        <div className={styles.shade} aria-hidden="true" />
        {breadcrumb && (
          <div className={styles.crumbs}>
            <Breadcrumbs items={breadcrumb} tone="dark" currentPath={path} />
          </div>
        )}
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
              <div className={styles.leadImage} data-reveal-item>
                {lead}
              </div>
            )}
            {chips && chips.length > 0 && (
              <ul className={styles.chips} data-reveal-item>
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
                  <TextLink href={secondaryCta.href} tone="dark">
                    {secondaryCta.label}
                  </TextLink>
                )}
              </div>
            )}
            {trustLine && (
              <div data-reveal-item>
                <TrustLine tone="dark" className={styles.trust} />
              </div>
            )}
            {updatedAt && (
              <div data-reveal-item>
                <UpdatedAt date={updatedAt} tone="dark" />
              </div>
            )}
          </Reveal>
          {factCard && <FactCard {...factCard} />}
        </div>
      </div>
    </section>
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
              <div className={styles.leadType} data-reveal-item>
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
              <div className={styles.kort} data-reveal-item>
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
                {secondaryCta && <TextLink href={secondaryCta.href}>{secondaryCta.label}</TextLink>}
              </div>
            )}
            {trustLine && (
              <div data-reveal-item>
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
