import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGES } from "@/content/registry";
import { allPosts, getPost } from "@/content/blog";
import { getTeamMember } from "@/content/team";
import { absoluteUrl, routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import ArticleTemplate from "@/components/content/ArticleTemplate";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  const author = getTeamMember(p.author);
  return buildMetadata({
    title: p.seoTitle ?? p.title,
    description: p.seoDescription ?? p.description,
    path: routes.post(p.slug),
    type: "article",
    publishedTime: p.publishedAt,
    modifiedTime: p.updatedAt,
    authors: author ? [absoluteUrl(routes.team(author.slug))] : undefined,
    section: p.category,
  });
}

export default function BlogPostPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const path = routes.post(p.slug);
  return (
    <ArticleTemplate
      kind="post"
      item={p}
      path={path}
      breadcrumb={[
        { label: PAGES.home.shortTitle, href: routes.home() },
        { label: PAGES.blog.shortTitle, href: routes.blog() },
        { label: p.shortTitle },
      ]}
    />
  );
}
