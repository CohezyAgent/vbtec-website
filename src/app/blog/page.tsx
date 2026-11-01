import Link from "next/link";
import { categoryTitle, PAGES } from "@/content/registry";
import { postsByDate } from "@/content/blog";
import { allArticles } from "@/content/kennisbank";
import { getTeamMember } from "@/content/team";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { itemList } from "@/lib/schema";
import { formatDate } from "@/lib/format";
import PageHero from "@/components/sections/PageHero";
import Rail from "@/components/sections/Rail";
import LeadSection from "@/components/lead/LeadSection";
import { ArticleCard } from "@/components/ui/cards";
import JsonLd from "@/components/ui/JsonLd";
import FeatureCard from "@/components/content/FeatureCard";
import styles from "@/components/content/Hub.module.css";

const PATH = routes.blog();

export const metadata = buildMetadata({
  title: "Blog: energietarieven, premies en mythes in Vlaanderen",
  description:
    "Wat verandert er aan capaciteitstarief, premies, gasprijzen en contracten – en wat betekent het voor jouw gezin? Helder uitgelegd door onze ingenieurs.",
  path: PATH,
});

export default function BlogPage() {
  const [first, ...rest] = postsByDate;
  const firstAuthor = getTeamMember(first.author);
  const kb = allArticles.slice(0, 6);

  return (
    <>
      <PageHero
        variant="type"
        path={PATH}
        breadcrumb={[{ label: PAGES.home.shortTitle, href: routes.home() }, { label: PAGES.blog.shortTitle }]}
        eyebrow="Blog"
        title="Wat verandert er, en wat betekent het voor jou?"
        lead={
          <p>
            Het capaciteitstarief, het einde van de terugdraaiende teller, nieuwe premies, een CO₂-prijs op gas: de regels rond je energiefactuur
            veranderen snel. Onze ingenieurs zoeken uit wat er echt beslist is, wat het jouw gezin kost of oplevert, en wat je ermee kunt doen.
          </p>
        }
      >
        <div className={styles.stack}>
          <div>
            <h2 className={styles.sectionLabel}>Nieuwste artikel</h2>
            <FeatureCard
              href={routes.post(first.slug)}
              image={first.image ?? "hero-gezin-woning"}
              meta={
                <>
                  {first.category} · <time dateTime={first.publishedAt}>{formatDate(first.publishedAt)}</time>
                  {firstAuthor ? ` · ${firstAuthor.name}` : ""}
                </>
              }
              title={first.h1}
              text={first.excerpt}
            />
          </div>

          <div>
            <h2 className={styles.sectionLabel}>Alle artikels</h2>
            <ul className={styles.postGrid}>
              {rest.map((p) => {
                const a = getTeamMember(p.author);
                return (
                  <li key={p.slug}>
                    <ArticleCard
                      href={routes.post(p.slug)}
                      title={p.h1}
                      excerpt={p.excerpt}
                      eyebrow={`${p.category}${a ? ` · ${a.name}` : ""}`}
                      image={p.image}
                      date={p.publishedAt}
                      variant="grid"
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.honest}>
            <p className={styles.honestBody}>
              Elk getal in onze artikels komt met een bron en een datum, en is indicatief: prijzen en premies veranderen. Een algemeen artikel vertelt
              je hoe het werkt; wat het voor jouw woning betekent, rekenen we graag apart uit. Zoek je een definitie of een rustige uitleg? Kijk dan
              in de <Link href={routes.kennisbank()}>kennisbank</Link>.
            </p>
          </div>
        </div>
      </PageHero>

      <Rail
        id="uit-de-kennisbank"
        bg="D"
        kind="article"
        intro={{ eyebrow: "Uit de kennisbank", title: "De begrippen achter het nieuws, kort uitgelegd" }}
        items={kb.map((a) => (
          <ArticleCard key={a.slug} href={routes.article(a.slug)} title={a.shortTitle} excerpt={a.excerpt} eyebrow={categoryTitle(a.category)} tone="dark" />
        ))}
        viewAll={{ href: routes.kennisbank(), label: "Naar de kennisbank" }}
      />

      <LeadSection bron={PATH} heading="Wat betekent dit voor jouw factuur?" />

      <JsonLd data={itemList(postsByDate.map((p) => ({ name: p.h1, path: routes.post(p.slug) })))} />
    </>
  );
}
