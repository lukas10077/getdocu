"use client";

import { useCountry } from "./CountryProvider";

// Zahlungsmethoden-Logos, abhängig vom gewählten Land.
// TWINT ist ein Schweizer Zahlungsmittel und wird nur für die Schweiz
// und Liechtenstein angezeigt — für alle anderen Länder wirkt es fremd.
export default function PaymentMethodsRow() {
  const { country } = useCountry();
  const showTwint = country?.code === "CH" || country?.code === "LI";
  const paymentMethods = [
    ...(showTwint ? ["TWINT"] : []),
    "Visa",
    "Mastercard",
    "Apple Pay",
    "Google Pay",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {paymentMethods.map((method) => (
        <span
          key={method}
          className="rounded-sm border border-ink-700 bg-ink-900 px-4 py-2 text-xs font-medium text-cream-muted"
        >
          {method}
        </span>
      ))}
    </div>
  );
}
