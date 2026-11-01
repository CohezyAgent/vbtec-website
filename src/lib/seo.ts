// buildMetadata – one helper for every page's Metadata (02 §0.1, §0.5, §0.6).
// Usage (static):  export const metadata = buildMetadata({ title: "Hoe het werkt", description: "…", path: routes.hoeHetWerkt() });
// Usage (dynamic): export async function generateMetadata({ params }) { const { slug } = await params; … return buildMetadata({...}); }
import type { Metadata } from "next";

export type BuildMetadataInput = {
  /** Segment title; the root template appends " | VB-TEC". */
  title: string;
  description: string;
  /** Canonical path, e.g. "/diensten/zonnepanelen" (no trailing slash). */
  path: string;
  /** Use the title as-is (home). */
  absoluteTitle?: boolean;
  type?: "website" | "article";
  /** Article extras for OG. */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  noindex?: boolean;
};

/** Site-wide OG image (src/app/opengraph-image.tsx). Page-level `openGraph` replaces the
 *  layout's (shallow merge), which drops the file-based image – so we re-attach it here. */
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "VB-TEC – energie-ingenieurs voor jouw woning",
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const { title, description, path, absoluteTitle, type = "website", noindex } = input;
  const canonical = path !== "/" ? path.replace(/\/+$/, "") : "/";
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "VB-TEC",
      locale: "nl_BE",
      type,
      images: [OG_IMAGE],
      ...(type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: input.authors,
            section: input.section,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
