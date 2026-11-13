"use client";

import Link from "next/link";
import { useCompleted } from "@/lib/progress";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

/** Compact progress strip: count, bar, and a jump to the next pending tirtha. */
export function YatraProgress({
  lang,
  slugs,
  className = "",
}: {
  lang: LanguageCode;
  slugs: string[];
  className?: string;
}) {
  const t = getUiStrings(lang).progress;
  const { completed, hydrated } = useCompleted();
  if (!hydrated) return null;

  const done = slugs.filter((s) => completed.has(s)).length;
  if (done === 0) return null;
  const total = slugs.length;
  const pct = Math.round((done / total) * 100);
  const nextSlug = slugs.find((s) => !completed.has(s));

  return (
    <div
      className={`flex flex-col gap-3 rounded-md border border-gold/50 bg-sandstone/80 p-4 shadow-[0_1px_2px_rgba(42,31,26,0.06)] backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:px-5 ${className}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-gold">{t.yatraProgress}</p>
          <p className="font-ui text-xs tabular-nums text-ink-soft">{pct}%</p>
        </div>
        <p className="mt-0.5 font-display text-lg text-maroon">{t.countLabel(done, total)}</p>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-sandstone-deep/70"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-maroon transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      {nextSlug ? (
        <Link
          href={`/${lang}/tirtha/${nextSlug}`}
          className="shrink-0 rounded-sm bg-maroon px-4 py-2 text-center font-ui text-xs font-medium text-ivory transition-colors hover:bg-maroon-deep"
        >
          {t.nextToVisit} →
        </Link>
      ) : (
        <p className="shrink-0 font-body text-sm text-maroon">{t.allDoneMessage}</p>
      )}
    </div>
  );
}
