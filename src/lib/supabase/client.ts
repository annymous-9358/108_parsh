import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // v2 is a separate schema in the same Supabase project, so admin writes
    // made here can never touch the original site's `public` schema data.
    { db: { schema: "v2" } },
  );
}
