// JSON-LD builders (02 §0.7 + placeholder-safe rules 00 §2.8). Render with <JsonLd data={…} />.
// Never emits Review/AggregateRating while reviews are placeholders, never Person for
// placeholder team members, and never NAP while site.isPlaceholder is true.

import { site } from "@/content/site";
import type { BreadcrumbItem, FaqItem, TeamMember } from "@/content/types";
import { absoluteUrl, SITE_URL } from "./routes";

type Json = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOCALBUSINESS_ID = `${SITE_URL}/#localbusiness`;

const ctx = { "@context": "https://schema.org" } as const;

const areaServed = { "@type": "AdministrativeArea", name: "Vlaanderen" };

function napFields(): Json {
  if (site.isPlaceholder) return {};
  return {
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    openingHours: site.openingHoursSpec,
  };
}

export function organization(): Json {
  return {
    ...ctx,
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: SITE_URL,
    logo: absoluteUrl("/opengraph-image"),
    description: site.description,
    areaServed,
    sameAs: site.socialProfiles,
    ...(site.isPlaceholder
      ? {}
      : { contactPoint: { "@type": "ContactPoint", telephone: site.phone, email: site.email, contactType: "customer service", availableLanguage: "nl" } }),
  };
}

export function website(): Json {
  return {
    ...ctx,
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    inLanguage: "nl-BE",
    publisher: { "@id": ORG_ID },
  };
}

export function localBusiness(): Json {
  return {
    ...ctx,
    "@type": "HomeAndConstructionBusiness",
    "@id": LOCALBUSINESS_ID,
    name: site.name,
    url: SITE_URL,
    image: absoluteUrl("/opengraph-image"),
    priceRange: "€€",
    areaServed,
    parentOrganization: { "@id": ORG_ID },
    ...napFields(),
  };
}

/** BreadcrumbList. Items without href (e.g. kennisbank category) are skipped; the last item gets the page url. */
export function breadcrumb(items: BreadcrumbItem[], currentPath?: string): Json {
  const linked = items.filter((i, idx) => i.href || idx === items.length - 1);
  return {
    ...ctx,
    "@type": "BreadcrumbList",
    itemListElement: linked.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? currentPath ?? "/"),
    })),
  };
}

/** FAQPage – text must match the visible FAQ verbatim (uses the short `a`). */
export function faqPage(faqs: FaqItem[]): Json {
  return {
    ...ctx,
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function service(s: { name: string; description: string; path: string; serviceType?: string }): Json {
  return {
    ...ctx,
    "@type": "Service",
    "@id": `${absoluteUrl(s.path)}#service`,
    name: s.name,
    serviceType: s.serviceType ?? s.name,
    description: s.description,
    url: absoluteUrl(s.path),
    provider: { "@id": ORG_ID },
    areaServed,
  };
}

/** Article / BlogPosting. Author = Person only when the team is real, else the Organization. */
export function article(a: {
  type?: "Article" | "BlogPosting";
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified: string;
  image?: string;
  author?: TeamMember;
  authorIsPlaceholder?: boolean;
  about?: string;
  section?: string;
}): Json {
  const author =
    a.author && a.authorIsPlaceholder === false
      ? { "@type": "Person", name: a.author.name, url: absoluteUrl(`/team#${a.author.slug}`), jobTitle: a.author.role, worksFor: { "@id": ORG_ID } }
      : { "@id": ORG_ID };
  return {
    ...ctx,
    "@type": a.type ?? "Article",
    headline: a.headline,
    description: a.description,
    url: absoluteUrl(a.path),
    mainEntityOfPage: absoluteUrl(a.path),
    inLanguage: "nl-BE",
    // Google recommends datePublished + image on every Article; fall back to the
    // modified date and the site-wide OG image when a template has none.
    datePublished: a.datePublished ?? a.dateModified,
    dateModified: a.dateModified,
    image: absoluteUrl(a.image ?? "/opengraph-image"),
    ...(a.about ? { about: a.about } : {}),
    ...(a.section ? { articleSection: a.section } : {}),
    author,
    publisher: { "@id": ORG_ID },
  };
}

export function howTo(h: { name: string; description: string; steps: { name: string; text: string }[] }): Json {
  return {
    ...ctx,
    "@type": "HowTo",
    name: h.name,
    description: h.description,
    step: h.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
}

export function itemList(items: { name: string; path: string }[]): Json {
  return {
    ...ctx,
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: absoluteUrl(it.path) })),
  };
}

export function aboutPage(path: string, name: string): Json {
  return { ...ctx, "@type": "AboutPage", name, url: absoluteUrl(path), about: { "@id": ORG_ID } };
}

export function contactPage(path: string, name: string): Json {
  return { ...ctx, "@type": "ContactPage", name, url: absoluteUrl(path), about: { "@id": LOCALBUSINESS_ID } };
}

/** Person entries for /team – returns [] while the team is placeholder. */
export function persons(members: TeamMember[], isPlaceholder: boolean): Json[] {
  if (isPlaceholder) return [];
  return members.map((m) => ({
    ...ctx,
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    url: absoluteUrl(`/team#${m.slug}`),
    worksFor: { "@id": ORG_ID },
    ...(m.knowsAbout ? { knowsAbout: m.knowsAbout } : {}),
  }));
}
