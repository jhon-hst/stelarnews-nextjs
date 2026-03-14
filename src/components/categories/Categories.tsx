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
        <nav className="border-b border-white/5 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/80">
            <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8">
                {CATEGORIES.map((category) => {
                    const isActive = active === category || (!active && category === "Toda la actualidad");
                    return (
                        <button
                            key={category}
                            type="button"
                            className={`whitespace-nowrap rounded-full px-4 py-1.5 transition-colors ${isActive
                                    ? "bg-sky-500 text-white shadow-sm shadow-sky-500/40"
                                    : "bg-white/0 text-slate-200 hover:bg-white/5"
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
