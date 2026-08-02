import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

export function Footer({ lang }: { lang: LanguageCode }) {
  const t = getUiStrings(lang);
  return (
    <footer className="mt-auto border-t border-sandstone-deep/60 py-8">
      <div className="mx-auto max-w-6xl px-5 font-ui text-xs text-ink-soft flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p>१०८ पार्श्वनाथ तीर्थ दर्शन — श्री पार्श्वनाथ भगवान के तीर्थों का डिजिटल संकलन</p>
        <p>{t.footerCredit}</p>
      </div>
    </footer>
  );
}
