import Link from "next/link";

export function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <div>
                    <p className="font-display text-base font-semibold text-slate-900">
                        EstelarNews
                    </p>
                    <p className="mt-1 max-w-md text-xs leading-relaxed">
                    EstelarNews is an independent digital publisher. We may receive compensation from the companies whose products or services we review. This helps us maintain the site.
                    </p>
                </div>
                <div className="flex flex-wrap gap-4 sm:justify-end">
                    <Link href="/terms-of-service" className="hover:text-sky-400 transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-sky-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/about" className="hover:text-sky-400 transition-colors">
                        About Us
                    </Link>
                </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
                    <span>© {new Date().getFullYear()} EstelarNews. All rights reserved.</span>
                  
                </div>
            </div>
        </footer>
    );
}
