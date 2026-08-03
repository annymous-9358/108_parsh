import { DEFAULT_LANGUAGE, type LanguageCode } from "./languages";

export type UiStrings = {
  siteSubtitle: string;
  navList: string;
  navHistory: string;
  navMap: string;
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
  audioUnavailable: string;
  aboutTitle: string;
  aboutEyebrow: string;
  mapTitle: string;
  mapSubtitle: string;
  getDirections: string;
  findNearby: string;
  locating: string;
  yourLocation: string;
  nearbyHeading: string;
  distanceAway: (km: string) => string;
  locationDenied: string;
  locationUnavailable: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCta: string;
  footerCredit: string;
  languageLabel: string;
  translationNotice: string;
  admin: {
    setupPendingTitle: string;
    setupPendingBody: string;
    manageTemples: string;
    entriesCount: (n: number) => string;
    addTemple: string;
    signOut: string;
    colNumber: string;
    colTitle: string;
    colCity: string;
    colStatus: string;
    published: string;
    hidden: string;
    edit: string;
    newTempleTitle: string;
    editTempleTitle: string;
    publishedCheckbox: string;
    entryNumberLabel: string;
    slugLabel: string;
    photosLabel: string;
    setCoverPhoto: string;
    removePhoto: string;
    save: string;
    saving: string;
    deleteTemple: string;
    confirmDeleteTemple: string;
    fieldTitle: string;
    fieldCity: string;
    fieldState: string;
    fieldMapsLink: string;
    fieldPhone: string;
    fieldFullText: string;
    translationMissingNotice: string;
    loading: string;
    mapPinNote: string;
    geocodeButton: string;
    latitudeLabel: string;
    longitudeLabel: string;
    verifyPin: string;
    geocodeMissingUrl: string;
    geocodeError: string;
    loginTitle: string;
    loginSubtitle: string;
    supabaseNotConfigured: string;
    accountNotAdmin: string;
    loginFailed: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    pleaseWait: string;
    loginButton: string;
    adminLanguageLabel: string;
  };
};

