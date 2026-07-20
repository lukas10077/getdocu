"use client";

import { useState, useEffect } from "react";
import { useCountry } from "./CountryProvider";
import { COUNTRIES, Country } from "@/lib/countries";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

// ── Moved to module level — avoids React remounting these on every parent render ──

function CountryButton({
  c,
  onSelect,
}: {
  c: Country;
  onSelect: (c: Country) => void;
}) {
  return (
    <button
      onClick={() => onSelect(c)}
      className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-cream-muted transition hover:bg-ink-800 hover:text-cream active:scale-[0.98]"
    >
      <span className="flex-shrink-0 text-lg leading-none">{c.flag}</span>
      <span className="truncate">{c.name}</span>
    </button>
  );
}

function Group({
  label,
  list,
  onSelect,
}: {
  label: string;
  list: Country[];
  onSelect: (c: Country) => void;
}) {
  if (list.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
        {list.map((c) => (
          <CountryButton key={c.code} c={c} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────────

export default function CountrySelector() {
  const { showSelector, setCountry, setShowSelector, country, scrollTarget, setScrollTarget } = useCountry();

  function handleSelect(c: Country) {
    setCountry(c);
    if (scrollTarget) {
      setScrollTarget(null);
      setTimeout(() => {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
  const [search, setSearch] = useState("");
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const code = readCookie("getdocu_detected_country");
    if (code) {
      const found = COUNTRIES.find((c) => c.code === code) ?? null;
      setDetectedCountry(found);
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!showSelector) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowSelector(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showSelector, setShowSelector]);

  if (!showSelector) return null;

  const q = search.toLowerCase();
  const filtered = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
    : COUNTRIES;

  // Pinned = aktuell gewähltes Land oder erkanntes Land
  const pinned = country ?? detectedCountry;
  const filteredWithoutPinned = pinned ? filtered.filter((c) => c.code !== pinned.code) : filtered;

  // Fokus-Länder (mit priority) zuerst, danach bisherige Reihenfolge (nach Bevölkerung)
  const byPriority = (a: Country, b: Country) => (a.priority ?? 999) - (b.priority ?? 999);
  const europe   = filteredWithoutPinned.filter((c) => c.continent === "europe").sort(byPriority);
  const americas = filteredWithoutPinned.filter((c) => c.continent === "americas").sort(byPriority);
  const asia     = filteredWithoutPinned.filter((c) => c.continent === "asia");
  const oceania  = filteredWithoutPinned.filter((c) => c.continent === "oceania");
  const pinnedInFiltered = pinned ? filtered.find((c) => c.code === pinned.code) : null;
  const total    = europe.length + americas.length + asia.length + oceania.length + (pinnedInFiltered ? 1 : 0);

  return (
    // Backdrop — click outside the card to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={() => setShowSelector(false)}
    >
      {/* Card — stop propagation so clicks here don't close */}
      <div
        className="flex w-full max-w-2xl flex-col rounded-sm border border-ink-700 bg-ink-900 shadow-2xl"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
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
            className="mt-4 w-full rounded-sm border border-ink-700 bg-ink-800 px-4 py-2.5 text-[16px] text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold"
          />
        </div>

        {/* Country list */}
        <div className="overflow-y-auto px-6 py-5">
          {/* Gepinntes Land zuoberst */}
          {pinnedInFiltered && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
                {country ? "Ausgewählt" : "Erkannt"}
              </p>
              <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                <button
                  onClick={() => handleSelect(pinnedInFiltered)}
                  className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm font-semibold text-swiss-gold ring-1 ring-swiss-gold/30 bg-ink-800 transition hover:bg-ink-700 active:scale-[0.98]"
                >
                  <span className="flex-shrink-0 text-lg leading-none">{pinnedInFiltered.flag}</span>
                  <span className="truncate">{pinnedInFiltered.name}</span>
                  <svg className="ml-auto flex-shrink-0" width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Group label="Europa"              list={europe}   onSelect={handleSelect} />
          <Group label="Amerika"             list={americas} onSelect={handleSelect} />
          <Group label="Asien & Naher Osten" list={asia}     onSelect={handleSelect} />
          <Group label="Ozeanien"            list={oceania}  onSelect={handleSelect} />

          {total === 0 && (
            <p className="py-10 text-center text-sm text-cream-subtle">
              Kein Land gefunden
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-ink-700 px-6 py-4">
          <p className="text-xs text-cream-subtle">
            Land kann jederzeit über das Flaggen-Symbol in der Navigation geändert werden.
          </p>
          <button
            onClick={() => setShowSelector(false)}
            className="ml-4 flex-shrink-0 text-xs text-cream-subtle transition hover:text-cream"
          >
            Schliessen ✕
          </button>
        </div>
      </div>
    </div>
  );
}
