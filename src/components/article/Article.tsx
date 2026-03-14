import { ArticleType } from '@/utils/types';
import Link from 'next/link'


interface ArticleProps {
    article: ArticleType;
}

export function ItemArticle({ article }: ArticleProps) {
    return (
        <Link href={`/articles/${article.title}/${article.id}`}>
        <article
            key={article.id}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:border-[#1a1a1a]/60 hover:shadow-md hover:shadow-slate-200/80"
            >
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#000000_10%,_transparent_55%)] opacity-5 transition-opacity group-hover:opacity-10" />
            </div>
            <div className="flex flex-1 flex-col gap-2 px-4 py-4">
            <span className="inline-flex w-fit rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-[#1a1a1a] ring-1 ring-black/5">
                {article.category}
            </span>
            <h2 className="line-clamp-3 font-display text-base font-semibold leading-snug text-slate-900 group-hover:text-[#000000]">
                {article.title}
            </h2>
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
                Este bloque de texto es únicamente de relleno. Aquí podrás
                mostrar un resumen breve de la noticia para que el lector
                decida si quiere leer el artículo completo.
            </p>
            </div>
        </article>
        </Link>
    )
}
