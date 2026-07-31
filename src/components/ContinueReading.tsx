"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { tirthaImageUrl } from "@/lib/image-url";
import type { Tirtha } from "@/lib/types";

type HistoryRow = { last_viewed_at: string; tirthas: Tirtha };

export function ContinueReading() {
  const [rows, setRows] = useState<HistoryRow[] | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("reading_history")
        .select("last_viewed_at, tirthas(*)")
        .order("last_viewed_at", { ascending: false })
        .limit(6);

      if (data && data.length > 0) {
        setRows(data as unknown as HistoryRow[]);
      }
    })();
  }, []);

  if (!rows || rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-4">
      <h2 className="mb-4 font-display text-xl text-ink">जहाँ आपने छोड़ा था</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {rows.map(
          (row) =>
            row.tirthas && (
              <Link
                key={row.tirthas.id}
                href={`/tirtha/${row.tirthas.slug}`}
                className="group flex w-40 shrink-0 flex-col gap-2"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-sandstone-deep/30">
                  <Image
                    src={tirthaImageUrl(row.tirthas.cover_image_path)}
                    alt={row.tirthas.title}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="truncate font-ui text-xs text-ink-soft group-hover:text-maroon">
                  {row.tirthas.title}
                </p>
              </Link>
            ),
        )}
      </div>
    </section>
  );
}
