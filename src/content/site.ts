// PLACEHOLDER – vervang door echte gegevens
// Company data (NAP, metrics, promises) + navigation (00 §2.1: replaces company.ts + navigation.ts).
// While `isPlaceholder` is true, structured data never emits telephone/e-mail/address/opening hours
// (00 §2.8) and the UI shows these values only as contact details, never as verified claims.

import {
  ARTICLES,
  COMPARISONS,
  PAGES,
  SERVICE_GROUPS,
  SERVICE_TAGLINES,
  SERVICES,
} from "./registry";
import { routes } from "@/lib/routes";

export const site = {
  isPlaceholder: true,
  name: "VB-TEC",
  legalName: "VB-TEC BV", // PLACEHOLDER
  tagline: "Energie-ingenieurs voor jouw woning",
  promise: "Ingenieurs die rekenen, geen verkopers die duwen.",
  description:
    "VB-TEC rekent als ingenieur uit welke combinatie van zonnepanelen, PVT, warmtepomp, thuisbatterij en laadpaal jouw energiefactuur zo dicht mogelijk bij €0 brengt. Eerlijk, ook als het niet loont.",
  phone: "09 123 45 67", // PLACEHOLDER
  phoneHref: "tel:+3291234567", // PLACEHOLDER
  email: "info@vb-tec.be", // PLACEHOLDER
  address: {
    street: "Voorbeeldstraat 1", // PLACEHOLDER
    postalCode: "9000",
    city: "Gent",
    country: "BE",
  },
  vat: "BE 0000.000.000", // PLACEHOLDER
  areaServed: "Vlaanderen",
  areaLabel: "Heel Vlaanderen · eigen installatieploegen",
  openingHours: [
    { days: "Maandag – vrijdag", hours: "8.30 – 18.00 u" },
    { days: "Zaterdag", hours: "op afspraak" },
  ],
  /** schema.org openingHours strings – only emitted when isPlaceholder === false. */
  openingHoursSpec: ["Mo-Fr 08:30-18:00"],
  responseTime: "2 werkdagen", // PLACEHOLDER (00 §2.5)
  /** Only show the planning line (03 §5) when the client fills this in. */
  leadTimeWeeks: undefined as number | undefined,
  /** "In {x}% van de berekeningen raadden we minstens één product af." */
  adviceAgainstPct: 38, // PLACEHOLDER
  calculationsCount: 1200, // PLACEHOLDER
  /** Google review badge in image heroes. PLACEHOLDER – vervang door de echte Google-score. */
  googleRating: { score: "4,9", count: 127 },
  guarantees: [
    "Geen voorschot vóór je akkoord", // PLACEHOLDER – bevestigen met klant
    "Fabrieksgarantie + installatiegarantie (termijnen volgen)", // PLACEHOLDER
    "Wij vragen je premies aan",
  ],
  /** Text-only quality labels (no third-party logos). */
  trustLabels: ["Erkend installateur", "AREI-conforme installaties", "Merkonafhankelijk advies"], // PLACEHOLDER
  socialProfiles: [] as string[],
  foundingYear: "2026", // PLACEHOLDER
  /** Static footer year (no Date.now() in render). */
  copyrightYear: "2026",
} as const;

export const TRUSTLINE = [
  "Gratis en vrijblijvend",
  "Berekend door een ingenieur",
  "Eerlijk, ook als het niet loont",
] as const;

// ───────────────────────── Navigation ─────────────────────────
export type NavLink = { label: string; href: string; description?: string };
export type NavColumn = { title: string; links: NavLink[] };
export type NavItem =
  | { kind: "link"; label: string; href: string }
  | {
      kind: "menu";
      label: string;
      /** Path prefix that marks this item active. */
      match: string[];
      columns: NavColumn[];
      feature?: { title: string; body: string; href: string; cta: string };
      footerLink?: NavLink;
    };

const serviceColumns: NavColumn[] = SERVICE_GROUPS.map((g) => ({
  title: g.title,
  links: SERVICES.filter((s) => s.group === g.key).map((s) => ({
    label: s.shortTitle,
    href: routes.service(s.slug),
    description: SERVICE_TAGLINES[s.slug],
  })),
}));

export const navigation: { main: NavItem[]; cta: { label: string; shortLabel: string; href: string } } = {
  main: [
    {
      kind: "menu",
      label: "Diensten",
      match: ["/diensten"],
      columns: serviceColumns,
      feature: {
        title: "Alles samen?",
        body: "Zie hoe zon, warmte, opslag en laden in jouw woning samenwerken.",
        href: routes.hoeHetWerkt(),
        cta: "Hoe het werkt",
      },
      footerLink: { label: "Alle diensten", href: routes.diensten() },
    },
    { kind: "link", label: "Hoe het werkt", href: routes.hoeHetWerkt() },
    {
      kind: "menu",
      label: "Vergelijken",
      match: ["/vergelijken"],
      columns: [
        {
          title: "Twijfel je tussen…",
          links: COMPARISONS.map((c) => ({ label: c.shortTitle, href: routes.comparison(c.slug) })),
        },
      ],
      footerLink: { label: "Alle vergelijkingen", href: routes.vergelijken() },
    },
    { kind: "link", label: "Projecten", href: routes.projecten() },
    {
      kind: "menu",
      label: "Kennis",
      match: ["/kennisbank", "/blog"],
      columns: [
        {
          title: "Kennis",
          links: [
            { label: "Kennisbank", href: routes.kennisbank(), description: "Elk begrip uitgelegd, met bron en datum" },
            { label: "Blog", href: routes.blog(), description: "Wat verandert er, en wat betekent het voor jou?" },
          ],
        },
      ],
    },
    {
      kind: "menu",
      label: "Over ons",
      match: ["/over-ons", "/hoe-we-werken", "/team"],
      columns: [
        {
          title: "VB-TEC",
          links: [
            { label: "Over ons", href: routes.overOns(), description: "Waarom ingenieurs rekenen, niet verkopen" },
            { label: "Hoe we werken", href: routes.hoeWeWerken(), description: "Van berekening tot opvolging" },
            { label: "Team", href: routes.team(), description: "Wie er bij jou thuis komt rekenen" },
          ],
        },
      ],
    },
  ],
  cta: { label: "Gratis berekening", shortLabel: "Berekening", href: routes.lead() },
};

export const footerColumns: NavColumn[] = [
  {
    title: "Diensten",
    links: SERVICES.map((s) => ({ label: s.shortTitle, href: routes.service(s.slug) })),
  },
  {
    title: "Vergelijken",
    links: COMPARISONS.map((c) => ({ label: c.shortTitle, href: routes.comparison(c.slug) })),
  },
  {
    title: "Kennis",
    links: [
      { label: PAGES.hoeHetWerkt.shortTitle, href: routes.hoeHetWerkt() },
      { label: PAGES.kennisbank.shortTitle, href: routes.kennisbank() },
      { label: PAGES.blog.shortTitle, href: routes.blog() },
      { label: PAGES.projecten.shortTitle, href: routes.projecten() },
    ],
  },
  {
    title: "Bedrijf",
    links: [
      { label: PAGES.overOns.shortTitle, href: routes.overOns() },
      { label: PAGES.hoeWeWerken.shortTitle, href: routes.hoeWeWerken() },
      { label: PAGES.team.shortTitle, href: routes.team() },
      { label: PAGES.contact.shortTitle, href: routes.contact() },
    ],
  },
];

/** Kept for completeness (kennisbank article count in nav copy etc.). */
export const kennisbankCount = ARTICLES.length;
