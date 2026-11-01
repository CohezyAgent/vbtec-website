// Comparison page body (05 §4) – owner: Builder 1.
// Order: Hero+Kort antwoord (W) · Tabel + kosten (D) · Wanneer A/B (W, pinned) ·
// Wanneer geen van beide (I) · Wat je vaak hoort (W) · Gerelateerd (D rail) · FAQ (W) · Lead (I).
import type { ReactNode } from "react";
import { DataBand, Faq, ImagePanel, MythBuster, PageHero, Rail, StackCards } from "@/components/sections";
import type { DataBandChart } from "@/components/sections/DataBand";
import LeadSection from "@/components/lead/LeadSection";
import { ArticleCard, ComparisonCard, JsonLd, PlaceholderBadge, ProjectCard, ServiceCard } from "@/components/ui";
import { ARTICLES, POSTS, categoryTitle } from "@/content/registry";
import type { ComparisonPage } from "@/content/comparisons";
import { comparisons } from "@/content/comparisons";
import { getProject } from "@/content/projects";
import { reviews, PLACEHOLDER_LABEL } from "@/content/reviews";
import { getFaqs } from "@/content/faqs";
import { relatedLinks, projectLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { article } from "@/lib/schema";
import styles from "./Comparison.module.css";

function chartFor(c: ComparisonPage): DataBandChart | undefined {
  if (!c.chart) return undefined;
  if (c.chart.kind === "line") {
    return {
      type: "line",
      title: c.chart.title,
      props: { series: c.chart.series, xLabels: c.chart.xLabels, summary: c.chart.summary, caption: c.chart.caption, factKeys: c.chart.factKeys },
    };
  }
  return { type: "bar", title: c.chart.title, props: { bars: c.chart.bars, caption: c.chart.caption } };
}

function List({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export default function ComparisonView({ c }: { c: ComparisonPage }) {
  const path = routes.comparison(c.slug);
  const review = reviews.find((r) => r.id === c.reviewId);
  const neither = c.neitherProject ? getProject(c.neitherProject) : undefined;
  const otherComparisons = (c.relatedComparisons ?? []).slice(0, 2);
  const projects = (c.relatedProjects ?? []).map((s) => getProject(s)).filter((p) => !!p);

  const railItems: ReactNode[] = [
    ...otherComparisons.map((s) => <ComparisonCard key={s} slug={s} verdict={comparisons.find((x) => x.slug === s)?.verdict} variant="rail" tone="dark" />),
    ...(c.relatedServices ?? []).slice(0, 2).map((s) => <ServiceCard key={s} slug={s} variant="rail" tone="dark" />),
    ...projects.slice(0, 2).map((p) => <ProjectCard key={p!.slug} project={p!} variant="rail" tone="dark" />),
    ...(c.relatedArticles ?? []).slice(0, 3).map((s) => {
      const a = ARTICLES.find((x) => x.slug === s)!;
      return <ArticleCard key={s} href={routes.article(s)} title={a.shortTitle} eyebrow={`Kennisbank · ${categoryTitle(a.category)}`} variant="rail" tone="dark" />;
    }),
    ...(c.relatedPosts ?? []).slice(0, 1).map((s) => {
      const p = POSTS.find((x) => x.slug === s)!;
      return <ArticleCard key={s} href={routes.post(s)} title={p.shortTitle} eyebrow="Blog" variant="rail" tone="dark" />;
    }),
  ];

  const faqItems = [...c.faq, ...getFaqs(["berekening-kost"])];

  return (
    <>
      <PageHero
        variant="type"
        path={path}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Vergelijken", href: routes.vergelijken() }, { label: c.shortTitle }]}
        eyebrow={`Vergelijking · ${c.options[0]} of ${c.options[1].toLowerCase()}`}
        title={c.h1}
        lead={c.lead}
        kortAntwoord={c.kortAntwoord}
        kortAntwoordFacts={c.sources.slice(0, 4)}
        updatedAt={c.updatedAt}
        cta={{ label: "Laat jouw situatie doorrekenen", href: routes.lead() }}
        secondaryCta={{ label: "Naar de vergelijking", href: "#tabel", variant: "ink" }}
        trustLine
      />

      <DataBand
        id="tabel"
        intro={{ eyebrow: "Naast elkaar", title: "Vergelijking in één tabel", lead: c.tableIntro }}
        mode={c.chart ? "table+chart" : "table"}
        table={{ ...c.table }}
        chart={chartFor(c)}
        urgency={c.urgency}
        assumptions={c.assumptions}
        assumptionsNote={c.assumptionsNote}
        cta={{ label: "Laat jouw situatie doorrekenen", href: routes.lead(), variant: "lime" }}
      />

      <StackCards
        bg="W"
        id="profielen"
        intro={{ eyebrow: "Welk profiel ben jij?", title: `Wanneer kies je ${c.options[0].toLowerCase()}? Wanneer ${c.options[1].toLowerCase()}?` }}
        aside={<p className={styles.doubt}>{c.doubt}</p>}
        cards={[
          { tone: "G", eyebrow: c.options[0], title: c.whenTitleA, body: <List items={c.whenA} /> },
          { tone: "D", eyebrow: c.options[1], title: c.whenTitleB, body: <List items={c.whenB} /> },
          { tone: "I", eyebrow: "De middenweg", title: c.combo.title, body: <p>{c.combo.body}</p>, image: c.combo.image },
          ...(review
            ? [
                {
                  tone: "G" as const,
                  eyebrow: "Iemand met dezelfde twijfel",
                  title: `${review.name} uit ${review.place}`,
                  body: (
                    <blockquote className={styles.quote}>
                      <p>“{review.text}”</p>
                    </blockquote>
                  ),
                  footer: <PlaceholderBadge label={PLACEHOLDER_LABEL} />,
                },
              ]
            : []),
        ]}
      />

      <ImagePanel
        id="geen-van-beide"
        image={c.image}
        align="right"
        eyebrow="Eerlijk is eerlijk"
        title="Wanneer geen van beide?"
        body={<p>{c.whenNeither}</p>}
        secondary={neither ? projectLink(neither.slug, c.neitherLinkLabel) : undefined}
      />

      {c.mythKeys && c.mythKeys.length > 0 && (
        <MythBuster
          id="mythes"
          intro={{ eyebrow: "Wat je vaak hoort", title: c.mythTitle, lead: "Wat je hoort, wat de cijfers zeggen, en wanneer het wél klopt. Dat laatste vinden we minstens zo belangrijk." }}
          keys={c.mythKeys}
        />
      )}

      <Rail
        bg="D"
        kind="mixed"
        id="verder"
        intro={{ eyebrow: "Verder lezen", title: "Andere keuzes, technieken en voorbeelden" }}
        items={railItems}
        viewAll={{ href: routes.vergelijken(), label: "Alle vergelijkingen" }}
      />

      <Faq
        title={`Veelgestelde vragen: ${c.shortTitle.replace(/\?$/, "").toLowerCase()}`}
        items={faqItems}
        sources={c.sources}
        relatedLinks={[
          ...relatedLinks({ services: c.relatedServices, articles: c.relatedArticles, posts: c.relatedPosts }),
          { href: routes.hoeHetWerkt(), label: "Hoe alles samenwerkt in één energiesysteem", kind: "page" },
        ]}
      />

      <LeadSection
        bron={path}
        defaultInteresse={c.interesse}
        heading="Twijfel je nog? Wij rekenen beide scenario's voor jouw woning uit – gratis."
      />

      <JsonLd
        data={article({
          headline: c.h1,
          description: c.description,
          path,
          dateModified: c.updatedAt,
          datePublished: c.updatedAt,
          about: c.shortTitle,
          section: "Vergelijken",
        })}
      />
    </>
  );
}
