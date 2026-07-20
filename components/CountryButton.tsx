"use client";

import { useCountry } from "./CountryProvider";

export default function CountryButton({ title = "Land ändern" }: { title?: string }) {
  const { country, setShowSelector } = useCountry();

  return (
    <button
      onClick={() => setShowSelector(true)}
      title={title}
      aria-label={title}
      className="flex items-center gap-1 text-cream-muted transition hover:text-cream"
    >
      <span className="text-xl leading-none">{country?.flag ?? "🌍"}</span>
    </button>
  );
}
