export interface Country {
  code: string;        // ISO 3166-1 alpha-2
  name: string;        // auf Deutsch
  flag: string;        // Emoji-Flagge
  currency: string;    // ISO 4217
  documentLang: string; // Sprache des generierten Dokuments
  continent: "europe" | "americas" | "asia" | "oceania";
}

// Stripe-Währungskonfiguration
// factor: priceChfRappen × factor = Stripe unit_amount in Zielwährung
export const CURRENCY_CONFIG: Record<string, { factor: number }> = {
  // Europa
  CHF: { factor: 1 },
  EUR: { factor: 0.95 },
  GBP: { factor: 0.87 },
  SEK: { factor: 12 },
  NOK: { factor: 12 },
  DKK: { factor: 7.5 },
  PLN: { factor: 4.5 },
  CZK: { factor: 25 },
  HUF: { factor: 4 },     // zero-decimal
  RON: { factor: 5 },
  BGN: { factor: 1.86 },
  RSD: { factor: 115 },   // zero-decimal
  UAH: { factor: 44 },
  // Amerika
  USD: { factor: 1.10 },
  CAD: { factor: 1.50 },
  MXN: { factor: 20 },
  BRL: { factor: 6 },
  ARS: { factor: 10 },
  CLP: { factor: 9.4 },   // zero-decimal
  COP: { factor: 45 },    // zero-decimal
  PEN: { factor: 3.8 },
  UYU: { factor: 45 },
  PYG: { factor: 760 },   // zero-decimal
  BOB: { factor: 7.5 },
  // Naher Osten
  AED: { factor: 4.04 },
  SAR: { factor: 4.13 },
  QAR: { factor: 4.01 },
  KWD: { factor: 3.4 },   // three-decimal
  BHD: { factor: 4.2 },   // three-decimal
  OMR: { factor: 4.2 },   // three-decimal
  JOD: { factor: 7.9 },   // three-decimal
  ILS: { factor: 4.10 },
  TRY: { factor: 36 },
  // Asien
  JPY: { factor: 1.65 },  // zero-decimal
  KRW: { factor: 14.8 },  // zero-decimal
  HKD: { factor: 8.58 },
  SGD: { factor: 1.48 },
  MYR: { factor: 5.1 },
  THB: { factor: 37.5 },
  PHP: { factor: 62 },
  VND: { factor: 270 },   // zero-decimal
  INR: { factor: 91 },
  PKR: { factor: 306 },
  BDT: { factor: 120 },
  LKR: { factor: 300 },
  // Ozeanien
  AUD: { factor: 1.73 },
  NZD: { factor: 1.87 },
  FJD: { factor: 2.35 },
  PGK: { factor: 4.3 },
};

// Stripe: Währungen ohne Dezimalstellen (unit_amount = voller Betrag)
export const ZERO_DECIMAL_CURRENCIES = new Set([
  "JPY", "KRW", "VND", "CLP", "COP", "PYG", "RSD", "HUF",
]);

// Stripe: Währungen mit 3 Dezimalstellen (unit_amount in Tausendstel)
export const THREE_DECIMAL_CURRENCIES = new Set([
  "KWD", "BHD", "OMR", "JOD",
]);

// Fallback für Stripe-nicht-unterstützte Währungen
export const CURRENCY_FALLBACK: Record<string, string> = {
  // Karibik + Zentralamerika → USD
  CUP: "USD", HTG: "USD", JMD: "USD", TTD: "USD",
  BBD: "USD", XCD: "USD", BSD: "USD", DOP: "USD",
  GTQ: "USD", BZD: "USD", HNL: "USD", NIO: "USD", CRC: "USD",
  // Sonstiges Europa → EUR
  MDL: "EUR", BYR: "EUR", MKD: "EUR", ALL: "EUR", BAM: "EUR", ISK: "EUR",
  // Südamerika → USD
  GYD: "USD", SRD: "USD",
  // Zentralasien → USD
  KZT: "USD", UZS: "USD",
  // Restliches Asien → USD oder SGD
  MMK: "USD", KHR: "USD", LAK: "USD", NPR: "USD", MVR: "USD",
  BTN: "USD", MNT: "USD", CNY: "USD", TWD: "USD",
  // Ozeanien → USD
  SBD: "USD", VUV: "USD", WST: "USD", TOP: "USD",
  PGK: "AUD",
};

