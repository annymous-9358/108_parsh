import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SpeakButton } from "@/components/SpeakButton";
import { isLanguageCode, DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getUiStrings(isLanguageCode(lang) ? lang : "hi");
  return { title: `${t.aboutTitle} — 108 Parshwanath` };
}

function getAboutText() {
  const p = path.join(process.cwd(), "src/content/about_parshwanath.txt");
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!isLanguageCode(langParam)) notFound();
  const lang: LanguageCode = langParam;
  const t = getUiStrings(lang);

  const text = getAboutText();
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold">
              {t.aboutEyebrow}
            </p>
            <SpeakButton text={paragraphs.join(" ")} lang={lang} label={t.listen} stopLabel={t.stopListening} />
          </div>
          <h1 className="mb-4 font-display text-4xl text-maroon">{t.aboutTitle}</h1>
          {lang !== DEFAULT_LANGUAGE && (
            <p className="mb-6 rounded-sm border border-gold/60 bg-sandstone px-4 py-2.5 font-ui text-xs text-ink-soft">
              {t.translationNotice}
            </p>
          )}
          <article className="space-y-4 font-body text-[1.05rem] leading-[1.85] text-ink">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
