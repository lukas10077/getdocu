"use client";

import { useCountry } from "./CountryProvider";

export default function ToolsCountryBadge() {
  const { country, setShowSelector } = useCountry();
  if (!country) return null;

  return (
    <button
      onClick={() => setShowSelector(true)}
      className="flex items-center gap-3 rounded-sm border border-ink-700 bg-ink-900 px-6 py-4 text-base text-cream-muted transition hover:border-swiss-gold/50 hover:text-cream"
    >
      <span className="text-2xl leading-none">{country.flag}</span>
      <span>
        Dokumente nach{" "}
        <span className="text-cream">{country.name}-Standards</span>
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-0.5 opacity-50"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
