import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tables } from "@/types/database.types";
import { Categories } from "@/components/categories/Categories";

interface ArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

export async function generateMetadata(
  props: ArticlePageProps
): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const articleId = Number(props.params.id);

  const { data } = await supabase
    .from("articles")
    .select("*, categories(*)")
    .eq("id", articleId)
    .maybeSingle();

  const article = data as ArticleWithCategory | null;

  const title = article?.title ?? "Article";
  const description =
    article?.description ??
    "Read this curated news article on EstelarNews, your modern news portal.";
  const image = article?.image ?? "/logo.webp";
  const categoryName = article?.categories?.name ?? undefined;

  const urlSlug = props.params.slug || "featured-article";
  const urlId = props.params.id || "1";
  const url = `https://estelarnews.com/articles/${urlSlug}/${urlId}`;

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
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: "EstelarNews",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EstelarNews`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;
  const articleId = Number(id);

  const [{ data: articleData, error }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*, categories(*)")
        .eq("id", articleId)
        .maybeSingle(),
      supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true }),
    ]);

  if (error || !articleData) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          The requested article was not found.
        </p>
      </main>
    );
  }

  const article = articleData as ArticleWithCategory;
  const categories = (categoriesData ?? []) as Tables<"categories">[];

  return (
    <>
      <Categories
        categories={categories}
        activeCategoryId={article.category_id ?? undefined}
      />

      <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]"  dangerouslySetInnerHTML={{ __html: article.content ?? "" }}/>

    </>
  );
}
