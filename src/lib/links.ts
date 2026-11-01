// Resolve slugs → { href, label } via the registry (01 §6). Builders never string-build URLs.
import {
  ARTICLES,
  COMPARISONS,
  POSTS,
  PROJECTS,
  SERVICES,
  type ArticleSlug,
  type ComparisonSlug,
  type PostSlug,
  type ProjectSlug,
  type ServiceSlug,
} from "@/content/registry";
import type { LinkItem } from "@/content/types";
import { routes } from "./routes";

function find<T extends { slug: string }>(list: readonly T[], slug: string, kind: string): T | undefined {
  const item = list.find((x) => x.slug === slug);
  if (!item && process.env.NODE_ENV !== "production") {
    throw new Error(`[links] Onbekende ${kind}-slug: "${slug}" – voeg hem toe aan src/content/registry.ts`);
  }
  return item;
}

export function serviceLink(slug: ServiceSlug, label?: string): LinkItem {
  const s = find(SERVICES, slug, "service");
  return { href: routes.service(slug), label: label ?? s?.shortTitle ?? slug, kind: "service" };
}
export function comparisonLink(slug: ComparisonSlug, label?: string): LinkItem {
  const s = find(COMPARISONS, slug, "comparison");
  return { href: routes.comparison(slug), label: label ?? s?.shortTitle ?? slug, kind: "comparison" };
}
export function projectLink(slug: ProjectSlug, label?: string): LinkItem {
  const s = find(PROJECTS, slug, "project");
  return { href: routes.project(slug), label: label ?? s?.shortTitle ?? slug, kind: "project" };
}
export function postLink(slug: PostSlug, label?: string): LinkItem {
  const s = find(POSTS, slug, "post");
  return { href: routes.post(slug), label: label ?? s?.shortTitle ?? slug, kind: "post" };
}
export function articleLink(slug: ArticleSlug, label?: string): LinkItem {
  const s = find(ARTICLES, slug, "article");
  return { href: routes.article(slug), label: label ?? s?.shortTitle ?? slug, kind: "article" };
}

/** Build a related-links list from relation arrays (any combination). */
export function relatedLinks(rel: {
  services?: readonly ServiceSlug[];
  comparisons?: readonly ComparisonSlug[];
  projects?: readonly ProjectSlug[];
  articles?: readonly ArticleSlug[];
  posts?: readonly PostSlug[];
}): LinkItem[] {
  return [
    ...(rel.services ?? []).map((s) => serviceLink(s)),
    ...(rel.comparisons ?? []).map((s) => comparisonLink(s)),
    ...(rel.projects ?? []).map((s) => projectLink(s)),
    ...(rel.articles ?? []).map((s) => articleLink(s)),
    ...(rel.posts ?? []).map((s) => postLink(s)),
  ];
}
