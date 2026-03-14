import { Header } from "@/components/header/Header";
import { Categories } from "@/components/categories/Categories";
import { Footer } from "@/components/footer/Footer";
import { ItemArticle } from "@/components/article/Article";
import { ArticleType } from "@/utils/types";

const MOCK_ARTICLES: ArticleType[] = [
  {
    id: 1,
    title:
      "Título de ejemplo para una noticia destacada que se completará más adelante",
    category: "Política",
    categoryId: 1,
    image: "/window.svg",
  },
  {
    id: 2,
    title:
      "Otra noticia importante con un titular de relleno para completar posteriormente",
    category: "Economía",
    categoryId: 2,
    image: "/vercel.svg",
  },
  {
    id: 3,
    title:
      "Cobertura especial sobre un evento relevante. El contenido se definirá después",
    category: "Tecnología",
    categoryId: 3,
    image: "/file.svg",
  },
  {
    id: 4,
    title: "Artículo de análisis y opinión con texto provisional",
    category: "Opinión",
    categoryId: 4,
      image: "/next.svg",
  },
];

export default function Home() {
  return (


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
          {MOCK_ARTICLES.map((article) => (
            <ItemArticle key={article.id} article={article} />
          ))}
        </section>
      </main>


  );
}
