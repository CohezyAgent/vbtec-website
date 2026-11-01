import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryTitle, PAGES } from "@/content/registry";
import { allArticles, getArticle } from "@/content/kennisbank";
import { getTeamMember } from "@/content/team";
import { absoluteUrl, routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import ArticleTemplate from "@/components/content/ArticleTemplate";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const author = getTeamMember(a.author);
  return buildMetadata({
    title: a.seoTitle ?? a.title,
    description: a.seoDescription ?? a.description,
    path: routes.article(a.slug),
    type: "article",
    publishedTime: a.publishedAt,
    modifiedTime: a.updatedAt,
    authors: author ? [absoluteUrl(routes.team(author.slug))] : undefined,
    section: categoryTitle(a.category),
  });
}

export default function KennisbankArticlePage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const path = routes.article(a.slug);
  return (
    <ArticleTemplate
      kind="article"
      item={a}
      path={path}
      breadcrumb={[
        { label: PAGES.home.shortTitle, href: routes.home() },
        { label: PAGES.kennisbank.shortTitle, href: routes.kennisbank() },
        { label: categoryTitle(a.category) },
        { label: a.shortTitle },
      ]}
    />
  );
}
