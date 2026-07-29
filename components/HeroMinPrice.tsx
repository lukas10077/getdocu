"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

// Günstigstes Tool: 250 CHF Rappen (Preistest −50 %, Juli 2026)
const MIN_RAPPEN = 250;

export default function HeroMinPrice({ label }: { label?: string }) {
  const { country } = useCountry();

  const { currency, amount } = country
    ? getStripeAmount(MIN_RAPPEN, country.currency, country.priceFactor ?? 1)
    : { currency: "chf", amount: MIN_RAPPEN };

  const template = label ?? "✓ ab {price}";
  return <span>{template.replace("{price}", formatAmount(amount, currency))}</span>;
}
