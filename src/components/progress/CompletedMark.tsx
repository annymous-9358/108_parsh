"use client";

import { Check } from "lucide-react";
import { useCompleted } from "@/lib/progress";

/** Small seal shown on a tirtha card once its darshan is marked complete. */
export function CompletedMark({ slug, label }: { slug: string; label: string }) {
  const { completed } = useCompleted();
  if (!completed.has(slug)) return null;
  return (
    <span
      className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-maroon/95 px-2 py-1 font-ui text-[10px] font-semibold text-ivory shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-gold-bright/60 animate-[seal-in_320ms_ease-out]"
      title={label}
    >
      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
      <span className="sr-only sm:not-sr-only">{label}</span>
    </span>
  );
}
