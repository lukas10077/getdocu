"use client";

import { useCountry } from "./CountryProvider";

interface Props {
  /** Satz mit {land}-Platzhalter, z.B. "Wähle dein {land}, für welches wir dein Dokument erstellen können." */
  text?: string;
  /** Das klickbare Wort, z.B. "Land" */
  landWord?: string;
  /** Zweite Zeile, z.B. "Wir helfen dir deine Chance zu erhöhen!" */
  tagline?: string;
}

export default function HeroCountryPicker({ text, landWord, tagline }: Props) {
  const { setShowSelector, setScrollTarget } = useCountry();

  const template = text ?? "Wähle dein {land}, für welches wir dein Dokument erstellen können.";
  const word = landWord ?? "Land";
  const [before, after] = template.split("{land}");

  return (
    <div className="mt-6 max-w-md text-base leading-relaxed text-cream-muted md:text-lg">
      <p>
        {before}
        <button
          onClick={() => { setScrollTarget("tools"); setShowSelector(true); }}
          className="inline-flex items-center gap-1 border-b border-swiss-gold text-swiss-gold pb-0.5 hover:opacity-75 transition-opacity"
        >
          <span>{word}</span>
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
        {after}
      </p>
      <p className="mt-3">{tagline ?? "Wir helfen dir deine Chance zu erhöhen!"}</p>
    </div>
  );
}