const hi: UiStrings = {
  siteSubtitle: "तीर्थ दर्शन",
  navList: "तीर्थ सूची",
  navHistory: "प्रभु का इतिहास",
  navMap: "मानचित्र",
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
  audioUnavailable: "इस भाषा के लिए आवाज़ इस डिवाइस पर उपलब्ध नहीं है",
  aboutTitle: "श्री पार्श्वनाथ भगवान का इतिहास",
  aboutEyebrow: "चरित्र",
  mapTitle: "तीर्थ मानचित्र",
  mapSubtitle: "सभी 108 पार्श्वनाथ तीर्थों को मानचित्र पर देखें — किसी भी चिन्ह पर क्लिक करके दिशा-निर्देश पाएं।",
  getDirections: "दिशा-निर्देश",
  findNearby: "मेरे नज़दीक तीर्थ खोजें",
  locating: "स्थान ज्ञात किया जा रहा है…",
  yourLocation: "आपका स्थान",
  nearbyHeading: "आपके नज़दीकी तीर्थ",
  distanceAway: (km) => `${km} किमी दूर`,
  locationDenied: "स्थान की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में लोकेशन की अनुमति दें।",
  locationUnavailable: "आपका स्थान ज्ञात नहीं हो सका।",
  notFoundTitle: "यह तीर्थ नहीं मिला",
  notFoundBody: "हो सकता है यह पृष्ठ हटा दिया गया हो या पता गलत हो।",
  notFoundCta: "सभी तीर्थ देखें",
  footerCredit: "मूल स्रोत: राजेन्द्र कुमार जैन, पार्श्व सदन, पार्श्व नगर, डूंगरपुर",
  languageLabel: "भाषा",
  translationNotice: "यह अनुवाद अभी तैयार नहीं है — मूल हिंदी पाठ दिखाया जा रहा है।",
  admin: {
    setupPendingTitle: "Admin सेटअप बाकी है",
    setupPendingBody:
      "NEXT_PUBLIC_SUPABASE_URL और NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local में सेट करें, फिर supabase/schema.sql चलाएँ और seed स्क्रिप्ट से डेटा भरें।",
    manageTemples: "तीर्थ प्रबंधन",
    entriesCount: (n) => `${n} प्रविष्टियाँ`,
    addTemple: "+ नया तीर्थ",
    signOut: "लॉगआउट",
    colNumber: "#",
    colTitle: "शीर्षक",
    colCity: "शहर",
    colStatus: "स्थिति",
    published: "प्रकाशित",
    hidden: "छिपा हुआ",
    edit: "संपादित करें",
    newTempleTitle: "नया तीर्थ जोड़ें",
    editTempleTitle: "तीर्थ संपादित करें",
    publishedCheckbox: "प्रकाशित",
    entryNumberLabel: "क्रमांक",
    slugLabel: "slug",
    photosLabel: "फोटो",
    setCoverPhoto: "मुख्य फोटो बनाएं",
    removePhoto: "हटाएं",
    save: "सहेजें",
    saving: "सहेजा जा रहा है…",
    deleteTemple: "यह तीर्थ हटाएं",
    confirmDeleteTemple: "क्या आप वाकई इस तीर्थ को हटाना चाहते हैं?",
    fieldTitle: "शीर्षक",
    fieldCity: "शहर",
    fieldState: "राज्य",
    fieldMapsLink: "Google Maps लिंक",
    fieldPhone: "फोन",
    fieldFullText: "पूर्ण विवरण (मूल पाठ)",
    translationMissingNotice: "इस भाषा में अभी अनुवाद नहीं है — नीचे भरकर सहेजें।",
    loading: "लोड हो रहा है…",
    mapPinNote: "तीर्थ मानचित्र (/map) पर यह पिन इन निर्देशांकों पर दिखेगा।",
    geocodeButton: "लिंक से स्थान ज्ञात करें",
    latitudeLabel: "अक्षांश (Latitude)",
    longitudeLabel: "देशांतर (Longitude)",
    verifyPin: "पिन की स्थिति जाँचें (Google Maps पर खोलें)",
    geocodeMissingUrl: "पहले Google Maps लिंक भरें।",
    geocodeError: "स्थान ज्ञात नहीं हो सका।",
    loginTitle: "Admin लॉगिन",
    loginSubtitle: "१०८ पार्श्वनाथ तीर्थ दर्शन — सामग्री प्रबंधन",
    supabaseNotConfigured: "Supabase अभी कॉन्फ़िगर नहीं है। .env.local में NEXT_PUBLIC_SUPABASE_URL/ANON_KEY सेट करें।",
    accountNotAdmin: "यह खाता admin सूची में नहीं है।",
    loginFailed: "लॉगिन विफल — ईमेल या पासवर्ड जांचें।",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड",
    pleaseWait: "प्रतीक्षा करें…",
    loginButton: "लॉगिन करें",
    adminLanguageLabel: "Admin भाषा",
  },
};

const en: UiStrings = {
  siteSubtitle: "Tirtha Darshan",
  navList: "Temple List",
  navHistory: "Life of Parshwanath",
  navMap: "Map",
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
  audioUnavailable: "Voice for this language isn't available on this device",
  aboutTitle: "The life of Lord Parshwanath",
  aboutEyebrow: "Biography",
  mapTitle: "Temple Map",
  mapSubtitle: "All 108 Parshwanath temples on one map — click any pin for directions.",
  getDirections: "Get Directions",
  findNearby: "Find Temples Near Me",
  locating: "Locating you…",
  yourLocation: "Your location",
  nearbyHeading: "Temples Near You",
  distanceAway: (km) => `${km} km away`,
  locationDenied: "Location permission was denied. Please allow location access in your browser settings.",
  locationUnavailable: "We couldn't determine your location.",
  notFoundTitle: "Temple not found",
  notFoundBody: "This page may have been removed, or the address is incorrect.",
  notFoundCta: "Browse all temples",
  footerCredit: "Original source: Rajendra Kumar Jain, Parshv Sadan, Parshv Nagar, Dungarpur",
  languageLabel: "Language",
  translationNotice: "This translation isn't ready yet — showing the original Hindi text.",
  admin: {
    setupPendingTitle: "Admin setup pending",
    setupPendingBody:
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then run supabase/schema.sql and seed the data.",
    manageTemples: "Manage Temples",
    entriesCount: (n) => `${n} entries`,
    addTemple: "+ New Temple",
    signOut: "Sign Out",
    colNumber: "#",
    colTitle: "Title",
    colCity: "City",
    colStatus: "Status",
    published: "Published",
    hidden: "Hidden",
    edit: "Edit",
    newTempleTitle: "Add New Temple",
    editTempleTitle: "Edit Temple",
    publishedCheckbox: "Published",
    entryNumberLabel: "Entry Number",
    slugLabel: "slug",
    photosLabel: "Photos",
    setCoverPhoto: "Set as cover",
    removePhoto: "Remove",
    save: "Save",
    saving: "Saving…",
    deleteTemple: "Delete this temple",
    confirmDeleteTemple: "Are you sure you want to delete this temple?",
    fieldTitle: "Title",
    fieldCity: "City",
    fieldState: "State",
    fieldMapsLink: "Google Maps link",
    fieldPhone: "Phone",
    fieldFullText: "Full description (source text)",
    translationMissingNotice: "There's no translation for this language yet — fill it in below and save.",
    loading: "Loading…",
    mapPinNote: "This pin will appear at these coordinates on the temple map (/map).",
    geocodeButton: "Find location from link",
    latitudeLabel: "Latitude",
    longitudeLabel: "Longitude",
    verifyPin: "Verify pin location (open in Google Maps)",
    geocodeMissingUrl: "Fill in the Google Maps link first.",
    geocodeError: "Couldn't determine the location.",
    loginTitle: "Admin Login",
    loginSubtitle: "108 Parshwanath Tirtha Darshan — Content Management",
    supabaseNotConfigured: "Supabase isn't configured yet. Set NEXT_PUBLIC_SUPABASE_URL/ANON_KEY in .env.local.",
    accountNotAdmin: "This account is not on the admin list.",
    loginFailed: "Login failed — check your email or password.",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    pleaseWait: "Please wait…",
    loginButton: "Log In",
    adminLanguageLabel: "Admin Language",
  },
};

