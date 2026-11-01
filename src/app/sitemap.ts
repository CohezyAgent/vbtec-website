import type { MetadataRoute } from "next";
import { COMPARISONS, PAGES, SERVICES, type PageKey } from "@/content/registry";
import { allProjects } from "@/content/projects";
import { allPosts } from "@/content/blog";
import { allArticles } from "@/content/kennisbank";
import { absoluteUrl, routes } from "@/lib/routes";

// Static date strings only (no Date.now()). Bump SITE_UPDATED when static pages change.
const SITE_UPDATED = "2026-11-01";

const PRIORITY: Record<PageKey, number> = {
  home: 1,
  hoeHetWerkt: 0.9,
  diensten: 0.9,
  vergelijken: 0.8,
  kennisbank: 0.7,
  projecten: 0.6,
  blog: 0.6,
  overOns: 0.5,
  hoeWeWerken: 0.5,
  team: 0.5,
  contact: 0.5,
  privacy: 0.2,
};

type Entry = MetadataRoute.Sitemap[number];
const entry = (path: string, lastModified: string, priority: number, changeFrequency: Entry["changeFrequency"] = "monthly"): Entry => ({
  url: absoluteUrl(path),
  lastModified,
  changeFrequency,
  priority,
});

/** /sitemap.xml – every static page plus every slug (services/comparisons from the registry, the rest from content files). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = (Object.keys(PAGES) as PageKey[]).map((k) => entry(PAGES[k].path, SITE_UPDATED, PRIORITY[k], k === "blog" ? "weekly" : "monthly"));
  return [
    ...pages,
    ...SERVICES.map((s) => entry(routes.service(s.slug), SITE_UPDATED, 0.9)),
    ...COMPARISONS.map((c) => entry(routes.comparison(c.slug), SITE_UPDATED, 0.8)),
    ...allArticles.map((a) => entry(routes.article(a.slug), a.updatedAt, 0.7)),
    ...allProjects.map((p) => entry(routes.project(p.slug), p.updatedAt, 0.6)),
    ...allPosts.map((p) => entry(routes.post(p.slug), p.updatedAt, 0.6)),
  ];
}
