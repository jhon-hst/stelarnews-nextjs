import { ArticleSectionType } from "@/utils/types";

interface ArticleSectionProps {
  section: ArticleSectionType;
}

export function ArticleSection({ section }: ArticleSectionProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          {section.title}
        </h2>
        <p className="text-sm text-slate-600">{section.description}</p>
      </div>

      <div className="relative h-52 w-full overflow-hidden rounded-xl bg-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#000000_10%,_transparent_55%)] opacity-5" />
        {/* La imagen real se conectará más adelante */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-400">
          Imagen: {section.image}
        </span>
      </div>
    </article>
  );
}
