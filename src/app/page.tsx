import { Header } from "@/components/header/Header";
import { Categories } from "@/components/categories/Categories";
import { Footer } from "@/components/footer/Footer";

const MOCK_ARTICLES = [
  {
    id: 1,
    title:
      "Título de ejemplo para una noticia destacada que se completará más adelante",
    category: "Política",
    image: "/window.svg",
  },
  {
    id: 2,
    title:
      "Otra noticia importante con un titular de relleno para completar posteriormente",
    category: "Economía",
    image: "/vercel.svg",
  },
  {
    id: 3,
    title:
      "Cobertura especial sobre un evento relevante. El contenido se definirá después",
    category: "Tecnología",
    image: "/file.svg",
  },
  {
    id: 4,
    title: "Artículo de análisis y opinión con texto provisional",
    category: "Opinión",
    image: "/next.svg",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950 text-slate-50">
      <Header />
      <Categories />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-400">
            Hoy en portada
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Noticias curadas para mantenerte siempre informado.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Este es un texto de ejemplo que describe brevemente el objetivo de
            tu portal de noticias. Más adelante podrás reemplazarlo por un
            resumen real de la línea editorial, el tipo de contenido y el valor
            que ofreces a tus lectores.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/5 bg-slate-900/60 shadow-lg shadow-black/50 transition-transform transition-shadow hover:-translate-y-1 hover:border-sky-500/70 hover:shadow-sky-900/60"
            >
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-sky-500/30 via-cyan-500/20 to-indigo-500/30">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#38bdf8_0,_transparent_55%)] opacity-70 transition-opacity group-hover:opacity-90" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_transparent,_#020617)] opacity-80" />
              </div>
              <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                <span className="inline-flex w-fit rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-300">
                  {article.category}
                </span>
                <h2 className="line-clamp-3 font-display text-base font-semibold leading-snug text-slate-50 group-hover:text-sky-100">
                  {article.title}
                </h2>
                <p className="mt-1 line-clamp-3 text-xs text-slate-400">
                  Este bloque de texto es únicamente de relleno. Aquí podrás
                  mostrar un resumen breve de la noticia para que el lector
                  decida si quiere leer el artículo completo.
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
