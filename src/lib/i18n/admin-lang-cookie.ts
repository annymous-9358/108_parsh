/**
 * Cookie name shared between the client-side AdminLanguageSwitcher and the
 * server-side getAdminLang() reader. Kept in its own module with no
 * next/headers import so client components can reference it without
 * pulling a server-only dependency into the browser bundle.
 */
export const ADMIN_LANG_COOKIE = "admin_lang";
