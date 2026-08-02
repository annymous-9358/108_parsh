"use client";

import { useEffect } from "react";

/** Keeps <html lang="..."> accurate for screen readers as the user switches languages. */
export function LangAttribute({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" || lang === "sd" ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
