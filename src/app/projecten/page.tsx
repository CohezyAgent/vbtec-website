import { PAGES, SERVICES } from "@/content/registry";
import { allProjects, getProject } from "@/content/projects";
import { reviews } from "@/content/reviews";
import { getFaqs } from "@/content/faqs";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { itemList } from "@/lib/schema";
import { relatedLinks } from "@/lib/links";
import PageHero from "@/components/sections/PageHero";
import ReviewWall from "@/components/sections/ReviewWall";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import { ProjectCard } from "@/components/ui/cards";
import JsonLd from "@/components/ui/JsonLd";
import Link from "next/link";
import ProjectFilterGrid, { type FilterOption } from "@/components/content/ProjectFilterGrid";
import FeatureCard from "@/components/content/FeatureCard";
import styles from "@/components/content/Hub.module.css";
import LatestPosts from "@/components/sections/LatestPosts";

const PATH = routes.projecten();

export const metadata = buildMetadata({
  title: "Projecten: zo verlaagden gezinnen hun energiefactuur",
  description:
    "Gezinswoning, rijwoning, fermette of nieuwbouw: bekijk welke combinatie we berekenden, wat het kostte en wat de factuur nu is. Ook waar we een batterij afraadden.",
  path: PATH,
});

/** Woningtype → filter bucket (client-side chips, no URLs). */
function homeBucket(homeType: string): string {
  const t = homeType.toLowerCase();
  if (t.includes("nieuwbouw")) return "nieuwbouw";
  if (t.includes("rijwoning")) return "rijwoning";
  if (t.includes("fermette")) return "fermette";
  if (t.includes("halfopen")) return "halfopen";
  return "open";
}

const HOMES: FilterOption[] = [
  { value: "rijwoning", label: "Rijwoning" },
  { value: "halfopen", label: "Halfopen" },
  { value: "open", label: "Open bebouwing" },
  { value: "nieuwbouw", label: "Nieuwbouw" },
  { value: "fermette", label: "Fermette" },
];

const FAQ = [
  {
    q: "Zijn deze resultaten representatief?",
    a: "Deze projecten zijn voorbeeldprojecten: de gezinnen zijn verzonnen, de bedragen berekend met de publieke rekenwaarden uit onze bronnenlijst. Ze tonen hoe we rekenen, niet wat jij gegarandeerd bespaart. Jouw resultaat hangt af van je verbruik, je dak, je isolatie en je contract. Daarom rekenen we elke woning apart.",
    aLong: "Zodra we echte projecten met gemeten cijfers en toestemming van de bewoners kunnen tonen, vervangen we deze voorbeelden. Tot dan staat bij elk project duidelijk het label 'Voorbeeldproject'.",
  },
  {
    q: "Hoe meten jullie de besparing?",
    a: "We vergelijken altijd met hetzelfde gezin zonder ingreep: het scenario 'niets doen', aan dezelfde prijzen. Zo zie je het effect van de installatie, niet van een prijsdaling of een zachte winter. Na de installatie volgen we de opbrengst op via de omvormer, de warmtepomp en je meterdata uit Mijn Fluvius.",
  },
  {
    q: "Kan ik een installatie bezoeken?",
    a: "Dat regelen we graag, als er in jouw buurt een klant is die daarvoor openstaat. Vaak is een gesprek met een ingenieur over jouw eigen woning nuttiger: daar zie je je eigen cijfers, met de aannames erbij. Vraag het gerust tijdens het eerste telefoontje na je aanvraag.",
  },
  {
    q: "Wat als mijn woning anders is?",
    a: "Dat is bijna altijd zo, en daarom kopiëren we nooit een pakket van een ander project. Je krijgt een eigen berekening met twee of drie combinaties naast elkaar, inclusief 'niets doen', en een eerlijk advies. Soms is dat een kleinere installatie dan je dacht, of eerst isoleren.",
  },
  ...getFaqs(["berekening-kost"]),
];

