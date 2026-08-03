import { AdminLanguageSwitcher } from "@/components/admin/AdminLanguageSwitcher";
import { getAdminLang } from "@/lib/i18n/admin-lang";
import { getUiStrings } from "@/lib/i18n/dictionary";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const lang = await getAdminLang();
  const t = getUiStrings(lang);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="flex justify-end border-b border-sandstone-deep/60 px-5 py-2">
        <AdminLanguageSwitcher lang={lang} label={t.admin.adminLanguageLabel} />
      </div>
      {children}
    </div>
  );
}
