import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/utils/GoogleAnalytics";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import { validate } from "jsonschema"; // Import the validator
import type { Viewport } from "next";
import Head from "next/head";

const SkRegular = localFont({
  src: "../../public/fonts/Sk-Modernist-Regular.otf",
  display: "swap",
  variable: "--font-skregular",
});

const SkBold = localFont({
  src: "../../public/fonts/Sk-Modernist-Bold.otf",
  display: "swap",
  variable: "--font-skbold",
});

const Skmono = localFont({
  src: "../../public/fonts/Sk-Modernist-Mono.otf",
  display: "swap",
  variable: "--font-skmono",
});

interface LocaleConfig {
  [locale: string]: {
    href: string;
  };
}

const locales: LocaleConfig = {
  en: { href: "/en" },
  es: { href: "/es" },
  "en-GB": { href: "/en-GB" },
  "x-default": { href: "/" }, // Fallback
};

// JSON Schema for Metadata
const metadataSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    authors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          url: { type: "string", format: "url" }, // Optional URL
        },
        required: ["name"],
      },
    },
    viewport: {
      type: "object",
      properties: {
        width: { type: "string" },
        initialScale: { type: "number" },
        maximumScale: { type: "number" },
      },
      required: ["width", "initialScale"],
    },
    openGraph: {
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        url: { type: "string", format: "url" },
        siteName: { type: "string" },
        images: {
          type: "array",
          items: {
            type: "object",
            properties: {
              url: { type: "string", format: "url" },
              width: { type: "integer" },
              height: { type: "integer" },
              alt: { type: "string" },
            },
            required: ["url", "width", "height", "alt"],
          },
        },
        locale: { type: "string" },
        type: { type: "string" },
      },
      required: [
        "title",
        "description",
        "url",
        "siteName",
        "images",
        "locale",
        "type",
      ],
    },
    robots: {
      type: "object",
      properties: {
        index: { type: "boolean" },
        follow: { type: "boolean" },
        googleBot: {
          type: "object",
          properties: {
            index: { type: "boolean" },
            follow: { type: "boolean" },
          },
          required: ["index", "follow"],
        },
      },
      required: ["index", "follow", "googleBot"],
    },
    alternates: {
      type: "object",
      properties: {
        canonical: { type: "string", format: "url" },
      },
      required: ["canonical"],
    },
  },
  required: ["title", "description"], // Minimum required fields
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
};

const myMetadata: Metadata = {
  title: "Simulasi - Screen Printing Studio ",
  description:
    "Screen printing service transforming creative ideas into actual designs through vibrant colors and intricate patterns.",
  keywords: [
    "Screen printing",
    "Screen printing Studio",
    "Screen printing studio near me",
  ],
  authors: [{ name: "M Fahriza Ansyari", url: "https://simulasi.studio" }],
  openGraph: {
    title: "Simulasi - Screen Printing Studio",
    description:
      "Screen printing service transforming creative ideas into actual designs through vibrant colors and intricate patterns.",
    url: "https://Simulasi.studio",
    siteName: "Simulasi Studio",
    images: [
      {
        url: "https://simulasi.studio/images/papersize.svg",
        width: 1200,
        height: 630,
        alt: "Screen printing poster",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://simulasi.studio",
  },
};

// Validate the metadata
const validationResult = validate(myMetadata, metadataSchema);

if (!validationResult.valid) {
  console.error("Metadata validation errors:", validationResult.errors);
  // You could throw an error here to stop the build process if the metadata is invalid.
  // throw new Error("Invalid metadata");
  // Or, log the errors and continue, depending on your needs.
}

export const metadata: Metadata = myMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <Head>
        {Object.entries(locales).map(([locale, { href }]) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}${href}`}
          />
        ))}
      </Head>
      <GoogleAnalytics />
      <body
        className={`${SkRegular.variable} ${SkBold.variable} ${Skmono.variable} antialiased min-h-[101vh] p-[10px]`}
      >
        <SmoothScrolling>
          <GoogleTagManager gtmId="GTM-PBBJ5ZFZ" />
          <Menu />
          {children}

          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
