import { existsSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import type { ImageInput } from "@/content/types";
import { MYTHS } from "@/content/facts";
import { getProject } from "@/content/projects";
import { getReviewsByProduct, reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { eur, fx } from "@/content/services";
import type { ServiceContent } from "@/content/services";
import PageHero from "@/components/sections/PageHero";
import StackCards from "@/components/sections/StackCards";
import DataBand from "@/components/sections/DataBand";
import StickySplit, { type StickySplitStep } from "@/components/sections/StickySplit";
import Statement from "@/components/sections/Statement";
import CardRow from "@/components/sections/CardRow";
import ImagePanel from "@/components/sections/ImagePanel";
import SplitShowcase from "@/components/sections/SplitShowcase";
import ReviewWall from "@/components/sections/ReviewWall";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import LatestPosts from "@/components/sections/LatestPosts";
import HouseDiagram from "@/components/sections/house-diagram/HouseDiagram";
import { FactNote, KortAntwoord } from "@/components/ui/Facts";
import { TextLink } from "@/components/ui/CtaPill";
import JsonLd from "@/components/ui/JsonLd";
import { projectLink, postLink, relatedLinks, serviceLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { service as serviceSchema } from "@/lib/schema";
import ServiceSignature from "./ServiceSignature";
import { SERVICE_SHOWCASE } from "./serviceShowcase";
import styles from "./ServiceView.module.css";

/** Key number on the hero glass card, in plain words (values come from facts.ts). */
const HERO_STAT: Record<string, { value: string; label: string; zoom?: number }> = {
  "lucht-water-warmtepomp": { value: `tot ${fx("premieLuchtWaterCat4", { euro: true, single: true, exact: true })}`, label: "Mijn VerbouwPremie – wij vragen ze voor je aan" },
  "lucht-lucht-warmtepomp": { value: `${fx("scopLuchtLucht", { single: true, exact: true })}×`, label: "zoveel warmte uit elke kWh stroom", zoom: 1.05 },
  zonnepanelen: { value: `${fx("pvOpbrengstPerKwp", { single: true, exact: true })} kWh`, label: "per kWp per jaar op een Vlaams dak", zoom: 1.15 },
  "pvt-panelen": { value: "2 in 1", label: "stroom én warmte van hetzelfde paneel" },
  laadpalen: { value: fx("kostPer100kmZonOverschot", { euro: true, single: true }), label: "per 100 km, geladen op je eigen zonnestroom" },
  thuisbatterij: { value: eur("prijsThuisbatterijPerKwh", true), label: "per kWh opslag, geplaatst – en dalend", zoom: 1.1 },
  omvormers: { value: fx("levensduurOmvormer", { suffix: " jaar", single: true, exact: true }), label: "gaat een omvormer gemiddeld mee" },
};

/** Real VB-TEC project photo (public/images/vbtec) for the photo card in "Kost & opbrengst". */
const vb = (file: string, alt: string, width: number, height: number): ImageInput => ({ src: `/images/vbtec/${file}`, alt, width, height });
const DATA_PHOTO: Record<string, ImageInput> = {
  "lucht-water-warmtepomp": vb("warmtepomp-tuin-unit.jpg", "Buitenunit van een lucht-water warmtepomp in de tuin", 2000, 2000),
  "lucht-lucht-warmtepomp": vb("warmtepomp-architectuur.jpg", "Buitenunit van een lucht-lucht warmtepomp naast een moderne woning", 1280, 1920),
  zonnepanelen: vb("installateurs-panelen.jpg", "Installateurs van VB-TEC leggen zonnepanelen op een dak", 2000, 1333),
  "pvt-panelen": vb("dakrij-zonnepanelen-luchtfoto.jpg", "Rij woningen met panelen op het dak, van bovenaf", 1600, 1200),
  thuisbatterij: vb("app-smartphone-verbruik.jpg", "Verbruik en batterij volgen in de app op een smartphone", 1920, 1280),
  omvormers: vb("app-tablet.jpg", "Opbrengst van de omvormer bekijken op een tablet", 1280, 1920),
  laadpalen: vb("laadpaal-oprit-auto.jpg", "Elektrische auto aan de laadpaal op de oprit", 1920, 1280),
};

/** Studio product photo for the hero glass card (public/images/products), else the service photo. */
function productImage(slug: string, name: string, fallback: ImageInput): ImageInput {
  const src = `/images/products/product-${slug}.jpg`;
  if (!existsSync(path.join(process.cwd(), "public", src))) return fallback;
  return { src, alt: name, width: 1400, height: 1050 };
}

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
  const showcase = SERVICE_SHOWCASE[s.slug];
  // Service-specific deliverables first, then the shared ones (max. 5 checklist rows).
  const showcasePoints = [...s.deliverables.slice(5), ...s.deliverables.slice(0, 5)].slice(0, 5).map((label) => ({ label }));
  const myth = s.mythKey ? MYTHS.find((m) => m.key === s.mythKey) : undefined;

  // Row 4 – "Hoe werkt het" + one step per complementary service (mini house diagram).
  const systemSteps: StickySplitStep[] = [
    {
      eyebrow: "Uitleg",
      title: s.howItWorks.title,
      titleAs: "h2",
      // Two paragraphs max: the pinned split has one screen of height per step.
      body: paragraphs(s.howItWorks.body.slice(0, 2)),
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
        showcase={{
          image: productImage(s.slug, s.shortTitle, s.image),
          value: HERO_STAT[s.slug]?.value ?? String(s.heroFact?.value ?? ""),
          label: HERO_STAT[s.slug]?.label ?? s.heroFact?.title.split(" – ")[0] ?? "",
          zoom: HERO_STAT[s.slug]?.zoom,
          avatars: getReviewsByProduct(s.slug).slice(0, 4).map((r) => r.name.charAt(0)),
          avatarsLabel: `${site.calculationsCount.toLocaleString("nl-BE")}+ gezinnen berekend`, // PLACEHOLDER count
        }}
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

      {/* 2b · Visual break: what you get + key numbers on a photo */}
      <SplitShowcase
        id="in-een-oogopslag"
        badge="Wat je krijgt"
        title={showcase.title}
        points={showcasePoints}
        cta={{ label: ctaLabel, href: routes.lead(), variant: "ink" }}
        image={showcase.image}
        chip={showcase.chip}
        stats={showcase.stats}
        tone="lilac"
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
        image={DATA_PHOTO[s.slug] ?? productImage(s.slug, s.shortTitle, s.image)}
      >
        {s.dataBand.chartFactKeys && <FactNote keys={s.dataBand.chartFactKeys} tone="dark" variant="footnote" />}
      </DataBand>

      {/* 4 · Hoe werkt het & hoe past het in je systeem (D · W, pinned) */}
      <StickySplit id="systeem" bg="W" variant="opposite" steps={systemSteps} />

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
          result={project?.headline}
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

      {/* 10 · Lead (I) */}
      <LeadSection bron={path} defaultInteresse={[s.slug]} heading={s.leadHeading} />

      {/* 11 · Blog (W) */}
      <LatestPosts id="blog" />

      {/* 12 · FAQ + verder lezen + bronnen (W) */}
      <Faq title={`Wat je nog wil weten over ${s.productName}`} items={s.faq} relatedLinks={faqLinks} sources={s.sources} />

      <JsonLd data={serviceSchema({ name: s.title, description: s.description, path, serviceType: s.serviceType })} />
    </>
  );
}
