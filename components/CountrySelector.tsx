"use client";

import { useState } from "react";
import { useCountry } from "./CountryProvider";
import { COUNTRIES, Country } from "@/lib/countries";

export default function CountrySelector() {
  const { showSelector, setCountry } = useCountry();
  const [search, setSearch] = useState("");

  if (!showSelector) return null;

  const q = search.toLowerCase();
  const filtered = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
    : COUNTRIES;

  const europe  = filtered.filter((c) => c.continent === "europe");
  const americas = filtered.filter((c) => c.continent === "americas");

  function CountryButton({ c }: { c: Country }) {
    return (
      <button
        key={c.code}
        onClick={() => setCountry(c)}
        className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-cream-muted transition hover:bg-ink-800 hover:text-cream active:scale-[0.98]"
      >
        <span className="flex-shrink-0 text-lg leading-none">{c.flag}</span>
        <span className="truncate">{c.name}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-2xl flex-col rounded-sm border border-ink-700 bg-ink-900 shadow-2xl"
           style={{ maxHeight: "calc(100vh - 2rem)" }}>

        {/* Header */}
        <div className="border-b border-ink-700 px-6 py-5">
          <h2 className="font-serif text-2xl font-medium text-cream">
            Für welches Land?
          </h2>
          <p className="mt-1 text-sm text-cream-muted">
            Das Dokument wird an die Konventionen deines Landes angepasst.
          </p>
          <input
            autoFocus
            type="text"
            placeholder="Land suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full rounded-sm border border-ink-700 bg-ink-800 px-4 py-2.5 text-sm text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold"
          />
        </div>

        {/* Länderliste */}
        <div className="overflow-y-auto px-6 py-5">
          {europe.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
                Europa
              </p>
              <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                {europe.map((c) => <CountryButton key={c.code} c={c} />)}
              </div>
            </div>
          )}

          {americas.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
                Amerika
              </p>
              <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                {americas.map((c) => <CountryButton key={c.code} c={c} />)}
              </div>
            </div>
          )}

          {europe.length === 0 && americas.length === 0 && (
            <p className="py-10 text-center text-sm text-cream-subtle">
              Kein Land gefunden
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ink-700 px-6 py-4">
          <p className="text-xs text-cream-subtle">
            Land kann jederzeit über das Flaggen-Symbol in der Navigation geändert werden.
          </p>
        </div>
      </div>
    </div>
  );
}
