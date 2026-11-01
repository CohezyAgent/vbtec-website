import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enerza | Smarter Energy for Modern Living",
  description: "Solar energy solutions for modern living.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
