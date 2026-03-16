import type { Metadata } from "next";
import { unstable_cache } from "next/cache"; // <-- agrega esto
import { Tables } from "@/types/database.types";
import { Categories } from "@/components/categories/Categories";
import { createClient } from "@/lib/supabase-client";

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

interface ArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

// Funciones de fetch puras
async function fetchArticle(id: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as ArticleWithCategory;
}

async function fetchCategories() {
  const supabase = createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (data ?? []) as Tables<"categories">[];
}

// Versiones cacheadas — revalidate: false = nunca expira automáticamente
const getCachedArticle = unstable_cache(
  async (id: number) => fetchArticle(id),
  ["article-detail"],
  { tags: ["article-detail"], revalidate: false }
);

const getCachedCategories = unstable_cache(
  async () => fetchCategories(),
  ["categories"],
  { tags: ["categories"], revalidate: false }
);

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const article = await getCachedArticle(Number(id));

  const title = article?.title ?? "Article";
  const description = article?.description ?? "Read this curated news article on EstelarNews, your modern news portal.";
  const image = article?.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${article.image}` : "/logo.webp";
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

  const [article, categories] = await Promise.all([
    getCachedArticle(Number(id)),
    getCachedCategories(),
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
      <div
        className="flex min-h-screen flex-col bg-white text-[#1a1a1a]"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </>
  );
}