"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CircleCheckBig, ArrowRight } from "lucide-react";
import { useCompleted } from "@/lib/progress";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

type Props = {
  slug: string;
  /** Tirtha name, shown in the confirmation toast. */
  title?: string;
  lang: LanguageCode;
  /** All slugs in entry order, used for the "x of y" count and next suggestion. */
  allSlugs: string[];
  variant?: "inline" | "panel";
};

export function MarkCompleteButton({ slug, title, lang, allSlugs, variant = "inline" }: Props) {
  const t = getUiStrings(lang).progress;
  const { completed, toggle, hydrated } = useCompleted();
  const [justMarked, setJustMarked] = useState(false);
  const isDone = completed.has(slug);

  const onClick = () => {
    setJustMarked(!isDone);
    toggle(slug, title);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={isDone}
        disabled={!hydrated}
        className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 font-ui text-sm font-medium transition-all disabled:opacity-60 ${
          isDone
            ? "border border-gold bg-gold/15 text-maroon hover:bg-gold/25"
            : "border border-maroon/70 text-maroon hover:-translate-y-0.5 hover:bg-maroon hover:text-ivory"
        }`}
      >
        {isDone ? (
          <CircleCheckBig className="h-4 w-4" aria-hidden />
        ) : (
          <Check className="h-4 w-4" aria-hidden />
        )}
        {isDone ? t.completed : t.markComplete}
      </button>
    );
  }

  const doneCount = allSlugs.filter((s) => completed.has(s)).length;
  const total = allSlugs.length;
  const idx = allSlugs.indexOf(slug);
  // Next not-yet-completed tirtha after this one (wrapping around).
  const nextSlug =
    [...allSlugs.slice(idx + 1), ...allSlugs.slice(0, Math.max(idx, 0))].find(
      (s) => !completed.has(s),
    ) ?? null;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;

  return (
    <section
      className={`relative mt-14 overflow-hidden rounded-md border p-6 text-center transition-colors sm:p-8 ${
        isDone ? "border-gold bg-gold/10" : "border-sandstone-deep bg-sandstone/70"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-gold) 25%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
      <p className="font-ui text-[11px] uppercase tracking-[0.25em] text-gold">{t.yatraProgress}</p>
      <p className="mt-1 font-display text-2xl text-maroon" aria-live="polite">
        {hydrated ? t.countLabel(doneCount, total) : " "}
      </p>
      <div
        className="mx-auto mt-4 h-1.5 max-w-sm overflow-hidden rounded-full bg-sandstone-deep/70"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={doneCount}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-maroon transition-[width] duration-700"
          style={{ width: `${hydrated ? pct : 0}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClick}
          aria-pressed={isDone}
          disabled={!hydrated}
          className={`inline-flex items-center gap-2 rounded-sm px-6 py-3 font-ui text-sm font-medium transition-all disabled:opacity-60 ${
            isDone
              ? "border border-sandstone-deep text-ink-soft hover:border-maroon hover:text-maroon"
              : "bg-maroon text-ivory shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:bg-maroon-deep hover:shadow-[0_8px_20px_-6px_rgba(122,26,43,0.45)]"
          }`}
        >
          {isDone ? t.undo : (
            <>
              <Check className="h-4 w-4" aria-hidden />
              {t.markComplete}
            </>
          )}
        </button>
        {isDone && nextSlug && (
          <Link
            href={`/${lang}/tirtha/${nextSlug}`}
            className="inline-flex items-center gap-2 rounded-sm bg-maroon px-6 py-3 font-ui text-sm font-medium text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep"
          >
            {t.nextToVisit}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </div>

      {isDone && justMarked && (
        <p className="mt-4 font-body text-sm text-maroon animate-[seal-in_320ms_ease-out]">
          {doneCount === total ? t.allDoneMessage : "जय जिनेन्द्र"}
        </p>
      )}
      <p className="mt-4 font-ui text-[11px] text-ink-soft">{process.env.NEXT_PUBLIC_SUPABASE_URL ? t.savedPermanently : t.savedLocally}</p>
    </section>
  );
}
