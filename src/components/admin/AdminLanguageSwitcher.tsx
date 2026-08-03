"use client";

import { useRouter } from "next/navigation";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n/languages";
import { ADMIN_LANG_COOKIE } from "@/lib/i18n/admin-lang-cookie";

/** Lets an admin pick the admin panel's own UI language, stored in a cookie
 * (not the page URL, since /admin routes sit outside the public [lang]
 * segment) so it persists across the whole admin session. */
export function AdminLanguageSwitcher({ lang, label }: { lang: LanguageCode; label: string }) {
  const router = useRouter();

  function onChange(next: string) {
    document.cookie = `${ADMIN_LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 font-ui text-xs text-ink-soft">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={lang}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-sandstone-deep bg-ivory px-2 py-1 font-ui text-xs text-ink outline-none focus:border-maroon"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