export default function ProjectenPage() {
  const featured = getProject("gezinswoning-gent-warmtepomp-pvt")!;
  const productOptions: FilterOption[] = SERVICES.filter((s) => allProjects.some((p) => p.products.includes(s.slug))).map((s) => ({ value: s.slug, label: s.shortTitle.replace(" (airco)", "") }));
  const homeOptions = HOMES.filter((h) => allProjects.some((p) => homeBucket(p.homeType) === h.value));
  const projectReviews = reviews.filter((r) => r.project).concat(reviews.filter((r) => !r.project)).slice(0, 9);

  return (
    <>
      <PageHero
        variant="type"
        path={PATH}
        breadcrumb={[{ label: PAGES.home.shortTitle, href: routes.home() }, { label: PAGES.projecten.shortTitle }]}
        eyebrow="Projecten"
        title="Gezinnen zoals jij, facturen zoals je wil"
        lead={
          <p>
            Een rijwoning met een klein dak, een jaren &apos;70-woning met radiatoren, een nieuwbouw zonder gas, een fermette op stookolie. Per gezin zie je
            hun factuur vóór en na, de scenario&apos;s die we naast elkaar legden, en wat we afraadden.
          </p>
        }
        placeholderBadge="Voorbeeldprojecten"
        cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead() }}
        trustLine
      >
        <div className={styles.stack}>
          <div className={styles.intro}>
            <div className={styles.introText}>
              <p>
                Elk project hieronder begint bij dezelfde vraag: wat betaalt dit gezin vandaag, en hoe brengen we hun factuur zo dicht mogelijk bij €0 zonder
                iets te plaatsen wat niet loont? Het antwoord is telkens anders. Soms is het een warmtepomp met PVT-panelen, soms alleen zonnepanelen,
                en soms is het advies: nu nog niet.
              </p>
              <p>
                Let op: dit zijn <strong>voorbeeldprojecten</strong>. De bedragen zijn berekend met de rekenwaarden uit onze bronnenlijst en vlakke
                prijzen, niet gemeten bij echte klanten. Ze tonen hoe we rekenen. Jouw eigen berekening is de enige die telt.
              </p>
            </div>
          </div>

          <div>
            <h2 className={styles.sectionLabel}>Uitgelicht</h2>
            <FeatureCard
              href={routes.project(featured.slug)}
              image={featured.image}
              badge="Voorbeeldproject"
              meta={`${featured.place} · ${featured.homeType} · bouwjaar ${featured.buildYear}`}
              number={`${featured.headline.before} → ${featured.headline.after}`}
              unit={`${featured.headline.unit}, indicatief`}
              title={featured.h1}
              text={featured.summary}
            />
          </div>

          <ProjectFilterGrid
            products={productOptions}
            homes={homeOptions}
            emptyHref={routes.lead()}
            items={allProjects.map((p) => ({
              slug: p.slug,
              products: [...p.products],
              home: homeBucket(p.homeType),
              card: <ProjectCard project={p} variant="grid" />,
            }))}
          />

          <div className={styles.honest}>
            <p className={styles.honestBody}>
              Eén project gaat over een gezin dat een thuisbatterij wilde en die níet kreeg, omdat ze bij hen niet zou lonen. Lees{" "}
              <Link href={routes.project("gezin-kortrijk-geen-batterij-advies")}>waarom we in Kortrijk nee zeiden</Link> en{" "}
              <Link href={routes.hoeWeWerken()}>hoe we werken</Link>, van eerste berekening tot opvolging.
            </p>
          </div>
        </div>
      </PageHero>

      <ReviewWall
        bg="D"
        variant="static"
        initial={6}
        intro={{ eyebrow: "In hun woorden", twoTone: true, title: "Wat gezinnen zeggen na de berekening", lead: "Voorbeeldreviews: ze tonen het soort reacties dat we willen verdienen, en worden vervangen door echte reviews met toestemming." }}
        reviews={projectReviews}
      />

      <LeadSection bron={PATH} heading="Zo'n berekening voor jouw woning?" />

      <LatestPosts />

      <Faq
        title="Hoe we resultaten meten"
        lead="We vergelijken elk resultaat met hetzelfde gezin zonder ingreep, aan dezelfde prijzen, en tonen de aannames erbij. Zo zie je wat de installatie doet, los van prijsschommelingen of het weer."
        items={FAQ}
        relatedLinks={relatedLinks({ comparisons: ["met-of-zonder-thuisbatterij", "gasketel-vs-warmtepomp"], articles: ["injectietarief-en-zelfverbruik"] })}
      />

      <JsonLd data={itemList(allProjects.map((p) => ({ name: p.title, path: routes.project(p.slug) })))} />
    </>
  );
}
