"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonSession } from "@/lib/supabase/ensure-session";

/**
 * "Darshan complete" tracking, keyed by tirtha slug (slugs are
 * language-independent, so progress carries across every UI language).
 *
 * Supabase (v2.tirtha_completions, one row per user + slug) is the permanent
 * record, tied to the visitor's anonymous auth user. localStorage is a local
 * cache so the UI is instant and still works offline or when Supabase isn't
 * configured. On first use the two are merged: server rows are pulled in and
 * any device-only completions are pushed up.
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

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
let syncStarted = false;
let supabase: ReturnType<typeof createClient> | null = null;

function client() {
  if (!supabase) supabase = createClient();
  return supabase;
}

/** One-time pull + merge with the server copy for this visitor. */
async function syncFromServer() {
  const sb = client();
  const userId = await ensureAnonSession(sb);
  if (!userId) return;
  const { data, error } = await sb.from("tirtha_completions").select("tirtha_slug");
  if (error || !data) return; // table missing / offline — stay on local cache
  const server = new Set(data.map((r: { tirtha_slug: string }) => r.tirtha_slug));
  const local = read();
  const localOnly = Array.from(local).filter((slug) => !server.has(slug));
  if (localOnly.length > 0) {
    await sb
      .from("tirtha_completions")
      .upsert(localOnly.map((tirtha_slug) => ({ tirtha_slug })), {
        onConflict: "user_id,tirtha_slug",
        ignoreDuplicates: true,
      });
  }
  write(new Set([...server, ...read()]));
}

async function pushChange(slug: string, done: boolean) {
  if (!hasSupabase) return;
  const sb = client();
  const userId = await ensureAnonSession(sb);
  if (!userId) return;
  if (done) {
    await sb
      .from("tirtha_completions")
      .upsert({ tirtha_slug: slug }, { onConflict: "user_id,tirtha_slug", ignoreDuplicates: true });
  } else {
    await sb.from("tirtha_completions").delete().eq("tirtha_slug", slug);
  }
}

function subscribe(cb: () => void) {
  if (hasSupabase && !syncStarted) {
    syncStarted = true;
    syncFromServer().catch(() => {});
  }
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

export const TOAST_EVENT = "parsh108:toast";
export type ToastDetail = { done: boolean; title?: string };

/**
 * Toggle one tirtha. Usable outside React too (the Leaflet map popups are
 * plain DOM). Updates the local cache immediately, then persists to Supabase.
 */
export function toggleCompleted(slug: string, title?: string): boolean {
  const next = new Set(read());
  const done = !next.has(slug);
  if (done) next.add(slug);
  else next.delete(slug);
  write(next); // optimistic local update
  pushChange(slug, done).catch(() => {});
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { done, title } }));
  return done;
}

/** Non-React read of the current completed set (local cache). */
export function getCompleted(): ReadonlySet<string> {
  return read();
}

export { subscribe as subscribeCompleted };

export function useCompleted() {
  const completed = useSyncExternalStore(subscribe, read, () => EMPTY);
  // Server snapshot is EMPTY; this flag lets callers avoid flashing "0 done"
  // before hydration reads the real value.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((slug: string, title?: string) => toggleCompleted(slug, title), []);

  return { completed, toggle, hydrated };
}
