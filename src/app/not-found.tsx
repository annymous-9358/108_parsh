import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DEFAULT_LANGUAGE } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

export default function NotFound() {
  const t = getUiStrings(DEFAULT_LANGUAGE);
  return (
    <>
      <Header lang={DEFAULT_LANGUAGE} />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="font-display text-3xl text-maroon">{t.notFoundTitle}</h1>
        <p className="max-w-sm font-body text-ink-soft">{t.notFoundBody}</p>
        <Link
          href={`/${DEFAULT_LANGUAGE}/tirthas`}
          className="mt-2 rounded-sm bg-maroon px-6 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
        >
          {t.notFoundCta}
        </Link>
      </main>
      <Footer lang={DEFAULT_LANGUAGE} />
    </>
  );
}
