import { requireAdmin } from "@/lib/supabase/admin-guard";
import { TirthaForm } from "@/components/admin/TirthaForm";

export default async function NewTirthaPage() {
  await requireAdmin();
  return <TirthaForm mode="create" />;
}
