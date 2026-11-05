import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGES, serviceEntry, comparisonEntry, SERVICE_TAGLINES } from "@/content/registry";
import { resolveImage } from "@/content/images";
import { allProjects, getProject, projectFaq, type ProjectDetail } from "@/content/projects";
import { getFaqs } from "@/content/faqs";
import type { Block } from "@/content/types";
import { relatedLinks } from "@/lib/links";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { article } from "@/lib/schema";
import { slugify } from "@/lib/format";
import PageHero from "@/components/sections/PageHero";
import Prose from "@/components/sections/Prose";
import ArticleBody from "@/components/sections/ArticleBody";
import DataBand from "@/components/sections/DataBand";
import ImagePanel from "@/components/sections/ImagePanel";
import Rail from "@/components/sections/Rail";
import CardRow, { type CardRowItem } from "@/components/sections/CardRow";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import JsonLd from "@/components/ui/JsonLd";
import SmartImage from "@/components/ui/SmartImage";
import ScenarioTable from "@/components/content/ScenarioTable";
import styles from "@/components/content/ProjectParts.module.css";
import LatestPosts from "@/components/sections/LatestPosts";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return buildMetadata({ title: p.seoTitle ?? p.title, description: p.seoDescription ?? p.description, path: routes.project(p.slug), type: "article", modifiedTime: p.updatedAt });
}

export default function ProjectPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

const H = {
  situatie: "De situatie",
  uitdaging: "De uitdaging",
  twijfel: "Hun twijfel",
  berekend: "Wat we berekenden",
};

async function ProjectContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  return <ProjectView p={p} />;
}

