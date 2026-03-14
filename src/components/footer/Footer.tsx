export function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div>
                    <p className="font-display text-base font-semibold text-slate-900">
                        StelarNews
                    </p>
                    <p className="mt-1 max-w-md text-xs leading-relaxed">
                        Este es un texto de ejemplo para la descripción del portal de noticias.
                        Más adelante podrás completar este espacio con información real sobre
                        tu medio, misión y valores editoriales.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 sm:justify-end">
                    <a href="#" className="hover:text-sky-400 transition-colors">
                        Términos y condiciones
                    </a>
                    <a href="#" className="hover:text-sky-400 transition-colors">
                        Políticas de privacidad
                    </a>
                    <a href="#" className="hover:text-sky-400 transition-colors">
                        Acerca de nosotros
                    </a>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
                    <span>© {new Date().getFullYear()} StelarNews. Todos los derechos reservados.</span>
                    <span className="hidden sm:inline">
                        Construido para ser rápido, moderno y centrado en la experiencia de lectura.
                    </span>
                </div>
            </div>
        </footer>
    );
}
