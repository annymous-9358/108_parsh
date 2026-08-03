import { cookies } from "next/headers";
import { DEFAULT_LANGUAGE, isLanguageCode, type LanguageCode } from "./languages";
import { ADMIN_LANG_COOKIE } from "./admin-lang-cookie";

/**
 * The admin panel's own UI language, independent of the public site's
 * `[lang]` route param — admin routes (/admin/...) live outside that
 * segment, so without this the admin chrome was always stuck in Hindi
 * regardless of which language content an admin was editing.
 */
export async function getAdminLang(): Promise<LanguageCode> {
  const store = await cookies();
  const value = store.get(ADMIN_LANG_COOKIE)?.value;
  return value && isLanguageCode(value) ? value : DEFAULT_LANGUAGE;
}
