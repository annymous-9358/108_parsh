import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getAdminLang } from "@/lib/i18n/admin-lang";

export default async function AdminLoginPage() {
  const lang = await getAdminLang();
  return <AdminLoginForm lang={lang} />;
}
