#!/usr/bin/env sh
# Prepares a CI checkout for the GitHub Pages static export (.github/workflows/pages.yml).
# Never run this in your working copy: it deletes and edits source files.
set -e
# Proxy needs a server.
rm -f src/proxy.ts
# Metadata routes must be marked static for output: "export". The normal build uses
# cacheComponents, which forbids this segment config, so it's only added here.
for f in src/app/robots.ts src/app/sitemap.ts src/app/opengraph-image.tsx; do
  printf '\nexport const dynamic = "force-static";\n' >> "$f"
done
