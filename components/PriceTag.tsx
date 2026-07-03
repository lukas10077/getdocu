"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, ZERO_DECIMAL_CURRENCIES } from "@/lib/countries";

export default function PriceTag({ priceChfRappen }: { priceChfRappen: number }) {
  const { country } = useCountry();

  const { currency, amount } = country
    ? getStripeAmount(priceChfRappen, country.currency)
    : { currency: "chf", amount: priceChfRappen };

  const display = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase())
    ? `${amount} ${currency.toUpperCase()}`
    : `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;

  return <>{display}</>;
}
