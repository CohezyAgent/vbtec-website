import type { MetadataRoute } from "next";
import { absoluteUrl, routes, SITE_URL } from "@/lib/routes";

// Allow everything public, explicitly welcome search and AI crawlers (AEO goal, 02 §0.9).
const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_AND_SEARCH_BOTS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: absoluteUrl(routes.sitemapXml()),
    host: SITE_URL,
  };
}
