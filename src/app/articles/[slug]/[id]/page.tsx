import type { Metadata } from "next";
import { Tables } from "@/types/database.types";
import { createClient } from "@/lib/supabase-client";
import AdNative from "@/components/ads/AdNative";
import AdBanner from "@/components/ads/AdBanner";
import ArticleContent from "@/components/ads/ArticleContent";
import { Categories } from "@/components/categories/Categories";

// ✅ CLAVE: Fuerza renderizado completamente estático
// Cada página se genera UNA SOLA VEZ en build time → 0 invocaciones serverless por visita
export const dynamic = "force-static";
export const revalidate = false;

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

interface ArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

// ✅ Funciones de fetch puras (sin cache wrapper — no necesario con SSG)
async function fetchArticle(id: number): Promise<ArticleWithCategory | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as ArticleWithCategory;
}

async function fetchCategories(): Promise<Tables<"categories">[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (data ?? []) as Tables<"categories">[];
}

// ✅ CRÍTICO: Pre-genera todas las rutas en build time
// Sin esto, Next.js renderiza cada página on-demand (consume invocaciones)
export async function generateStaticParams() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id");
 
  if (error || !data) return [];
 
  return data.map((article) => ({
    id: String(article.id),
    slug: String(article.id), // slug se toma de params en runtime, aquí solo necesitamos el id
  }));
}


export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const article = await fetchArticle(Number(id));

  const title = article?.title ?? "Article";
  const description =
    article?.description ??
    "Read this curated news article on EstelarNews, your modern news portal.";
  const image = article?.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.image}`
    : "/logo.webp";
  const categoryName = article?.categories?.name ?? undefined;
  const url = `https://estelarnews.com/articles/${slug ?? "featured-article"}/${id ?? "1"}`;

  return {
    title: `${title} | EstelarNews`,
    description,
    keywords: categoryName
      ? [title, categoryName, "news", "article", "EstelarNews"]
      : [title, "news", "article", "EstelarNews"],
    openGraph: {
      title: `${title} | EstelarNews`,
      description,
      url,
      type: "article",
      section: categoryName,
      images: [{ url: image, alt: title }],
      siteName: "EstelarNews",
      locale: "en_US",
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

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;

  // ✅ Con SSG, esto se ejecuta SOLO en build time, nunca en runtime
  const [article, categories] = await Promise.all([
    fetchArticle(Number(id)),
    fetchCategories(),
  ]);

  if (!article) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          The requested article was not found.
        </p>
      </main>
    );
  }

  return (
    <>
      <Categories
        categories={categories}
        activeCategoryId={article.category_id ?? undefined}
      />

      <AdBanner dimentions={"dynamic"} />

      {/* Wrapper con banners laterales en desktop */}
      <div className="relative flex justify-center">
        {/* Banner izquierdo */}
        <div className="hidden xl:flex flex-col items-center top-4 h-fit gap-4">
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
        </div>

        {/* Contenido principal */}
        <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a] w-full">
          <ArticleContent html={article.content ?? ""} />
        </div>

        {/* Banner derecho */}
        <div className="hidden xl:flex flex-col items-center top-4 h-fit gap-4">
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
          <AdBanner dimentions={"160x600"} delay={500} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">
          You may also be interested in
        </h2>
      </div>
      <AdNative />
      <AdNative />
      <AdNative />
    </>
  );
}