"use client";

/**
 * Ersetzt Platzhalter in einem Text dynamisch basierend auf dem gewählten Land:
 *   {countryName}  → z.B. "Deutschland"
 *   {priceRange}   → z.B. "3 €–5 €"
 */

import { useParams } from "next/navigation";
import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

const MIN_RAPPEN = 300; // günstigstes Tool
const MAX_RAPPEN = 500; // teuerstes Tool

// Ländername in der UI-Sprache (statt des deutschen Namens aus countries.ts).
// Fallback: deutscher Name, falls Intl.DisplayNames nicht verfügbar ist.
function localizedCountryName(code: string, locale: string, germanName: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? germanName;
  } catch {
    return germanName;
  }
}

export default function CountryText({ text, className, fallbackCountryName }: { text: string; className?: string; fallbackCountryName?: string }) {
  const { country } = useCountry();
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "de";

  const countryName = country
    ? localizedCountryName(country.code, locale, country.name)
    : fallbackCountryName ?? "deinem Land";

  const minResult = country ? getStripeAmount(MIN_RAPPEN, country.currency, country.priceFactor ?? 1) : null;
  const maxResult = country ? getStripeAmount(MAX_RAPPEN, country.currency, country.priceFactor ?? 1) : null;
  const cur = minResult?.currency ?? "chf";
  const minAmt = minResult?.amount ?? MIN_RAPPEN;
  const maxAmt = maxResult?.amount ?? MAX_RAPPEN;

  const minFmt = formatAmount(minAmt, cur);
  const maxFmt = formatAmount(maxAmt, cur);
  const priceRange = minFmt === maxFmt ? minFmt : `${minFmt}–${maxFmt}`;

  const result = text
    .replace(/\{countryName\}/g, countryName)
    .replace(/\{priceRange\}/g, priceRange);

  if (className) return <span className={className}>{result}</span>;
  return <>{result}</>;
}
