import { requireAdmin } from "@/lib/supabase/admin-guard";
import { TirthaForm } from "@/components/admin/TirthaForm";
import { getAdminLang } from "@/lib/i18n/admin-lang";

export default async function NewTirthaPage() {
  await requireAdmin();
  const adminLang = await getAdminLang();
  return <TirthaForm mode="create" adminLang={adminLang} />;
}
