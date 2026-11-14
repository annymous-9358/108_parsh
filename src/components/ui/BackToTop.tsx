"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={label}
      title={label}
      className={`fixed bottom-5 right-5 z-[900] rounded-full border border-gold/60 bg-ivory/95 p-3 text-maroon shadow-[0_10px_24px_-10px_rgba(122,26,43,0.5)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-maroon hover:text-ivory ${
        show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  );
}
