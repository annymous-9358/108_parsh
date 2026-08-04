import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MalaRing } from "@/components/MalaRing";
import { TirthaCard } from "@/components/TirthaCard";
import { ContinueReading } from "@/components/ContinueReading";
import { getAllTirthas } from "@/lib/data";
import { isLanguageCode, type LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";
import { notFound } from "next/navigation";
import { toTirthaSummary } from "@/lib/types";

export const revalidate = 60;


export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!isLanguageCode(langParam)) notFound();
  const lang: LanguageCode = langParam;
  const t = getUiStrings(lang);

  const tirthas = (await getAllTirthas(lang)).map(toTirthaSummary);
  const featured = tirthas.slice(0, 8);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--color-gold) 16%, transparent) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 pb-16 pt-14 text-center lg:pb-24 lg:pt-20">
            <div className="relative flex items-center justify-center">
              <MalaRing
                total={tirthas.length || 108}
                size={380}
                className="max-w-full text-maroon"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-10">
                <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-gold">
                  Shri
                </p>
                <h1 className="font-display text-5xl leading-[1.15] text-maroon sm:text-6xl">
                  १०८ पार्श्वनाथ
                </h1>
                <p className="font-ui text-xs uppercase tracking-[0.25em] text-ink-soft">
                  {t.siteSubtitle}
                </p>
              </div>
            </div>

            <p className="max-w-xl text-balance font-body text-lg leading-relaxed text-ink-soft">
              {t.heroTagline(tirthas.length || 108)}
            </p>

            <div className="flex w-full flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${lang}/tirthas`}
                className="rounded-sm bg-maroon px-6 py-3 font-ui text-sm font-medium text-ivory shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-[0_8px_20px_-6px_rgba(122,26,43,0.45)]"
              >
                {t.ctaBrowse}
              </Link>
              <Link
                href={`/${lang}/about`}
                className="rounded-sm border border-sandstone-deep px-6 py-3 font-ui text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-maroon hover:text-maroon"
              >
                {t.ctaAbout}
              </Link>
            </div>
          </div>
        </section>

        <ContinueReading lang={lang} />

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">{t.featuredHeading}</h2>
            <Link href={`/${lang}/tirthas`} className="font-ui text-xs text-maroon hover:underline">
              {t.viewAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((x) => (
              <TirthaCard key={x.id} tirtha={x} lang={lang} />
            ))}
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  );
}
