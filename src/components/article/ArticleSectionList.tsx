import { ArticleSectionType } from "@/utils/types";
import { ArticleSection } from "./ArticleSection";

interface ArticleSectionListProps {
  sections: ArticleSectionType[];
}

export function ArticleSectionList({ sections }: ArticleSectionListProps) {
  if (!sections?.length) return null;

  const limitedSections = sections.slice(0, 10);

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {limitedSections.map((section) => (
        <ArticleSection key={section.id} section={section} />
      ))}
    </section>
  );
}
