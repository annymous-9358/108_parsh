import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MalaRing } from "@/components/MalaRing";
import { HistoryRecorder } from "@/components/HistoryRecorder";
import { getAllTirthas, getTirtha, getTirthaImages } from "@/lib/data";
import { tirthaImageUrl } from "@/lib/image-url";

export const revalidate = 60;

export async function generateStaticParams() {
  const tirthas = await getAllTirthas();
  return tirthas.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tirtha = await getTirtha(slug);
  return { title: tirtha ? `${tirtha.title} — 108 Parshwanath` : "108 Parshwanath" };
}

export default async function TirthaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tirtha, all] = await Promise.all([getTirtha(slug), getAllTirthas()]);

  if (!tirtha) notFound();

  const images = await getTirthaImages(tirtha.id);

  const idx = all.findIndex((t) => t.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const paragraphs = (tirtha.raw_text ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <HistoryRecorder tirthaId={tirtha.id} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-10">
          <div className="mb-3 flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 font-ui text-xs uppercase tracking-[0.2em] text-gold">
                तीर्थ क्रमांक {tirtha.entry_number} / {all.length}
              </p>
              <h1 className="font-display text-4xl leading-tight text-maroon">
                {tirtha.title}
              </h1>
            </div>
            <MalaRing
              total={all.length}
              current={tirtha.entry_number}
              size={84}
              slugs={all.map((t) => t.slug)}
              className="hidden shrink-0 sm:block"
            />
          </div>
          {(tirtha.city || tirtha.state) && (
            <p className="mb-6 flex items-center gap-1.5 font-ui text-sm text-ink-soft">
              <MapPin className="h-4 w-4" aria-hidden />
              {[tirtha.city, tirtha.state].filter(Boolean).join(", ")}
            </p>
          )}

          <div className="mb-8 flex flex-wrap gap-3">
            {tirtha.maps_url && (
              <a
                href={tirtha.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm bg-maroon px-5 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                Google Maps पर देखें
              </a>
            )}
            {tirtha.phone && (
              <a
                href={`tel:${tirtha.phone}`}
                className="inline-flex items-center gap-2 rounded-sm border border-sandstone-deep px-5 py-2.5 font-ui text-sm font-medium text-ink hover:border-maroon hover:text-maroon transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {tirtha.phone}
              </a>
            )}
          </div>

          {images.length > 0 && (
            <div className="mb-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {images.slice(0, 12).map((im, i) => (
                <div
                  key={im.id}
                  className={`relative overflow-hidden rounded-sm bg-sandstone-deep/30 ${
                    i === 0 ? "col-span-2 aspect-[4/3] sm:col-span-2" : "aspect-square"
                  }`}
                >
                  <Image
                    src={tirthaImageUrl(im.storage_path)}
                    alt={`${tirtha.title} फोटो ${i + 1}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <article className="prose-none space-y-4 font-body text-[1.05rem] leading-[1.85] text-ink">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>

          <nav className="mt-14 flex items-center justify-between border-t border-sandstone-deep/60 pt-6">
            {prev ? (
              <Link
                href={`/tirtha/${prev.slug}`}
                className="group flex items-center gap-1.5 font-ui text-sm text-ink-soft hover:text-maroon transition-colors"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                <span className="max-w-[10rem] truncate sm:max-w-xs">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/tirtha/${next.slug}`}
                className="group flex items-center gap-1.5 text-right font-ui text-sm text-ink-soft hover:text-maroon transition-colors"
              >
                <span className="max-w-[10rem] truncate sm:max-w-xs">{next.title}</span>
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
