// next/image loader for the GitHub Pages static export (STATIC_EXPORT=1, see next.config.ts).
// Pages serves files as-is, so this only prefixes the repo base path; no resizing.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function staticImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  return `${BASE}${src}?w=${width}`;
}
