"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

// Günstigstes Tool: 300 CHF Rappen
const MIN_RAPPEN = 300;

export default function HeroMinPrice({ label }: { label?: string }) {
  const { country } = useCountry();

  const { currency, amount } = country
    ? getStripeAmount(MIN_RAPPEN, country.currency)
    : { currency: "chf", amount: MIN_RAPPEN };

  const template = label ?? "✓ ab {price}";
  return <span>{template.replace("{price}", formatAmount(amount, currency))}</span>;
}
