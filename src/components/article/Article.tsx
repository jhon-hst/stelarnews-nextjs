import { Tables } from '@/types/database.types';
import Link from 'next/link';
import Image from 'next/image';


export interface ArticleProps {
    article: Tables<"articles"> & { category: string };
}

export function ItemArticle({ article }: ArticleProps) {
    const imageUrl = article.image;
    return (
        <Link href={`/articles/${article.title}/${article.id}`}>
        <article
            key={article.id}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform transition-shadow hover:-translate-y-0.5 hover:border-[#1a1a1a]/60 hover:shadow-md hover:shadow-slate-200/80"
            >
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
            {imageUrl ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${imageUrl}`}
                alt={article.title ?? ''}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : null}
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
                {article.description}
            </p>
            </div>
        </article>
        </Link>
    )
}
