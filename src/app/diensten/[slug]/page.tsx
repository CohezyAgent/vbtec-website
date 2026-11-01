import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { buildMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import ServiceView from "./_components/ServiceView";

// /diensten/[slug] – 7 service sales pages (05 §3). Unknown slug → notFound() (no dynamicParams in Next 16).
type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  return buildMetadata({ title: s.seoTitle ?? s.title, description: s.description, path: routes.service(s.slug) });
}

export default function ServicePage({ params }: Params) {
  return (
    <Suspense fallback={null}>
      <ServiceContentLoader params={params} />
    </Suspense>
  );
}

async function ServiceContentLoader({ params }: Params) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  return <ServiceView s={s} />;
}
