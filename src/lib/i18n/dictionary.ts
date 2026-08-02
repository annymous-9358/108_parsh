import { DEFAULT_LANGUAGE, type LanguageCode } from "./languages";

export type UiStrings = {
  siteSubtitle: string;
  navList: string;
  navHistory: string;
  navAdmin: string;
  heroTagline: (count: number) => string;
  ctaBrowse: string;
  ctaAbout: string;
  featuredHeading: string;
  viewAll: string;
  continueReading: string;
  browseTitle: string;
  browseSubtitle: string;
  searchPlaceholder: string;
  allStates: string;
  resultsFound: (count: number) => string;
  noResults: string;
  entryLabel: (n: number, total: number) => string;
  openMaps: string;
  listen: string;
  stopListening: string;
  aboutTitle: string;
  aboutEyebrow: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  footerCredit: string;
  languageLabel: string;
  translationNotice: string;
};

const hi: UiStrings = {
  siteSubtitle: "तीर्थ दर्शन",
  navList: "तीर्थ सूची",
  navHistory: "प्रभु का इतिहास",
  navAdmin: "Admin",
  heroTagline: (n) =>
    `प्रत्येक मनका एक तीर्थ है — भगवान श्री पार्श्वनाथ के ${n} तीर्थों का इतिहास, दर्शन-फोटो और मार्गदर्शन, एक ही स्थान पर।`,
  ctaBrowse: "सभी तीर्थ देखें",
  ctaAbout: "प्रभु का इतिहास पढ़ें",
  featuredHeading: "कुछ प्रमुख तीर्थ",
  viewAll: "पूरी सूची →",
  continueReading: "जहाँ आपने छोड़ा था",
  browseTitle: "तीर्थ सूची",
  browseSubtitle: "श्री 108 पार्श्वनाथ भगवान के सभी तीर्थों की सूची — शहर, राज्य अथवा नाम से खोजें।",
  searchPlaceholder: "नाम, शहर या क्रमांक से खोजें…",
  allStates: "सभी",
  resultsFound: (n) => `${n} तीर्थ मिले`,
  noResults: "कोई तीर्थ नहीं मिला। कृपया अलग शब्द से खोजें।",
  entryLabel: (n, total) => `तीर्थ क्रमांक ${n} / ${total}`,
  openMaps: "Google Maps पर देखें",
  listen: "सुनें",
  stopListening: "रोकें",
  aboutTitle: "श्री पार्श्वनाथ भगवान का इतिहास",
  aboutEyebrow: "चरित्र",
  notFoundTitle: "यह तीर्थ नहीं मिला",
  notFoundBody: "हो सकता है यह पृष्ठ हटा दिया गया हो या पता गलत हो।",
  notFoundCta: "सभी तीर्थ देखें",
  footerCredit: "मूल स्रोत: राजेन्द्र कुमार जैन, पार्श्व सदन, पार्श्व नगर, डूंगरपुर",
  languageLabel: "भाषा",
  translationNotice: "यह अनुवाद अभी तैयार नहीं है — मूल हिंदी पाठ दिखाया जा रहा है।",
};

const en: UiStrings = {
  siteSubtitle: "Tirtha Darshan",
  navList: "Temple List",
  navHistory: "Life of Parshwanath",
  navAdmin: "Admin",
  heroTagline: (n) =>
    `Every bead is a tirtha — the history, photographs and pilgrimage guide to ${n} Parshwanath temples, in one place.`,
  ctaBrowse: "Browse all temples",
  ctaAbout: "Read the life of Parshwanath",
  featuredHeading: "Featured temples",
  viewAll: "View all →",
  continueReading: "Continue where you left off",
  browseTitle: "Temple list",
  browseSubtitle: "All Shri 108 Parshwanath temples — search by name, city or state.",
  searchPlaceholder: "Search by name, city or number…",
  allStates: "All",
  resultsFound: (n) => `${n} temples found`,
  noResults: "No temples found. Try a different search.",
  entryLabel: (n, total) => `Temple ${n} of ${total}`,
  openMaps: "Open in Google Maps",
  listen: "Listen",
  stopListening: "Stop",
  aboutTitle: "The life of Lord Parshwanath",
  aboutEyebrow: "Biography",
  notFoundTitle: "Temple not found",
  notFoundBody: "This page may have been removed, or the address is incorrect.",
  notFoundCta: "Browse all temples",
  footerCredit: "Original source: Rajendra Kumar Jain, Parshv Sadan, Parshv Nagar, Dungarpur",
  languageLabel: "Language",
  translationNotice: "This translation isn't ready yet — showing the original Hindi text.",
};

