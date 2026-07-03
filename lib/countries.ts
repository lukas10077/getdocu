export interface Country {
  code: string;        // ISO 3166-1 alpha-2
  name: string;        // auf Deutsch
  flag: string;        // Emoji-Flagge
  currency: string;    // ISO 4217
  documentLang: string; // Sprache des generierten Dokuments
  continent: "europe" | "americas";
}

// Stripe-Währungskonfiguration
// factor: priceChfRappen × factor = Stripe unit_amount in Zielwährung
export const CURRENCY_CONFIG: Record<string, { factor: number }> = {
  CHF: { factor: 1 },
  EUR: { factor: 0.95 },
  GBP: { factor: 0.87 },
  SEK: { factor: 12 },
  NOK: { factor: 12 },
  DKK: { factor: 7.5 },
  PLN: { factor: 4.5 },
  CZK: { factor: 25 },
  HUF: { factor: 4 },   // zero-decimal in Stripe
  RON: { factor: 5 },
  BGN: { factor: 1.86 },
  RSD: { factor: 115 }, // zero-decimal
  UAH: { factor: 44 },
  USD: { factor: 1.10 },
  CAD: { factor: 1.50 },
  MXN: { factor: 20 },
  BRL: { factor: 6 },
  ARS: { factor: 10 },  // vereinfacht wegen Inflation
  CLP: { factor: 9.4 }, // zero-decimal
  COP: { factor: 45 },  // zero-decimal
  PEN: { factor: 3.8 },
  UYU: { factor: 45 },
  PYG: { factor: 760 }, // zero-decimal
  BOB: { factor: 7.5 },
};

// Für Stripe: Diese Währungen haben keine Dezimalstellen
export const ZERO_DECIMAL_CURRENCIES = new Set([
  "HUF", "CLP", "COP", "PYG", "RSD",
]);

// Fallback-Währungen für Länder mit exotischen Währungen
export const CURRENCY_FALLBACK: Record<string, string> = {
  // Karibik → USD
  CUP: "USD", HTG: "USD", JMD: "USD", TTD: "USD",
  BBD: "USD", XCD: "USD", BSD: "USD", DOP: "USD",
  // Zentralamerika → USD
  GTQ: "USD", BZD: "USD", HNL: "USD", NIO: "USD", CRC: "USD",
  // Sonstige → EUR
  MDL: "EUR", BYR: "EUR", MKD: "EUR", ALL: "EUR", BAM: "EUR",
  ISK: "EUR", GYD: "USD", SRD: "USD",
};

