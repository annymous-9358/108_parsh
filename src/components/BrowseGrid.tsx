"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Tirtha } from "@/lib/types";
import { TirthaCard } from "@/components/TirthaCard";

export function BrowseGrid({ tirthas }: { tirthas: Tirtha[] }) {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<string>("सभी");

  const states = useMemo(() => {
    const s = new Set<string>();
    tirthas.forEach((t) => t.state && s.add(t.state));
    return ["सभी", ...Array.from(s).sort()];
  }, [tirthas]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return tirthas.filter((t) => {
      if (state !== "सभी" && t.state !== state) return false;
      if (!q) return true;
      return (
        t.title.includes(q) ||
        (t.city ?? "").includes(q) ||
        (t.state ?? "").includes(q) ||
        String(t.entry_number).includes(q)
      );
    });
  }, [tirthas, query, state]);

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
            placeholder="नाम, शहर या क्रमांक से खोजें…"
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

      <p className="mb-4 font-ui text-xs text-ink-soft">
        {filtered.length} तीर्थ मिले
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-body text-ink-soft">
          कोई तीर्थ नहीं मिला। कृपया अलग शब्द से खोजें।
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t) => (
            <TirthaCard key={t.id} tirtha={t} />
          ))}
        </div>
      )}
    </div>
  );
}
