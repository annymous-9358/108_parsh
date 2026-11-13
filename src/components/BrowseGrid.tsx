"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { TirthaSummary } from "@/lib/types";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";
import { TirthaCard } from "@/components/TirthaCard";
import { YatraProgress } from "@/components/progress/YatraProgress";
import { useCompleted } from "@/lib/progress";

type StatusFilter = "all" | "done" | "pending";

export function BrowseGrid({ tirthas, lang }: { tirthas: TirthaSummary[]; lang: LanguageCode }) {
  const t = getUiStrings(lang);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<string>(t.allStates);
  const [status, setStatus] = useState<StatusFilter>("all");
  const { completed, hydrated } = useCompleted();
  const slugs = useMemo(() => tirthas.map((x) => x.slug), [tirthas]);
  const doneCount = hydrated ? slugs.filter((s) => completed.has(s)).length : 0;

  const states = useMemo(() => {
    const s = new Set<string>();
    tirthas.forEach((x) => x.state && s.add(x.state));
    return [t.allStates, ...Array.from(s).sort()];
  }, [tirthas, t.allStates]);

  const normalize = (s: string) => s.normalize("NFC").toLowerCase();

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return tirthas.filter((x) => {
      if (state !== t.allStates && x.state !== state) return false;
      if (status === "done" && !completed.has(x.slug)) return false;
      if (status === "pending" && completed.has(x.slug)) return false;
      if (!q) return true;
      return (
        normalize(x.title).includes(q) ||
        normalize(x.city ?? "").includes(q) ||
        normalize(x.state ?? "").includes(q) ||
        String(x.entry_number).includes(q)
      );
    });
  }, [tirthas, query, state, status, completed, t.allStates]);

  return (
    <div>
      <YatraProgress lang={lang} slugs={slugs} className="mb-6" />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-sm border border-sandstone-deep bg-ivory py-2.5 pl-10 pr-3 font-body text-sm text-ink placeholder:text-ink-soft focus:border-maroon outline-none"
          />
        </div>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="rounded-sm border border-sandstone-deep bg-ivory px-3 py-2.5 font-ui text-sm text-ink outline-none focus:border-maroon"
        >
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label={t.progress.yatraProgress}
          className="inline-flex rounded-full border border-sandstone-deep bg-sandstone/70 p-1 font-ui text-xs"
        >
          {(
            [
              ["all", t.progress.filterAll, slugs.length],
              ["done", t.progress.filterDone, doneCount],
              ["pending", t.progress.filterPending, slugs.length - doneCount],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={status === key}
              onClick={() => setStatus(key)}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                status === key
                  ? "bg-maroon text-ivory shadow-sm"
                  : "text-ink-soft hover:text-maroon"
              }`}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{hydrated ? count : "–"}</span>
            </button>
          ))}
        </div>
        <p className="font-ui text-xs text-ink-soft">{t.resultsFound(filtered.length)}</p>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-body text-ink-soft">{t.noResults}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((x) => (
            <TirthaCard key={x.id} tirtha={x} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
