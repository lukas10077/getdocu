"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

export default function PriceTag({ priceChfRappen }: { priceChfRappen: number }) {
  const { country } = useCountry();

  const { currency, amount } = country
    ? getStripeAmount(priceChfRappen, country.currency, country.priceFactor ?? 1)
    : { currency: "chf", amount: priceChfRappen };

  return <>{formatAmount(amount, currency)}</>;
}
