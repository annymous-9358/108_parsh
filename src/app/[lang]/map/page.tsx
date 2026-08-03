import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TempleMap } from "@/components/TempleMap";
import { getAllTirthaMapPoints } from "@/lib/data";
import { isLanguageCode, type LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getUiStrings(isLanguageCode(lang) ? lang : "hi");
  return { title: `${t.mapTitle} — 108 Parshwanath` };
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!isLanguageCode(langParam)) notFound();
  const lang: LanguageCode = langParam;
  const t = getUiStrings(lang);

  const points = await getAllTirthaMapPoints(lang);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <h1 className="mb-1 font-display text-3xl text-maroon">{t.mapTitle}</h1>
          <p className="mb-6 font-body text-ink-soft">{t.mapSubtitle}</p>
          <TempleMap points={points} lang={lang} />
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
