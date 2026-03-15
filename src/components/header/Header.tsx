import { Search } from "lucide-react";
import Image from "next/image";

export function Header() {
    return (
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 via-cyan-400 to-indigo-500 shadow-lg shadow-sky-500/40">
                        <Image
                            src="/globe.svg"
                            alt="StelarNews logo"
                            fill
                            sizes="36px"
                            className="object-cover opacity-70"
                        />
                    </div>
                    <div className="leading-tight">
                        <p className="font-display text-lg font-semibold tracking-tight text-slate-900">
                            StelarNews
                        </p>
                        <p className="text-xs text-slate-500">
                            Noticias al instante, en un solo lugar
                        </p>
                    </div>
                </div>

                {/* <div className="ml-auto flex-1 max-w-md">
                    <form className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            placeholder="Buscar noticias, temas o autores..."
                            className="w-full rounded-full border border-slate-200 bg-white px-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm shadow-slate-200/80 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        />
                    </form>
                </div> */}
            </div>
        </header>
    );
}
