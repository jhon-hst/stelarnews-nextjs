import type { Metadata } from "next";
import { Tables } from "@/types/database.types";
import { createClient } from "@/lib/supabase-client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AdNative from "@/components/ads/AdNative";
import NextEpisodeButton from "@/components/history/NextEpisodeButton";
import AdBanner from "@/components/ads/AdBanner";
import SwipeIndicator from "@/components/history/SwipeIndicator";

// ✅ CLAVE: Fuerza renderizado completamente estático
// Cada página se genera UNA SOLA VEZ en build time → 0 invocaciones serverless por visita
export const dynamic = "force-static";
export const revalidate = false;

type PagesType = Record<string, string>;

type HistoryType = Tables<"histories"> & {
  pages: PagesType;
};

interface HistoryPageProps {
  params: {
    slug: string;
    id: string;
    page: string;
  };
}

// ✅ Funciones de fetch puras (sin cache wrapper — no necesario con SSG)
async function fetchHistory(id: number): Promise<HistoryType | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("histories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as HistoryType;
}


// ✅ CRÍTICO: Pre-genera todas las rutas en build time
// Sin esto, Next.js renderiza cada página on-demand (consume invocaciones)
export async function generateStaticParams() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("histories")
    .select("id, name, pages");

  if (error || !data) return [];

  const params: { slug: string; id: string; page: string }[] = [];

  for (const history of data) {
    const pages = history.pages as PagesType;

    if (!pages) continue;

    for (const pageKey of Object.keys(pages)) {
      params.push({
        slug: String(history.name), // si luego quieres slugify, aquí también
        id: String(history.id),
        page: pageKey,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: HistoryPageProps): Promise<Metadata> {
  const { id, slug, page } = await params;
  const history = await fetchHistory(Number(id));

  const title = history?.name ?? "History";
  // const description =
  //   history?.description ??
  //   "Read this curated news history on EstelarNews, your modern news portal.";
  const description = "Read this curated news history on EstelarNews, your modern news portal.";
  const image = "https://pub-c38d6e22cb9247ea8a87cbcb25f85c9a.r2.dev/histories/1/141.webp";
  const categoryName = "Infidelidad";
  const url = `https://estelarnews.com/histories/${slug ?? "featured-history"}/${id ?? "1"}/${page ?? "1"}`;

  return {
    title: `${title} | EstelarNews`,
    description,
    keywords: categoryName
      ? [title, categoryName, "news", "history", "EstelarNews"]
      : [title, "news", "history", "EstelarNews"],
    openGraph: {
      title: `${title} | EstelarNews`,
      description,
      url,
      type: "article",
      section: categoryName,
      images: [{ url: image, alt: title }],
      siteName: "EstelarNews",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EstelarNews`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { id, page } = await params;

  // ✅ Con SSG, esto se ejecuta SOLO en build time, nunca en runtime
  const [history] = await Promise.all([
    fetchHistory(Number(id)),
  ]);

    const rangeImages = history?.pages?.[page] as string | undefined;


  if (!history || !rangeImages) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          The requested history was not found.
        </p>
      </main>
    );
  }
  
  const [start, end] = rangeImages.split("-").map(Number);
  
  const init = start - 1;
  const imageArray = Array.from({ length: end - init }, (_, i) => init + i + 1);


  const currentPageKey = page;

  // detectar si es número (evita "prologue")
  const isNumericPage = !isNaN(Number(currentPageKey));

  let nextPageKey: string | null = null;

  if (isNumericPage) {
    const next = String(Number(currentPageKey) + 1);

    if (history.pages[next]) {
      nextPageKey = next;
    }
  }else {
    nextPageKey = "1";
  }



  return (
    <div className="mx-auto">
      {isNumericPage && <AdBanner dimentions="320x50"/>}

     {!isNumericPage && <SwipeIndicator />}
      {imageArray.map((num) => (
        <Image 
          key={num} 
          alt={`${history.name} - page ${page} - image ${num}`}  
          src={`https://pub-c38d6e22cb9247ea8a87cbcb25f85c9a.r2.dev/histories/${id}/${num}.webp`} 
          height="5000" 
          width="900" 
          data-link="" 
          className="block mt-[-1]"
        />
      ))}


     {nextPageKey && (
        <div className="w-full flex justify-center px-5 my-8">
          <div className="w-full max-w-6xl">
            <NextEpisodeButton
              url={`/history/${history.name}/${id}/${nextPageKey}`}
              nextPageKey={nextPageKey}
            />
          </div>
        </div>
      )}

      <AdNative/>
    </div>
  );
}