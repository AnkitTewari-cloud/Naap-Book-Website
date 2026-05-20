import type { Metadata } from "next";
import { Inter, Noto_Sans, Noto_Sans_Devanagari } from "next/font/google";

import { AppProviders } from "@/components/AppProviders";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Naap Book",
  description: "Your tailoring workbook — customers, jobs, and bills in one place.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${notoSans.variable} ${notoDevanagari.variable}`}
        style={{
          fontFamily:
            'var(--font-inter), var(--font-noto-devanagari), var(--font-noto-sans), system-ui, sans-serif',
        }}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
