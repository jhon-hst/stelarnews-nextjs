interface ArticleHeaderProps {
  title: string;
  description: string;
}

export function ArticleHeader({ title, description }: ArticleHeaderProps) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a]">
        Artículo
      </p>
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-slate-600">{description}</p>
    </section>
  );
}

