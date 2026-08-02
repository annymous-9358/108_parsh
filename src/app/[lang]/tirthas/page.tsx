import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrowseGrid } from "@/components/BrowseGrid";
import { getAllTirthas } from "@/lib/data";

export const metadata = { title: "तीर्थ सूची — 108 Parshwanath" };
export const revalidate = 60;

export default async function TirthasPage() {
  const tirthas = await getAllTirthas();
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <h1 className="mb-1 font-display text-3xl text-maroon">तीर्थ सूची</h1>
          <p className="mb-8 font-body text-ink-soft">
            श्री 108 पार्श्वनाथ भगवान के सभी तीर्थों की सूची — शहर, राज्य अथवा नाम से खोजें।
          </p>
          <BrowseGrid tirthas={tirthas} />
        </div>
      </main>
      <Footer />
    </>
  );
}
