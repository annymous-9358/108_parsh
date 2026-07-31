"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ensureAnonSession } from "@/lib/supabase/ensure-session";

/** Mounted once in the root layout — kicks off anonymous auth in the background. */
export function SessionBootstrap() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    ensureAnonSession(createClient());
  }, []);

  return null;
}
