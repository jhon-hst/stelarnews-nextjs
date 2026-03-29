import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import Script from "next/script";
// import Script from "next/script";

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
      {/* Popunder ad clicks ocultos, mejor usar link inteligentes asi se controla cuando puede dar click */}
      {/* <Script
        src="https://pl28932105.effectivegatecpm.com/49/46/1c/49461c807d175833b911239087bf2701.js"
        strategy="afterInteractive"
      /> */}
      <head>
  
        <meta name="97b23db664b7de295158271d6c01eebad835fff6" content="97b23db664b7de295158271d6c01eebad835fff6" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]">
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
          
        </div>

        {/* Social bar ads, son push notification, super invasivos, no se si funciona nunca lo puede probar  */}
        {/* <Script src="https://pl28938789.effectivegatecpm.com/01/ef/ba/01efbaba958df57a0bb6247886e34ac3.js"   strategy="afterInteractive"/> */}
      </body>
      <GoogleAnalytics gaId={gaId} />
    </html>
  );
}
