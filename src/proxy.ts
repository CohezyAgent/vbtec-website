// Real 404 for unknown slugs on the dynamic content routes.
// With cacheComponents the page calls notFound() inside a streamed <Suspense> child, which
// renders the not-found UI with noindex but HTTP 200 (soft 404). This allow-list, built from
// the registry (no other imports, so the proxy bundle stays tiny), rewrites unknown slugs to a
// path that matches no route, so Next answers with a real 404 + src/app/not-found.tsx.
import { NextResponse, type NextRequest } from "next/server";
import { ARTICLES, COMPARISONS, POSTS, PROJECTS, SERVICES } from "@/content/registry";

const KNOWN: Record<string, ReadonlySet<string>> = {
  diensten: new Set(SERVICES.map((s) => s.slug)),
  vergelijken: new Set(COMPARISONS.map((c) => c.slug)),
  kennisbank: new Set(ARTICLES.map((a) => a.slug)),
  blog: new Set(POSTS.map((p) => p.slug)),
  projecten: new Set(PROJECTS.map((p) => p.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const known = KNOWN[section];
  if (!known || !slug) return NextResponse.next();
  if (rest.length === 0 && known.has(decodeURIComponent(slug))) return NextResponse.next();
  return NextResponse.rewrite(new URL("/__pagina-niet-gevonden", request.url));
}

export const config = {
  matcher: ["/diensten/:path+", "/vergelijken/:path+", "/kennisbank/:path+", "/blog/:path+", "/projecten/:path+"],
};
