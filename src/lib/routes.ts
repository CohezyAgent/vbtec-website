// Route helpers – the only place where URLs are built (01 §6).
import type {
  ArticleSlug,
  ComparisonSlug,
  PostSlug,
  ProjectSlug,
  ServiceSlug,
} from "@/content/registry";

export const SITE_URL = "https://www.vb-tec.be"; // PLACEHOLDER domain – confirm with client
export const LEAD_ANCHOR = "berekening";

export const routes = {
  home: () => "/",
  hoeHetWerkt: () => "/hoe-het-werkt",
  diensten: () => "/diensten",
  service: (slug: ServiceSlug) => `/diensten/${slug}`,
  vergelijken: () => "/vergelijken",
  comparison: (slug: ComparisonSlug) => `/vergelijken/${slug}`,
  projecten: () => "/projecten",
  project: (slug: ProjectSlug) => `/projecten/${slug}`,
  blog: () => "/blog",
  post: (slug: PostSlug) => `/blog/${slug}`,
  kennisbank: () => "/kennisbank",
  article: (slug: ArticleSlug) => `/kennisbank/${slug}`,
  overOns: () => "/over-ons",
  hoeWeWerken: () => "/hoe-we-werken",
  team: (member?: string) => (member ? `/team#${member}` : "/team"),
  contact: () => "/contact",
  privacy: () => "/privacy",
  sitemapXml: () => "/sitemap.xml",
  /** In-page anchor of the LeadSection at the end of every page. */
  lead: () => `#${LEAD_ANCHOR}`,
  /** Lead form on the contact page (used from pages without a LeadSection). */
  contactLead: () => `/contact#${LEAD_ANCHOR}`,
} as const;

/** Absolute URL for structured data / OG. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
}
