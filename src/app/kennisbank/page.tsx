import { KENNISBANK_CATEGORIES, PAGES, type KennisbankCategory } from "@/content/registry";
import { getArticlesByCategory, kennisbankCheckedAt } from "@/content/kennisbank";
import { getTeamMember } from "@/content/team";
import { getFaqs } from "@/content/faqs";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { relatedLinks } from "@/lib/links";
import PageHero from "@/components/sections/PageHero";
import Statement from "@/components/sections/Statement";
import Faq from "@/components/sections/Faq";
import LeadSection from "@/components/lead/LeadSection";
import KennisbankBrowser, { type KbCategory } from "@/components/content/KennisbankBrowser";

const PATH = routes.kennisbank();

export const metadata = buildMetadata({
  title: "Kennisbank: energie, tarieven en premies helder uitgelegd",
  description:
    "Wat is het capaciteitstarief, wat betekent SCOP, hoe groot moet je batterij zijn? Korte antwoorden en diepgaande uitleg, met bronnen en Vlaamse cijfers.",
  path: PATH,
});

const INTROS: Record<KennisbankCategory, string> = {
  tarieven: "Hoe je energiefactuur is opgebouwd, en waar je zelf invloed op hebt: je piek, je zelfverbruik en je contract.",
  warmtepompen: "Wat een warmtepomp écht verbruikt, en of jouw woning er klaar voor is – ook zonder vloerverwarming.",
  "zon-pvt": "Zonnepanelen zonder terugdraaiende teller, en PVT-panelen die stroom én warmte maken.",
  "opslag-laden": "Thuisbatterijen en laadpalen: wanneer ze lonen, en hoe groot ze moeten zijn.",
  "premies-regels": "Premies, btw en verplichtingen: wat geldt er in 2026, en wat betekent het voor jouw plannen?",
};

const FAQ = [
  {
    q: "Hoe vaak worden deze artikels bijgewerkt?",
    a: "Minstens elk kwartaal controleren we de prijzen, en bij elke wijziging van premies, tarieven of regels passen we de betrokken artikels aan. Bovenaan elk artikel staat wanneer het voor het laatst werd bijgewerkt, en bij elk cijfer de stand van de bron. Zie je iets dat niet meer klopt? Laat het ons weten.",
  },
  {
    q: "Waar komen jullie cijfers vandaan?",
    a: "Uit publieke bronnen: de tariefkaarten van de netbeheerder, de VREG, het Vlaams Energie- en Klimaatagentschap, Mijn VerbouwPremie, consumentenorganisaties en marktdata. Elk getal staat met bron en datum in onze bronnenlijst. Waar we zelf rekenen, zoals de kost per kWh warmte, staat dat erbij als eigen berekening.",
  },
  {
    q: "Wie schrijft deze artikels?",
    a: "De ingenieurs die bij VB-TEC ook de berekeningen voor gezinnen maken. Ze schrijven over wat ze elke week tegenkomen: vragen over het capaciteitstarief, warmtepompen in oudere woningen, de juiste batterijgrootte. Bij elk artikel zie je wie het schreef, en via het team lees je wie ze zijn.",
  },
  {
    q: "Kan ik een vraag stellen die hier niet staat?",
    a: "Graag. Stel je vraag via het formulier onderaan of op de contactpagina. Een ingenieur antwoordt je, en vaak is het antwoord voor jouw woning concreter dan een algemeen artikel. Komt een vraag vaak terug, dan schrijven we er een artikel over.",
  },
  ...getFaqs(["berekening-kost"]),
];

export default function KennisbankPage() {
  const categories: KbCategory[] = KENNISBANK_CATEGORIES.map((c) => ({
    key: c.key,
    title: c.title,
    intro: INTROS[c.key],
    entries: getArticlesByCategory(c.key).map((a) => ({
      slug: a.slug,
      href: routes.article(a.slug),
      title: a.h1,
      teaser: a.kortAntwoord.replace(/\*\*|\[|\]\([^)]*\)/g, ""),
      author: getTeamMember(a.author)?.name,
      keywords: `${a.shortTitle} ${a.title} ${a.faq.map((f) => f.q).join(" ")}`,
    })),
  })).filter((c) => c.entries.length > 0);

  return (
    <>
      <PageHero
        variant="type"
        path={PATH}
        breadcrumb={[{ label: PAGES.home.shortTitle, href: routes.home() }, { label: PAGES.kennisbank.shortTitle }]}
        eyebrow="Kennisbank"
        title="Energie, eindelijk helder uitgelegd"
        lead={
          <p>
            Wat is het capaciteitstarief, wat betekent SCOP, hoe groot moet een thuisbatterij zijn? Bij elk artikel krijg je eerst een kort antwoord, en
            daarna de uitleg, met Vlaamse cijfers, bronnen en een eerlijk stuk over wanneer iets níet voor jou interessant is.
          </p>
        }
      >
        <KennisbankBrowser categories={categories} contactHref={routes.contactLead()} />
      </PageHero>

      <Statement
        bg="L"
        eyebrow="Onze werkwijze"
        text={`Elk getal met bron en datum. Laatst gecontroleerd: ${formatDate(kennisbankCheckedAt)}.`}
        heading="Waarom je onze cijfers kunt nakijken"
        highlight={["bron", "datum."]}
        support={
          <p>
            Prijzen, premies en tarieven veranderen. Daarom staat bij elk cijfer waar het vandaan komt en van wanneer het is, en noemen we het
            indicatief. Je persoonlijke berekening rekent met jouw verbruik en jouw contract.
          </p>
        }
        pills={[
          { label: "Hoe het samenwerkt", href: routes.hoeHetWerkt() },
          { label: "Vergelijkingen", href: routes.vergelijken() },
          { label: "Blog", href: routes.blog() },
        ]}
      />

      <Faq
        items={FAQ}
        relatedLinks={relatedLinks({ comparisons: ["gasketel-vs-warmtepomp", "met-of-zonder-thuisbatterij"], services: ["lucht-water-warmtepomp"] })}
      />

      <LeadSection bron={PATH} heading="Liever meteen weten wat het voor jóuw woning betekent?" />
    </>
  );
}
