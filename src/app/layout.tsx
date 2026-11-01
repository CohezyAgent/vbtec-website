import type { Metadata, Viewport } from "next";
import { Figtree, Lexend, Manrope } from "next/font/google";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/routes";
import { organization, website } from "@/lib/schema";
import JsonLd from "@/components/ui/JsonLd";
import SiteHeader from "@/components/site/SiteHeader";
import Footer from "@/components/site/Footer";
import "./globals.css";

// Fonts load once here (04 §1.2); modules use var(--font-figtree) / var(--font-lexend)
// through the tokens --font-label / --font-ui. Manrope is the brand voice (body,
// headings and the heavy VBTEC wordmark).
const figtree = Figtree({ subsets: ["latin"], weight: ["600"], variable: "--font-figtree", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-manrope", display: "swap" });
const lexend = Lexend({ subsets: ["latin"], weight: ["300", "500"], variable: "--font-lexend", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL), // PLACEHOLDER domain
  title: {
    default: "VB-TEC – energie-ingenieurs voor jouw woning",
    template: "%s | VB-TEC",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "nl_BE",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0b4a3f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl-BE" className={`${manrope.variable} ${figtree.variable} ${lexend.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        <main id="inhoud" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <JsonLd data={[organization(), website()]} />
      </body>
    </html>
  );
}