function ProjectView({ p }: { p: ProjectDetail }) {
  const path = routes.project(p.slug);
  const toc = [H.situatie, H.uitdaging, H.twijfel, H.berekend, ...(p.whyNot ? [p.whyNot.title] : [])].map((label) => ({ id: slugify(label), label }));
  const para = (texts: string[]): Block[] => texts.map((text) => ({ type: "p", text }));
  const others = (p.relatedProjects ?? []).map((s) => getProject(s)).filter((x): x is ProjectDetail => Boolean(x));
  const firstComparison = p.relatedComparisons?.[0];
  const faq = [...projectFaq(p), ...getFaqs(["berekening-kost"])];

  const alsoItems: CardRowItem[] = [
    {
      title: serviceEntry(p.products[0]).shortTitle,
      body: `${SERVICE_TAGLINES[p.products[0]]}. Zo werkt het, en wanneer het voor jou loont.`,
      href: routes.service(p.products[0]),
      image: "step-install",
      tags: ["Dienst"],
    },
    ...(firstComparison
      ? [
          {
            title: comparisonEntry(firstComparison).shortTitle,
            body: "De twee opties eerlijk naast elkaar, met cijfers en het antwoord op 'wanneer niet'.",
            href: routes.comparison(firstComparison),
            image: "step-design" as const,
            tags: ["Vergelijking"],
          },
        ]
      : []),
    ...(others[0]
      ? [
          {
            title: others[0].shortTitle,
            body: `${others[0].family}: ${others[0].headline.before} → ${others[0].headline.after} ${others[0].headline.unit} (indicatief).`,
            href: routes.project(others[0].slug),
            image: "step-assessment" as const,
            tags: ["Voorbeeldproject"],
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        variant="image"
        path={path}
        breadcrumb={[
          { label: PAGES.home.shortTitle, href: routes.home() },
          { label: PAGES.projecten.shortTitle, href: routes.projecten() },
          { label: p.shortTitle },
        ]}
        eyebrow={`${p.family} · ${p.place}`}
        placeholderBadge="Voorbeeldproject"
        title={p.h1}
        lead={p.lead}
        image={p.image}
        chips={[p.homeType, ...(p.buildYear ? [`Bouwjaar ${p.buildYear}`] : []), ...p.products.map((s) => serviceEntry(s).shortTitle)]}
        cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead() }}
        secondaryCta={{ label: "Lees hoe we rekenden", href: "#verhaal" }}
        factCard={{
          title: `Energiefactuur ${p.headline.unit.replace("/", "per ")} – indicatief, voorbeeldproject`,
          value: (
            <>
              {p.headline.before} → {p.headline.after}
            </>
          ),
        }}
      />

      <Prose id="verhaal" toc={toc} updatedAt={p.updatedAt}>
        <p>{p.summary}</p>
        <h2 id={slugify(H.situatie)}>{H.situatie}</h2>
        <ArticleBody blocks={para(p.situation)} />
        <h2 id={slugify(H.uitdaging)}>{H.uitdaging}</h2>
        <ArticleBody blocks={para(p.challenge)} />
        <h2 id={slugify(H.twijfel)}>{H.twijfel}</h2>
        <blockquote className={styles.doubt}>
          <span className={styles.doubtLabel}>Wat ze dachten vóór het gesprek</span>
          {p.doubt}
        </blockquote>
        <h2 id={slugify(H.berekend)}>{H.berekend}</h2>
        <ArticleBody blocks={para(p.calculated)} />
        <ScenarioTable scenarios={p.scenarios} caption={`Scenario's die we voor ${p.family.toLowerCase()} in ${p.place} naast elkaar legden`} />
        {p.whyNot && (
          <div className={styles.honest}>
            <h2 id={slugify(p.whyNot.title)}>{p.whyNot.title}</h2>
            {p.whyNot.paragraphs.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        )}
        <dl className={styles.facts}>
          <div>
            <dt>Investering</dt>
            <dd>{p.install.investering}</dd>
          </div>
          <div>
            <dt>Premie & btw</dt>
            <dd>{p.install.premie}</dd>
          </div>
          <div>
            <dt>Installatie</dt>
            <dd>{p.install.duur}</dd>
          </div>
          <div>
            <dt>Terugverdientijd</dt>
            <dd>{p.install.terugverdientijd}</dd>
          </div>
        </dl>
      </Prose>

      <DataBand
        id="resultaat"
        mode="stats"
        intro={{ eyebrow: "Het resultaat", title: `Wat het ${p.family.toLowerCase()} in ${p.place} oplevert`, lead: <p className={styles.resultNote}>{p.resultNote}</p> }}
        stats={p.stats.map((s) => ({ k: s.value, label: s.label, prefix: s.prefix, suffix: s.suffix, decimals: s.decimals }))}
        assumptions={["stroomprijsAllIn", "gasprijsAllIn", "injectievergoeding", "capaciteitstariefPerKw", "pvOpbrengstPerKwp", "scopRekenwaarde"]}
        assumptionsNote="Voorbeeldproject: de bedragen zijn berekend met de rekenwaarden hieronder en vlakke prijzen, niet gemeten bij een echte klant."
        whenTrue={p.advisedAgainst ? "Een batterij kan voor dit gezin later wél lonen: met een elektrische auto, een warmtepomp of een dynamisch contract. Dan rekenen we opnieuw." : undefined}
        cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead() }}
      />

      <ImagePanel
        id="in-hun-woorden"
        image={p.quoteImage}
        align={p.advisedAgainst ? "left" : "right"}
        eyebrow="Voorbeeldproject"
        title="In hun woorden"
        quote={{ text: p.quote.text, name: p.quote.name.split(",")[0], place: p.place, meta: p.homeType }}
        placeholderBadge="Voorbeeldproject"
      />

      <Rail
        id="technieken"
        bg="W"
        kind="image"
        intro={{ eyebrow: "Gebruikte technieken", title: "Wat er nu in en op hun woning zit", lead: "Elke component werd gekozen op basis van de berekening, niet uit een standaardpakket." }}
        items={p.setup.map((t) => (
          <figure key={t.title} className={styles.tech}>
            <SmartImage image={t.image} ratio="1/1" sizes="(max-width: 900px) 82vw, 26vw" className={styles.techMedia} />
            <figcaption>
              <h3 className={styles.techTitle}>{t.title}</h3>
              <p className={styles.techBody}>{t.detail}</p>
            </figcaption>
          </figure>
        ))}
      />

      <CardRow id="ook-interessant" skin="photo" bg="D" intro={{ eyebrow: "Ook interessant", title: "Verder kijken: de techniek, de keuze, een ander gezin" }} items={alsoItems} />

      <LeadSection bron={path} defaultInteresse={[...p.products]} heading="Zo'n berekening voor jouw woning?" />

      <LatestPosts />

      <Faq
        items={faq}
        title="Vragen over dit project"
        relatedLinks={relatedLinks({ services: p.products, projects: others.slice(1).map((o) => o.slug), articles: (p.relatedArticles ?? []).slice(0, 1), posts: p.relatedPosts })}
        relatedTitle="Gebruikte producten en achtergrond"
      />

      <JsonLd
        data={article({
          headline: p.h1,
          description: p.description,
          path,
          dateModified: p.updatedAt,
          image: resolveImage(p.image).src,
          about: `Voorbeeldproject: ${p.title}`,
          section: "Projecten",
        })}
      />
    </>
  );
}
