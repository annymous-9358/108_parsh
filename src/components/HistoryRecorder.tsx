"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonSession } from "@/lib/supabase/ensure-session";

/**
 * Fires once per visit to upsert this tirtha into the visitor's reading
 * history. Every visitor — including anonymous ones — gets a stable
 * Supabase auth uid (see ensure-session.ts), so history survives future
 * sessions. Runs client-side only, after the page has already rendered.
 */
export function HistoryRecorder({ tirthaId }: { tirthaId: string }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();

    (async () => {
      await ensureAnonSession(supabase);
      await supabase.rpc("upsert_reading_history", { p_tirtha_id: tirthaId });
    })();
  }, [tirthaId]);

  return null;
}
