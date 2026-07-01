export type Locale =
  | "de"
  | "en"
  | "fr"
  | "it"
  | "sq"
  | "pt"
  | "es"
  | "sr"
  | "ar"
  | "pl"
  | "hu"
  | "tr"
  | "ru"
  | "uk"
  | "ta";

export const locales: Locale[] = [
  "de",
  "en",
  "fr",
  "it",
  "sq",
  "pt",
  "es",
  "sr",
  "ar",
  "pl",
  "hu",
  "tr",
  "ru",
  "uk",
  "ta",
];

export const defaultLocale: Locale = "de";

export const rtlLocales: Locale[] = ["ar"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

// Anzeige-Metadaten je Sprache: Eigenname + Flagge.
// Flaggen sind eine grobe Heuristik (Hauptverbreitungsland), nicht politisch zu verstehen.
export const localeMeta: Record<Locale, { nativeName: string; flag: string }> = {
  de: { nativeName: "Deutsch", flag: "🇨🇭" },
  en: { nativeName: "English", flag: "🇬🇧" },
  fr: { nativeName: "Français", flag: "🇫🇷" },
  it: { nativeName: "Italiano", flag: "🇮🇹" },
  sq: { nativeName: "Shqip", flag: "🇦🇱" },
  pt: { nativeName: "Português", flag: "🇵🇹" },
  es: { nativeName: "Español", flag: "🇪🇸" },
  sr: { nativeName: "Srpski / Hrvatski / Bosanski", flag: "🇷🇸" },
  ar: { nativeName: "العربية", flag: "🇸🇦" },
  pl: { nativeName: "Polski", flag: "🇵🇱" },
  hu: { nativeName: "Magyar", flag: "🇭🇺" },
  tr: { nativeName: "Türkçe", flag: "🇹🇷" },
  ru: { nativeName: "Русский", flag: "🇷🇺" },
  uk: { nativeName: "Українська", flag: "🇺🇦" },
  ta: { nativeName: "தமிழ்", flag: "🇱🇰" },
};

export type Dictionary = typeof import("./dictionaries/de.json");

const dictionaries: Record<Locale, () => Promise<any>> = {
  de: () => import("./dictionaries/de.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  it: () => import("./dictionaries/it.json").then((m) => m.default),
  sq: () => import("./dictionaries/sq.json").then((m) => m.default),
  pt: () => import("./dictionaries/pt.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  sr: () => import("./dictionaries/sr.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
  hu: () => import("./dictionaries/hu.json").then((m) => m.default),
  tr: () => import("./dictionaries/tr.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  uk: () => import("./dictionaries/uk.json").then((m) => m.default),
  ta: () => import("./dictionaries/ta.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  return loader();
}
