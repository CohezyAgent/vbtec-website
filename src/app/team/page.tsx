import { teamPage as c } from "@/content/company-pages";
import { allArticles } from "@/content/kennisbank";
import { allPosts } from "@/content/blog";
import { categoryTitle } from "@/content/registry";
import { getTeamMember, isPlaceholder, PLACEHOLDER_LABEL, team } from "@/content/team";
import PageHero from "@/components/sections/PageHero";
import Rail from "@/components/sections/Rail";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import { ArticleCard } from "@/components/ui/cards";
import JsonLd from "@/components/ui/JsonLd";
import { routes } from "@/lib/routes";
import { persons } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import TeamGrid from "./_components/TeamGrid";

// /team (05 §7.3): Hero type + team grid (W) → Articles by our team (I · D) → FAQ (W) → Lead (I).
// Person schema only once the team is real (00 §2.8) – persons() returns [] while placeholder.
export const metadata = buildMetadata({ title: c.title, description: c.description, path: routes.team() });

const authorName = (slug: string) => getTeamMember(slug)?.name.split(" ")[0];

const writing = [
  ...allArticles.map((a) => ({ key: `a-${a.slug}`, href: routes.article(a.slug), title: a.h1, excerpt: a.excerpt, eyebrow: `${categoryTitle(a.category)} · ${authorName(a.author) ?? "VB-TEC"}`, date: a.updatedAt })),
  ...allPosts.map((p) => ({ key: `p-${p.slug}`, href: routes.post(p.slug), title: p.h1, excerpt: p.excerpt, eyebrow: `Blog · ${authorName(p.author) ?? "VB-TEC"}`, date: p.publishedAt })),
]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 8);

export default function TeamPage() {
  const schema = persons(team, isPlaceholder);
  return (
    <>
      <PageHero
        variant="type"
        path={routes.team()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Team" }]}
        eyebrow="Ons team"
        title={c.h1}
        lead={<p>{c.lead}</p>}
        placeholderBadge={isPlaceholder ? PLACEHOLDER_LABEL : undefined}
        secondaryCta={{ label: "Waarom ingenieurs rekenen: over ons", href: routes.overOns() }}
      >
        <TeamGrid members={team} />
      </PageHero>

      {writing.length > 0 && (
        <Rail
          id="artikels"
          bg="D"
          kind="article"
          intro={{ eyebrow: c.articlesIntro.eyebrow, title: c.articlesIntro.title, lead: <p>{c.articlesIntro.lead}</p> }}
          items={writing.map((w) => (
            <ArticleCard key={w.key} href={w.href} title={w.title} excerpt={w.excerpt} eyebrow={w.eyebrow} tone="dark" />
          ))}
          viewAll={{ href: routes.kennisbank(), label: "Naar de kennisbank" }}
        />
      )}

      <Faq title="Wie je aan de lijn en over de vloer krijgt" items={c.faq} />

      <LeadSection bron={routes.team()} heading={c.leadHeading} />

      {schema.length > 0 && <JsonLd data={schema} />}
    </>
  );
}
