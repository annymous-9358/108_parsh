"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { TirthaSummary } from "@/lib/types";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";
import { TirthaCard } from "@/components/TirthaCard";

export function BrowseGrid({ tirthas, lang }: { tirthas: TirthaSummary[]; lang: LanguageCode }) {
  const t = getUiStrings(lang);
  const [query, setQuery] = useState("");
  const [state, setState] = useState<string>(t.allStates);

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
      if (!q) return true;
      return (
        normalize(x.title).includes(q) ||
        normalize(x.city ?? "").includes(q) ||
        normalize(x.state ?? "").includes(q) ||
        String(x.entry_number).includes(q)
      );
    });
  }, [tirthas, query, state, t.allStates]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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

      <p className="mb-4 font-ui text-xs text-ink-soft">{t.resultsFound(filtered.length)}</p>

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
