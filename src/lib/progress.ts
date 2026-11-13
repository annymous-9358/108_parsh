"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * "Darshan complete" tracking. Stored per device in localStorage, keyed by
 * tirtha slug (slugs are language-independent, so progress carries across
 * every UI language). Deliberately client-only: it needs no database
 * schema change and works with or without Supabase configured.
 */
const KEY = "parsh108:completed:v1";
const EVENT = "parsh108:completed-change";
const EMPTY: ReadonlySet<string> = new Set();

let cache: ReadonlySet<string> | null = null;
let cacheRaw: string | null = null;

function read(): ReadonlySet<string> {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache ?? EMPTY;
  }
  if (raw === cacheRaw && cache) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cache = new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
  } catch {
    cache = new Set();
  }
  return cache;
}

function write(next: Set<string>) {
  const raw = JSON.stringify(Array.from(next));
  cache = next;
  cacheRaw = raw;
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // storage unavailable (private mode) — keep in-memory state for this visit
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCompleted() {
  const completed = useSyncExternalStore(subscribe, read, () => EMPTY);
  // Server snapshot is EMPTY; this flag lets callers avoid flashing "0 done"
  // before hydration reads the real value.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((slug: string) => {
    const next = new Set(read());
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    write(next);
  }, []);

  return { completed, toggle, hydrated };
}
