import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-sandstone-deep/60 bg-ivory/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-3 sm:flex-nowrap sm:justify-between sm:px-5 sm:py-3.5">
        <Link href="/" className="flex items-baseline gap-2.5 group">
          <span className="font-display text-xl leading-none text-maroon group-hover:text-maroon-deep transition-colors sm:text-2xl">
            १०८ पार्श्वनाथ
          </span>
          <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-soft hidden sm:inline">
            Tirtha Darshan
          </span>
        </Link>
        <nav className="font-ui flex items-center gap-3 text-xs sm:gap-5 sm:text-sm text-ink">
          <Link href="/tirthas" className="hover:text-maroon transition-colors">
            तीर्थ सूची
          </Link>
          <Link href="/about" className="hover:text-maroon transition-colors">
            <span className="sm:hidden">इतिहास</span>
            <span className="hidden sm:inline">प्रभु का इतिहास</span>
          </Link>
          <Link
            href="/admin"
            className="text-ink-soft hover:text-maroon transition-colors text-[11px] uppercase tracking-wide"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
