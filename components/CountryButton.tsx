"use client";

import { useCountry } from "./CountryProvider";

export default function CountryButton({ title = "Land ändern" }: { title?: string }) {
  const { country, setShowSelector } = useCountry();

  return (
    <button
      onClick={() => setShowSelector(true)}
      title={title}
      aria-label={title}
      className="flex items-center gap-1 rounded-l-full px-3 py-2 text-cream-muted transition hover:bg-ink-800 hover:text-cream"
    >
      <span className="text-xl leading-none">{country?.flag ?? "🌍"}</span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-0.5 text-cream-subtle">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
