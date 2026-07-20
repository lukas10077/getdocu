"use client";

import Link from "next/link";
import { useCountry } from "./CountryProvider";
import { localizedCountryName } from "./CountryText";

// Übersetzbare Texte — aus i18n/dictionaries/<locale>.json (Key "chOnlyGuard"); Fallback Deutsch.
export type ChOnlyGuardDict = {
  title: string;
  body: string; // enthält {country}-Platzhalter
  linkLead: string;
  linkText: string;
};

const DEFAULT_T: ChOnlyGuardDict = {
  title: "Nur für die Schweiz verfügbar",
  body: "Dieses Dokument beruht auf schweizerischem Mietrecht (vorzeitiger Ausstieg durch Stellung eines Nachmieters). In {country} gibt es diesen Weg in der Regel nicht.",
  linkLead: "Passend für dein Land ist die",
  linkText: "ausserordentliche Kündigung aus wichtigem Grund",
};

// Zeigt für CH-only Tools bei explizit gewähltem Nicht-CH-Land einen Hinweis
// statt des Formulars und verweist auf das international passende Tool.
export default function ChOnlyGuard({
  enabled,
  locale,
  t = DEFAULT_T,
  children,
}: {
  enabled?: boolean;
  locale: string;
  t?: ChOnlyGuardDict;
  children: React.ReactNode;
}) {
  const { country } = useCountry();

  if (enabled && country && country.code !== "CH") {
    const countryName = localizedCountryName(country.code, locale, country.name);
    return (
      <div className="mt-8 rounded-sm border border-ink-700 bg-ink-900 p-6 text-sm leading-relaxed text-cream-muted">
        <p className="mb-2 font-medium text-cream">{t.title}</p>
        <p>
          {t.body.replace("{country}", countryName)}{" "}
          {t.linkLead}{" "}
          <Link
            href={`/${locale}/tools/ausserordentliche-kuendigung`}
            className="text-swiss-gold underline hover:opacity-80"
          >
            {t.linkText}
          </Link>
          .
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
