import { ArticleSectionType } from "@/utils/types";
import Image from "next/image";

interface ArticleDetailSectionProps {
  section: ArticleSectionType;
}

export function ArticleDetailSection({ section }: ArticleDetailSectionProps) {
  return (
    <section className=" gap-4 mb-20">
      <h3 className="font-display text-xl font-semibold leading-snug text-slate-900">
        {section.title}
      </h3>
      <div className="flex w-full justify-center">
        <Image
          src={section.image}
          alt={section.title}
          width={600}
          height={400}
          className="h-auto w-full max-h-[400px] max-w-[600px] object-cover"
        />
      </div>

      <div className="flex w-full max-w-[600px] flex-col gap-2">
      
        <p className="text-sm text-slate-700 sm:text-base">
          {section.description}
        </p>
      </div>
    </section>
  );
}