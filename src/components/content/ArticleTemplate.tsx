import type { ReactNode } from "react";
import type { Article, BreadcrumbItem, FactKey, Post } from "@/content/types";
import { categoryTitle, SERVICE_TAGLINES } from "@/content/registry";
import { resolveImage } from "@/content/images";
import { getTeamMember, isPlaceholder as teamIsPlaceholder } from "@/content/team";
import { articlesBySlugs } from "@/content/kennisbank";
import { postsBySlugs } from "@/content/blog";
import { relatedLinks } from "@/lib/links";
import { routes } from "@/lib/routes";
import { article as articleSchema } from "@/lib/schema";
import { inline } from "@/components/sections/ArticleBody";
import ArticleBody, { buildToc } from "@/components/sections/ArticleBody";
import PageHero from "@/components/sections/PageHero";
import Prose from "@/components/sections/Prose";
import Rail from "@/components/sections/Rail";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import { ArticleCard, ComparisonCard, ServiceCard } from "@/components/ui/cards";
import { AuthorBox, InlineCta } from "@/components/ui/Content";
import JsonLd from "@/components/ui/JsonLd";
import styles from "./ArticleTemplate.module.css";

type Props =
  | { kind: "article"; item: Article; path: string; breadcrumb: BreadcrumbItem[] }
  | { kind: "post"; item: Post; path: string; breadcrumb: BreadcrumbItem[] };

/** Fact keys mentioned in the Kort antwoord (shown as the footnote under the box). */
function kortFacts(sources: FactKey[] | undefined): FactKey[] | undefined {
  return sources && sources.length ? sources.slice(0, 3) : undefined;
}

/**
 * Builder 3 – shared detail template for /blog/[slug] and /kennisbank/[slug] (05 §6.2):
 * Hero (type, W) → Prose body (W, hairline) → related Rail (D) → FAQ (W) → Lead (I).
 */
export default function ArticleTemplate(props: Props) {
  const { item, path, breadcrumb, kind } = props;
  const author = getTeamMember(item.author);
  const eyebrow = kind === "article" ? categoryTitle(props.item.category) : props.item.category;
  const relArticles = articlesBySlugs(item.relatedArticles).slice(0, 2);
  const relPosts = postsBySlugs(item.relatedPosts).slice(0, 2);
  const services = (item.relatedServices ?? []).slice(0, 2);
  const comparisons = (item.relatedComparisons ?? []).slice(0, 1);

  const railItems: ReactNode[] = [
    ...relArticles.map((a) => (
      <ArticleCard key={a.slug} href={routes.article(a.slug)} title={a.shortTitle} excerpt={a.excerpt} eyebrow={`Kennisbank · ${categoryTitle(a.category)}`} image={a.image} tone="dark" />
    )),
    ...relPosts.map((p) => <ArticleCard key={p.slug} href={routes.post(p.slug)} title={p.shortTitle} excerpt={p.excerpt} eyebrow={`Blog · ${p.category}`} image={p.image} date={p.publishedAt} tone="dark" />),
    ...services.map((s) => <ServiceCard key={s} slug={s} body={SERVICE_TAGLINES[s]} variant="rail" tone="dark" />),
    ...comparisons.map((c) => <ComparisonCard key={c} slug={c} variant="rail" tone="dark" />),
  ];

  // 01 §5.1: kennisbank + blog link to the pillar page and (where set) one project.
  const faqLinks = [
    { href: routes.hoeHetWerkt(), label: "Hoe je woning één energiesysteem wordt", kind: "page" as const },
    ...relatedLinks({ projects: (item.relatedProjects ?? []).slice(0, 1), comparisons }),
  ];
  const image = item.image ? resolveImage(item.image).src : undefined;

  return (
    <>
      <PageHero
        variant="type"
        path={path}
        breadcrumb={breadcrumb}
        eyebrow={eyebrow}
        title={item.h1}
        lead={item.excerpt}
        author={author}
        updatedAt={item.updatedAt}
        kortAntwoord={item.kortAntwoord ? inline(item.kortAntwoord) : undefined}
        kortAntwoordFacts={kortFacts(item.sources)}
      />

      <Prose toc={buildToc(item.body)} hairline sources={item.sources}>
        <InlineCta
          title="Wat betekent dit voor jouw factuur?"
          body="Laat het gratis uitrekenen door een ingenieur, met jouw verbruik en jouw woning."
          cta={{ label: "Gratis berekening", href: routes.lead() }}
        />
        <ArticleBody blocks={item.body} faqSchema={false} />
        {author && (
          <div className={styles.author}>
            <p className={styles.authorLabel}>Geschreven door</p>
            <AuthorBox member={author} updatedAt={item.updatedAt} />
          </div>
        )}
      </Prose>

      {railItems.length > 0 && (
        <Rail
          id="verder-lezen"
          bg="D"
          kind="mixed"
          intro={{ eyebrow: "Verder lezen", title: kind === "article" ? "Wat je hierna wil weten" : "Meer over dit onderwerp" }}
          items={railItems}
          viewAll={kind === "article" ? { href: routes.kennisbank(), label: "Alle kennisbankartikels" } : { href: routes.blog(), label: "Alle blogartikels" }}
        />
      )}

      {item.faq && item.faq.length >= 3 && (
        <Faq
          items={item.faq}
          title={kind === "article" ? "Veelgestelde vragen" : "Wat lezers ons vragen"}
          eyebrow={kind === "article" ? "Kort en eerlijk" : "Veelgestelde vragen"}
          relatedLinks={faqLinks}
          relatedTitle="Ook interessant"
        />
      )}

      <LeadSection bron={path} defaultInteresse={item.relatedServices ? [...item.relatedServices] : undefined} heading="Je hebt nu de theorie. Wil je de cijfers voor jouw woning?" />

      <JsonLd
        data={articleSchema({
          type: kind === "post" ? "BlogPosting" : "Article",
          headline: item.h1,
          description: item.description,
          path,
          datePublished: item.publishedAt,
          dateModified: item.updatedAt,
          image,
          author,
          authorIsPlaceholder: teamIsPlaceholder,
          about: kind === "article" ? item.shortTitle : undefined,
          section: eyebrow,
        })}
      />
    </>
  );
}
