import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds the static demo for GitHub Pages (.github/workflows/pages.yml):
// no server, so the lead Server Action is swapped for a client stand-in, images are served
// unoptimised through a base-path loader, and scripts/prepare-static-export.sh drops the proxy.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  ...(staticExport && { output: "export", basePath, trailingSlash: true }),
  images: staticExport
    ? { loader: "custom", loaderFile: "./src/lib/static-export/image-loader.ts", qualities: [75, 90] }
    : { qualities: [75, 90] },
  // Off for the export: it forbids the force-static config the metadata routes need there.
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  turbopack: {
    ...(staticExport && { resolveAlias: { "@/app/actions/lead": "./src/lib/static-export/lead-action.ts" } }),
    rules: {
      "*.css": {
        // Keep CSS Modules out of the Tailwind loader so their class exports survive.
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
