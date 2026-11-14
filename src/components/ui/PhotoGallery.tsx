"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

type Photo = { id: string; src: string; alt: string };

/** Photo grid; tap any photo for a full-screen viewer with keyboard + swipe navigation. */
export function PhotoGallery({ photos, lang }: { photos: Photo[]; lang: LanguageCode }) {
  const p = getUiStrings(lang).progress;
  const labels = { close: p.close, prev: p.prevPhoto, next: p.nextPhoto, open: p.openPhoto };
  const [open, setOpen] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i == null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  if (photos.length === 0) return null;
  const current = open != null ? photos[open] : null;

  return (
    <>
      <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((im, i) => (
          <button
            key={im.id}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={labels.open(i + 1)}
            className={`group relative overflow-hidden rounded-md bg-sandstone-deep/30 ${
              i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-2" : "aspect-square"
            }`}
          >
            <Image
              src={im.src}
              alt={im.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              priority={i === 0}
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
              <Expand className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
          </button>
        ))}
      </div>

      {current &&
        open != null &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="lightbox-in fixed inset-0 z-[1100] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX == null) return;
              const dx = e.changedTouches[0].clientX - touchX;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              setTouchX(null);
            }}
          >
            <div
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 font-ui text-xs tabular-nums text-white/90">
              {open + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={labels.prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={labels.next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden />
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
