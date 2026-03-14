import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Categories } from "@/components/categories/Categories";
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
  title: "StelarNews",
  description: "Portal de noticias rápido y moderno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
      <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]">
        <Header />
        <Categories />
        {children}
        <Footer />
      </div>
      </body>
    </html>
  );
}
