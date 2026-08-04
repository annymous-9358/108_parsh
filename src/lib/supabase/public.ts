import { createClient } from "@supabase/supabase-js";

/**
 * Plain (cookie-free) client for public content reads. Unlike the
 * cookies()-based server client, using this in a Server Component does not
 * force the route into dynamic/per-request rendering, so public pages can
 * be statically generated and served from the CDN instead of invoking a
 * serverless function on every visit — this is the main lever for page speed.
 * Never use this for admin writes or anything that must respect the
 * visitor's session (those still need the cookie-aware server client).
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // v2 is a separate schema in the same Supabase project — a full data
    // copy of `public` made when this redesign shipped, so admin edits made
    // here can never touch the original site's content.
    { db: { schema: "v2" } },
  );
}
