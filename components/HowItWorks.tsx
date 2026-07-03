"use client";

import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

// Günstigstes Tool: 300 CHF Rappen, teuerstes: 500
const MIN_RAPPEN = 300;
const MAX_RAPPEN = 500;

export default function HowItWorks({ dict }: { dict: any }) {
  const { country } = useCountry();

  // Preisspanne in Landeswährung berechnen
  const minResult = country ? getStripeAmount(MIN_RAPPEN, country.currency) : null;
  const maxResult = country ? getStripeAmount(MAX_RAPPEN, country.currency) : null;
  const minCur = minResult?.currency ?? "chf";
  const minAmt = minResult?.amount ?? MIN_RAPPEN;
  const maxAmt = maxResult?.amount ?? MAX_RAPPEN;

  const minFmt = formatAmount(minAmt, minCur);
  const maxFmt = formatAmount(maxAmt, minCur);

  // Wenn Min und Max identisch formatiert sind → nur einen Wert zeigen
  const priceRange = minFmt === maxFmt ? minFmt : `${minFmt}–${maxFmt}`;

  function interpolate(text: string) {
    return text.replace("{priceRange}", priceRange);
  }

  const steps = [
    dict.howItWorks.step1,
    dict.howItWorks.step2,
    dict.howItWorks.step3,
    dict.howItWorks.step4,
  ];

  return (
    <section id="how-it-works" className="bg-ink-900 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <h2 className="font-serif text-4xl font-medium text-cream md:text-5xl">{dict.howItWorks.title}</h2>
        <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
        <p className="mt-4 max-w-xl text-base text-cream-muted">{dict.howItWorks.subtitle}</p>
        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {steps.map((step: any, i: number) => (
            <div key={step.title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-swiss-gold/40 text-sm font-medium text-swiss-gold">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 font-serif text-xl font-medium text-cream">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-muted">
                {interpolate(step.description)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
