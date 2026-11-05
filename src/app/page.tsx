import Hero from "@/components/hero/Hero";
import StickToBottom from "@/components/layout/StickToBottom";
import MissionSection from "@/components/mission/MissionSection";
import ProductsSection from "@/components/products/ProductsSection";
import ServicesSection from "@/components/services/ServicesSection";
import LeadSection from "@/components/lead/LeadSection";
import { BentoShowcase, DataBand, Faq, ImagePanel, ReviewWall, SplitShowcase, StackCards, Statement } from "@/components/sections";
import HouseDiagram from "@/components/sections/house-diagram/HouseDiagram";
import { JsonLd, Section, SectionIntro } from "@/components/ui";
import { comparisonLink } from "@/lib/links";
import { buildMetadata } from "@/lib/seo";
import { localBusiness } from "@/lib/schema";
import { routes } from "@/lib/routes";
import { featuredProjects } from "@/content/projects";
import { SERVICES } from "@/content/registry";
import { reviews } from "@/content/reviews";
import { v } from "@/content/comparisons";
import { DATA, DOUBT, HOME_FAQ, LEAD_HEADING, MYTH, PAIN, PROJECTS_BENTO, PVT, REVIEWS_INTRO, SMART_SPLIT, SYSTEM_TEASER } from "@/content/home";
import { BatteryIcon, BoltIcon, EyeIcon, FanIcon, SolarPanelIcon, SunIcon } from "@/components/ui/icons";
import styles from "./home.module.css";

