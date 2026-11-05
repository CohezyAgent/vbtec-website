import { overOns as c } from "@/content/company-pages";
import { getProject } from "@/content/projects";
import { getFaqs } from "@/content/faqs";
import { site } from "@/content/site";
import { team } from "@/content/team";
import PageHero from "@/components/sections/PageHero";
import MediaSplit from "@/components/sections/MediaSplit";
import Bento from "@/components/sections/Bento";
import Rail from "@/components/sections/Rail";
import ImagePanel from "@/components/sections/ImagePanel";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import { TeamCard } from "@/components/ui/cards";
import JsonLd from "@/components/ui/JsonLd";
import { projectLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { aboutPage } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import LatestPosts from "@/components/sections/LatestPosts";

// /over-ons (05 §7.2, round 4): Hero (I) → MediaSplit story rows (W) → Bento (W) → Team rail (D) → Story (C · I) → FAQ (W) → Lead (I).
export const metadata = buildMetadata({ title: c.title, description: c.description, path: routes.overOns() });

const story = getProject("fermette-brugge-airco-zonnepanelen");

export default function OverOnsPage() {
  return (
    <>
      <PageHero
        variant="image"
        path={routes.overOns()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Over ons" }]}
        eyebrow="Over VB-TEC"
        title={c.h1}
        lead={<p>{c.lead}</p>}
        image="ingenieur-aan-tafel"
        cta={{ label: "Gratis berekening", href: routes.lead() }}
        secondaryCta={{ label: "Ontmoet het team", href: routes.team() }}
        trustLine
      />

      <MediaSplit
        id="verhaal"
        start="right"
        items={c.splits.map((x) => ({ ...x, points: "points" in x ? [...x.points] : undefined }))}
      />

      <Bento
        id="waarden"
        bg="W"
        intro={{ eyebrow: c.values.eyebrow, twoTone: true, title: c.values.title }}
        tiles={[
          {
            kind: "stat",
            to: site.adviceAgainstPct,
            suffix: "%",
            label: "van de berekeningen raadden we minstens één product af",
            pill: "Eerlijk",
            placeholderNote: "Voorbeeldcijfer",
          },
          { kind: "grey", title: c.values.klant.title, body: c.values.klant.body, tags: c.values.klant.tags },
          { kind: "photo", image: "pvt-dak-detail", title: c.values.pvt.title, body: c.values.pvt.body },
          { kind: "wide", title: c.values.systeem.title, body: c.values.systeem.body, tone: "dark", cta: { label: "Zo werkt je woning als één systeem", href: routes.hoeHetWerkt() } },
          {
            kind: "stat",
            to: site.calculationsCount,
            suffix: "+",
            label: "woningen doorgerekend in Vlaanderen",
            placeholderNote: "Voorbeeldcijfer",
          },
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
        viewAll={{ href: routes.team(), label: "Bekijk het hele team" }}
      />

      {story && (
        <ImagePanel
          id="klantverhaal"
          image="fermette-airco"
          align="left"
          eyebrow="Een gezin zoals jij"
          title={c.storyTitle}
          quote={{
            text: story.quote.text,
            name: story.quote.name,
            place: story.place,
            meta: `${story.headline.before} → ${story.headline.after} ${story.headline.unit} (indicatief)`,
          }}
          body={<p>{c.storyBody}</p>}
          cta={{ label: "Zo'n berekening voor jouw woning?", href: routes.lead() }}
          secondary={projectLink(story.slug, "Bekijk het project")}
          placeholderBadge="Voorbeeldproject"
        />
      )}

      <LeadSection bron={routes.overOns()} heading={c.leadHeading} subheading={c.leadSub} />

      <LatestPosts />

      <Faq
        title={c.faqTitle}
        items={[...c.faq, ...getFaqs(["regio"])]}
        relatedTitle="Meer over ons"
        relatedLinks={[
          { href: routes.hoeWeWerken(), label: "Hoe we werken: van berekening tot opvolging", kind: "page" },
          { href: routes.diensten(), label: "Wat we doen: alle diensten", kind: "page" },
          projectLink("gezinswoning-gent-warmtepomp-pvt", "Project: warmtepomp en PVT in Gent"),
          projectLink("gezin-kortrijk-geen-batterij-advies", "Project: waarom we een batterij afraadden"),
        ]}
      />

      <JsonLd data={aboutPage(routes.overOns(), c.title)} />
    </>
  );
}
