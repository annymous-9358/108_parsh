import fs from "node:fs";
import path from "node:path";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = { title: "प्रभु पार्श्वनाथ का इतिहास — 108 Parshwanath" };

function getAboutText() {
  const p = path.join(process.cwd(), "src/content/about_parshwanath.txt");
  try {
    return fs.readFileSync(p, "utf-8");
  } catch {
    return "";
  }
}

export default function AboutPage() {
  const text = getAboutText();
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-12">
          <p className="mb-2 font-ui text-xs uppercase tracking-[0.2em] text-gold">
            चरित्र
          </p>
          <h1 className="mb-8 font-display text-4xl text-maroon">
            श्री पार्श्वनाथ भगवान का इतिहास
          </h1>
          <article className="space-y-4 font-body text-[1.05rem] leading-[1.85] text-ink">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
