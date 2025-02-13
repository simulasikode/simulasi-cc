"use client";
import "./globals.css";
import Menu from "@/components/Menu";
import localFont from "next/font/local";
import { GoogleTagManager } from "@next/third-parties/google";
import GoogleAnalytics from "@/utils/GoogleAnalytics";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import MetadataComponent from "@/components/MetadataComponent";
import SmoothScrolling from "@/components/SmoothScrolling";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <MetadataComponent />
      </head>
      <GoogleAnalytics />
      <body
        className={`${SkRegular.variable} ${SkBold.variable} ${Skmono.variable} antialiased min-h-[101vh] p-[10px]`}
      >
        <SmoothScrolling>
          <GoogleTagManager gtmId="GTM-PBBJ5ZFZ" />
          <Menu />
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 1, y: 10 }}
              animate={{ opacity: 2, y: 0 }}
              exit={{ opacity: 1, y: -10 }}
              transition={{ duration: 1.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <Footer />
        </SmoothScrolling>
      </body>
    </html>
  );
}
