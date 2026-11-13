import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { TirthaSummary } from "@/lib/types";
import type { LanguageCode } from "@/lib/i18n/languages";
import { tirthaImageUrl } from "@/lib/image-url";
import { getUiStrings } from "@/lib/i18n/dictionary";
import { CompletedMark } from "@/components/progress/CompletedMark";

export function TirthaCard({ tirtha, lang }: { tirtha: TirthaSummary; lang: LanguageCode }) {
  const t = getUiStrings(lang);
  return (
    <Link
      href={`/${lang}/tirtha/${tirtha.slug}`}
      className="tirtha-card group flex flex-col overflow-hidden rounded-md border border-sandstone-deep/70 bg-sandstone shadow-[0_1px_2px_rgba(42,31,26,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[0_14px_30px_-12px_rgba(122,26,43,0.35)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sandstone-deep/40">
        <Image
          src={tirthaImageUrl(tirtha.cover_image_path)}
          alt={tirtha.title}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <span className="bead-badge absolute left-2 top-2 h-7 w-7 font-ui text-[10px] font-semibold tabular-nums">
          {tirtha.entry_number}
        </span>
        <CompletedMark slug={tirtha.slug} label={t.progress.completed} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 border-t border-gold/30 p-3.5">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-maroon">
          {tirtha.title}
        </h3>
        {(tirtha.city || tirtha.state) && (
          <p className="mt-auto flex items-center gap-1 font-ui text-xs text-ink-soft">
            <MapPin className="h-3 w-3 shrink-0 text-gold" aria-hidden />
            <span className="truncate">{[tirtha.city, tirtha.state].filter(Boolean).join(", ")}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
