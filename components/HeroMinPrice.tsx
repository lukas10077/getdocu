"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

// Günstigstes Tool: 300 CHF Rappen
const MIN_RAPPEN = 300;

export default function HeroMinPrice() {
  const { country } = useCountry();

  const { currency, amount } = country
    ? getStripeAmount(MIN_RAPPEN, country.currency)
    : { currency: "chf", amount: MIN_RAPPEN };

  return <span>✓ ab {formatAmount(amount, currency)}</span>;
}
