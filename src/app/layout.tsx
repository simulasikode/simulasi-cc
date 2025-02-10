import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import localFont from "next/font/local";
import SmoothScrolling from "@/components/SmoothScrolling";
import { GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/utils/GoogleAnalytics";
import Footer from "@/components/Footer";

const SkRegular = localFont({
  src: "../../public/fonts/Sk-Modernist-Regular.otf", // Supports .otf
  display: "swap",
  variable: "--font-skregular", // Creates a CSS variable
});

const SkBold = localFont({
  src: "../../public/fonts/Sk-Modernist-Bold.otf", // Supports .otf
  display: "swap",
  variable: "--font-skbold", // Creates a CSS variable
});

const Skmono = localFont({
  src: "../../public/fonts/Sk-Modernist-Mono.otf", // Supports .otf
  display: "swap",
  variable: "--font-skmono", // Creates a CSS variable
});

export const metadata: Metadata = {
  title: "Simulasi Studio",
  description:
    "Screen printing studio base on Yogyakarta, Indonesia. We offer hand-pulled screen printing on paper using water-based ink.",
  keywords: [
    "screen printing",
    "custom printing",
    "fine art",
    "Poster",
    "local screen printing",
    "Sablon Indonesia",
    "Sablon kertas",
    "art printing",
    "CMYK",
    "RGB",
    "COlor",
    "Paper",
  ],
  openGraph: {
    title: "Simulasi Studio Fine Art Printing", // Same as title or slightly different
    description:
      "Screen printing studio base on Yogyakarta, Indonesia. We offer hand-pulled screen printing on paper using water-based ink.", // Same as description or slightly different
    url: "https://simulasi.studio", // Replace with your website URL
    type: "website", // Usually "website" for a business
    images: [
      {
        url: "https://simulasi.studio/images/papersize.svg", // Replace with your Open Graph image URL
        alt: "Paper Size Chart", // Alt text for the image
        width: 1200, // Recommended width
        height: 630, // Recommended height
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <GoogleAnalytics />
      <body
        className={`${SkRegular.variable} ${SkBold.variable} ${Skmono.variable} antialiased min-h-[100vh] p-[10px]`}
      >
        <GoogleTagManager gtmId="GTM-PBBJ4ZFZ" />

        <Menu />

        <SmoothScrolling>{children}</SmoothScrolling>
        <Footer />
      </body>
    </html>
  );
}
