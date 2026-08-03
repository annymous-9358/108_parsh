import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { getAdminLang } from "@/lib/i18n/admin-lang";
import { getUiStrings } from "@/lib/i18n/dictionary";
import type { Tirtha } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const lang = await getAdminLang();
  const t = getUiStrings(lang).admin;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 font-ui text-sm text-ink">
        <h1 className="mb-3 font-display text-2xl text-maroon">{t.setupPendingTitle}</h1>
        <p className="text-ink-soft">{t.setupPendingBody}</p>
      </div>
    );
  }

  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("tirthas")
    .select("*")
    .order("entry_number", { ascending: true });

  const tirthas = (data ?? []) as Tirtha[];

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-maroon">{t.manageTemples}</h1>
          <p className="font-ui text-xs text-ink-soft">{t.entriesCount(tirthas.length)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tirtha/new"
            className="rounded-sm bg-maroon px-4 py-2 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
          >
            {t.addTemple}
          </Link>
          <AdminSignOut label={t.signOut} />
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-sandstone-deep">
        <table className="w-full text-left font-ui text-sm">
          <thead className="bg-sandstone text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-2.5">{t.colNumber}</th>
              <th className="px-4 py-2.5">{t.colTitle}</th>
              <th className="px-4 py-2.5">{t.colCity}</th>
              <th className="px-4 py-2.5">{t.colStatus}</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {tirthas.map((tirtha) => (
              <tr key={tirtha.id} className="border-t border-sandstone-deep/60 hover:bg-sandstone/60">
                <td className="px-4 py-2.5 tabular-nums text-ink-soft">{tirtha.entry_number}</td>
                <td className="px-4 py-2.5 text-ink">{tirtha.title}</td>
                <td className="px-4 py-2.5 text-ink-soft">
                  {[tirtha.city, tirtha.state].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={
                      tirtha.published
                        ? "rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold"
                        : "rounded-full bg-sandstone-deep px-2 py-0.5 text-xs text-ink-soft"
                    }
                  >
                    {tirtha.published ? t.published : t.hidden}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/admin/tirtha/${tirtha.id}`} className="text-maroon hover:underline">
                    {t.edit}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