const gu: UiStrings = {
  siteSubtitle: "તીર્થ દર્શન",
  navList: "તીર્થ યાદી",
  navHistory: "પ્રભુનો ઇતિહાસ",
  navAdmin: "Admin",
  heroTagline: (n) =>
    `દરેક મણકો એક તીર્થ છે — શ્રી પાર્શ્વનાથ ભગવાનના ${n} તીર્થોનો ઇતિહાસ, દર્શન-ફોટા અને માર્ગદર્શન, એક જ સ્થાને.`,
  ctaBrowse: "બધા તીર્થ જુઓ",
  ctaAbout: "પ્રભુનો ઇતિહાસ વાંચો",
  featuredHeading: "કેટલાક મુખ્ય તીર્થ",
  viewAll: "પૂરી યાદી →",
  continueReading: "તમે જ્યાં છોડ્યું હતું",
  browseTitle: "તીર્થ યાદી",
  browseSubtitle: "શ્રી 108 પાર્શ્વનાથ ભગવાનના બધા તીર્થોની યાદી — શહેર, રાજ્ય અથવા નામથી શોધો.",
  searchPlaceholder: "નામ, શહેર અથવા ક્રમાંકથી શોધો…",
  allStates: "બધા",
  resultsFound: (n) => `${n} તીર્થ મળ્યા`,
  noResults: "કોઈ તીર્થ મળ્યું નથી. કૃપા કરી અલગ શબ્દથી શોધો.",
  entryLabel: (n, total) => `તીર્થ ક્રમાંક ${n} / ${total}`,
  openMaps: "Google Maps પર જુઓ",
  listen: "સાંભળો",
  stopListening: "રોકો",
  aboutTitle: "શ્રી પાર્શ્વનાથ ભગવાનનો ઇતિહાસ",
  aboutEyebrow: "ચરિત્ર",
  notFoundTitle: "આ તીર્થ મળ્યું નથી",
  notFoundBody: "આ પાનું દૂર કરવામાં આવ્યું હોઈ શકે અથવા સરનામું ખોટું છે.",
  notFoundCta: "બધા તીર્થ જુઓ",
  footerCredit: "મૂળ સ્રોત: રાજેન્દ્ર કુમાર જૈન, પાર્શ્વ સદન, પાર્શ્વ નગર, ડુંગરપુર",
  languageLabel: "ભાષા",
  translationNotice: "આ અનુવાદ હજુ તૈયાર નથી — મૂળ હિન્દી લખાણ બતાવવામાં આવ્યું છે.",
};

const mr: UiStrings = {
  siteSubtitle: "तीर्थ दर्शन",
  navList: "तीर्थ यादी",
  navHistory: "प्रभूंचा इतिहास",
  navAdmin: "Admin",
  heroTagline: (n) =>
    `प्रत्येक मणी एक तीर्थ आहे — श्री पार्श्वनाथ भगवानच्या ${n} तीर्थांचा इतिहास, दर्शन-फोटो आणि मार्गदर्शन, एकाच ठिकाणी.`,
  ctaBrowse: "सर्व तीर्थ पहा",
  ctaAbout: "प्रभूंचा इतिहास वाचा",
  featuredHeading: "काही प्रमुख तीर्थ",
  viewAll: "संपूर्ण यादी →",
  continueReading: "तुम्ही जिथे थांबला होता",
  browseTitle: "तीर्थ यादी",
  browseSubtitle: "श्री 108 पार्श्वनाथ भगवानच्या सर्व तीर्थांची यादी — शहर, राज्य किंवा नावाने शोधा.",
  searchPlaceholder: "नाव, शहर किंवा क्रमांकाने शोधा…",
  allStates: "सर्व",
  resultsFound: (n) => `${n} तीर्थ सापडले`,
  noResults: "कोणतेही तीर्थ सापडले नाही. कृपया वेगळा शब्द वापरा.",
  entryLabel: (n, total) => `तीर्थ क्रमांक ${n} / ${total}`,
  openMaps: "Google Maps वर पहा",
  listen: "ऐका",
  stopListening: "थांबवा",
  aboutTitle: "श्री पार्श्वनाथ भगवानचा इतिहास",
  aboutEyebrow: "चरित्र",
  notFoundTitle: "हे तीर्थ सापडले नाही",
  notFoundBody: "हे पान काढले गेले असावे किंवा पत्ता चुकीचा आहे.",
  notFoundCta: "सर्व तीर्थ पहा",
  footerCredit: "मूळ स्रोत: राजेंद्र कुमार जैन, पार्श्व सदन, पार्श्व नगर, डुंगरपूर",
  languageLabel: "भाषा",
  translationNotice: "हे भाषांतर अद्याप तयार नाही — मूळ हिंदी मजकूर दाखवला जात आहे.",
};

// Remaining constitutional languages: UI chrome falls back to Hindi for now
// (still fully navigable — Devanagari-adjacent readers can follow it, and
// content translation is prioritized over chrome labels). Content itself
// falls back per-entry via translationNotice logic in the data layer.
const fallbackMap: Partial<Record<LanguageCode, UiStrings>> = { hi, en, gu, mr };

export function getUiStrings(lang: LanguageCode): UiStrings {
  return fallbackMap[lang] ?? fallbackMap[DEFAULT_LANGUAGE]!;
}
