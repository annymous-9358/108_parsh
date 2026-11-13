import type { SupabaseClient } from "@supabase/supabase-js";

let pending: Promise<string | null> | null = null;

/**
 * Ensures the visitor has a Supabase session, creating an anonymous one if
 * needed, so reading history and completed tirthas persist across future
 * visits. Runs entirely client-side (no server/middleware involvement) so it
 * never blocks the initial page render. Idempotent per page load: every
 * caller awaits the same in-flight sign-in and gets the user id.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- only .auth.* is used here, which isn't scoped by DB schema
export function ensureAnonSession(supabase: SupabaseClient<any, any, any>): Promise<string | null> {
  if (!pending) {
    pending = (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return user.id;
      const { data } = await supabase.auth.signInAnonymously();
      return data.user?.id ?? null;
    })().catch(() => {
      pending = null;
      return null;
    });
  }
  return pending;
}
