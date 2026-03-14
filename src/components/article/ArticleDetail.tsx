import { ARTICLE_DETAIL } from "@/utils/articleDetail";
import { ArticleDetailSection } from "./ArticleDetailSection";
import { ArticleSectionType } from "@/utils/types";

export function ArticleDetail() {
  const { title, description, sections } = ARTICLE_DETAIL;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
          Artículo destacado
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
          {description}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
          Descubre estos destinos
        </h2>
        <p className="max-w-2xl text-sm text-slate-600">
          A continuación encontrarás una selección de lugares inolvidables con
          una breve descripción para que puedas inspirarte y planear tu próxima
          aventura.
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:mt-4 sm:gap-5">
          {sections.map((section: ArticleSectionType) => (
            <ArticleDetailSection key={section.id} section={section} />
          ))}
        </div>
      </section>
    </main>
  );
}
