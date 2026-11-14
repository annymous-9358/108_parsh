"use client";

import { useEffect, useRef, useState } from "react";
import { CircleCheckBig, Undo2 } from "lucide-react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/progress";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

type Toast = { id: number; done: boolean; text: string };

/** Bottom-centre confirmation whenever a tirtha is marked (in)complete anywhere. */
export function Toaster({ lang }: { lang: LanguageCode }) {
  const t = getUiStrings(lang).progress;
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const onToast = (e: Event) => {
      const { done, title } = (e as CustomEvent<ToastDetail>).detail;
      const name = title ?? "";
      const text = done ? t.toastDone(name) : t.toastUndone(name);
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-2), { id, done, text }]);
      window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3200);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, [t]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-5 z-[1000] flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((x) => (
        <div
          key={x.id}
          className={`toast-in flex max-w-md items-center gap-2.5 rounded-full px-4 py-2.5 font-ui text-sm shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] ${
            x.done ? "bg-[#2f7d4f] text-white" : "bg-ink text-ivory"
          }`}
        >
          {x.done ? (
            <CircleCheckBig className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <Undo2 className="h-4 w-4 shrink-0" aria-hidden />
          )}
          <span className="truncate">{x.text}</span>
        </div>
      ))}
    </div>
  );
}
