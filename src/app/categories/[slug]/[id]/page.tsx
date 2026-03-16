import type { Metadata } from "next";
import { ItemArticle } from "@/components/article/Article";
import { Categories } from "@/components/categories/Categories";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tables } from "@/types/database.types";

type CategoryPageProps = {
  params: {
    slug: string;
    id: string;
  };
};

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

export async function generateMetadata(
  props: CategoryPageProps
): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const categoryId = Number(props.params.id);

  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .maybeSingle();

  const category = data as Tables<"categories"> | null;
  const categoryName = category?.name ?? "Category";

  const title = `${categoryName} News`;
  const description = `Explore curated news and articles in the ${categoryName.toLowerCase()} category on EstelarNews.`;
  const image = "/logo.webp";

  const urlSlug = props.params.slug || "news";
  const urlId = props.params.id || "1";
  const url = `https://estelarnews.com/categories/${urlSlug}/${urlId}`;

  return {
    title: `${title} | EstelarNews`,
    description,
    keywords: [categoryName, "news", "category", "EstelarNews"],
    openGraph: {
      title: `${title} | EstelarNews`,
      description,
      url,
      type: "website",
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createServerSupabaseClient();
  const {  id } = await params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          Invalid category.
        </p>
      </main>
    );
  }

  const [{ data: categoriesData }, { data: articlesData, error }] =
    await Promise.all([
      supabase.from("categories").select("*").order("name", { ascending: true }),
      supabase
        .from("articles")
        .select("*, categories(*)")
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false }),
    ]);

  if (error) {
    console.error("Error fetching articles by category", error);
  }

  const typedArticles = (articlesData ?? []) as ArticleWithCategory[];

  type ArticleWithCategoryName = Tables<"articles"> & { category: string };
  const articles: ArticleWithCategoryName[] = typedArticles.map((item) => ({
    ...item,
    category: item.categories?.name ?? "Uncategorized",
  }));

  const categories = (categoriesData ?? []) as Tables<"categories">[];
  const currentCategory = categories.find((c) => c.id === categoryId);

  return (
    <>
      <Categories categories={categories} activeCategoryId={categoryId} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
            Category
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {currentCategory?.name ?? "Articles by category"}
          </h1>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <p className="text-sm text-slate-600">
              There are no articles available for this category.
            </p>
          ) : (
            articles.map((article) => (
              <ItemArticle key={article.id} article={article} />
            ))
          )}
        </section>
      </main>
    </>
  );
}
