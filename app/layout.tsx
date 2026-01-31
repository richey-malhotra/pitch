import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Premium body font - clean, modern, highly legible
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Premium display font - bold, distinctive headings
const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "The Engine Room — Frisson Labs | Nescot College",
  description: "A proposal to establish Frisson Labs as Nescot's crown jewel — an arm's-length software company delivering T Level excellence, employer partnerships, and sustainable revenue.",
  keywords: ["T Levels", "Nescot", "Frisson Labs", "Digital Production", "FE innovation", "The Engine Room"],
  authors: [{ name: "Nescot College" }],
  openGraph: {
    title: "The Engine Room — Frisson Labs",
    description: "Establishing Nescot's flagship T Level software company",
    images: ["/og-image.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Engine Room — Frisson Labs",
    description: "Establishing Nescot's flagship T Level software company",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" defer></script>
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-nescot-purple text-white px-4 py-2 rounded z-50">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
