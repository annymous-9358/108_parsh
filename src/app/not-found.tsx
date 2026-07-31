import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-24 text-center">
        <p className="font-ui text-xs uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="font-display text-3xl text-maroon">यह तीर्थ नहीं मिला</h1>
        <p className="max-w-sm font-body text-ink-soft">
          हो सकता है यह पृष्ठ हटा दिया गया हो या पता गलत हो।
        </p>
        <Link
          href="/tirthas"
          className="mt-2 rounded-sm bg-maroon px-6 py-2.5 font-ui text-sm font-medium text-ivory hover:bg-maroon-deep transition-colors"
        >
          सभी तीर्थ देखें
        </Link>
      </main>
      <Footer />
    </>
  );
}
