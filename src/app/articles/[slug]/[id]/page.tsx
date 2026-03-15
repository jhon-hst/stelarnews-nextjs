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

  const title = article?.title ?? "Artículo";
  const description =
    article?.description ??
    "Lee este artículo en Estelarnews, tu portal de noticias curadas.";
  const image = article?.image ?? "/window.svg";

  const urlSlug = props.params.slug || "15-lugares-mas-hermosos";
  const urlId = props.params.id || "1";
  const url = `https://eEstelarnews.com/articles/${urlSlug}/${urlId}`;

  return {
    title: `${title} | Estelarnews`,
    description,
    openGraph: {
      title: `${title} | Estelarnews`,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: "Estelarnews",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Estelarnews`,
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
          No se encontró el artículo solicitado.
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
