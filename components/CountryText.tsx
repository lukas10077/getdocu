"use client";

/**
 * Ersetzt Platzhalter in einem Text dynamisch basierend auf dem gewählten Land:
 *   {countryName}  → z.B. "Deutschland"
 *   {priceRange}   → z.B. "3 €–5 €"
 */

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

const MIN_RAPPEN = 300; // günstigstes Tool
const MAX_RAPPEN = 500; // teuerstes Tool

export default function CountryText({ text, className, fallbackCountryName }: { text: string; className?: string; fallbackCountryName?: string }) {
  const { country } = useCountry();

  const countryName = country?.name ?? fallbackCountryName ?? "deinem Land";

  const minResult = country ? getStripeAmount(MIN_RAPPEN, country.currency) : null;
  const maxResult = country ? getStripeAmount(MAX_RAPPEN, country.currency) : null;
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