export const COUNTRIES: Country[] = [
  // ── Europa ────────────────────────────────────────────
  { code: "AD", name: "Andorra",                        flag: "🇦🇩", currency: "EUR", documentLang: "ca", continent: "europe" },
  { code: "AL", name: "Albanien",                       flag: "🇦🇱", currency: "ALL", documentLang: "sq", continent: "europe" },
  { code: "AT", name: "Österreich",                     flag: "🇦🇹", currency: "EUR", documentLang: "de", continent: "europe" },
  { code: "BA", name: "Bosnien-Herzegowina",            flag: "🇧🇦", currency: "BAM", documentLang: "bs", continent: "europe" },
  { code: "BE", name: "Belgien",                        flag: "🇧🇪", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "BG", name: "Bulgarien",                      flag: "🇧🇬", currency: "BGN", documentLang: "bg", continent: "europe" },
  { code: "BY", name: "Belarus",                        flag: "🇧🇾", currency: "BYR", documentLang: "be", continent: "europe" },
  { code: "CH", name: "Schweiz",                        flag: "🇨🇭", currency: "CHF", documentLang: "de", continent: "europe" },
  { code: "CY", name: "Zypern",                         flag: "🇨🇾", currency: "EUR", documentLang: "el", continent: "europe" },
  { code: "CZ", name: "Tschechien",                     flag: "🇨🇿", currency: "CZK", documentLang: "cs", continent: "europe" },
  { code: "DE", name: "Deutschland",                    flag: "🇩🇪", currency: "EUR", documentLang: "de", continent: "europe" },
  { code: "DK", name: "Dänemark",                       flag: "🇩🇰", currency: "DKK", documentLang: "da", continent: "europe" },
  { code: "EE", name: "Estland",                        flag: "🇪🇪", currency: "EUR", documentLang: "et", continent: "europe" },
  { code: "ES", name: "Spanien",                        flag: "🇪🇸", currency: "EUR", documentLang: "es", continent: "europe" },
  { code: "FI", name: "Finnland",                       flag: "🇫🇮", currency: "EUR", documentLang: "fi", continent: "europe" },
  { code: "FR", name: "Frankreich",                     flag: "🇫🇷", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "GB", name: "Vereinigtes Königreich",         flag: "🇬🇧", currency: "GBP", documentLang: "en", continent: "europe" },
  { code: "GR", name: "Griechenland",                   flag: "🇬🇷", currency: "EUR", documentLang: "el", continent: "europe" },
  { code: "HR", name: "Kroatien",                       flag: "🇭🇷", currency: "EUR", documentLang: "hr", continent: "europe" },
  { code: "HU", name: "Ungarn",                         flag: "🇭🇺", currency: "HUF", documentLang: "hu", continent: "europe" },
  { code: "IE", name: "Irland",                         flag: "🇮🇪", currency: "EUR", documentLang: "en", continent: "europe" },
  { code: "IS", name: "Island",                         flag: "🇮🇸", currency: "ISK", documentLang: "is", continent: "europe" },
  { code: "IT", name: "Italien",                        flag: "🇮🇹", currency: "EUR", documentLang: "it", continent: "europe" },
  { code: "LI", name: "Liechtenstein",                  flag: "🇱🇮", currency: "CHF", documentLang: "de", continent: "europe" },
  { code: "LT", name: "Litauen",                        flag: "🇱🇹", currency: "EUR", documentLang: "lt", continent: "europe" },
  { code: "LU", name: "Luxemburg",                      flag: "🇱🇺", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "LV", name: "Lettland",                       flag: "🇱🇻", currency: "EUR", documentLang: "lv", continent: "europe" },
  { code: "MC", name: "Monaco",                         flag: "🇲🇨", currency: "EUR", documentLang: "fr", continent: "europe" },
  { code: "MD", name: "Moldau",                         flag: "🇲🇩", currency: "MDL", documentLang: "ro", continent: "europe" },
  { code: "ME", name: "Montenegro",                     flag: "🇲🇪", currency: "EUR", documentLang: "sr", continent: "europe" },
  { code: "MK", name: "Nordmazedonien",                 flag: "🇲🇰", currency: "MKD", documentLang: "mk", continent: "europe" },
  { code: "MT", name: "Malta",                          flag: "🇲🇹", currency: "EUR", documentLang: "en", continent: "europe" },
  { code: "NL", name: "Niederlande",                    flag: "🇳🇱", currency: "EUR", documentLang: "nl", continent: "europe" },
  { code: "NO", name: "Norwegen",                       flag: "🇳🇴", currency: "NOK", documentLang: "no", continent: "europe" },
  { code: "PL", name: "Polen",                          flag: "🇵🇱", currency: "PLN", documentLang: "pl", continent: "europe" },
  { code: "PT", name: "Portugal",                       flag: "🇵🇹", currency: "EUR", documentLang: "pt", continent: "europe" },
  { code: "RO", name: "Rumänien",                       flag: "🇷🇴", currency: "RON", documentLang: "ro", continent: "europe" },
  { code: "RS", name: "Serbien",                        flag: "🇷🇸", currency: "RSD", documentLang: "sr", continent: "europe" },
  { code: "SE", name: "Schweden",                       flag: "🇸🇪", currency: "SEK", documentLang: "sv", continent: "europe" },
  { code: "SI", name: "Slowenien",                      flag: "🇸🇮", currency: "EUR", documentLang: "sl", continent: "europe" },
  { code: "SK", name: "Slowakei",                       flag: "🇸🇰", currency: "EUR", documentLang: "sk", continent: "europe" },
  { code: "SM", name: "San Marino",                     flag: "🇸🇲", currency: "EUR", documentLang: "it", continent: "europe" },
  { code: "TR", name: "Türkei",                         flag: "🇹🇷", currency: "TRY", documentLang: "tr", continent: "europe" },
  { code: "UA", name: "Ukraine",                        flag: "🇺🇦", currency: "UAH", documentLang: "uk", continent: "europe" },
  { code: "XK", name: "Kosovo",                         flag: "🇽🇰", currency: "EUR", documentLang: "sq", continent: "europe" },

  // ── Nord- und Mittelamerika ───────────────────────────
  { code: "BZ", name: "Belize",                         flag: "🇧🇿", currency: "BZD", documentLang: "en", continent: "americas" },
  { code: "CA", name: "Kanada",                         flag: "🇨🇦", currency: "CAD", documentLang: "en", continent: "americas" },
  { code: "CR", name: "Costa Rica",                     flag: "🇨🇷", currency: "CRC", documentLang: "es", continent: "americas" },
  { code: "GT", name: "Guatemala",                      flag: "🇬🇹", currency: "GTQ", documentLang: "es", continent: "americas" },
  { code: "HN", name: "Honduras",                       flag: "🇭🇳", currency: "HNL", documentLang: "es", continent: "americas" },
  { code: "MX", name: "Mexiko",                         flag: "🇲🇽", currency: "MXN", documentLang: "es", continent: "americas" },
  { code: "NI", name: "Nicaragua",                      flag: "🇳🇮", currency: "NIO", documentLang: "es", continent: "americas" },
  { code: "PA", name: "Panama",                         flag: "🇵🇦", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "SV", name: "El Salvador",                    flag: "🇸🇻", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "US", name: "USA",                            flag: "🇺🇸", currency: "USD", documentLang: "en", continent: "americas" },
  // Karibik
  { code: "AG", name: "Antigua und Barbuda",            flag: "🇦🇬", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "BB", name: "Barbados",                       flag: "🇧🇧", currency: "BBD", documentLang: "en", continent: "americas" },
  { code: "BS", name: "Bahamas",                        flag: "🇧🇸", currency: "BSD", documentLang: "en", continent: "americas" },
  { code: "CU", name: "Kuba",                           flag: "🇨🇺", currency: "CUP", documentLang: "es", continent: "americas" },
  { code: "DM", name: "Dominica",                       flag: "🇩🇲", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "DO", name: "Dominikanische Republik",        flag: "🇩🇴", currency: "DOP", documentLang: "es", continent: "americas" },
  { code: "GD", name: "Grenada",                        flag: "🇬🇩", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "HT", name: "Haiti",                          flag: "🇭🇹", currency: "HTG", documentLang: "fr", continent: "americas" },
  { code: "JM", name: "Jamaika",                        flag: "🇯🇲", currency: "JMD", documentLang: "en", continent: "americas" },
  { code: "KN", name: "St. Kitts und Nevis",            flag: "🇰🇳", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "LC", name: "St. Lucia",                      flag: "🇱🇨", currency: "XCD", documentLang: "en", continent: "americas" },
  { code: "TT", name: "Trinidad und Tobago",            flag: "🇹🇹", currency: "TTD", documentLang: "en", continent: "americas" },
  { code: "VC", name: "St. Vincent und die Grenadinen", flag: "🇻🇨", currency: "XCD", documentLang: "en", continent: "americas" },
  // Südamerika
  { code: "AR", name: "Argentinien",                    flag: "🇦🇷", currency: "ARS", documentLang: "es", continent: "americas" },
  { code: "BO", name: "Bolivien",                       flag: "🇧🇴", currency: "BOB", documentLang: "es", continent: "americas" },
  { code: "BR", name: "Brasilien",                      flag: "🇧🇷", currency: "BRL", documentLang: "pt", continent: "americas" },
  { code: "CL", name: "Chile",                          flag: "🇨🇱", currency: "CLP", documentLang: "es", continent: "americas" },
  { code: "CO", name: "Kolumbien",                      flag: "🇨🇴", currency: "COP", documentLang: "es", continent: "americas" },
  { code: "EC", name: "Ecuador",                        flag: "🇪🇨", currency: "USD", documentLang: "es", continent: "americas" },
  { code: "GY", name: "Guyana",                         flag: "🇬🇾", currency: "GYD", documentLang: "en", continent: "americas" },
  { code: "PE", name: "Peru",                           flag: "🇵🇪", currency: "PEN", documentLang: "es", continent: "americas" },
  { code: "PY", name: "Paraguay",                       flag: "🇵🇾", currency: "PYG", documentLang: "es", continent: "americas" },
  { code: "SR", name: "Suriname",                       flag: "🇸🇷", currency: "SRD", documentLang: "nl", continent: "americas" },
  { code: "UY", name: "Uruguay",                        flag: "🇺🇾", currency: "UYU", documentLang: "es", continent: "americas" },
  { code: "VE", name: "Venezuela",                      flag: "🇻🇪", currency: "USD", documentLang: "es", continent: "americas" },

  // ── Naher Osten ───────────────────────────────────────
  { code: "AE", name: "Vereinigte Arabische Emirate",   flag: "🇦🇪", currency: "AED", documentLang: "ar", continent: "asia" },
  { code: "BH", name: "Bahrain",                        flag: "🇧🇭", currency: "BHD", documentLang: "ar", continent: "asia" },
  { code: "IL", name: "Israel",                         flag: "🇮🇱", currency: "ILS", documentLang: "he", continent: "asia" },
  { code: "IQ", name: "Irak",                           flag: "🇮🇶", currency: "USD", documentLang: "ar", continent: "asia" },
  { code: "JO", name: "Jordanien",                      flag: "🇯🇴", currency: "JOD", documentLang: "ar", continent: "asia" },
  { code: "KW", name: "Kuwait",                         flag: "🇰🇼", currency: "KWD", documentLang: "ar", continent: "asia" },
  { code: "LB", name: "Libanon",                        flag: "🇱🇧", currency: "USD", documentLang: "ar", continent: "asia" },
  { code: "OM", name: "Oman",                           flag: "🇴🇲", currency: "OMR", documentLang: "ar", continent: "asia" },
  { code: "PS", name: "Palästina",                      flag: "🇵🇸", currency: "USD", documentLang: "ar", continent: "asia" },
  { code: "QA", name: "Katar",                          flag: "🇶🇦", currency: "QAR", documentLang: "ar", continent: "asia" },
  { code: "SA", name: "Saudi-Arabien",                  flag: "🇸🇦", currency: "SAR", documentLang: "ar", continent: "asia" },
  { code: "YE", name: "Jemen",                          flag: "🇾🇪", currency: "USD", documentLang: "ar", continent: "asia" },
  // Zentralasien
  { code: "KZ", name: "Kasachstan",                     flag: "🇰🇿", currency: "KZT", documentLang: "ru", continent: "asia" },
  { code: "UZ", name: "Usbekistan",                     flag: "🇺🇿", currency: "UZS", documentLang: "uz", continent: "asia" },
  { code: "KG", name: "Kirgisistan",                    flag: "🇰🇬", currency: "USD", documentLang: "ru", continent: "asia" },
  { code: "TJ", name: "Tadschikistan",                  flag: "🇹🇯", currency: "USD", documentLang: "tg", continent: "asia" },
  // Südasien
  { code: "IN", name: "Indien",                         flag: "🇮🇳", currency: "INR", documentLang: "en", continent: "asia" },
  { code: "PK", name: "Pakistan",                       flag: "🇵🇰", currency: "PKR", documentLang: "ur", continent: "asia" },
  { code: "BD", name: "Bangladesch",                    flag: "🇧🇩", currency: "BDT", documentLang: "bn", continent: "asia" },
  { code: "LK", name: "Sri Lanka",                      flag: "🇱🇰", currency: "LKR", documentLang: "si", continent: "asia" },
  { code: "NP", name: "Nepal",                          flag: "🇳🇵", currency: "NPR", documentLang: "ne", continent: "asia" },
  { code: "MV", name: "Malediven",                      flag: "🇲🇻", currency: "MVR", documentLang: "en", continent: "asia" },
  // Südostasien
  { code: "TH", name: "Thailand",                       flag: "🇹🇭", currency: "THB", documentLang: "th", continent: "asia" },
  { code: "VN", name: "Vietnam",                        flag: "🇻🇳", currency: "VND", documentLang: "vi", continent: "asia" },
  { code: "ID", name: "Indonesien",                     flag: "🇮🇩", currency: "USD", documentLang: "id", continent: "asia" },
  { code: "PH", name: "Philippinen",                    flag: "🇵🇭", currency: "PHP", documentLang: "tl", continent: "asia" },
  { code: "MY", name: "Malaysia",                       flag: "🇲🇾", currency: "MYR", documentLang: "ms", continent: "asia" },
  { code: "SG", name: "Singapur",                       flag: "🇸🇬", currency: "SGD", documentLang: "en", continent: "asia" },
  { code: "MM", name: "Myanmar",                        flag: "🇲🇲", currency: "MMK", documentLang: "my", continent: "asia" },
  { code: "KH", name: "Kambodscha",                     flag: "🇰🇭", currency: "KHR", documentLang: "km", continent: "asia" },
  { code: "LA", name: "Laos",                           flag: "🇱🇦", currency: "LAK", documentLang: "lo", continent: "asia" },
  { code: "BN", name: "Brunei",                         flag: "🇧🇳", currency: "SGD", documentLang: "ms", continent: "asia" },
  { code: "TL", name: "Timor-Leste",                    flag: "🇹🇱", currency: "USD", documentLang: "pt", continent: "asia" },
  // Ostasien
  { code: "JP", name: "Japan",                          flag: "🇯🇵", currency: "JPY", documentLang: "ja", continent: "asia" },
  { code: "KR", name: "Südkorea",                       flag: "🇰🇷", currency: "KRW", documentLang: "ko", continent: "asia" },
  { code: "CN", name: "China",                          flag: "🇨🇳", currency: "CNY", documentLang: "zh", continent: "asia" },
  { code: "TW", name: "Taiwan",                         flag: "🇹🇼", currency: "TWD", documentLang: "zh", continent: "asia" },
  { code: "HK", name: "Hongkong",                       flag: "🇭🇰", currency: "HKD", documentLang: "zh", continent: "asia" },
  { code: "MN", name: "Mongolei",                       flag: "🇲🇳", currency: "MNT", documentLang: "mn", continent: "asia" },

  // ── Ozeanien ──────────────────────────────────────────
  { code: "AU", name: "Australien",                     flag: "🇦🇺", currency: "AUD", documentLang: "en", continent: "oceania" },
  { code: "NZ", name: "Neuseeland",                     flag: "🇳🇿", currency: "NZD", documentLang: "en", continent: "oceania" },
  { code: "FJ", name: "Fidschi",                        flag: "🇫🇯", currency: "FJD", documentLang: "en", continent: "oceania" },
  { code: "PG", name: "Papua-Neuguinea",                flag: "🇵🇬", currency: "PGK", documentLang: "en", continent: "oceania" },
  { code: "SB", name: "Salomonen",                      flag: "🇸🇧", currency: "SBD", documentLang: "en", continent: "oceania" },
  { code: "VU", name: "Vanuatu",                        flag: "🇻🇺", currency: "VUV", documentLang: "fr", continent: "oceania" },
  { code: "WS", name: "Samoa",                          flag: "🇼🇸", currency: "WST", documentLang: "en", continent: "oceania" },
  { code: "TO", name: "Tonga",                          flag: "🇹🇴", currency: "TOP", documentLang: "en", continent: "oceania" },
  { code: "FM", name: "Mikronesien",                    flag: "🇫🇲", currency: "USD", documentLang: "en", continent: "oceania" },
  { code: "PW", name: "Palau",                          flag: "🇵🇼", currency: "USD", documentLang: "en", continent: "oceania" },
  { code: "MH", name: "Marshallinseln",                 flag: "🇲🇭", currency: "USD", documentLang: "en", continent: "oceania" },
  { code: "NR", name: "Nauru",                          flag: "🇳🇷", currency: "AUD", documentLang: "en", continent: "oceania" },
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Ermittelt die Stripe-Währung und den Betrag für ein gegebenes Land */
export function getStripeAmount(priceChfRappen: number, currency: string): { currency: string; amount: number } {
  const effectiveCurrency = CURRENCY_FALLBACK[currency] ?? currency;
  const config = CURRENCY_CONFIG[effectiveCurrency];
  if (!config) return { currency: "chf", amount: priceChfRappen };
  const amount = Math.round(priceChfRappen * config.factor);
  return { currency: effectiveCurrency.toLowerCase(), amount };
}

/** Betrag für die Anzeige (berücksichtigt zero- und three-decimal Währungen) */
export function formatAmount(amount: number, currency: string): string {
  const cur = currency.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(cur)) {
    return `${amount.toLocaleString("de-CH")} ${cur}`;
  }
  if (THREE_DECIMAL_CURRENCIES.has(cur)) {
    return `${(amount / 1000).toFixed(3)} ${cur}`;
  }
  return `${(amount / 100).toFixed(2)} ${cur}`;
}

