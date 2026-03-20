import type { Metadata } from "next";
import { ItemArticle } from "@/components/article/Article";
import { Categories } from "@/components/categories/Categories";
import { createClient } from "@/lib/supabase-client";
import { Tables } from "@/types/database.types";

// ✅ Renderizado estático — se genera una sola vez en build time
export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: "News Refined for the Modern Reader",
  description: "Stay ahead with curated, high-quality news stories analyzed and distilled for the modern digital reader.",
  openGraph: {
    title: "News Refined for the Modern Reader",
    description: "Stay ahead with curated, high-quality news stories analyzed and distilled for the modern digital reader.",
    url: "/",
    type: "website",
    images: [{ url: "/logo.webp", width: 1200, height: 630, alt: "EstelarNews – News Refined for the Modern Reader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "News Refined for the Modern Reader",
    description: "Stay ahead with curated, high-quality news stories analyzed and distilled for the modern digital reader.",
    images: ["/logo.webp"],
  },
};

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

type ArticleWithCategoryName = Tables<"articles"> & { category: string };

async function fetchHomeData() {
  const supabase = createClient();

  const [{ data: articlesData, error }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*, categories(*)")
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true }),
    ]);

  if (error) console.error("Error fetching articles", error);

  const articles: ArticleWithCategoryName[] = (
    (articlesData ?? []) as ArticleWithCategory[]
  ).map((item) => ({
    ...item,
    category: item.categories?.name ?? "Uncategorized",
  }));

  const categories = (categoriesData ?? []) as Tables<"categories">[];

  return { articles, categories };
}

export default async function Home() {
  // ✅ Solo se ejecuta en build time, nunca en runtime
  const { articles, categories } = await fetchHomeData();

  return (
    <>
      <Categories categories={categories} activeCategoryId={undefined} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
            All news
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            News Refined for the Modern Reader
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            The most important stories, analyzed and simplified. Experience
            high-quality journalism designed for a fast-paced world. Welcome to
            the future of digital news.
          </p>
        </section>
        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ItemArticle key={article.id} article={article} />
          ))}
        </section>
      </main>
    </>
  );
}