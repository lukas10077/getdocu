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
  // ── Europa (nach Bevölkerung) ─────────────────────────
  { code: "TR", name: "Türkei",                         flag: "🇹🇷", currency: "TRY", documentLang: "tr", continent: "europe" }, // ~85M
  { code: "DE", name: "Deutschland",                    flag: "🇩🇪", currency: "EUR", documentLang: "de", continent: "europe" }, // ~84M
  { code: "FR", name: "Frankreich",                     flag: "🇫🇷", currency: "EUR", documentLang: "fr", continent: "europe" }, // ~68M
  { code: "GB", name: "Vereinigtes Königreich",         flag: "🇬🇧", currency: "GBP", documentLang: "en", continent: "europe" }, // ~67M
  { code: "IT", name: "Italien",                        flag: "🇮🇹", currency: "EUR", documentLang: "it", continent: "europe" }, // ~60M
  { code: "ES", name: "Spanien",                        flag: "🇪🇸", currency: "EUR", documentLang: "es", continent: "europe" }, // ~47M
  { code: "UA", name: "Ukraine",                        flag: "🇺🇦", currency: "UAH", documentLang: "uk", continent: "europe" }, // ~44M
  { code: "PL", name: "Polen",                          flag: "🇵🇱", currency: "PLN", documentLang: "pl", continent: "europe" }, // ~38M
  { code: "RO", name: "Rumänien",                       flag: "🇷🇴", currency: "RON", documentLang: "ro", continent: "europe" }, // ~19M
  { code: "NL", name: "Niederlande",                    flag: "🇳🇱", currency: "EUR", documentLang: "nl", continent: "europe" }, // ~17M
  { code: "BE", name: "Belgien",                        flag: "🇧🇪", currency: "EUR", documentLang: "fr", continent: "europe" }, // ~11.6M
  { code: "CZ", name: "Tschechien",                     flag: "🇨🇿", currency: "CZK", documentLang: "cs", continent: "europe" }, // ~10.9M
  { code: "GR", name: "Griechenland",                   flag: "🇬🇷", currency: "EUR", documentLang: "el", continent: "europe" }, // ~10.7M
  { code: "SE", name: "Schweden",                       flag: "🇸🇪", currency: "SEK", documentLang: "sv", continent: "europe" }, // ~10.5M
  { code: "PT", name: "Portugal",                       flag: "🇵🇹", currency: "EUR", documentLang: "pt", continent: "europe" }, // ~10.3M
  { code: "HU", name: "Ungarn",                         flag: "🇭🇺", currency: "HUF", documentLang: "hu", continent: "europe" }, // ~9.7M
  { code: "BY", name: "Belarus",                        flag: "🇧🇾", currency: "BYR", documentLang: "be", continent: "europe" }, // ~9.4M
  { code: "AT", name: "Österreich",                     flag: "🇦🇹", currency: "EUR", documentLang: "de", continent: "europe" }, // ~9.1M
  { code: "CH", name: "Schweiz",                        flag: "🇨🇭", currency: "CHF", documentLang: "de", continent: "europe" }, // ~8.7M
  { code: "RS", name: "Serbien",                        flag: "🇷🇸", currency: "RSD", documentLang: "sr", continent: "europe" }, // ~6.8M
  { code: "BG", name: "Bulgarien",                      flag: "🇧🇬", currency: "BGN", documentLang: "bg", continent: "europe" }, // ~6.4M
  { code: "DK", name: "Dänemark",                       flag: "🇩🇰", currency: "DKK", documentLang: "da", continent: "europe" }, // ~5.9M
  { code: "FI", name: "Finnland",                       flag: "🇫🇮", currency: "EUR", documentLang: "fi", continent: "europe" }, // ~5.6M
  { code: "NO", name: "Norwegen",                       flag: "🇳🇴", currency: "NOK", documentLang: "no", continent: "europe" }, // ~5.5M
  { code: "SK", name: "Slowakei",                       flag: "🇸🇰", currency: "EUR", documentLang: "sk", continent: "europe" }, // ~5.4M
  { code: "IE", name: "Irland",                         flag: "🇮🇪", currency: "EUR", documentLang: "en", continent: "europe" }, // ~5.1M
  { code: "HR", name: "Kroatien",                       flag: "🇭🇷", currency: "EUR", documentLang: "hr", continent: "europe" }, // ~3.9M
  { code: "BA", name: "Bosnien-Herzegowina",            flag: "🇧🇦", currency: "BAM", documentLang: "bs", continent: "europe" }, // ~3.2M
  { code: "LT", name: "Litauen",                        flag: "🇱🇹", currency: "EUR", documentLang: "lt", continent: "europe" }, // ~2.8M
  { code: "AL", name: "Albanien",                       flag: "🇦🇱", currency: "ALL", documentLang: "sq", continent: "europe" }, // ~2.7M
  { code: "MD", name: "Moldau",                         flag: "🇲🇩", currency: "MDL", documentLang: "ro", continent: "europe" }, // ~2.6M
  { code: "SI", name: "Slowenien",                      flag: "🇸🇮", currency: "EUR", documentLang: "sl", continent: "europe" }, // ~2.1M
  { code: "XK", name: "Kosovo",                         flag: "🇽🇰", currency: "EUR", documentLang: "sq", continent: "europe" }, // ~1.8M
  { code: "MK", name: "Nordmazedonien",                 flag: "🇲🇰", currency: "MKD", documentLang: "mk", continent: "europe" }, // ~1.8M
  { code: "LV", name: "Lettland",                       flag: "🇱🇻", currency: "EUR", documentLang: "lv", continent: "europe" }, // ~1.8M
  { code: "EE", name: "Estland",                        flag: "🇪🇪", currency: "EUR", documentLang: "et", continent: "europe" }, // ~1.3M
  { code: "CY", name: "Zypern",                         flag: "🇨🇾", currency: "EUR", documentLang: "el", continent: "europe" }, // ~1.2M
  { code: "ME", name: "Montenegro",                     flag: "🇲🇪", currency: "EUR", documentLang: "sr", continent: "europe" }, // ~0.6M
  { code: "LU", name: "Luxemburg",                      flag: "🇱🇺", currency: "EUR", documentLang: "fr", continent: "europe" }, // ~0.66M
  { code: "MT", name: "Malta",                          flag: "🇲🇹", currency: "EUR", documentLang: "en", continent: "europe" }, // ~0.5M
  { code: "IS", name: "Island",                         flag: "🇮🇸", currency: "ISK", documentLang: "is", continent: "europe" }, // ~0.37M
  { code: "AD", name: "Andorra",                        flag: "🇦🇩", currency: "EUR", documentLang: "ca", continent: "europe" }, // ~0.08M
  { code: "MC", name: "Monaco",                         flag: "🇲🇨", currency: "EUR", documentLang: "fr", continent: "europe" }, // ~0.04M
  { code: "LI", name: "Liechtenstein",                  flag: "🇱🇮", currency: "CHF", documentLang: "de", continent: "europe" }, // ~0.038M
  { code: "SM", name: "San Marino",                     flag: "🇸🇲", currency: "EUR", documentLang: "it", continent: "europe" }, // ~0.034M

  // ── Amerika (nach Bevölkerung) ────────────────────────
  { code: "US", name: "USA",                            flag: "🇺🇸", currency: "USD", documentLang: "en", continent: "americas" }, // ~335M
  { code: "BR", name: "Brasilien",                      flag: "🇧🇷", currency: "BRL", documentLang: "pt", continent: "americas" }, // ~215M
  { code: "MX", name: "Mexiko",                         flag: "🇲🇽", currency: "MXN", documentLang: "es", continent: "americas" }, // ~128M
  { code: "CO", name: "Kolumbien",                      flag: "🇨🇴", currency: "COP", documentLang: "es", continent: "americas" }, // ~52M
  { code: "AR", name: "Argentinien",                    flag: "🇦🇷", currency: "ARS", documentLang: "es", continent: "americas" }, // ~46M
  { code: "CA", name: "Kanada",                         flag: "🇨🇦", currency: "CAD", documentLang: "en", continent: "americas" }, // ~38M
  { code: "PE", name: "Peru",                           flag: "🇵🇪", currency: "PEN", documentLang: "es", continent: "americas" }, // ~33M
  { code: "VE", name: "Venezuela",                      flag: "🇻🇪", currency: "USD", documentLang: "es", continent: "americas" }, // ~28M
  { code: "CL", name: "Chile",                          flag: "🇨🇱", currency: "CLP", documentLang: "es", continent: "americas" }, // ~19M
  { code: "EC", name: "Ecuador",                        flag: "🇪🇨", currency: "USD", documentLang: "es", continent: "americas" }, // ~18M
  { code: "GT", name: "Guatemala",                      flag: "🇬🇹", currency: "GTQ", documentLang: "es", continent: "americas" }, // ~17M
  { code: "BO", name: "Bolivien",                       flag: "🇧🇴", currency: "BOB", documentLang: "es", continent: "americas" }, // ~12M
  { code: "HT", name: "Haiti",                          flag: "🇭🇹", currency: "HTG", documentLang: "fr", continent: "americas" }, // ~11M
  { code: "CU", name: "Kuba",                           flag: "🇨🇺", currency: "CUP", documentLang: "es", continent: "americas" }, // ~11M
  { code: "DO", name: "Dominikanische Republik",        flag: "🇩🇴", currency: "DOP", documentLang: "es", continent: "americas" }, // ~11M
  { code: "HN", name: "Honduras",                       flag: "🇭🇳", currency: "HNL", documentLang: "es", continent: "americas" }, // ~10M
  { code: "PY", name: "Paraguay",                       flag: "🇵🇾", currency: "PYG", documentLang: "es", continent: "americas" }, // ~7M
  { code: "NI", name: "Nicaragua",                      flag: "🇳🇮", currency: "NIO", documentLang: "es", continent: "americas" }, // ~6.8M
  { code: "SV", name: "El Salvador",                    flag: "🇸🇻", currency: "USD", documentLang: "es", continent: "americas" }, // ~6.5M
  { code: "CR", name: "Costa Rica",                     flag: "🇨🇷", currency: "CRC", documentLang: "es", continent: "americas" }, // ~5.2M
  { code: "PA", name: "Panama",                         flag: "🇵🇦", currency: "USD", documentLang: "es", continent: "americas" }, // ~4.4M
  { code: "UY", name: "Uruguay",                        flag: "🇺🇾", currency: "UYU", documentLang: "es", continent: "americas" }, // ~3.5M
  { code: "JM", name: "Jamaika",                        flag: "🇯🇲", currency: "JMD", documentLang: "en", continent: "americas" }, // ~2.9M
  { code: "TT", name: "Trinidad und Tobago",            flag: "🇹🇹", currency: "TTD", documentLang: "en", continent: "americas" }, // ~1.5M
  { code: "GY", name: "Guyana",                         flag: "🇬🇾", currency: "GYD", documentLang: "en", continent: "americas" }, // ~0.8M
  { code: "SR", name: "Suriname",                       flag: "🇸🇷", currency: "SRD", documentLang: "nl", continent: "americas" }, // ~0.6M
  { code: "BS", name: "Bahamas",                        flag: "🇧🇸", currency: "BSD", documentLang: "en", continent: "americas" }, // ~0.4M
  { code: "BZ", name: "Belize",                         flag: "🇧🇿", currency: "BZD", documentLang: "en", continent: "americas" }, // ~0.4M
  { code: "BB", name: "Barbados",                       flag: "🇧🇧", currency: "BBD", documentLang: "en", continent: "americas" }, // ~0.28M
  { code: "LC", name: "St. Lucia",                      flag: "🇱🇨", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.18M
  { code: "VC", name: "St. Vincent und die Grenadinen", flag: "🇻🇨", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.11M
  { code: "GD", name: "Grenada",                        flag: "🇬🇩", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.11M
  { code: "AG", name: "Antigua und Barbuda",            flag: "🇦🇬", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.1M
  { code: "DM", name: "Dominica",                       flag: "🇩🇲", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.07M
  { code: "KN", name: "St. Kitts und Nevis",            flag: "🇰🇳", currency: "XCD", documentLang: "en", continent: "americas" }, // ~0.05M

  // ── Asien & Naher Osten (nach Bevölkerung) ────────────
  { code: "IN", name: "Indien",                         flag: "🇮🇳", currency: "INR", documentLang: "en", continent: "asia" }, // ~1.43B
  { code: "CN", name: "China",                          flag: "🇨🇳", currency: "CNY", documentLang: "zh", continent: "asia" }, // ~1.4B
  { code: "ID", name: "Indonesien",                     flag: "🇮🇩", currency: "USD", documentLang: "id", continent: "asia" }, // ~277M
  { code: "PK", name: "Pakistan",                       flag: "🇵🇰", currency: "PKR", documentLang: "ur", continent: "asia" }, // ~230M
  { code: "BD", name: "Bangladesch",                    flag: "🇧🇩", currency: "BDT", documentLang: "bn", continent: "asia" }, // ~170M
  { code: "JP", name: "Japan",                          flag: "🇯🇵", currency: "JPY", documentLang: "ja", continent: "asia" }, // ~124M
  { code: "PH", name: "Philippinen",                    flag: "🇵🇭", currency: "PHP", documentLang: "tl", continent: "asia" }, // ~115M
  { code: "VN", name: "Vietnam",                        flag: "🇻🇳", currency: "VND", documentLang: "vi", continent: "asia" }, // ~98M
  { code: "TH", name: "Thailand",                       flag: "🇹🇭", currency: "THB", documentLang: "th", continent: "asia" }, // ~72M
  { code: "MM", name: "Myanmar",                        flag: "🇲🇲", currency: "MMK", documentLang: "my", continent: "asia" }, // ~55M
  { code: "KR", name: "Südkorea",                       flag: "🇰🇷", currency: "KRW", documentLang: "ko", continent: "asia" }, // ~52M
  { code: "IQ", name: "Irak",                           flag: "🇮🇶", currency: "USD", documentLang: "ar", continent: "asia" }, // ~43M
  { code: "UZ", name: "Usbekistan",                     flag: "🇺🇿", currency: "UZS", documentLang: "uz", continent: "asia" }, // ~36M
  { code: "SA", name: "Saudi-Arabien",                  flag: "🇸🇦", currency: "SAR", documentLang: "ar", continent: "asia" }, // ~35M
  { code: "YE", name: "Jemen",                          flag: "🇾🇪", currency: "USD", documentLang: "ar", continent: "asia" }, // ~34M
  { code: "MY", name: "Malaysia",                       flag: "🇲🇾", currency: "MYR", documentLang: "ms", continent: "asia" }, // ~33M
  { code: "NP", name: "Nepal",                          flag: "🇳🇵", currency: "NPR", documentLang: "ne", continent: "asia" }, // ~30M
  { code: "TW", name: "Taiwan",                         flag: "🇹🇼", currency: "TWD", documentLang: "zh", continent: "asia" }, // ~23M
  { code: "LK", name: "Sri Lanka",                      flag: "🇱🇰", currency: "LKR", documentLang: "si", continent: "asia" }, // ~22M
  { code: "KZ", name: "Kasachstan",                     flag: "🇰🇿", currency: "KZT", documentLang: "ru", continent: "asia" }, // ~19M
  { code: "KH", name: "Kambodscha",                     flag: "🇰🇭", currency: "KHR", documentLang: "km", continent: "asia" }, // ~17M
  { code: "AE", name: "Vereinigte Arabische Emirate",   flag: "🇦🇪", currency: "AED", documentLang: "ar", continent: "asia" }, // ~10M
  { code: "JO", name: "Jordanien",                      flag: "🇯🇴", currency: "JOD", documentLang: "ar", continent: "asia" }, // ~10M
  { code: "TJ", name: "Tadschikistan",                  flag: "🇹🇯", currency: "USD", documentLang: "tg", continent: "asia" }, // ~9.8M
  { code: "IL", name: "Israel",                         flag: "🇮🇱", currency: "ILS", documentLang: "he", continent: "asia" }, // ~9.8M
  { code: "HK", name: "Hongkong",                       flag: "🇭🇰", currency: "HKD", documentLang: "zh", continent: "asia" }, // ~7.5M
  { code: "LA", name: "Laos",                           flag: "🇱🇦", currency: "LAK", documentLang: "lo", continent: "asia" }, // ~7.4M
  { code: "KG", name: "Kirgisistan",                    flag: "🇰🇬", currency: "USD", documentLang: "ru", continent: "asia" }, // ~6.8M
  { code: "PS", name: "Palästina",                      flag: "🇵🇸", currency: "USD", documentLang: "ar", continent: "asia" }, // ~5.4M
  { code: "LB", name: "Libanon",                        flag: "🇱🇧", currency: "USD", documentLang: "ar", continent: "asia" }, // ~5.3M
  { code: "SG", name: "Singapur",                       flag: "🇸🇬", currency: "SGD", documentLang: "en", continent: "asia" }, // ~6M
  { code: "OM", name: "Oman",                           flag: "🇴🇲", currency: "OMR", documentLang: "ar", continent: "asia" }, // ~4.8M
  { code: "KW", name: "Kuwait",                         flag: "🇰🇼", currency: "KWD", documentLang: "ar", continent: "asia" }, // ~4.3M
  { code: "MN", name: "Mongolei",                       flag: "🇲🇳", currency: "MNT", documentLang: "mn", continent: "asia" }, // ~3.4M
  { code: "QA", name: "Katar",                          flag: "🇶🇦", currency: "QAR", documentLang: "ar", continent: "asia" }, // ~2.7M
  { code: "BH", name: "Bahrain",                        flag: "🇧🇭", currency: "BHD", documentLang: "ar", continent: "asia" }, // ~1.7M
  { code: "TL", name: "Timor-Leste",                    flag: "🇹🇱", currency: "USD", documentLang: "pt", continent: "asia" }, // ~1.4M
  { code: "MV", name: "Malediven",                      flag: "🇲🇻", currency: "MVR", documentLang: "en", continent: "asia" }, // ~0.52M
  { code: "BN", name: "Brunei",                         flag: "🇧🇳", currency: "SGD", documentLang: "ms", continent: "asia" }, // ~0.45M

  // ── Ozeanien (nach Bevölkerung) ───────────────────────
  { code: "AU", name: "Australien",                     flag: "🇦🇺", currency: "AUD", documentLang: "en", continent: "oceania" }, // ~26M
  { code: "PG", name: "Papua-Neuguinea",                flag: "🇵🇬", currency: "PGK", documentLang: "en", continent: "oceania" }, // ~10M
  { code: "NZ", name: "Neuseeland",                     flag: "🇳🇿", currency: "NZD", documentLang: "en", continent: "oceania" }, // ~5M
  { code: "FJ", name: "Fidschi",                        flag: "🇫🇯", currency: "FJD", documentLang: "en", continent: "oceania" }, // ~0.9M
  { code: "SB", name: "Salomonen",                      flag: "🇸🇧", currency: "SBD", documentLang: "en", continent: "oceania" }, // ~0.7M
  { code: "VU", name: "Vanuatu",                        flag: "🇻🇺", currency: "VUV", documentLang: "fr", continent: "oceania" }, // ~0.32M
  { code: "WS", name: "Samoa",                          flag: "🇼🇸", currency: "WST", documentLang: "en", continent: "oceania" }, // ~0.22M
  { code: "FM", name: "Mikronesien",                    flag: "🇫🇲", currency: "USD", documentLang: "en", continent: "oceania" }, // ~0.11M
  { code: "TO", name: "Tonga",                          flag: "🇹🇴", currency: "TOP", documentLang: "en", continent: "oceania" }, // ~0.1M
  { code: "MH", name: "Marshallinseln",                 flag: "🇲🇭", currency: "USD", documentLang: "en", continent: "oceania" }, // ~0.04M
  { code: "PW", name: "Palau",                          flag: "🇵🇼", currency: "USD", documentLang: "en", continent: "oceania" }, // ~0.018M
  { code: "NR", name: "Nauru",                          flag: "🇳🇷", currency: "AUD", documentLang: "en", continent: "oceania" }, // ~0.01M
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
