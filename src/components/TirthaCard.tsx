import Image from "next/image";
import Link from "next/link";
import type { TirthaSummary } from "@/lib/types";
import type { LanguageCode } from "@/lib/i18n/languages";
import { tirthaImageUrl } from "@/lib/image-url";

export function TirthaCard({ tirtha, lang }: { tirtha: TirthaSummary; lang: LanguageCode }) {
  return (
    <Link
      href={`/${lang}/tirtha/${tirtha.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-sandstone border border-sandstone-deep/70 shadow-[0_1px_2px_rgba(42,31,26,0.06)] transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_10px_24px_-8px_rgba(122,26,43,0.28)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sandstone-deep/40">
        <Image
          src={tirthaImageUrl(tirtha.cover_image_path)}
          alt={tirtha.title}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="bead-badge absolute left-2 top-2 h-6 w-6 font-ui text-[10px] font-semibold tabular-nums">
          {tirtha.entry_number}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-maroon transition-colors">
          {tirtha.title}
        </h3>
        {(tirtha.city || tirtha.state) && (
          <p className="font-ui text-xs text-ink-soft">
            {[tirtha.city, tirtha.state].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
