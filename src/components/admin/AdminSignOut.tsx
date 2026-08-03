"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-sm border border-sandstone-deep px-4 py-2 font-ui text-sm text-ink-soft hover:border-maroon hover:text-maroon transition-colors"
    >
      {label}
    </button>
  );
}
