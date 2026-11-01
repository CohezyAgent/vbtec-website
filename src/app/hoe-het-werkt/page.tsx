import { CardRow, DataBand, Faq, ImagePanel, PageHero, Statement, StickySplit } from "@/components/sections";
import HouseDiagram from "@/components/sections/house-diagram/HouseDiagram";
import LeadSection from "@/components/lead/LeadSection";
import { JsonLd, Section, SectionIntro } from "@/components/ui";
import { getProject } from "@/content/projects";
import { CHAPTERS, DIAGRAM_INTRO, EXAMPLE, FAQ, HERO, HONEST, LEAD_HEADING, PROFILES, STORY_PROJECT, TRAP, UPDATED_AT } from "@/content/hoe-het-werkt";
import { comparisonLink, projectLink, relatedLinks, serviceLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { article } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { v } from "@/content/comparisons";
import Link from "next/link";
import styles from "./hoe-het-werkt.module.css";

// /hoe-het-werkt – pillar (05 §2): Hero(I) · Waar komt de winst vandaan?(W) · Huisdiagram(D) ·
// Hoofdstukken(W, pinned) · Rekenvoorbeeld(D) · Profielen(W) · Eerlijk(L) · Klantverhaal(I) · FAQ(W) · Lead(I).
const PATH = routes.hoeHetWerkt();

export const metadata = buildMetadata({
  title: "Hoe warmtepomp, zonnepanelen & batterij samenwerken",
  description:
    "Zie hoe zonnepanelen, PVT, warmtepomp, batterij en laadpaal samen je factuur verlagen – dag, nacht en winter. Met Vlaamse cijfers en een gratis berekening.",
  path: PATH,
  type: "article",
  modifiedTime: UPDATED_AT,
});

export default function HoeHetWerkt() {
  const story = getProject(STORY_PROJECT);
  return (
    <>
      <PageHero
        variant="image"
        path={PATH}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Hoe het werkt" }]}
        eyebrow={HERO.eyebrow}
        title={HERO.title}
        lead={HERO.lead}
        image="jaren70-woning"
        cta={{ label: "Bereken wat jouw woning kan besparen", href: routes.lead() }}
        secondaryCta={{ label: "Naar het huisdiagram", href: "#diagram" }}
        trustLine
        factCard={{ title: HERO.factTitle, value: HERO.factValue }}
        updatedAt={UPDATED_AT}
      />

      <Statement
        bg="W"
        id="winst"
        text={TRAP.statement}
        heading={TRAP.heading}
        highlight={["samen."]}
        kortAntwoord={TRAP.kortAntwoord}
        support={
          <>
            {TRAP.support.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </>
        }
      />

      <Section bg="D" id="diagram" labelledBy="diagram-title">
        <SectionIntro eyebrow={DIAGRAM_INTRO.eyebrow} title={DIAGRAM_INTRO.title} lead={DIAGRAM_INTRO.lead} tone="dark" titleId="diagram-title" />
        <div className={styles.diagram}>
          <HouseDiagram mode="full" cta={{ label: "Gratis berekening", href: routes.lead(), variant: "lime" }} />
        </div>
      </Section>

      <StickySplit
        bg="W"
        id="hoofdstukken"
        steps={CHAPTERS.map((c) => ({
          id: c.id,
          eyebrow: c.eyebrow,
          title: c.title,
          titleAs: "h2" as const,
          body: (
            <>
              {c.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </>
          ),
          factKeys: c.factKeys,
          links: c.links.map((l) => serviceLink(l.slug, `Meer over ${serviceLink(l.slug).label.toLowerCase()}`)),
          media: { kind: "node" as const, node: <HouseDiagram mode="mini" highlight={c.diagram.highlight} scenes={c.diagram.scenes} /> },
        }))}
      />

      <DataBand
        id="rekenvoorbeeld"
        intro={{ eyebrow: EXAMPLE.eyebrow, title: EXAMPLE.title, lead: EXAMPLE.lead }}
        mode="chart"
        stats={[
          { k: "zelfverbruikMet", label: `Zelfverbruik met slimme sturing (zonder: ${v("zelfverbruikZonder")}%)`, suffix: "%" },
          { k: "capaciteitstariefPerKw", label: "Per kW lagere maandpiek, per jaar", prefix: "€ " },
          { k: "negatievePrijsUren2025", label: "Uren met negatieve stroomprijs in 2025" },
          { k: "voorbeeldBesparingWarmtepomp", label: "Gas eruit: besparing per jaar met een warmtepomp", prefix: "€ " },
        ]}
        chart={{ type: "stacked", title: "Energiekost per jaar, voorbeeldgezin (indicatief)", props: { rows: EXAMPLE.rows, unit: " €", caption: EXAMPLE.caption } }}
        whenTrue={EXAMPLE.whenTrue}
        assumptions={EXAMPLE.assumptions}
        assumptionsNote={EXAMPLE.assumptionsNote}
        cta={{ label: "Gratis berekening", href: routes.lead(), variant: "lime" }}
      />

      <CardRow
        skin="photo"
        bg="W"
        id="profielen"
        intro={{ eyebrow: PROFILES.eyebrow, title: PROFILES.title, lead: PROFILES.lead }}
        items={PROFILES.items.map((p) => ({ title: p.title, body: p.body, image: p.image, tags: p.tags, href: routes.project(p.project) }))}
        footer={
          <p className={styles.profilesNote}>
            Benieuwd naar de cijfers? Bekijk de voorbeeldprojecten in{" "}
            {PROFILES.items.map((p, i) => (
              <span key={p.project}>
                {i > 0 && (i === PROFILES.items.length - 1 ? " en " : ", ")}
                <Link href={projectLink(p.project).href}>{projectLink(p.project).label.replace(/^.* in /, "")}</Link>
              </span>
            ))}
            .
          </p>
        }
      />

      <Statement
        bg="L"
        id="eerlijk"
        eyebrow={HONEST.eyebrow}
        text={HONEST.text}
        pills={HONEST.comparisons.map((s) => {
          const l = comparisonLink(s);
          return { label: l.label, href: l.href };
        })}
      />

      {story && (
        <ImagePanel
          id="klantverhaal"
          image="nieuwbouw-gezin"
          align="left"
          eyebrow="Klantverhaal"
          title="Hoe een jong gezin in Leuven all-electric ging"
          quote={{ text: story.quote.text, name: story.quote.name, place: story.place, meta: story.homeType }}
          placeholderBadge="Voorbeeldproject"
          cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead(), variant: "lime" }}
          secondary={projectLink(story.slug, "Bekijk het project")}
        />
      )}

      <Faq
        title="Vragen over hoe alles samenwerkt"
        items={FAQ}
        relatedLinks={[
          ...relatedLinks({
            comparisons: ["gasketel-vs-warmtepomp", "met-of-zonder-thuisbatterij"],
            articles: ["wat-is-het-capaciteitstarief", "injectietarief-en-zelfverbruik", "dynamisch-tarief-uitgelegd"],
          }),
          { href: routes.hoeWeWerken(), label: "Hoe we werken: van berekening tot installatie", kind: "page" as const },
        ]}
        sources={[...new Set(CHAPTERS.flatMap((c) => c.factKeys).concat(EXAMPLE.assumptions))]}
      />

      <LeadSection bron={PATH} heading={LEAD_HEADING} />

      <JsonLd
        data={article({
          headline: HERO.title,
          description: "Hoe zonnepanelen, PVT, warmtepomp, thuisbatterij, omvormer en laadpaal samen je energiefactuur verlagen, met Vlaamse cijfers.",
          path: PATH,
          datePublished: UPDATED_AT,
          dateModified: UPDATED_AT,
          about: "Energiesysteem van een woning",
          section: "Hoe het werkt",
        })}
      />
    </>
  );
}
