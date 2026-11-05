import { SERVICE_GROUPS, SERVICE_TAGLINES, SERVICES, COMPARISONS } from "@/content/registry";
import { dienstenHub, services } from "@/content/services";
import { featuredProjects } from "@/content/projects";
import PageHero from "@/components/sections/PageHero";
import ProjectsRail from "@/components/sections/ProjectsRail";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import JsonLd from "@/components/ui/JsonLd";
import HubGrid, { type HubGroup } from "@/components/service/HubGrid";
import { comparisonLink } from "@/lib/links";
import { routes } from "@/lib/routes";
import { itemList } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import MediaSplit from "@/components/sections/MediaSplit";
import LatestPosts from "@/components/sections/LatestPosts";

// /diensten hub (05 §5.1): Hero + groups (W) → Statement (L) → Projects rail (D) → FAQ (W) → Lead (I).
export const metadata = buildMetadata({ title: dienstenHub.title, description: dienstenHub.description, path: routes.diensten() });

const groups: HubGroup[] = SERVICE_GROUPS.map((g) => ({
  key: g.key,
  title: g.title,
  intro: dienstenHub.groupIntros[g.key],
  items: SERVICES.filter((s) => s.group === g.key).map((r) => {
    const s = services.find((x) => x.slug === r.slug)!;
    return { slug: r.slug, name: r.shortTitle, tagline: SERVICE_TAGLINES[r.slug], line: s.hubLine, image: s.hubImage };
  }),
}));

export default function DienstenPage() {
  return (
    <>
      <PageHero
        variant="type"
        path={routes.diensten()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Diensten" }]}
        eyebrow="Onze diensten"
        title={dienstenHub.h1}
        lead={<p>{dienstenHub.lead}</p>}
        cta={{ label: "Gratis berekening", href: routes.lead() }}
        secondaryCta={{ label: "Bekijk hoe alles samenwerkt", href: routes.hoeHetWerkt() }}
        trustLine
      >
        <HubGrid groups={groups} />
      </PageHero>

      <MediaSplit
        id="waarom-rekenen"
        start="left"
        items={[
          {
            eyebrow: "Systeem, geen product",
            title: "We duwen geen product.",
            titleMuted: "We rekenen wat je woning nodig heeft.",
            text: "Panelen, warmtepomp, batterij en laadpaal werken pas echt als ze samenwerken. Daarom rekenen we je woning als één geheel.",
            points: ["Altijd een scenario 'niets doen'", "Merkonafhankelijk", "Slim aangestuurd: meer zelf verbruiken"],
            image: "vbtec-woning-zonnepanelen-oprit",
            cta: { label: "Zo werkt je woning als één systeem", href: routes.hoeHetWerkt(), variant: "ink" },
            secondary: { href: routes.hoeWeWerken(), label: "Lees hoe we werken" },
          },
        ]}
      />

      <ProjectsRail
        id="projecten"
        projects={featuredProjects.slice(0, 4)}
        intro={{ eyebrow: "Projecten", twoTone: true, title: "Gezinnen zoals jij. Hun factuur vóór en na." }}
      />

      <LeadSection bron={routes.diensten()} heading={dienstenHub.leadHeading} />

      <LatestPosts />

      <Faq
        title="Veelgestelde vragen over onze diensten"
        items={dienstenHub.faq}
        relatedTitle="Twijfel je tussen twee keuzes?"
        relatedLinks={COMPARISONS.map((c) => comparisonLink(c.slug))}
      />

      <JsonLd data={itemList(SERVICES.map((s) => ({ name: s.shortTitle, path: routes.service(s.slug) })))} />
    </>
  );
}
