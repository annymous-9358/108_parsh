import type { SupabaseClient } from "@supabase/supabase-js";

let bootstrapped = false;

/**
 * Ensures the visitor has a Supabase session, creating an anonymous one if
 * needed, so reading history persists across future visits. Runs entirely
 * client-side (no server/middleware involvement) so it never blocks the
 * initial page render. Idempotent per page load.
 */
export async function ensureAnonSession(supabase: SupabaseClient) {
  if (bootstrapped) return;
  bootstrapped = true;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    await supabase.auth.signInAnonymously();
  }
}
