import Link from "next/link";
import { Tables } from "@/types/database.types";

interface CategoriesProps {
  categories: Tables<"categories">[];
  activeCategoryId?: number;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "categoria";

export function Categories({ categories, activeCategoryId }: CategoriesProps) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
            activeCategoryId == null
              ? "bg-[#000000] text-white shadow-sm shadow-black/30"
              : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          All news
        </Link>

        {categories.map((category) => {
          const id = category.id;
          const name = category.name ?? "Categoría";
          const slug = slugify(name);
          const isActive = activeCategoryId === id;

          return (
            <Link
              key={id}
              href={`/categories/${slug}/${id}`}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#000000] text-white shadow-sm shadow-black/30"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
