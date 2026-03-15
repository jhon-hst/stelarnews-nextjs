import { ItemArticle } from "@/components/article/Article";
import { Categories } from "@/components/categories/Categories";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { ArticleType } from "@/utils/types";
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createServerSupabaseClient();
  const {  id } = await params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          Categoría no válida.
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

  const articles: ArticleType[] = typedArticles.map((item) => ({
    id: item.id,
    title: item.title ?? "",
    image: item.image ?? "/window.svg",
    categoryId: item.category_id ?? 0,
    category: item.categories?.name ?? "Sin categoría",
  }));

  const categories = (categoriesData ?? []) as Tables<"categories">[];
  const currentCategory = categories.find((c) => c.id === categoryId);

  return (
    <>
      <Categories categories={categories} activeCategoryId={categoryId} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
            Categoría
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {currentCategory?.name ?? "Artículos por categoría"}
          </h1>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hay artículos disponibles para esta categoría.
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
