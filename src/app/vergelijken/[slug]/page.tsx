import { Suspense } from "react";
import { notFound } from "next/navigation";
import ComparisonView from "@/components/comparison/ComparisonView";
import { comparisonSlugs, getComparison } from "@/content/comparisons";
import { routes } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import type { ComparisonSlug } from "@/content/registry";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return comparisonSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return {};
  return buildMetadata({
    title: c.seoTitle ?? c.title,
    description: c.seoDescription ?? c.description,
    path: routes.comparison(c.slug as ComparisonSlug),
    type: "article",
    modifiedTime: c.updatedAt,
  });
}

export default function ComparisonRoute({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={null}>
      <ComparisonContent params={params} />
    </Suspense>
  );
}

async function ComparisonContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();
  return <ComparisonView c={c} />;
}
