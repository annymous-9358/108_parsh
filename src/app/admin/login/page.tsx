"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
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
      setError("लॉगिन विफल — ईमेल या पासवर्ड जांचें।");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-5">
      <div className="w-full max-w-sm rounded-sm border border-sandstone-deep bg-sandstone p-8">
        <h1 className="mb-1 font-display text-2xl text-maroon">Admin लॉगिन</h1>
        <p className="mb-6 font-ui text-xs text-ink-soft">
          १०८ पार्श्वनाथ तीर्थ दर्शन — सामग्री प्रबंधन
        </p>

        {!configured && (
          <p className="mb-4 rounded-sm border border-gold bg-ivory p-3 font-ui text-xs text-ink-soft">
            Supabase अभी कॉन्फ़िगर नहीं है। .env.local में
            NEXT_PUBLIC_SUPABASE_URL/ANON_KEY सेट करें।
          </p>
        )}
        {denied && (
          <p className="mb-4 font-ui text-xs text-maroon">
            यह खाता admin सूची में नहीं है।
          </p>
        )}
        {error && <p className="mb-4 font-ui text-xs text-maroon">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="ईमेल"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-sm border border-sandstone-deep bg-ivory px-3 py-2.5 font-ui text-sm outline-none focus:border-maroon"
          />
          <input
            type="password"
            required
            placeholder="पासवर्ड"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border border-sandstone-deep bg-ivory px-3 py-2.5 font-ui text-sm outline-none focus:border-maroon"
          />
          <button
            type="submit"
            disabled={loading || !configured}
            className="mt-2 rounded-sm bg-maroon px-4 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors disabled:opacity-50"
          >
            {loading ? "प्रतीक्षा करें…" : "लॉगिन करें"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
