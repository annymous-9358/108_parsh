import { notFound } from "next/navigation";
import { isLanguageCode, LANGUAGE_CODES } from "@/lib/i18n/languages";
import { LangAttribute } from "@/components/LangAttribute";
import { Toaster } from "@/components/ui/Toaster";
import { BackToTop } from "@/components/ui/BackToTop";
import { getUiStrings } from "@/lib/i18n/dictionary";

export function generateStaticParams() {
  return LANGUAGE_CODES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguageCode(lang)) notFound();

  return (
    <>
      <LangAttribute lang={lang} />
      {children}
      <Toaster lang={lang} />
      <BackToTop label={getUiStrings(lang).progress.backToTop} />
    </>
  );
}
