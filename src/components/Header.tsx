import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavLinks } from "@/components/ui/NavLinks";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

export function Header({ lang }: { lang: LanguageCode }) {
  const t = getUiStrings(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-sandstone-deep/60 bg-ivory/85 backdrop-blur-md shadow-[0_1px_0_color-mix(in_oklab,var(--color-gold)_25%,transparent)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-3 sm:flex-nowrap sm:justify-between sm:px-5 sm:py-3.5">
        <Link href={`/${lang}`} className="flex items-baseline gap-2.5 group">
          <span className="font-display text-xl leading-none text-maroon group-hover:text-maroon-deep transition-colors sm:text-2xl">
            १०८ पार्श्वनाथ
          </span>
          <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-soft hidden sm:inline">
            {t.siteSubtitle}
          </span>
        </Link>
        <nav className="font-ui flex items-center gap-3 text-xs sm:gap-5 sm:text-sm text-ink">
          <NavLinks
            items={[
              { href: `/${lang}/tirthas`, label: t.navList },
              { href: `/${lang}/about`, label: t.navHistory },
              { href: `/${lang}/map`, label: t.navMap },
            ]}
          />
          <Link
            href="/admin"
            className="text-ink-soft hover:text-maroon transition-colors text-[11px] uppercase tracking-wide"
          >
            {t.navAdmin}
          </Link>
          <LanguageSwitcher lang={lang} />
        </nav>
      </div>
    </header>
  );
}
