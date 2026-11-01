// Registry of every routable item (foundation-owned, see docs/spec/00-decisions.md §2.1).
// Nav, footer, breadcrumbs, links.ts and sitemap.ts read THIS file, so they never
// depend on a builder's content file. Builders' content files must use exactly
// these slugs (typed unions below). Add an item here first (via a Note to Foundation).

export const SERVICES = [
  { slug: "zonnepanelen", shortTitle: "Zonnepanelen", group: "opwekken", label: "Zonnepanelen" },
  { slug: "pvt-panelen", shortTitle: "PVT-panelen", group: "opwekken", label: "PVT-panelen" },
  { slug: "omvormers", shortTitle: "Omvormers", group: "opwekken", label: "Omvormer" },
  { slug: "lucht-water-warmtepomp", shortTitle: "Lucht-water warmtepomp", group: "verwarmen", label: "Lucht-water warmtepomp" },
  { slug: "lucht-lucht-warmtepomp", shortTitle: "Lucht-lucht warmtepomp (airco)", group: "verwarmen", label: "Lucht-lucht warmtepomp (airco)" },
  { slug: "thuisbatterij", shortTitle: "Thuisbatterij", group: "opslaan", label: "Thuisbatterij" },
  { slug: "laadpalen", shortTitle: "Laadpalen", group: "opslaan", label: "Laadpaal" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
export type ServiceGroup = (typeof SERVICES)[number]["group"];

export const SERVICE_GROUPS: { key: ServiceGroup; title: string }[] = [
  { key: "opwekken", title: "Opwekken" },
  { key: "verwarmen", title: "Verwarmen & koelen" },
  { key: "opslaan", title: "Opslaan & laden" },
];

/** One-line descriptions used in the mega menu (no numbers). */
export const SERVICE_TAGLINES: Record<ServiceSlug, string> = {
  zonnepanelen: "Stroom van je eigen dak, slim zelf verbruikt",
  "pvt-panelen": "Stroom én warm water van hetzelfde dak",
  omvormers: "Het hart van je installatie, batterij-klaar",
  "lucht-water-warmtepomp": "Je gasketel eruit, comfort erin",
  "lucht-lucht-warmtepomp": "Verwarmen én koelen per ruimte",
  thuisbatterij: "Je zonnestroom bewaren voor 's avonds",
  laadpalen: "Thuis laden zonder je piek op te blazen",
};

export const COMPARISONS = [
  { slug: "gasketel-vs-warmtepomp", shortTitle: "Gasketel of warmtepomp?" },
  { slug: "met-of-zonder-thuisbatterij", shortTitle: "Met of zonder thuisbatterij?" },
  { slug: "met-of-zonder-zonnepanelen", shortTitle: "Met of zonder zonnepanelen?" },
  { slug: "warmtepomp-vs-airco", shortTitle: "Warmtepomp of airco?" },
  { slug: "zonnepanelen-vs-pvt-panelen", shortTitle: "Zonnepanelen of PVT-panelen?" },
  { slug: "vast-vs-dynamisch-energiecontract", shortTitle: "Vast of dynamisch contract?" },
] as const;

export type ComparisonSlug = (typeof COMPARISONS)[number]["slug"];

export const PROJECTS = [
  { slug: "gezinswoning-gent-warmtepomp-pvt", shortTitle: "Gezinswoning in Gent" },
  { slug: "nieuwbouw-leuven-all-electric", shortTitle: "Nieuwbouw in Leuven" },
  { slug: "rijwoning-antwerpen-zon-batterij", shortTitle: "Rijwoning in Antwerpen" },
  { slug: "fermette-brugge-airco-zonnepanelen", shortTitle: "Fermette in Brugge" },
  { slug: "koppel-hasselt-laadpaal-dynamisch", shortTitle: "Koppel in Hasselt" },
  { slug: "gezin-kortrijk-geen-batterij-advies", shortTitle: "Gezin in Kortrijk" },
] as const;

export type ProjectSlug = (typeof PROJECTS)[number]["slug"];

export const POSTS = [
  { slug: "loont-een-warmtepomp-nog-in-2026", shortTitle: "Loont een warmtepomp nog?" },
  { slug: "einde-terugdraaiende-teller-wat-nu", shortTitle: "Einde terugdraaiende teller" },
  { slug: "capaciteitstarief-verlagen-zo-doe-je-het", shortTitle: "Capaciteitstarief verlagen" },
  { slug: "gasketel-verbod-vlaanderen-wat-betekent-het", shortTitle: "Gasketel-verbod in Vlaanderen" },
  { slug: "waarom-wij-soms-nee-zeggen", shortTitle: "Waarom wij soms nee zeggen" },
  { slug: "dynamisch-energiecontract-ja-of-nee", shortTitle: "Dynamisch contract: ja of nee?" },
] as const;

export type PostSlug = (typeof POSTS)[number]["slug"];

export const KENNISBANK_CATEGORIES = [
  { key: "tarieven", title: "Tarieven & factuur" },
  { key: "warmtepompen", title: "Warmtepompen" },
  { key: "zon-pvt", title: "Zon & PVT" },
  { key: "opslag-laden", title: "Opslag & laden" },
  { key: "premies-regels", title: "Premies & regelgeving" },
] as const;

export type KennisbankCategory = (typeof KENNISBANK_CATEGORIES)[number]["key"];

export const ARTICLES = [
  { slug: "wat-is-het-capaciteitstarief", shortTitle: "Wat is het capaciteitstarief?", category: "tarieven" },
  { slug: "injectietarief-en-zelfverbruik", shortTitle: "Injectietarief en zelfverbruik", category: "tarieven" },
  { slug: "dynamisch-tarief-uitgelegd", shortTitle: "Dynamisch tarief uitgelegd", category: "tarieven" },
  { slug: "scop-en-cop-uitgelegd", shortTitle: "SCOP en COP uitgelegd", category: "warmtepompen" },
  { slug: "is-mijn-woning-geschikt-voor-een-warmtepomp", shortTitle: "Is mijn woning geschikt?", category: "warmtepompen" },
  { slug: "wat-is-een-pvt-paneel", shortTitle: "Wat is een PVT-paneel?", category: "zon-pvt" },
  { slug: "hoe-groot-moet-een-thuisbatterij-zijn", shortTitle: "Hoe groot moet een thuisbatterij zijn?", category: "opslag-laden" },
  { slug: "mijn-verbouwpremie-voor-energie", shortTitle: "Mijn VerbouwPremie voor energie", category: "premies-regels" },
  { slug: "epc-en-renovatieverplichting", shortTitle: "EPC en renovatieverplichting", category: "premies-regels" },
] as const satisfies readonly { slug: string; shortTitle: string; category: KennisbankCategory }[];

export type ArticleSlug = (typeof ARTICLES)[number]["slug"];

/** Static pages (path → short title for breadcrumbs/nav). */
export const PAGES = {
  home: { path: "/", shortTitle: "Home" },
  hoeHetWerkt: { path: "/hoe-het-werkt", shortTitle: "Hoe het werkt" },
  diensten: { path: "/diensten", shortTitle: "Diensten" },
  vergelijken: { path: "/vergelijken", shortTitle: "Vergelijken" },
  projecten: { path: "/projecten", shortTitle: "Projecten" },
  blog: { path: "/blog", shortTitle: "Blog" },
  kennisbank: { path: "/kennisbank", shortTitle: "Kennisbank" },
  overOns: { path: "/over-ons", shortTitle: "Over ons" },
  hoeWeWerken: { path: "/hoe-we-werken", shortTitle: "Hoe we werken" },
  team: { path: "/team", shortTitle: "Team" },
  contact: { path: "/contact", shortTitle: "Contact" },
  privacy: { path: "/privacy", shortTitle: "Privacy" },
} as const;

export type PageKey = keyof typeof PAGES;

/** Lead form `interesse` values = service slugs + "advies" (00 §2.12). */
export type Interesse = ServiceSlug | "advies";

export const INTERESSE_OPTIONS: { value: Interesse; label: string }[] = [
  { value: "zonnepanelen", label: "Zonnepanelen" },
  { value: "pvt-panelen", label: "PVT-panelen" },
  { value: "thuisbatterij", label: "Thuisbatterij" },
  { value: "lucht-water-warmtepomp", label: "Lucht-water warmtepomp" },
  { value: "lucht-lucht-warmtepomp", label: "Lucht-lucht warmtepomp (airco)" },
  { value: "laadpalen", label: "Laadpaal" },
  { value: "omvormers", label: "Omvormer" },
  { value: "advies", label: "Ik weet het nog niet – adviseer me" },
];

export function serviceEntry(slug: ServiceSlug) {
  return SERVICES.find((s) => s.slug === slug)!;
}
export function comparisonEntry(slug: ComparisonSlug) {
  return COMPARISONS.find((s) => s.slug === slug)!;
}
export function projectEntry(slug: ProjectSlug) {
  return PROJECTS.find((s) => s.slug === slug)!;
}
export function postEntry(slug: PostSlug) {
  return POSTS.find((s) => s.slug === slug)!;
}
export function articleEntry(slug: ArticleSlug) {
  return ARTICLES.find((s) => s.slug === slug)!;
}
export function categoryTitle(key: KennisbankCategory) {
  return KENNISBANK_CATEGORIES.find((c) => c.key === key)!.title;
}