const gu: UiStrings = {
  siteSubtitle: "તીર્થ દર્શન",
  navList: "તીર્થ યાદી",
  navHistory: "પ્રભુનો ઇતિહાસ",
  navMap: "નકશો",
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
  audioUnavailable: "આ ભાષા માટે અવાજ આ ડિવાઇસ પર ઉપલબ્ધ નથી",
  aboutTitle: "શ્રી પાર્શ્વનાથ ભગવાનનો ઇતિહાસ",
  aboutEyebrow: "ચરિત્ર",
  mapTitle: "તીર્થ નકશો",
  mapSubtitle: "બધા 108 પાર્શ્વનાથ તીર્થોને એક નકશા પર જુઓ — દિશા-નિર્દેશ માટે કોઈપણ પિન પર ક્લિક કરો.",
  getDirections: "દિશા-નિર્દેશ",
  findNearby: "મારી નજીકના તીર્થ શોધો",
  locating: "તમારું સ્થાન શોધાઈ રહ્યું છે…",
  yourLocation: "તમારું સ્થાન",
  nearbyHeading: "તમારી નજીકના તીર્થ",
  distanceAway: (km) => `${km} કિમી દૂર`,
  locationDenied: "સ્થાનની પરવાનગી મળી નથી. કૃપા કરી બ્રાઉઝર સેટિંગ્સમાં લોકેશન એક્સેસની મંજૂરી આપો.",
  locationUnavailable: "તમારું સ્થાન શોધી શકાયું નથી.",
  notFoundTitle: "આ તીર્થ મળ્યું નથી",
  notFoundBody: "આ પાનું દૂર કરવામાં આવ્યું હોઈ શકે અથવા સરનામું ખોટું છે.",
  notFoundCta: "બધા તીર્થ જુઓ",
  footerCredit: "મૂળ સ્રોત: રાજેન્દ્ર કુમાર જૈન, પાર્શ્વ સદન, પાર્શ્વ નગર, ડુંગરપુર",
  languageLabel: "ભાષા",
  translationNotice: "આ અનુવાદ હજુ તૈયાર નથી — મૂળ હિન્દી લખાણ બતાવવામાં આવ્યું છે.",
  admin: {
    setupPendingTitle: "Admin સેટઅપ બાકી છે",
    setupPendingBody:
      "NEXT_PUBLIC_SUPABASE_URL અને NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local માં સેટ કરો, પછી supabase/schema.sql ચલાવો અને seed સ્ક્રિપ્ટથી ડેટા ભરો.",
    manageTemples: "તીર્થ વ્યવસ્થાપન",
    entriesCount: (n) => `${n} પ્રવિષ્ટિઓ`,
    addTemple: "+ નવું તીર્થ",
    signOut: "લૉગઆઉટ",
    colNumber: "#",
    colTitle: "શીર્ષક",
    colCity: "શહેર",
    colStatus: "સ્થિતિ",
    published: "પ્રકાશિત",
    hidden: "છુપાયેલું",
    edit: "સંપાદિત કરો",
    newTempleTitle: "નવું તીર્થ ઉમેરો",
    editTempleTitle: "તીર્થ સંપાદિત કરો",
    publishedCheckbox: "પ્રકાશિત",
    entryNumberLabel: "ક્રમાંક",
    slugLabel: "slug",
    photosLabel: "ફોટા",
    setCoverPhoto: "મુખ્ય ફોટો બનાવો",
    removePhoto: "દૂર કરો",
    save: "સાચવો",
    saving: "સાચવાઈ રહ્યું છે…",
    deleteTemple: "આ તીર્થ કાઢી નાખો",
    confirmDeleteTemple: "શું તમે ખરેખર આ તીર્થ કાઢી નાખવા માંગો છો?",
    fieldTitle: "શીર્ષક",
    fieldCity: "શહેર",
    fieldState: "રાજ્ય",
    fieldMapsLink: "Google Maps લિંક",
    fieldPhone: "ફોન",
    fieldFullText: "સંપૂર્ણ વર્ણન (મૂળ લખાણ)",
    translationMissingNotice: "આ ભાષામાં હજુ અનુવાદ નથી — નીચે ભરીને સાચવો.",
    loading: "લોડ થઈ રહ્યું છે…",
    mapPinNote: "તીર્થ નકશા (/map) પર આ પિન આ નિર્દેશાંકો પર દેખાશે.",
    geocodeButton: "લિંક પરથી સ્થાન શોધો",
    latitudeLabel: "અક્ષાંશ (Latitude)",
    longitudeLabel: "રેખાંશ (Longitude)",
    verifyPin: "પિનની સ્થિતિ ચકાસો (Google Maps પર ખોલો)",
    geocodeMissingUrl: "પહેલા Google Maps લિંક ભરો.",
    geocodeError: "સ્થાન શોધી શકાયું નથી.",
    loginTitle: "Admin લૉગિન",
    loginSubtitle: "૧૦૮ પાર્શ્વનાથ તીર્થ દર્શન — સામગ્રી વ્યવસ્થાપન",
    supabaseNotConfigured: "Supabase હજુ કૉન્ફિગર થયું નથી. .env.local માં NEXT_PUBLIC_SUPABASE_URL/ANON_KEY સેટ કરો.",
    accountNotAdmin: "આ ખાતું admin યાદીમાં નથી.",
    loginFailed: "લૉગિન નિષ્ફળ — ઈમેલ અથવા પાસવર્ડ તપાસો.",
    emailPlaceholder: "ઈમેલ",
    passwordPlaceholder: "પાસવર્ડ",
    pleaseWait: "કૃપા કરી રાહ જુઓ…",
    loginButton: "લૉગિન કરો",
    adminLanguageLabel: "Admin ભાષા",
  },
};

