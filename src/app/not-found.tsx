import type { Metadata } from "next";
import { routes } from "@/lib/routes";
import PageHero from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/Statement";
import { ArticleCard } from "@/components/ui/cards";
import styles from "@/components/content/Hub.module.css";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: routes.home(), title: "Naar de startpagina", excerpt: "Zie in één oogopslag hoe je je energiefactuur zo dicht mogelijk bij €0 brengt.", eyebrow: "Home" },
  { href: routes.hoeHetWerkt(), title: "Hoe het samenwerkt", excerpt: "Zonnepanelen, warmtepomp, batterij en laadpaal: waar zit de winst precies?", eyebrow: "Uitleg" },
  { href: routes.diensten(), title: "Wat we doen", excerpt: "Zeven technieken, één berekening. Vaak heb je minder nodig dan je denkt.", eyebrow: "Diensten" },
  { href: routes.kennisbank(), title: "De kennisbank", excerpt: "Capaciteitstarief, SCOP, premies: kort en eerlijk uitgelegd, met bronnen.", eyebrow: "Kennisbank" },
];

/** 404 (02 §2.1): helpful links + CtaBand. No breadcrumbs, no schema; Next adds noindex. */
export default function NotFound() {
  return (
    <>
      <PageHero
        variant="type"
        eyebrow="Fout 404"
        title="Deze pagina bestaat niet (meer)."
        lead={
          <p>
            Misschien is de link verouderd, of hebben we de pagina verhuisd. Geen nood: hieronder vind je de plekken waar de meeste bezoekers verder
            zoeken.
          </p>
        }
      >
        <ul className={styles.notFoundGrid}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <ArticleCard href={l.href} title={l.title} excerpt={l.excerpt} eyebrow={l.eyebrow} variant="grid" />
            </li>
          ))}
        </ul>
      </PageHero>
      <CtaBand text="Liever meteen weten wat jouw woning kan besparen?" cta={{ label: "Gratis berekening", href: routes.contactLead() }} />
    </>
  );
}
