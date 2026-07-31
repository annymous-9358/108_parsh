import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MalaRing } from "@/components/MalaRing";
import { TirthaCard } from "@/components/TirthaCard";
import { ContinueReading } from "@/components/ContinueReading";
import { getAllTirthas } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const tirthas = await getAllTirthas();
  const featured = tirthas.slice(0, 8);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 pb-16 pt-14 text-center lg:pb-24 lg:pt-20">
            <div className="relative flex items-center justify-center">
              <MalaRing
                total={tirthas.length || 108}
                size={380}
                className="max-w-full text-maroon"
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-10">
                <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-gold">
                  Shri
                </p>
                <h1 className="font-display text-5xl leading-[1.15] text-maroon sm:text-6xl">
                  १०८ पार्श्वनाथ
                </h1>
                <p className="font-ui text-xs uppercase tracking-[0.25em] text-ink-soft">
                  Tirtha Darshan
                </p>
              </div>
            </div>

            <p className="max-w-xl text-balance font-body text-lg leading-relaxed text-ink-soft">
              प्रत्येक मनका एक तीर्थ है — भगवान श्री पार्श्वनाथ के {tirthas.length || 108} तीर्थों का
              इतिहास, दर्शन-फोटो और मार्गदर्शन, एक ही स्थान पर।
            </p>

            <div className="flex w-full flex-wrap items-center justify-center gap-3">
              <Link
                href="/tirthas"
                className="rounded-sm bg-maroon px-6 py-3 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
              >
                सभी तीर्थ देखें
              </Link>
              <Link
                href="/about"
                className="rounded-sm border border-sandstone-deep px-6 py-3 font-ui text-sm font-medium text-ink hover:border-maroon hover:text-maroon transition-colors"
              >
                प्रभु का इतिहास पढ़ें
              </Link>
            </div>
          </div>
        </section>

        <ContinueReading />

        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-ink">कुछ प्रमुख तीर्थ</h2>
            <Link href="/tirthas" className="font-ui text-xs text-maroon hover:underline">
              पूरी सूची →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((t) => (
              <TirthaCard key={t.id} tirtha={t} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
