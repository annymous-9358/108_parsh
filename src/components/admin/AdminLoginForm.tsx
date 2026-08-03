"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUiStrings } from "@/lib/i18n/dictionary";
import type { LanguageCode } from "@/lib/i18n/languages";

function LoginForm({ lang }: { lang: LanguageCode }) {
  const t = getUiStrings(lang).admin;
  const router = useRouter();
  const params = useSearchParams();
  const denied = params.get("denied");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(t.loginFailed);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="w-full max-w-sm rounded-sm border border-sandstone-deep bg-sandstone p-8">
        <h1 className="mb-1 font-display text-2xl text-maroon">{t.loginTitle}</h1>
        <p className="mb-6 font-ui text-xs text-ink-soft">{t.loginSubtitle}</p>

        {!configured && (
          <p className="mb-4 rounded-sm border border-gold bg-ivory p-3 font-ui text-xs text-ink-soft">
            {t.supabaseNotConfigured}
          </p>
        )}
        {denied && <p className="mb-4 font-ui text-xs text-maroon">{t.accountNotAdmin}</p>}
        {error && <p className="mb-4 font-ui text-xs text-maroon">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-sm border border-sandstone-deep bg-ivory px-3 py-2.5 font-ui text-sm outline-none focus:border-maroon"
          />
          <input
            type="password"
            required
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border border-sandstone-deep bg-ivory px-3 py-2.5 font-ui text-sm outline-none focus:border-maroon"
          />
          <button
            type="submit"
            disabled={loading || !configured}
            className="mt-2 rounded-sm bg-maroon px-4 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors disabled:opacity-50"
          >
            {loading ? t.pleaseWait : t.loginButton}
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdminLoginForm({ lang }: { lang: LanguageCode }) {
  return (
    <Suspense>
      <LoginForm lang={lang} />
    </Suspense>
  );
}
