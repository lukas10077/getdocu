"use client";

import { useCountry } from "./CountryProvider";

export default function HeroCountryPicker() {
  const { country, setShowSelector } = useCountry();

  return (
    <p className="mt-6 max-w-md text-base leading-relaxed text-cream-muted md:text-lg">
      Wähle dein{" "}
      <button
        onClick={() => setShowSelector(true)}
        className="inline-flex items-center gap-1 border-b border-swiss-gold text-swiss-gold pb-0.5 hover:opacity-75 transition-opacity"
      >
        <span>Land</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      , für welches wir dein Dokument erstellen können.{" "}
      Wir helfen dir deine Chance zu erhöhen!
    </p>
  );
}
