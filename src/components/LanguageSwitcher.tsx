"use client";

import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n/languages";

export function LanguageSwitcher({ lang }: { lang: LanguageCode }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(newLang: string) {
    const segments = pathname.split("/");
    segments[1] = newLang; // [lang] is always the first path segment
    router.push(segments.join("/") || "/");
  }

  return (
    <div className="relative flex items-center">
      <Languages className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-ink-soft" aria-hidden />
      <select
        value={lang}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="भाषा चुनें / Select language"
        className="appearance-none rounded-sm border border-sandstone-deep bg-ivory py-1.5 pl-7 pr-6 font-ui text-xs text-ink outline-none focus:border-maroon cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </div>
  );
}
