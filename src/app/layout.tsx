import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EstelarNews – Modern News for the Digital Reader",
    template: "%s | EstelarNews",
  },
  description:
    "Fast, modern news portal delivering curated stories and analysis for the digital reader.",
  openGraph: {
    title: "EstelarNews – Modern News for the Digital Reader",
    description:
      "Fast, modern news portal delivering curated stories and analysis for the digital reader.",
    url: "/",
    siteName: "EstelarNews",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "EstelarNews – Modern News for the Digital Reader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EstelarNews – Modern News for the Digital Reader",
    description:
      "Fast, modern news portal delivering curated stories and analysis for the digital reader.",
    images: ["/logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-7C9LQ24BQD";

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
