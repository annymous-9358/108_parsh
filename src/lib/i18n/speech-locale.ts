import type { LanguageCode } from "./languages";

/** Best-effort BCP-47 locale per language for the browser's speech synthesis voice picker. */
const SPEECH_LOCALES: Record<LanguageCode, string> = {
  hi: "hi-IN",
  en: "en-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
  or: "or-IN",
  as: "as-IN",
  ur: "ur-IN",
  sa: "hi-IN",
  ks: "hi-IN",
  kok: "mr-IN",
  sd: "hi-IN",
  mai: "hi-IN",
  mni: "hi-IN",
  ne: "ne-NP",
  brx: "hi-IN",
  doi: "hi-IN",
  sat: "hi-IN",
};

export function speechLocale(lang: LanguageCode): string {
  return SPEECH_LOCALES[lang] ?? "hi-IN";
}
