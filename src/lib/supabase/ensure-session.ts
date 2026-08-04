import type { SupabaseClient } from "@supabase/supabase-js";

let bootstrapped = false;

/**
 * Ensures the visitor has a Supabase session, creating an anonymous one if
 * needed, so reading history persists across future visits. Runs entirely
 * client-side (no server/middleware involvement) so it never blocks the
 * initial page render. Idempotent per page load.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- only .auth.* is used here, which isn't scoped by DB schema
export async function ensureAnonSession(supabase: SupabaseClient<any, any, any>) {
  if (bootstrapped) return;
  bootstrapped = true;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    await supabase.auth.signInAnonymously();
  }
}