const mr: UiStrings = {
  siteSubtitle: "तीर्थ दर्शन",
  navList: "तीर्थ यादी",
  navHistory: "प्रभूंचा इतिहास",
  navMap: "नकाशा",
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
  audioUnavailable: "या भाषेसाठी आवाज या डिव्हाइसवर उपलब्ध नाही",
  aboutTitle: "श्री पार्श्वनाथ भगवानचा इतिहास",
  aboutEyebrow: "चरित्र",
  mapTitle: "तीर्थ नकाशा",
  mapSubtitle: "सर्व 108 पार्श्वनाथ तीर्थ एकाच नकाशावर पहा — दिशानिर्देशांसाठी कोणत्याही खुणेवर क्लिक करा.",
  getDirections: "दिशानिर्देश",
  findNearby: "माझ्या जवळची तीर्थे शोधा",
  locating: "तुमचे स्थान शोधले जात आहे…",
  yourLocation: "तुमचे स्थान",
  nearbyHeading: "तुमच्या जवळची तीर्थे",
  distanceAway: (km) => `${km} किमी दूर`,
  locationDenied: "स्थानाची परवानगी मिळाली नाही. कृपया ब्राउझर सेटिंग्जमध्ये लोकेशन अ‍ॅक्सेसला परवानगी द्या.",
  locationUnavailable: "तुमचे स्थान शोधता आले नाही.",
  notFoundTitle: "हे तीर्थ सापडले नाही",
  notFoundBody: "हे पान काढले गेले असावे किंवा पत्ता चुकीचा आहे.",
  notFoundCta: "सर्व तीर्थ पहा",
  footerCredit: "मूळ स्रोत: राजेंद्र कुमार जैन, पार्श्व सदन, पार्श्व नगर, डुंगरपूर",
  languageLabel: "भाषा",
  translationNotice: "हे भाषांतर अद्याप तयार नाही — मूळ हिंदी मजकूर दाखवला जात आहे.",
  admin: {
    setupPendingTitle: "Admin सेटअप बाकी आहे",
    setupPendingBody:
      "NEXT_PUBLIC_SUPABASE_URL आणि NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local मध्ये सेट करा, नंतर supabase/schema.sql चालवा आणि seed स्क्रिप्टने डेटा भरा.",
    manageTemples: "तीर्थ व्यवस्थापन",
    entriesCount: (n) => `${n} नोंदी`,
    addTemple: "+ नवीन तीर्थ",
    signOut: "लॉगआउट",
    colNumber: "#",
    colTitle: "शीर्षक",
    colCity: "शहर",
    colStatus: "स्थिती",
    published: "प्रकाशित",
    hidden: "लपवलेले",
    edit: "संपादित करा",
    newTempleTitle: "नवीन तीर्थ जोडा",
    editTempleTitle: "तीर्थ संपादित करा",
    publishedCheckbox: "प्रकाशित",
    entryNumberLabel: "क्रमांक",
    slugLabel: "slug",
    photosLabel: "फोटो",
    setCoverPhoto: "मुख्य फोटो बनवा",
    removePhoto: "काढा",
    save: "जतन करा",
    saving: "जतन होत आहे…",
    deleteTemple: "हे तीर्थ हटवा",
    confirmDeleteTemple: "तुम्हाला खरोखर हे तीर्थ हटवायचे आहे का?",
    fieldTitle: "शीर्षक",
    fieldCity: "शहर",
    fieldState: "राज्य",
    fieldMapsLink: "Google Maps लिंक",
    fieldPhone: "फोन",
    fieldFullText: "संपूर्ण वर्णन (मूळ मजकूर)",
    translationMissingNotice: "या भाषेत अद्याप भाषांतर नाही — खाली भरून जतन करा.",
    loading: "लोड होत आहे…",
    mapPinNote: "तीर्थ नकाशावर (/map) हे पिन या निर्देशांकांवर दिसेल.",
    geocodeButton: "लिंकवरून स्थान शोधा",
    latitudeLabel: "अक्षांश (Latitude)",
    longitudeLabel: "रेखांश (Longitude)",
    verifyPin: "पिनची स्थिती तपासा (Google Maps वर उघडा)",
    geocodeMissingUrl: "आधी Google Maps लिंक भरा.",
    geocodeError: "स्थान शोधता आले नाही.",
    loginTitle: "Admin लॉगिन",
    loginSubtitle: "१०८ पार्श्वनाथ तीर्थ दर्शन — सामग्री व्यवस्थापन",
    supabaseNotConfigured: "Supabase अद्याप कॉन्फिगर केलेले नाही. .env.local मध्ये NEXT_PUBLIC_SUPABASE_URL/ANON_KEY सेट करा.",
    accountNotAdmin: "हे खाते admin यादीत नाही.",
    loginFailed: "लॉगिन अयशस्वी — ईमेल किंवा पासवर्ड तपासा.",
    emailPlaceholder: "ईमेल",
    passwordPlaceholder: "पासवर्ड",
    pleaseWait: "कृपया प्रतीक्षा करा…",
    loginButton: "लॉगिन करा",
    adminLanguageLabel: "Admin भाषा",
  },
};

// Remaining constitutional languages: UI chrome falls back to Hindi for now
// (still fully navigable — Devanagari-adjacent readers can follow it, and
// content translation is prioritized over chrome labels). Content itself
// falls back per-entry via translationNotice logic in the data layer.
const fallbackMap: Partial<Record<LanguageCode, UiStrings>> = { hi, en, gu, mr };

export function getUiStrings(lang: LanguageCode): UiStrings {
  return fallbackMap[lang] ?? fallbackMap[DEFAULT_LANGUAGE]!;
}