export const COUNTRIES: Country[] = [
  // ── Europa ────────────────────────────────────────────
  { code: "AD", name: "Andorra",                      flag: "🇦🇩", currency: "EUR", documentLang: "ca", continent: "europe" },
  { code: "AL", name: "Albanien",                     flag: "🇦🇱", currency: "ALL", documentLang: "sq", continent: "europe" },
  { code: "AT", name: "Österreich",                   flag: "🇦🇹", currency: "EUR", documentLang: "de", continent: "europe" },
  { code: "BA", name: "Bosnien-Herzegowina",          flag: "🇧🇦", currency: "BAM", documentLang: "bs", continent: "europe" },
  { code: "BE", name: "Belgien",                      flag: "🇧🇪", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "BG", name: "Bulgarien",                    flag: "🇧🇬", currency: "BGN", documentLang: "bg", continent: "europe" },
  { code: "BY", name: "Belarus",                      flag: "🇧🇾", currency: "BYR", documentLang: "be", continent: "europe" },
  { code: "CH", name: "Schweiz",                      flag: "🇨🇭", currency: "CHF", documentLang: "de", continent: "europe" },
  { code: "CY", name: "Zypern",                       flag: "🇨🇾", currency: "EUR", documentLang: "el", continent: "europe" },
  { code: "CZ", name: "Tschechien",                   flag: "🇨🇿", currency: "CZK", documentLang: "cs", continent: "europe" },
  { code: "DE", name: "Deutschland",                  flag: "🇩🇪", currency: "EUR", documentLang: "de", continent: "europe" },
  { code: "DK", name: "Dänemark",                     flag: "🇩🇰", currency: "DKK", documentLang: "da", continent: "europe" },
  { code: "EE", name: "Estland",                      flag: "🇪🇪", currency: "EUR", documentLang: "et", continent: "europe" },
  { code: "ES", name: "Spanien",                      flag: "🇪🇸", currency: "EUR", documentLang: "es", continent: "europe" },
  { code: "FI", name: "Finnland",                     flag: "🇫🇮", currency: "EUR", documentLang: "fi", continent: "europe" },
  { code: "FR", name: "Frankreich",                   flag: "🇫🇷", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "GB", name: "Vereinigtes Königreich",       flag: "🇬🇧", currency: "GBP", documentLang: "en", continent: "europe" },
  { code: "GR", name: "Griechenland",                 flag: "🇬🇷", currency: "EUR", documentLang: "el", continent: "europe" },
  { code: "HR", name: "Kroatien",                     flag: "🇭🇷", currency: "EUR", documentLang: "hr", continent: "europe" },
  { code: "HU", name: "Ungarn",                       flag: "🇭🇺", currency: "HUF", documentLang: "hu", continent: "europe" },
  { code: "IE", name: "Irland",                       flag: "🇮🇪", currency: "EUR", documentLang: "en", continent: "europe" },
  { code: "IS", name: "Island",                       flag: "🇮🇸", currency: "ISK", documentLang: "is", continent: "europe" },
  { code: "IT", name: "Italien",                      flag: "🇮🇹", currency: "EUR", documentLang: "it", continent: "europe" },
  { code: "LI", name: "Liechtenstein",                flag: "🇱🇮", currency: "CHF", documentLang: "de", continent: "europe" },
  { code: "LT", name: "Litauen",                      flag: "🇱🇹", currency: "EUR", documentLang: "lt", continent: "europe" },
  { code: "LU", name: "Luxemburg",                    flag: "🇱🇺", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "LV", name: "Lettland",                     flag: "🇱🇻", currency: "EUR", documentLang: "lv", continent: "europe" },
  { code: "MC", name: "Monaco",                       flag: "🇲🇨", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "MD", name: "Moldau",                       flag: "🇲🇩", currency: "MDL", documentLang: "ro", continent: "europe" },
  { code: "ME", name: "Montenegro",                   flag: "🇲🇪", currency: "EUR", documentLang: "sr", continent: "europe" },
  { code: "MK", name: "Nordmazedonien",               flag: "🇲🇰", currency: "MKD", documentLang: "mk", continent: "europe" },
  { code: "MT", name: "Malta",                        flag: "🇲🇹", currency: "EUR", documentLang: "en", continent: "europe" },
  { code: "NL", name: "Niederlande",                  flag: "🇳🇱", currency: "EUR", documentLang: "nl", continent: "europe" },
  { code: "NO", name: "Norwegen",                     flag: "🇳🇴", currency: "NOK", documentLang: "no", continent: "europe" },
  { code: "PL", name: "Polen",                        flag: "🇵🇱", currency: "PLN", documentLang: "pl", continent: "europe" },
  { code: "PT", name: "Portugal",                     flag: "🇵🇹", currency: "EUR", documentLang: "pt", continent: "europe" },
  { code: "RO", name: "Rumänien",                     flag: "🇷🇴", currency: "RON", documentLang: "ro", continent: "europe" },
  { code: "RS", name: "Serbien",                      flag: "🇷🇸", currency: "RSD", documentLang: "sr", continent: "europe" },
  { code: "SE", name: "Schweden",                     flag: "🇸🇪", currency: "SEK", documentLang: "sv", continent: "europe" },
  { code: "SI", name: "Slowenien",                    flag: "🇸🇮", currency: "EUR", documentLang: "sl", continent: "europe" },
  { code: "SK", name: "Slowakei",                     flag: "🇸🇰", currency: "EUR", documentLang: "sk", continent: "europe" },
  { code: "SM", name: "San Marino",                   flag: "🇸🇲", currency: "EUR", documentLang: "it", continent: "europe" },
  { code: "UA", name: "Ukraine",                      flag: "🇺🇦", currency: "UAH", documentLang: "uk", continent: "europe" },
  { code: "XK", name: "Kosovo",                       flag: "🇽🇰", currency: "EUR", documentLang: "sq", continent: "europe" },

  // ── Nord- und Mittelamerika ───────────────────────────
  { code: "BZ", name: "Belize",                       flag: "🇧🇿", currency: "BZD", documentLang: "en", continent: "americas" },
  { code: "CA", name: "Kanada",                       flag: "🇨🇦", currency: "CAD", documentLang: "en", continent: "americas" },
  { code: "CR", name: "Costa Rica",                   flag: "🇨🇷", currency: "CRC", documentLang: "es", continent: "americas" },
  { code: "GT", name: "Guatemala",                    flag: "🇬🇹", currency: "GTQ", documentLang: "es", continent: "americas" },
  { code: "HN", name: "Honduras",                     flag: "🇭🇳", currency: "HNL", documentLang: "es", continent: "americas" },
  { code: "MX", name: "Mexiko",                       flag: "🇲🇽", currency: "MXN", documentLang: "es", continent: "americas" },
  { code: "NI", name: "Nicaragua",                    flag: "🇳🇮", currency: "NIO", documentLang: "es", continent: "americas" },
  { code: "PA", name: "Panama",                       flag: "🇵🇦", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "SV", name: "El Salvador",                  flag: "🇸🇻", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "US", name: "USA",                          flag: "🇺🇸", currency: "USD", documentLang: "en", continent: "americas" },

  // ── Karibik ───────────────────────────────────────────
  { code: "AG", name: "Antigua und Barbuda",          flag: "🇦🇬", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "BB", name: "Barbados",                     flag: "🇧🇧", currency: "BBD", documentLang: "en", continent: "americas" },
  { code: "BS", name: "Bahamas",                      flag: "🇧🇸", currency: "BSD", documentLang: "en", continent: "americas" },
  { code: "CU", name: "Kuba",                         flag: "🇨🇺", currency: "CUP", documentLang: "es", continent: "americas" },
  { code: "DM", name: "Dominica",                     flag: "🇩🇲", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "DO", name: "Dominikanische Republik",      flag: "🇩🇴", currency: "DOP", documentLang: "es", continent: "americas" },
  { code: "GD", name: "Grenada",                      flag: "🇬🇩", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "HT", name: "Haiti",                        flag: "🇭🇹", currency: "HTG", documentLang: "fr", continent: "americas" },
  { code: "JM", name: "Jamaika",                      flag: "🇯🇲", currency: "JMD", documentLang: "en", continent: "americas" },
  { code: "KN", name: "St. Kitts und Nevis",          flag: "🇰🇳", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "LC", name: "St. Lucia",                    flag: "🇱🇨", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "TT", name: "Trinidad und Tobago",          flag: "🇹🇹", currency: "TTD", documentLang: "en", continent: "americas" },
  { code: "VC", name: "St. Vincent und die Grenadinen", flag: "🇻🇨", currency: "XCD", documentLang: "en", continent: "americas" },

  // ── Südamerika ────────────────────────────────────────
  { code: "AR", name: "Argentinien",                  flag: "🇦🇷", currency: "ARS", documentLang: "es", continent: "americas" },
  { code: "BO", name: "Bolivien",                     flag: "🇧🇴", currency: "BOB", documentLang: "es", continent: "americas" },
  { code: "BR", name: "Brasilien",                    flag: "🇧🇷", currency: "BRL", documentLang: "pt", continent: "americas" },
  { code: "CL", name: "Chile",                        flag: "🇨🇱", currency: "CLP", documentLang: "es", continent: "americas" },
  { code: "CO", name: "Kolumbien",                    flag: "🇨🇴", currency: "COP", documentLang: "es", continent: "americas" },
  { code: "EC", name: "Ecuador",                      flag: "🇪🇨", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "GY", name: "Guyana",                       flag: "🇬🇾", currency: "GYD", documentLang: "en", continent: "americas" },
  { code: "PE", name: "Peru",                         flag: "🇵🇪", currency: "PEN", documentLang: "es", continent: "americas" },
  { code: "PY", name: "Paraguay",                     flag: "🇵🇾", currency: "PYG", documentLang: "es", continent: "americas" },
  { code: "SR", name: "Suriname",                     flag: "🇸🇷", currency: "SRD", documentLang: "nl", continent: "americas" },
  { code: "UY", name: "Uruguay",                      flag: "🇺🇾", currency: "UYU", documentLang: "es", continent: "americas" },
  { code: "VE", name: "Venezuela",                    flag: "🇻🇪", currency: "USD", documentLang: "es", continent: "americas" },
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Ermittelt die Stripe-Währung und den Betrag für ein gegebenes Land */
export function getStripeAmount(priceChfRappen: number, currency: string): { currency: string; amount: number } {
  // Fallback auf EUR/USD wenn Währung nicht direkt unterstützt
  const effectiveCurrency = CURRENCY_FALLBACK[currency] ?? currency;
  const config = CURRENCY_CONFIG[effectiveCurrency];
  if (!config) {
    // Letzter Fallback: CHF
    return { currency: "chf", amount: priceChfRappen };
  }
  const amount = Math.round(priceChfRappen * config.factor);
  return { currency: effectiveCurrency.toLowerCase(), amount };
}

/** Übersetzt einen Sprach-Code in einen lesbaren deutschen Namen */
export const LANG_NAMES: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch",
  fr: "Französisch",
  it: "Italienisch",
  es: "Spanisch",
  pt: "Portugiesisch",
  nl: "Niederländisch",
  pl: "Polnisch",
  hu: "Ungarisch",
  cs: "Tschechisch",
  sk: "Slowakisch",
  ro: "Rumänisch",
  bg: "Bulgarisch",
  hr: "Kroatisch",
  sl: "Slowenisch",
  sr: "Serbisch",
  sq: "Albanisch",
  mk: "Mazedonisch",
  el: "Griechisch",
  sv: "Schwedisch",
  no: "Norwegisch",
  da: "Dänisch",
  fi: "Finnisch",
  et: "Estnisch",
  lv: "Lettisch",
  lt: "Litauisch",
  uk: "Ukrainisch",
  be: "Belarussisch",
  is: "Isländisch",
  ca: "Katalanisch",
  bs: "Bosnisch",
};
