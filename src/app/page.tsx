import { ItemArticle } from "@/components/article/Article";
import { Categories } from "@/components/categories/Categories";
import { ArticleType } from "@/utils/types";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tables } from "@/types/database.types";

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const [{ data: articlesData, error }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*, categories(*)")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name", { ascending: true }),
    ]);

  if (error) {
    console.error("Error fetching articles", error);
  }

  const typedData = (articlesData ?? []) as ArticleWithCategory[];

  const articles: ArticleType[] = typedData.map((item) => ({
    id: item.id,
    title: item.title ?? "",
    image: item.image ?? "/window.svg",
    categoryId: item.category_id ?? 0,
    category: item.categories?.name ?? "Sin categoría",
  }));

  const categories = (categoriesData ?? []) as Tables<"categories">[];

  return (
      <>
      <Categories categories={categories} activeCategoryId={undefined} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
            Hoy en portada
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Noticias curadas para mantenerte siempre informado.
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Este es un texto de ejemplo que describe brevemente el objetivo de
            tu portal de noticias. Más adelante podrás reemplazarlo por un
            resumen real de la línea editorial, el tipo de contenido y el valor
            que ofreces a tus lectores.
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
