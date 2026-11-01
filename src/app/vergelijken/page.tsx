import { DataBand, Faq, PageHero } from "@/components/sections";
import LeadSection from "@/components/lead/LeadSection";
import { ComparisonCard, JsonLd } from "@/components/ui";
import { COMPARISON_GROUPS, getComparisonsByGroup, comparisons, v } from "@/content/comparisons";
import type { FaqItem } from "@/content/types";
import { getFaqs } from "@/content/faqs";
import { routes } from "@/lib/routes";
import { itemList } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import styles from "./_components/hub.module.css";

// /vergelijken – hub (05 §5.2): Hero + decision cards (W) → Hoe we vergelijken (D) → FAQ (W) → Lead (I).
export const metadata = buildMetadata({
  title: "Vergelijken: gasketel vs warmtepomp, met of zonder batterij",
  description:
    "Twijfel je tussen gasketel en warmtepomp, met of zonder batterij, PV of PVT? Eerlijke vergelijkingen met Vlaamse cijfers – inclusief wanneer het níet loont.",
  path: routes.vergelijken(),
});

const FAQ: FaqItem[] = [
  {
    q: "Hoe betrouwbaar zijn deze vergelijkingen?",
    a: "Elk cijfer komt uit een publieke bron, met de datum erbij, en staat bij de vergelijking vermeld. We rekenen met vlakke prijzen en zeggen welke aannames we maken. Het blijven gemiddelden: jouw verbruik, je woning en je contract kunnen het resultaat in beide richtingen doen kantelen.",
    aLong: "Daarom noemen we alle bedragen indicatief. Je persoonlijke berekening, op basis van je jaarafrekening en je woning, is de enige die telt.",
  },
  {
    q: "Waarom zeggen jullie soms dat iets niet loont?",
    a: "Omdat het zo is. Een batterij bij een klein verbruik, een warmtepomp in een slecht geïsoleerde woning met een zeer goedkoop gascontract: soms is de winst te klein. Wie je dan toch iets verkoopt, verliest je vertrouwen. Wij rekenen liever eerlijk en houden je als klant voor later.",
  },
  {
    q: "Met welke energieprijzen rekenen jullie?",
    a: `We gebruiken rekenwaarden voor een gemiddeld Vlaams gezin: stroom ${v("stroomprijsAllIn", { pre: "€ " })} per kWh all-in, gas ${v("gasprijsAllIn", { pre: "€ " })} per kWh all-in en een injectievergoeding van ${v("injectievergoeding")} cent. We herzien die cijfers minstens elk kwartaal, en in je eigen berekening rekenen we met jouw contract.`,
  },
  ...getFaqs(["berekening-kost"]),
];

export default function VergelijkenHub() {
  return (
    <>
      <PageHero
        variant="type"
        path={routes.vergelijken()}
        breadcrumb={[{ label: "Home", href: routes.home() }, { label: "Vergelijken" }]}
        eyebrow="Vergelijken"
        title="Twijfel je? Vergelijk eerlijk, met echte cijfers"
        lead="Gasketel of warmtepomp, met of zonder batterij, gewone panelen of PVT. Hier vind je per keuze het korte antwoord, de cijfers naast elkaar en – minstens zo belangrijk – wanneer het níet loont."
        cta={{ label: "Laat jouw situatie doorrekenen", href: routes.lead() }}
        trustLine
      >
        <div className={styles.groups}>
          {COMPARISON_GROUPS.map((g) => (
            <section key={g.key} className={styles.group} aria-labelledby={`groep-${g.key}`}>
              <div className={styles.groupHead}>
                <h2 id={`groep-${g.key}`} className={styles.groupTitle}>
                  {g.title}
                </h2>
                <p className={styles.groupIntro}>{g.intro}</p>
              </div>
              <ul className={styles.cards}>
                {getComparisonsByGroup(g.key).map((c) => (
                  <li key={c.slug}>
                    <ComparisonCard slug={c.slug} verdict={c.verdict} variant="grid" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </PageHero>

      <DataBand
        id="hoe-we-vergelijken"
        intro={{
          eyebrow: "Hoe we vergelijken",
          title: "Hoe we vergelijken: dezelfde cijfers voor elke keuze",
          lead: "Elke vergelijking rekent met dezelfde, gedateerde rekenwaarden voor een gemiddeld Vlaams gezin. Zo kan je de keuzes eerlijk naast elkaar leggen. Kosten over 20 jaar tonen we met vlakke prijzen: we voorspellen geen prijsstijgingen, en waar een betrouwbare prijs ontbreekt, tonen we geen curve.",
        }}
        mode="stats"
        stats={[
          { k: "stroomprijsAllIn", label: "Stroom per kWh, all-in", prefix: "€ " },
          { k: "gasprijsAllIn", label: "Gas per kWh, all-in", prefix: "€ " },
          { k: "scopRekenwaarde", label: "Rekenwaarde SCOP warmtepomp" },
          { k: "injectievergoeding", label: "Injectievergoeding", suffix: " c/kWh" },
        ]}
        whenTrue="Een gemiddelde is nooit jouw woning. Met een heel goedkoop gascontract, een slecht geïsoleerd huis of weinig verbruik overdag kan de uitkomst kantelen. Dat staat bij elke vergelijking, onder 'Wanneer geen van beide?'."
        assumptions={["stroomprijsAllIn", "gasprijsAllIn", "scopRekenwaarde", "injectievergoeding", "gasverbruikGezin", "stroomverbruikGezin"]}
        assumptionsNote={`Rekenwaarden voor een standaardgezin met ${v("gasverbruikGezin")} kWh gas en ${v("stroomverbruikGezin")} kWh stroom per jaar. We herzien ze elk kwartaal.`}
        cta={{ label: "Laat jouw situatie doorrekenen", href: routes.lead(), variant: "lime" }}
      />

      <Faq title="Vragen over onze vergelijkingen" items={FAQ} />

      <LeadSection bron={routes.vergelijken()} heading="Twijfel je nog? Wij rekenen jouw scenario's uit – gratis." />

      <JsonLd data={itemList(comparisons.map((c) => ({ name: c.shortTitle, path: routes.comparison(c.slug) })))} />
    </>
  );
}
