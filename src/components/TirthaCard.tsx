import Image from "next/image";
import Link from "next/link";
import type { Tirtha } from "@/lib/types";
import { tirthaImageUrl } from "@/lib/image-url";

export function TirthaCard({ tirtha }: { tirtha: Tirtha }) {
  return (
    <Link
      href={`/tirtha/${tirtha.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-sandstone border border-sandstone-deep/70 hover:border-gold transition-colors"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sandstone-deep/40">
        <Image
          src={tirthaImageUrl(tirtha.cover_image_path)}
          alt={tirtha.title}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-2 top-2 rounded-full bg-maroon/90 px-2 py-0.5 font-ui text-[10px] font-medium text-ivory tabular-nums">
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
