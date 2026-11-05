// PLACEHOLDER – vervang door echte gegevens (juridisch na te kijken door de klant vóór publicatie)
import Link from "next/link";
import { PAGES } from "@/content/registry";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import Prose from "@/components/sections/Prose";
import { CtaBand } from "@/components/sections/Statement";
import { Callout } from "@/components/ui/Content";

const PATH = routes.privacy();
const UPDATED = "2026-11-01";

export const metadata = buildMetadata({
  title: "Privacy- en cookieverklaring",
  description: "Hoe VB-TEC je gegevens verwerkt wanneer je een berekening aanvraagt, welke cookies we gebruiken en welke rechten je hebt.",
  path: PATH,
});

const SECTIONS = [
  { id: "wie", label: "Wie is verantwoordelijk?" },
  { id: "welke-gegevens", label: "Welke gegevens verwerken we?" },
  { id: "waarom", label: "Waarom en op welke basis?" },
  { id: "bewaren", label: "Hoe lang bewaren we ze?" },
  { id: "delen", label: "Met wie delen we ze?" },
  { id: "cookies", label: "Cookies" },
  { id: "rechten", label: "Jouw rechten" },
  { id: "wijzigingen", label: "Wijzigingen" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        variant="type"
        path={PATH}
        breadcrumb={[{ label: PAGES.home.shortTitle, href: routes.home() }, { label: PAGES.privacy.shortTitle }]}
        eyebrow="Privacy"
        title="Privacy- en cookieverklaring"
        lead={<p>Wat we doen met de gegevens die je ons geeft wanneer je een berekening aanvraagt, en wat niet. In gewone taal.</p>}
        updatedAt={UPDATED}
        placeholderBadge="Voorlopige tekst"
      />

      <Prose toc={SECTIONS} hairline>
        <Callout kind="info" title="Voorlopige tekst">
          <p>
            Deze verklaring is een voorlopige versie. De bedrijfsgegevens zijn nog voorbeeldgegevens en de tekst wordt juridisch nagekeken vóór de
            definitieve lancering van de website.
          </p>
        </Callout>

        <h2 id="wie">Wie is verantwoordelijk?</h2>
        <p>
          {site.legalName} ({site.name}), {site.address.street}, {site.address.postalCode} {site.address.city}, ondernemingsnummer {site.vat}, is
          verantwoordelijk voor de verwerking van je persoonsgegevens. Vragen over privacy stel je via{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>

        <h2 id="welke-gegevens">Welke gegevens verwerken we?</h2>
        <p>Wanneer je een berekening aanvraagt, vragen we alleen wat we nodig hebben om die berekening te maken en je te contacteren:</p>
        <ul>
          <li>je voornaam en naam, je e-mailadres en je telefoonnummer;</li>
          <li>het adres van je woning (straat, huisnummer, postcode en gemeente), je woningtype en je bouwjaar (bij benadering);</li>
          <li>je verbruik of voorschotbedrag, als je dat invult, en de technieken waarin je interesse hebt;</li>
          <li>eventuele opmerkingen die je zelf toevoegt.</li>
        </ul>
        <p>
          Bij een plaatsbezoek en een offerte komen daar je adres en technische gegevens van je woning bij, zoals je dakoppervlak, je meter en
          eventueel je verbruiksgegevens uit Mijn Fluvius. Die laatste krijgen we alleen als jij ze met ons deelt.
        </p>

        <h2 id="waarom">Waarom en op welke basis?</h2>
        <p>
          We gebruiken je gegevens om je berekening te maken, je daarover te contacteren en, als je verder gaat, een offerte op te maken en je
          installatie uit te voeren en op te volgen. De rechtsgrond is je aanvraag zelf (precontractuele maatregelen) en, na akkoord, de uitvoering van
          de overeenkomst. Voor premiedossiers en facturatie verwerken we gegevens omdat de wet dat vereist.
        </p>
        <p>
          We sturen je geen nieuwsbrief of reclame, tenzij je daar zelf uitdrukkelijk om vraagt. We verkopen je gegevens nooit en gebruiken ze niet om
          profielen voor reclame op te bouwen.
        </p>

        <h2 id="bewaren">Hoe lang bewaren we ze?</h2>
        <p>
          Gaat je aanvraag niet verder, dan verwijderen we je gegevens uiterlijk twaalf maanden na ons laatste contact. Word je klant, dan bewaren we
          ze zolang nodig voor de opvolging en garantie van je installatie, en zolang de boekhoud- en fiscale wetgeving dat vereist.
        </p>

        <h2 id="delen">Met wie delen we ze?</h2>
        <p>
          Alleen met partijen die we nodig hebben om je te helpen, en alleen wat zij nodig hebben: bijvoorbeeld onze IT- en e-maildienstverleners, een
          keuringsorganisme bij de keuring van je installatie, of de overheid bij een premieaanvraag die jij ons vraagt in te dienen. Met elke
          verwerker maken we afspraken over de beveiliging en vertrouwelijkheid van je gegevens. Je gegevens blijven binnen de Europese Unie.
        </p>

        <h2 id="cookies">Cookies</h2>
        <p>
          Deze website gebruikt alleen functionele cookies en vergelijkbare technieken die nodig zijn om de site te laten werken, zoals het onthouden
          van je voortgang in het formulier. We gebruiken op dit moment geen advertentiecookies en geen trackers van derden. Voegen we later
          statistieken toe, dan vragen we vooraf je toestemming en passen we deze verklaring aan.
        </p>

        <h2 id="rechten">Jouw rechten</h2>
        <p>Je hebt het recht om:</p>
        <ul>
          <li>je gegevens in te kijken en een kopie te vragen;</li>
          <li>onjuiste gegevens te laten verbeteren;</li>
          <li>je gegevens te laten verwijderen, voor zover we ze niet wettelijk moeten bewaren;</li>
          <li>bezwaar te maken tegen of een beperking te vragen van een verwerking;</li>
          <li>je gegevens over te dragen aan een andere partij.</li>
        </ul>
        <p>
          Stuur je vraag naar <a href={`mailto:${site.email}`}>{site.email}</a>. We antwoorden binnen een maand. Ben je niet tevreden over hoe we met je
          gegevens omgaan, dan kun je een klacht indienen bij de Gegevensbeschermingsautoriteit (www.gegevensbeschermingsautoriteit.be).
        </p>

        <h2 id="wijzigingen">Wijzigingen</h2>
        <p>
          Als we deze verklaring aanpassen, zie je dat aan de datum bovenaan. Bij belangrijke wijzigingen laten we het je weten als je klant bent. Wil
          je weten wat er gebeurt met je aanvraag zelf? Lees dan <Link href={routes.hoeWeWerken()}>hoe we werken</Link>.
        </p>
      </Prose>

      <CtaBand text="Liever meteen rekenen?" cta={{ label: "Gratis berekening", href: routes.contactLead() }} />
    </>
  );
}