/** Übersetzt einen Sprach-Code in einen lesbaren deutschen Namen */
export const LANG_NAMES: Record<string, string> = {
  de: "Deutsch",      en: "Englisch",     fr: "Französisch",
  it: "Italienisch",  es: "Spanisch",     pt: "Portugiesisch",
  nl: "Niederländisch", pl: "Polnisch",   hu: "Ungarisch",
  cs: "Tschechisch",  sk: "Slowakisch",   ro: "Rumänisch",
  bg: "Bulgarisch",   hr: "Kroatisch",    sl: "Slowenisch",
  sr: "Serbisch",     sq: "Albanisch",    mk: "Mazedonisch",
  el: "Griechisch",   sv: "Schwedisch",   no: "Norwegisch",
  da: "Dänisch",      fi: "Finnisch",     et: "Estnisch",
  lv: "Lettisch",     lt: "Litauisch",    uk: "Ukrainisch",
  be: "Belarussisch", is: "Isländisch",   ca: "Katalanisch",
  bs: "Bosnisch",     tr: "Türkisch",     ar: "Arabisch",
  he: "Hebräisch",    ru: "Russisch",     uz: "Usbekisch",
  tg: "Tadschikisch", hi: "Hindi",        ur: "Urdu",
  bn: "Bengalisch",   si: "Singhalesisch", ne: "Nepalesisch",
  th: "Thailändisch", vi: "Vietnamesisch", id: "Indonesisch",
  tl: "Filipino",     ms: "Malaiisch",    my: "Birmanisch",
  km: "Khmer",        lo: "Laotisch",     ja: "Japanisch",
  ko: "Koreanisch",   zh: "Chinesisch",   mn: "Mongolisch",
};