// Home – section order per docs/spec/05-pages.md §1 (00 §2.6):
// Hero(I) · Products(W strip) · Herken je dit?(D, pinned) · Mission(W) + Services slide-over(D) ·
// Mythe(W) · Cijfers(D) · PVT(I) · Hoe het samenwerkt(W) · Projecten(D) · Reviews(W) ·
// Twijfel je nog?(L) · FAQ(W) · Lead(I).
export const metadata = buildMetadata({
  title: "VB-TEC | Je energiefactuur zo dicht mogelijk bij €0",
  absoluteTitle: true,
  description:
    "Warmtepomp, zonnepanelen, PVT of batterij? Onze ingenieurs berekenen welke combinatie jouw gezin zo dicht mogelijk bij €0 brengt. Eerlijk, ook als het niet loont.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <ProductsSection />

      <StackCards
        bg="D"
        id="herken-je-dit"
        intro={{ eyebrow: PAIN.eyebrow, title: PAIN.title, lead: PAIN.lead }}
        cards={PAIN.cards.map((c) => ({ tone: c.tone, eyebrow: c.eyebrow, title: c.title, body: <p>{c.body}</p>, image: c.image, factKeys: c.factKeys }))}
        aside={<p className={styles.painClose}>Iedereen zegt iets anders. Wij rekenen het uit.</p>}
      />

      {/* Mission holds still at its end while the green Services section slides over it. */}
      <div>
        <StickToBottom>
          <MissionSection />
        </StickToBottom>
        <ServicesSection />
      </div>

      <Statement
        bg="W"
        id="mythe"
        eyebrow={MYTH.eyebrow}
        text={MYTH.quote}
        heading={MYTH.heading}
        highlight={["gasketel.”"]}
        pills={MYTH.pills.map((label) => ({ label }))}
        scrub
      />

      <SplitShowcase
        id="zon-eerst"
        badge={SMART_SPLIT.badge}
        title={SMART_SPLIT.title}
        lead={SMART_SPLIT.lead}
        points={[
          { icon: SolarPanelIcon, label: SMART_SPLIT.points[0] },
          { icon: FanIcon, label: SMART_SPLIT.points[1] },
          { icon: BatteryIcon, label: SMART_SPLIT.points[2] },
          { icon: EyeIcon, label: SMART_SPLIT.points[3] },
        ]}
        cta={{ label: "Bekijk hoe het werkt", href: routes.hoeHetWerkt(), variant: "ink" }}
        image="omvormer-app-klant"
        chip={SMART_SPLIT.chip}
        stats={[
          { icon: SunIcon, value: 32.4, decimals: 1, suffix: " kWh", label: "Productie" },
          { icon: BoltIcon, value: 21.8, decimals: 1, suffix: " kWh", label: "Verbruik" },
          { icon: BatteryIcon, value: 86, suffix: "%", label: "Batterij", meter: 0.86 },
        ]}
      />

      <DataBand
        id="cijfers"
        intro={{ eyebrow: DATA.eyebrow, title: DATA.title, lead: DATA.lead }}
        mode="chart"
        chart={{
          type: "bar",
          title: "Kost per kWh nuttige warmte (indicatief)",
          props: {
            bars: [
              { label: "Gasketel", value: "warmtekostGasPerKwhWarmte", display: `${v("warmtekostGasPerKwhWarmte", { scale: 100, dec: 1 })} c/kWh`, series: "base" },
              { label: "Warmtepomp op netstroom", value: "warmtekostWarmtepompPerKwhWarmte", display: `${v("warmtekostWarmtepompPerKwhWarmte", { scale: 100, dec: 1 })} c/kWh`, series: "good" },
            ],
            caption: "Met eigen zonnestroom, die je anders voor enkele centen zou injecteren, wordt warmte uit een warmtepomp nog veel goedkoper.",
          },
        }}
        stats={[
          { k: "breakEvenScop", label: "SCOP waarboven een warmtepomp goedkoper is dan gas" },
          { k: "voorbeeldBesparingWarmtepomp", label: "Besparing per jaar in ons rekenvoorbeeld (zonder zonnepanelen)", prefix: "€ " },
          { k: "btwWarmtepomp", label: "Btw op een warmtepomp tegenover een nieuwe gasketel", display: `${v("btwWarmtepomp")}% vs ${v("btwGasketel")}%` },
        ]}
        urgency={[
          { k: "ets2Start", label: "Europese CO₂-prijs op gas (ETS2) vanaf" },
          { k: "verbodGasNieuwbouw", label: "Geen gasaansluiting meer bij nieuwbouw sinds" },
        ]}
        assumptions={["gasprijsAllIn", "stroomprijsAllIn", "rendementGascondensatieketel", "scopRekenwaarde", "warmtekostGasPerKwhWarmte", "warmtekostWarmtepompPerKwhWarmte", "breakEvenScop", "voorbeeldBesparingWarmtepomp", "btwWarmtepomp", "btwGasketel"]}
        assumptionsNote="Kost per kWh warmte = energieprijs gedeeld door het rendement: gas met een condensatieketel, stroom met de SCOP van een goed ontworpen warmtepomp. Vlakke prijzen, gemiddeld contract."
        cta={{ label: "Bereken wat jouw woning kan besparen", href: routes.lead(), variant: "lime" }}
      />

      <ImagePanel
        id="pvt"
        image="pvt-dak-detail"
        align="right"
        eyebrow={PVT.eyebrow}
        title={PVT.title}
        body={<p>{PVT.body}</p>}
        cta={{ label: "Ontdek PVT-panelen", href: routes.service("pvt-panelen"), variant: "lime" }}
        secondary={comparisonLink("zonnepanelen-vs-pvt-panelen", "PVT of gewone panelen?")}
      />

      <Section bg="W" id="hoe-het-samenwerkt" labelledBy="systeem-title">
        <SectionIntro eyebrow={SYSTEM_TEASER.eyebrow} title={SYSTEM_TEASER.title} lead={SYSTEM_TEASER.lead} titleId="systeem-title" />
        <div className={styles.teaser}>
          <HouseDiagram mode="teaser" cta={{ label: "Bekijk hoe het werkt", href: routes.hoeHetWerkt(), variant: "ink" }} />
        </div>
      </Section>

      <BentoShowcase
        id="projecten"
        eyebrow={PROJECTS_BENTO.eyebrow}
        title={PROJECTS_BENTO.title}
        body={PROJECTS_BENTO.body}
        cta={{ label: "Alle projecten", href: routes.projecten(), variant: "white" }}
        slides={featuredProjects.map((p) => {
          const before = Number(p.headline.before.replace(/\D/g, ""));
          const after = Number(p.headline.after.replace(/\D/g, ""));
          const drop = Math.round((1 - after / before) * 100);
          return {
            image: p.image,
            kicker: `${p.place} · ${p.homeType}`,
            title: p.shortTitle,
            href: routes.project(p.slug),
            metric: { label: "Energiefactuur na", value: after, prefix: "€ ", suffix: p.headline.unit, trend: `was ${p.headline.before}` },
            card: {
              title: "Wat we plaatsten",
              chips: p.products.map((slug) => SERVICES.find((x) => x.slug === slug)?.shortTitle ?? slug),
              progressLabel: `${drop}% lager per maand`,
              progress: drop / 100,
            },
          };
        })}
        side={{ ...PROJECTS_BENTO.side, image: "ingenieur-aan-tafel", href: routes.hoeWeWerken() }}
        note={PROJECTS_BENTO.note}
      />

      <ReviewWall bg="W" variant="marquee" id="reviews" intro={REVIEWS_INTRO} reviews={reviews} />

      <Statement
        bg="L"
        id="twijfel"
        eyebrow={DOUBT.eyebrow}
        text={DOUBT.text}
        pills={[
          ...DOUBT.comparisons.map((s) => {
            const l = comparisonLink(s);
            return { label: l.label, href: l.href };
          }),
          { label: "Alle vergelijkingen", href: routes.vergelijken() },
        ]}
      />

      <Faq title="Wat je nog wil weten" items={HOME_FAQ} />

      <LeadSection bron="/" heading={LEAD_HEADING} image="woonkamer-warm-winter" />
      <JsonLd data={localBusiness()} />
    </>
  );
}
