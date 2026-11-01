import { Suspense } from "react";
import SiteChrome, { SiteChromeWithPath } from "./SiteChrome";

/**
 * Shared header + mobile menu + mobile sticky CTA for every page (rendered in the root layout).
 * usePathname() lives inside Suspense (cacheComponents): the fallback is the same chrome
 * without an active nav item.
 */
export default function SiteHeader() {
  return (
    <Suspense fallback={<SiteChrome pathname="" />}>
      <SiteChromeWithPath />
    </Suspense>
  );
}
