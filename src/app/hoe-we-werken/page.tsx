import { hoeWeWerken as c } from "@/content/company-pages";
import { reviews } from "@/content/reviews";
import { site } from "@/content/site";
import { team } from "@/content/team";
import PageHero from "@/components/sections/PageHero";
import MediaSplit from "@/components/sections/MediaSplit";
import Bento from "@/components/sections/Bento";
import Rail from "@/components/sections/Rail";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import { TeamCard } from "@/components/ui/cards";
import JsonLd from "@/components/ui/JsonLd";
import { articleLink, projectLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { howTo } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import LatestPosts from "@/components/sections/LatestPosts";
import styles from "./page.module.css";

// /hoe-we-werken (05 §7.1, round 4): Hero type (W) → six photo step rows (MediaSplit, W) → Bento (F · W) → Team rail (I · D) → FAQ (W) → Lead (I).
export const metadata = buildMetadata({ title: c.title, description: c.description, path: routes.hoeWeWerken() });

const processReview = reviews.find((r) => r.id === "r14") ?? reviews[0];

export default function HoeWeWerkenPage() {
  return (
    <>
      <PageHero
        variant="type"
        path={routes.hoeWeWerken()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Hoe we werken" }]}
        eyebrow="Hoe we werken"
        title={c.h1}
        lead={<p>{c.lead}</p>}
        kortAntwoord={c.kortAntwoord}
        cta={{ label: "Start met stap 1", href: routes.lead() }}
        secondaryCta={{ label: "Bekijk hoe je woning één systeem wordt", href: routes.hoeHetWerkt() }}
        trustLine
      />

      <MediaSplit
        id="stappen"
        start="right"
        intro={{ eyebrow: c.timelineIntro.eyebrow, title: "Zes stappen.", titleMuted: "Geen kleine lettertjes." }}
        items={c.steps.map((step, i) => ({
          eyebrow: `Stap ${i + 1}`,
          title: step.title,
          text: (
            <>
              <p>{c.stepVisuals[i].short}</p>
              <details className={`${styles.who} desktop-only`}>
                <summary>Wie doet wat?</summary>
                <p>
                  <strong>Jij:</strong> {step.whoDoesWhat?.jij}
                </p>
                <p>
                  <strong>Wij:</strong> {step.whoDoesWhat?.wij}
                </p>
              </details>
            </>
          ),
          image: c.stepVisuals[i].image,
          chip: { value: step.cost ?? "", label: step.duration ?? "" },
          cta: i === 0 ? { label: "Start met stap 1", href: routes.lead() } : undefined,
        }))}
      />

      <Bento
        id="niet-loont"
        bg="W"
        intro={{ eyebrow: c.bento.eyebrow, twoTone: true, title: c.bento.title }}
        tiles={[
          {
            kind: "stat",
            to: site.adviceAgainstPct,
            suffix: "%",
            label: "van de berekeningen raadden we minstens één product af",
            pill: "Eerlijk advies",
            placeholderNote: "Voorbeeldcijfer",
          },
          { kind: "grey", title: c.bento.nietsDoen.title, body: c.bento.nietsDoen.body, tags: c.bento.nietsDoen.tags },
          { kind: "photo", image: "ingenieur-aan-tafel", title: c.bento.photoTitle, body: c.bento.photoBody },
          { kind: "review", review: processReview },
          { kind: "wide", title: c.bento.garanties.title, body: c.bento.garanties.body, tone: "dark" },
        ]}
      />

      <Rail
        id="team"
        bg="D"
        kind="team"
        intro={{ eyebrow: c.teamIntro.eyebrow, twoTone: true, title: c.teamIntro.title }}
        items={team.map((m) => (
          <TeamCard key={m.slug} member={m} variant="rail" tone="dark" />
        ))}
        viewAll={{ href: routes.team(), label: "Maak kennis met het hele team" }}
      />

      <LeadSection bron={routes.hoeWeWerken()} heading={c.leadHeading} subheading={c.leadSub} />

      <LatestPosts />

      <Faq
        title={c.faqTitle}
        items={c.faq}
        relatedTitle="Lees ook"
        relatedLinks={[
          { href: routes.diensten(), label: "Alle diensten: wat elke techniek doet", kind: "page" },
          articleLink("mijn-verbouwpremie-voor-energie", "Mijn VerbouwPremie: welke premie krijg je nog?"),
          projectLink("gezin-kortrijk-geen-batterij-advies", "Project: waarom we in Kortrijk géén batterij plaatsten"),
          projectLink("gezinswoning-gent-warmtepomp-pvt", "Project: van gasketel naar warmtepomp en PVT in Gent"),
        ]}
      />

      <JsonLd
        data={howTo({
          name: c.h1,
          description: c.description,
          steps: c.steps.map((s) => ({ name: s.title, text: s.body })),
        })}
      />
    </>
  );
}
