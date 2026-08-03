import type { LanguageCode } from "./languages";

/**
 * Languages Google Translate's free TTS endpoint can voice directly
 * (verified empirically — not every language Google Translate can
 * translate TEXT into also has a TTS voice behind this endpoint).
 */
const DIRECT: Partial<Record<LanguageCode, string>> = {
  hi: "hi",
  en: "en",
  gu: "gu",
  mr: "mr",
  bn: "bn",
  ta: "ta",
  te: "te",
  kn: "kn",
  ml: "ml",
  pa: "pa",
  ur: "ur",
  ne: "ne",
};

/**
 * Languages with no direct TTS voice, mapped to the closest available
 * voice in the same script family — close enough to read the glyphs
 * correctly even if accent/vocabulary isn't native. Anything not listed
 * here (Odia, Santali) has no reasonable script-sharing substitute.
 */
const SCRIPT_FALLBACK: Partial<Record<LanguageCode, string>> = {
  sa: "hi", // Sanskrit — Devanagari
  mai: "hi", // Maithili — Devanagari
  doi: "hi", // Dogri — Devanagari
  brx: "hi", // Bodo — Devanagari
  kok: "mr", // Konkani — Devanagari, linguistically close to Marathi
  as: "bn", // Assamese — Bengali-Assamese script
  mni: "bn", // Manipuri (Meitei), commonly written in Bengali script
  sd: "ur", // Sindhi — Perso-Arabic script (as used in this app)
  ks: "ur", // Kashmiri — Perso-Arabic script (as used in this app)
};

/** Google TTS language code to use for cloud-voiced fallback, or null if none is viable. */
export function googleTtsLang(lang: LanguageCode): string | null {
  return DIRECT[lang] ?? SCRIPT_FALLBACK[lang] ?? null;
}
