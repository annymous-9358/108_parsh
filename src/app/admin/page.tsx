import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { AdminSignOut } from "@/components/admin/AdminSignOut";
import type { Tirtha } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 font-ui text-sm text-ink">
        <h1 className="mb-3 font-display text-2xl text-maroon">Admin सेटअप बाकी है</h1>
        <p className="text-ink-soft">
          NEXT_PUBLIC_SUPABASE_URL और NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local में सेट करें, फिर
          supabase/schema.sql चलाएँ और seed स्क्रिप्ट से डेटा भरें।
        </p>
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
          <h1 className="font-display text-3xl text-maroon">तीर्थ प्रबंधन</h1>
          <p className="font-ui text-xs text-ink-soft">{tirthas.length} प्रविष्टियाँ</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tirtha/new"
            className="rounded-sm bg-maroon px-4 py-2 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
          >
            + नया तीर्थ
          </Link>
          <AdminSignOut />
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-sandstone-deep">
        <table className="w-full text-left font-ui text-sm">
          <thead className="bg-sandstone text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-2.5">#</th>
              <th className="px-4 py-2.5">शीर्षक</th>
              <th className="px-4 py-2.5">शहर</th>
              <th className="px-4 py-2.5">स्थिति</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {tirthas.map((t) => (
              <tr key={t.id} className="border-t border-sandstone-deep/60 hover:bg-sandstone/60">
                <td className="px-4 py-2.5 tabular-nums text-ink-soft">{t.entry_number}</td>
                <td className="px-4 py-2.5 text-ink">{t.title}</td>
                <td className="px-4 py-2.5 text-ink-soft">
                  {[t.city, t.state].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={
                      t.published
                        ? "rounded-full bg-gold/20 px-2 py-0.5 text-xs text-gold"
                        : "rounded-full bg-sandstone-deep px-2 py-0.5 text-xs text-ink-soft"
                    }
                  >
                    {t.published ? "प्रकाशित" : "छिपा हुआ"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link href={`/admin/tirtha/${t.id}`} className="text-maroon hover:underline">
                    संपादित करें
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
