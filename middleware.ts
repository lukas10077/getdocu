import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale, Locale } from "./i18n/config";

// Mapping: IP-Land → beste Sprache
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Deutsch
  CH: "de", DE: "de", AT: "de", LI: "de",
  // Französisch
  FR: "fr", MC: "fr", LU: "fr",
  // Italienisch
  IT: "it", SM: "it",
  // Spanisch
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  PE: "es", VE: "es", EC: "es", BO: "es", PY: "es",
  UY: "es", GT: "es", HN: "es", SV: "es", NI: "es",
  CR: "es", PA: "es", DO: "es", CU: "es",
  // Portugiesisch
  PT: "pt", BR: "pt",
  // Polnisch
  PL: "pl",
  // Ungarisch
  HU: "hu",
  // Türkisch
  TR: "tr",
  // Russisch
  RU: "ru", BY: "ru", KZ: "ru",
  // Ukrainisch
  UA: "uk",
  // Albanisch
  AL: "sq", XK: "sq",
  // Serbisch/Kroatisch/Bosnisch
  RS: "sr", HR: "sr", BA: "sr", ME: "sr",
  // Arabisch
  SA: "ar", AE: "ar", EG: "ar", MA: "ar", TN: "ar",
  DZ: "ar", LB: "ar", JO: "ar", IQ: "ar", SY: "ar",
  // Tamil
  LK: "ta",
  // Englisch (default für alle anderen)
};

function getPreferredLocale(request: NextRequest): Locale {
  // 1. IP-Land prüfen
  const ipCountry = request.headers.get("x-vercel-ip-country");
  if (ipCountry && COUNTRY_TO_LOCALE[ipCountry]) {
    return COUNTRY_TO_LOCALE[ipCountry];
  }

  // 2. Accept-Language Header als Fallback
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0].trim().split("-")[0].toLowerCase());
    for (const candidate of browserLocales) {
      const match = locales.find((l) => l === candidate);
      if (match) return match;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // IP-Land als Cookie setzen (für OnboardingCard, Client-seitig lesbar)
  const ipCountry = request.headers.get("x-vercel-ip-country");

  if (pathnameHasLocale) {
    // Bereits eine Locale im Pfad — nur IP-Land-Cookie setzen falls noch nicht vorhanden
    if (ipCountry && !request.cookies.get("getdocu_detected_country")) {
      const res = NextResponse.next();
      res.cookies.set("getdocu_detected_country", ipCountry, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
      return res;
    }
    return;
  }

  // Keine Locale im Pfad → zur erkannten Sprache weiterleiten
  const locale = getPreferredLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;
  const res = NextResponse.redirect(newUrl);

  // IP-Land-Cookie setzen
  if (ipCountry && !request.cookies.get("getdocu_detected_country")) {
    res.cookies.set("getdocu_detected_country", ipCountry, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)).*)",
  ],
};
