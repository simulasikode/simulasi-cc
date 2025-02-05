import type { Metadata } from "next";
import "./globals.css";
import Menu from "@/components/Menu";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import localFont from "next/font/local";

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
  description: "Screen printing studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${SkRegular.variable} ${SkBold.variable} ${Skmono.variable} antialiased`}
      >
        <ThemeSwitcher />
        <Menu />
        {children}
      </body>
    </html>
  );
}
