const CATEGORIES = [
    "Toda la actualidad",
    "Política",
    "Economía",
    "Tecnología",
    "Deportes",
    "Cultura",
    "Mundo",
    "Opinión",
] as const;

export type Category = (typeof CATEGORIES)[number];

interface CategoriesProps {
    active?: Category | string;
}

export function Categories({ active }: CategoriesProps) {
    return (
        <nav className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
                {CATEGORIES.map((category) => {
                    const isActive = active === category || (!active && category === "Toda la actualidad");
                    return (
                        <button
                            key={category}
                            type="button"
                            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors ${isActive
                                    ? "bg-[#000000] text-white shadow-sm shadow-black/30"
                                    : "bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
