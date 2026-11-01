import type { ReactNode } from "react";
import { MYTHS } from "@/content/facts";
import { getProject } from "@/content/projects";
import { getReviewsByProduct, reviews } from "@/content/reviews";
import type { ServiceContent } from "@/content/services";
import PageHero from "@/components/sections/PageHero";
import StackCards from "@/components/sections/StackCards";
import DataBand from "@/components/sections/DataBand";
import StickySplit, { type StickySplitStep } from "@/components/sections/StickySplit";
import Statement from "@/components/sections/Statement";
import CardRow from "@/components/sections/CardRow";
import ImagePanel from "@/components/sections/ImagePanel";
import ReviewWall from "@/components/sections/ReviewWall";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import HouseDiagram from "@/components/sections/house-diagram/HouseDiagram";
import { FactNote, KortAntwoord } from "@/components/ui/Facts";
import { Tag } from "@/components/ui/Bits";
import { TextLink } from "@/components/ui/CtaPill";
import JsonLd from "@/components/ui/JsonLd";
import { projectLink, postLink, relatedLinks, serviceLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { service as serviceSchema } from "@/lib/schema";
import ServiceSignature from "./ServiceSignature";
import styles from "./ServiceView.module.css";

const paragraphs = (ps: string[]): ReactNode => (
  <>
    {ps.map((p) => (
      <p key={p}>{p}</p>
    ))}
  </>
);

/** Full sales page for one service – section order per docs/spec/05-pages.md §3. */
export default function ServiceView({ s }: { s: ServiceContent }) {
  const path = routes.service(s.slug);
  const ctaLabel = `Bereken of ${s.productPhrase} ${s.productPhrase.startsWith("een ") ? "loont" : "lonen"} voor jou`;
  const myth = s.mythKey ? MYTHS.find((m) => m.key === s.mythKey) : undefined;

  // Row 4 – "Hoe werkt het" + one step per complementary service (mini house diagram).
  const systemSteps: StickySplitStep[] = [
    {
      eyebrow: "Uitleg",
      title: s.howItWorks.title,
      titleAs: "h2",
      body: paragraphs(s.howItWorks.body),
      media: { kind: "image", image: s.howItWorks.image },
      factKeys: s.howItWorks.factKeys,
    },
    ...s.systemSteps.map((step, i, all) => ({
      eyebrow: step.eyebrow,
      title: step.title,
      titleAs: step.titleAs ?? ("h3" as const),
      body: paragraphs(step.body),
      factKeys: step.factKeys,
      media: step.partner
        ? { kind: "node" as const, node: <HouseDiagram mode="mini" highlight={[s.slug, step.partner]} /> }
        : { kind: "image" as const, image: step.image ?? s.image },
      links: [
        ...(step.partner ? [serviceLink(step.partner, `Meer over ${serviceLink(step.partner).label.toLowerCase()}`)] : []),
        ...(i === all.length - 1 ? [{ href: routes.hoeHetWerkt(), label: "Zo werkt je woning als één systeem" }] : []),
      ],
    })),
  ];

  // Row 8 – story: project quote (Builder 3) with the matching review as fallback.
  const project = s.featuredProject ? getProject(s.featuredProject) : undefined;
  const review = reviews.find((r) => r.id === s.story.reviewId);
  const quote = project?.quote
    ? {
        text: project.quote.text,
        name: project.quote.name,
        place: project.place,
        meta: `${project.headline.before} → ${project.headline.after} ${project.headline.unit} (indicatief)`,
      }
    : review
      ? { text: review.text, name: review.name, place: review.place, meta: review.homeType }
      : undefined;

  const againstLink = s.advisesAgainstLink.project
    ? projectLink(s.advisesAgainstLink.project, s.advisesAgainstLink.label)
    : s.advisesAgainstLink.post
      ? postLink(s.advisesAgainstLink.post, s.advisesAgainstLink.label)
      : undefined;

  const faqLinks = [
    ...relatedLinks({
      comparisons: s.relatedComparisons,
      // 01 §5.2: every related project is linked; skip the ones already featured above.
      projects: (s.relatedProjects ?? []).filter((x) => x !== s.featuredProject && x !== s.advisesAgainstLink.project),
      articles: s.relatedArticles,
      posts: s.relatedPosts,
    }),
    { href: routes.team(), label: "Wie rekent jouw installatie uit? Maak kennis met ons team", kind: "page" as const },
  ];

  return (
    <>
      {/* 1 · Hero (I) */}
      <PageHero
        variant="image"
        path={path}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Diensten", href: routes.diensten() }, { label: s.shortTitle }]}
        title={s.h1}
        lead={<p>{s.heroLead}</p>}
        image={s.image}
        cta={{ label: ctaLabel, href: routes.lead() }}
        secondaryCta={{ label: "Hoe past het in je systeem?", href: "#systeem" }}
        trustLine
        factCard={s.heroFact}
        updatedAt={s.updatedAt}
        eyebrow={s.shortTitle}
      />

      {/* 2 · Kort antwoord + Herken je dit? (B · W, pinned) */}
      <StackCards
        id="herken-je-dit"
        bg="W"
        intro={{ eyebrow: "Herken je dit?", title: s.painTitle }}
        aside={<KortAntwoord>{s.kortAntwoord}</KortAntwoord>}
        cards={s.painPoints.map((p) => ({
          eyebrow: p.eyebrow,
          title: p.title,
          body: p.body ? <p>{p.body}</p> : undefined,
          tone: p.tone ?? "G",
          image: p.image,
          factKeys: p.factKeys,
        }))}
      />

      {/* 3 · Kost & opbrengst (H · D) – unique per service */}
      <DataBand
        id="kost-en-opbrengst"
        myth={myth?.myth}
        intro={{ eyebrow: "Kost & opbrengst", title: s.dataBand.title, lead: s.dataBand.lead ? <p>{s.dataBand.lead}</p> : undefined }}
        mode={s.dataBand.mode}
        chart={s.dataBand.chart}
        table={s.dataBand.table}
        stats={s.dataBand.stats}
        extra={s.dataBand.extra}
        urgency={s.dataBand.urgency}
        whenTrue={s.dataBand.whenTrue}
        assumptions={s.dataBand.assumptions}
        assumptionsNote={s.dataBand.assumptionsNote}
        cta={{ label: ctaLabel, href: routes.lead() }}
      >
        {s.dataBand.chartFactKeys && <FactNote keys={s.dataBand.chartFactKeys} tone="dark" />}
      </DataBand>

      {/* 4 · Hoe werkt het & hoe past het in je systeem (D · W, pinned) */}
      <StickySplit id="systeem" bg="W" steps={systemSteps} />

      {/* 5 · Wanneer we het afraden (G · L) */}
      <Statement
        id="wanneer-afraden"
        bg="L"
        eyebrow="Eerlijk is eerlijk"
        text={`Soms raden we ${s.productPhrase} af.`}
        highlight={["af."]}
        heading="Wanneer raden we het af?"
        pills={s.advisesAgainst.map((label) => ({ label, tone: "dark" as const }))}
        support={
          <div className={styles.support}>
            <p>{s.advisesAgainstText}</p>
            {againstLink && <TextLink href={againstLink.href}>{againstLink.label}</TextLink>}
          </div>
        }
      />

      {/* 6 · Wat we voor jou berekenen (A2 · D) */}
      <CardRow
        id="wat-we-berekenen"
        skin="photo"
        bg="D"
        numbered
        intro={{ eyebrow: "Wat we voor jou berekenen", title: "Wat onze ingenieur voor jou uitrekent", lead: <p>{s.calculatesLead}</p> }}
        items={s.calculates.map((c) => ({ title: c.title, body: <p>{c.body}</p>, image: c.image, progress: true }))}
        footer={
          <div className={styles.deliverables}>
            <h3 className={styles.deliverablesTitle}>Wat je krijgt</h3>
            <ul className={styles.tags}>
              {s.deliverables.map((d) => (
                <li key={d}>
                  <Tag tone="ring" size="sm">
                    {d}
                  </Tag>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      {/* 7 · Signature (W) – unique per service */}
      <ServiceSignature s={s} />

      {/* 8 · Klantverhaal (C · I) */}
      {quote && (
        <ImagePanel
          id="klantverhaal"
          image={project?.image ?? s.story.image}
          align="right"
          eyebrow="Een gezin zoals jij"
          title={s.story.title}
          quote={quote}
          body={<p>{s.story.body}</p>}
          cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead() }}
          secondary={project ? projectLink(project.slug, "Bekijk het project") : { href: routes.projecten(), label: "Alle projecten" }}
          placeholderBadge="Voorbeeldproject"
        />
      )}

      {/* 9 · Reviews (J · D, static) */}
      <ReviewWall
        id="reviews"
        bg="D"
        variant="static"
        initial={3}
        intro={{ eyebrow: "Reviews", title: s.reviewsTitle }}
        reviews={getReviewsByProduct(s.slug)}
        filterProduct={s.slug}
      />

      {/* 10 · FAQ + verder lezen + bronnen (W) */}
      <Faq title={`Wat je nog wil weten over ${s.productName}`} items={s.faq} relatedLinks={faqLinks} sources={s.sources} />

      {/* 11 · Lead (I) */}
      <LeadSection bron={path} defaultInteresse={[s.slug]} heading={s.leadHeading} />

      <JsonLd data={serviceSchema({ name: s.title, description: s.description, path, serviceType: s.serviceType })} />
    </>
  );
}
