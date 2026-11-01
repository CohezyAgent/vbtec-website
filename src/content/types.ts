// Shared content types (foundation-owned, docs/spec/00-decisions.md §2.2).
// Builders may add page-specific optional fields with an intersection type in their
// own content file; they never edit this file (request changes under Notes in 06).

import type { ReactNode } from "react";
import type { FactKey } from "./facts";
import type { ImageKey } from "./images";
import type {
  ArticleSlug,
  ComparisonSlug,
  Interesse,
  KennisbankCategory,
  PostSlug,
  ProjectSlug,
  ServiceSlug,
} from "./registry";

export type { FactKey } from "./facts";
export type { ImageKey } from "./images";
export type {
  ArticleSlug,
  ComparisonSlug,
  Interesse,
  KennisbankCategory,
  PostSlug,
  ProjectSlug,
  ServiceSlug,
} from "./registry";

/** Section background: White, Deep green, Lime, framed Image. */
export type Bg = "W" | "D" | "L" | "I";
export type Tone = "light" | "dark";
/** Always produced by src/lib/routes.ts helpers, never string-built in components. */
export type Href = string;

export type ImageRef = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** CSS object-position, e.g. "60% 40%" – used for mobile crops. */
  focal?: string;
  /** Intended alt text once the real photo replaces the stock placeholder. */
  altFinal?: string;
};
export type ImageInput = ImageRef | ImageKey;

export type CtaVariant = "lime" | "hero" | "white" | "ghost-dark" | "ink";
export type Cta = { label: string; href: Href; variant?: CtaVariant };

export type LinkKind = "service" | "comparison" | "project" | "article" | "post" | "page";
export type LinkItem = { href: Href; label: string; kind?: LinkKind; description?: string };

/** FAQ item (02 §0.3): `a` = 40–60 words, used verbatim in FAQPage JSON-LD. */
export type FaqItem = { q: string; a: string; aLong?: string };
/** Alias requested by the orchestrator brief. */
export type Faq = FaqItem;

export type BreadcrumbItem = { label: string; href?: Href };

// ───────────────────────── Long-form content blocks ─────────────────────────
// Rendered by <ArticleBody blocks={…} /> (src/components/sections/ArticleBody.tsx).
// Inline text in p / list / callout supports **bold** and [label](/href).
export type CalloutKind = "rekenvoorbeeld" | "mythe" | "eerlijk" | "info";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; kind: CalloutKind; title?: string; text: string | string[]; factKeys?: FactKey[] }
  | { type: "stat"; k: FactKey; label: string; format?: Intl.NumberFormatOptions }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; image: ImageInput; caption?: string; ratio?: ImageRatio }
  | { type: "faq"; items: FaqItem[]; title?: string }
  | { type: "cta"; title: string; body?: string; cta: Cta }
  | { type: "table"; caption: string; columns: string[]; rows: string[][] }
  | { type: "kortAntwoord"; text: string; factKeys?: FactKey[] };

export type ImageRatio = "16/9" | "4/3" | "3/2" | "1/1" | "4/5" | "16/10" | "3/4";

// ───────────────────────── People & proof ─────────────────────────
export type Review = {
  id: string;
  /** Voornaam + initiaal, e.g. "Sarah V." */
  name: string;
  /** Gemeente */
  place: string;
  homeType?: string;
  products: ServiceSlug[];
  text: string;
  /** YYYY-MM */
  date: string;
  /** Optional link to the matching (placeholder) project. */
  project?: ProjectSlug;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  personalLine?: string;
  certifications?: string[];
  knowsAbout?: string[];
  installationsCount?: number;
  image?: ImageInput;
};

// ───────────────────────── Shared item base ─────────────────────────
type ItemBase = {
  title: string;
  shortTitle: string;
  /** Meta description, 140–160 chars. */
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  /** YYYY-MM-DD, static string. */
  updatedAt: string;
  relatedServices?: ServiceSlug[];
  relatedComparisons?: ComparisonSlug[];
  relatedProjects?: ProjectSlug[];
  relatedArticles?: ArticleSlug[];
  relatedPosts?: PostSlug[];
};

export type PainPoint = { eyebrow?: string; title: string; body?: string; tone?: "D" | "G" | "I"; image?: ImageInput; factKeys?: FactKey[] };

export type Service = ItemBase & {
  slug: ServiceSlug;
  h1: string;
  heroLead: string;
  image: ImageInput;
  heroFact?: { k?: FactKey; title: string; value?: string; image?: ImageInput };
  kortAntwoord: string;
  painPoints: PainPoint[];
  /** Product-specific myth key from MYTHS (facts.ts). */
  mythKey?: string;
  advisesAgainst: string[];
  calculates: { title: string; body: string; image?: ImageInput }[];
  deliverables: string[];
  featuredProject?: ProjectSlug;
  faq: FaqItem[];
  /** Interest preselected in the lead form. */
  interesse?: Interesse[];
};

export type Comparison = ItemBase & {
  slug: ComparisonSlug;
  h1: string;
  lead: string;
  kortAntwoord: string;
  /** Lead form preselection (00 §2.12). */
  interesse: Interesse[];
  options: [string, string];
  whenA: string[];
  whenB: string[];
  whenNeither: string;
  mythKeys?: string[];
  image: ImageInput;
  faq: FaqItem[];
};

export type ProjectResult = { label: string; before?: string; after?: string; value?: string; note?: string };

export type Project = ItemBase & {
  slug: ProjectSlug;
  isPlaceholder: boolean;
  h1: string;
  place: string;
  homeType: string;
  buildYear?: string;
  products: ServiceSlug[];
  /** Headline number, e.g. { before: "€ 275", after: "€ 60", unit: "/maand" } – indicatief. */
  headline: { before: string; after: string; unit: string };
  image: ImageInput;
  gallery?: ImageInput[];
  quote?: { text: string; name: string };
  results?: ProjectResult[];
  /** True for the honest "we advised against" case. */
  advisedAgainst?: boolean;
  summary: string;
  body?: Block[];
  faq?: FaqItem[];
};

export type Post = ItemBase & {
  slug: PostSlug;
  h1: string;
  category: string;
  /** Team member slug. */
  author: string;
  publishedAt: string;
  image?: ImageInput;
  excerpt: string;
  kortAntwoord?: string;
  body: Block[];
  faq?: FaqItem[];
  sources?: FactKey[];
};

export type Article = ItemBase & {
  slug: ArticleSlug;
  h1: string;
  category: KennisbankCategory;
  author: string;
  publishedAt: string;
  image?: ImageInput;
  excerpt: string;
  kortAntwoord: string;
  body: Block[];
  faq: FaqItem[];
  sources?: FactKey[];
};

/** Generic node type helper for content that may hold rich text. */
export type Rich = ReactNode;
