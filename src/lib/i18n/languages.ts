export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/**
 * English + Hindi + all 22 languages of the Eighth Schedule of the Indian
 * Constitution. Hindi ("hi") is the original source language the book was
 * written in — every other language falls back to it when a translation
 * isn't available yet, so no language ever shows a blank page.
 */
export const LANGUAGES = [
  { code: "hi", native: "हिंदी", english: "Hindi" },
  { code: "en", native: "English", english: "English" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati" },
  { code: "mr", native: "मराठी", english: "Marathi" },
  { code: "bn", native: "বাংলা", english: "Bengali" },
  { code: "ta", native: "தமிழ்", english: "Tamil" },
  { code: "te", native: "తెలుగు", english: "Telugu" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada" },
  { code: "ml", native: "മലയാളം", english: "Malayalam" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia" },
  { code: "as", native: "অসমীয়া", english: "Assamese" },
  { code: "ur", native: "اردو", english: "Urdu" },
  { code: "sa", native: "संस्कृतम्", english: "Sanskrit" },
  { code: "ks", native: "کٲشُر", english: "Kashmiri" },
  { code: "kok", native: "कोंकणी", english: "Konkani" },
  { code: "sd", native: "سنڌي", english: "Sindhi" },
  { code: "mai", native: "मैथिली", english: "Maithili" },
  { code: "mni", native: "মৈতৈলোন্", english: "Manipuri" },
  { code: "ne", native: "नेपाली", english: "Nepali" },
  { code: "brx", native: "बड़ो", english: "Bodo" },
  { code: "doi", native: "डोगरी", english: "Dogri" },
  { code: "sat", native: "ᱥᱟᱱᱛᱟᱲᱤ", english: "Santali" },
] as const;

export const DEFAULT_LANGUAGE: LanguageCode = "hi";

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export function isLanguageCode(value: string): value is LanguageCode {
  return (LANGUAGE_CODES as string[]).includes(value);
}

export function languageInfo(code: string) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
