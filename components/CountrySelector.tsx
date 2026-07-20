"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCountry } from "./CountryProvider";
import { COUNTRIES, Country } from "@/lib/countries";
import { localizedCountryName } from "./CountryText";

// Übersetzbare Texte des Selectors — Werte kommen aus i18n/dictionaries/<locale>.json
// (Key "countrySelector"); Fallback ist Deutsch.
export type CountrySelectorDict = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  selected: string;
  detected: string;
  showAll: string;
  notFound: string;
  footerHint: string;
  close: string;
  europe: string;
  americas: string;
  asia: string;
  oceania: string;
};

const DEFAULT_T: CountrySelectorDict = {
  title: "Für welches Land?",
  subtitle: "Das Dokument wird an die Konventionen deines Landes angepasst.",
  searchPlaceholder: "Land suchen…",
  selected: "Ausgewählt",
  detected: "Erkannt",
  showAll: "Alle Länder anzeigen ({count} weitere)",
  notFound: "Kein Land gefunden",
  footerHint: "Land kann jederzeit über das Flaggen-Symbol in der Navigation geändert werden.",
  close: "Schliessen",
  europe: "Europa",
  americas: "Amerika",
  asia: "Asien & Naher Osten",
  oceania: "Ozeanien",
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

// ── Moved to module level — avoids React remounting these on every parent render ──

function CountryButton({
  c,
  label,
  onSelect,
}: {
  c: Country;
  label: string;
  onSelect: (c: Country) => void;
}) {
  return (
    <button
      onClick={() => onSelect(c)}
      className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-cream-muted transition hover:bg-ink-800 hover:text-cream active:scale-[0.98]"
    >
      <span className="flex-shrink-0 text-lg leading-none">{c.flag}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function Group({
  label,
  list,
  getLabel,
  onSelect,
}: {
  label: string;
  list: Country[];
  getLabel: (c: Country) => string;
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
          <CountryButton key={c.code} c={c} label={getLabel(c)} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────────

export default function CountrySelector({ t = DEFAULT_T }: { t?: CountrySelectorDict }) {
  const { showSelector, setCountry, setShowSelector, country, scrollTarget, setScrollTarget } = useCountry();
  const params = useParams<{ locale?: string }>();
  const locale = typeof params?.locale === "string" ? params.locale : "de";
  const getLabel = (c: Country) => localizedCountryName(c.code, locale, c.name);

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
  const [showAll, setShowAll] = useState(false);
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

  // Suche matcht den lokalisierten UND den deutschen Namen (z.B. "México" und "Mexiko")
  const q = search.toLowerCase();
  const filtered = q
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          getLabel(c).toLowerCase().includes(q)
      )
    : COUNTRIES;

  // Pinned = aktuell gewähltes Land oder erkanntes Land
  const pinned = country ?? detectedCountry;
  const filteredWithoutPinned = pinned ? filtered.filter((c) => c.code !== pinned.code) : filtered;

  // Fokus-Länder (mit priority) zuerst, danach bisherige Reihenfolge (nach Bevölkerung).
  // Ohne Suche und ohne "Alle Länder anzeigen" werden nur Fokus-Länder gezeigt —
  // der Traffic kommt fast ausschliesslich aus den Kampagnenländern, und das
  // erkannte Land ist ohnehin oben angepinnt.
  const byPriority = (a: Country, b: Country) => (a.priority ?? 999) - (b.priority ?? 999);
  const expanded = showAll || q.length > 0;
  const visible  = expanded
    ? filteredWithoutPinned
    : filteredWithoutPinned.filter((c) => c.priority !== undefined);
  const europe   = visible.filter((c) => c.continent === "europe").sort(byPriority);
  const americas = visible.filter((c) => c.continent === "americas").sort(byPriority);
  const asia     = visible.filter((c) => c.continent === "asia");
  const oceania  = visible.filter((c) => c.continent === "oceania");
  const pinnedInFiltered = pinned ? filtered.find((c) => c.code === pinned.code) : null;
  const total    = europe.length + americas.length + asia.length + oceania.length + (pinnedInFiltered ? 1 : 0);
  const hiddenCount = filteredWithoutPinned.length - visible.length;

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
            {t.title}
          </h2>
          <p className="mt-1 text-sm text-cream-muted">
            {t.subtitle}
          </p>
          <input
            autoFocus
            type="text"
            placeholder={t.searchPlaceholder}
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
                {country ? t.selected : t.detected}
              </p>
              <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-3">
                <button
                  onClick={() => handleSelect(pinnedInFiltered)}
                  className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm font-semibold text-swiss-gold ring-1 ring-swiss-gold/30 bg-ink-800 transition hover:bg-ink-700 active:scale-[0.98]"
                >
                  <span className="flex-shrink-0 text-lg leading-none">{pinnedInFiltered.flag}</span>
                  <span className="truncate">{getLabel(pinnedInFiltered)}</span>
                  <svg className="ml-auto flex-shrink-0" width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <Group label={t.europe}   list={europe}   getLabel={getLabel} onSelect={handleSelect} />
          <Group label={t.americas} list={americas} getLabel={getLabel} onSelect={handleSelect} />
          <Group label={t.asia}     list={asia}     getLabel={getLabel} onSelect={handleSelect} />
          <Group label={t.oceania}  list={oceania}  getLabel={getLabel} onSelect={handleSelect} />

          {!expanded && hiddenCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="mb-2 w-full rounded-sm border border-ink-700 px-4 py-2.5 text-sm text-cream-muted transition hover:border-ink-600 hover:bg-ink-800 hover:text-cream"
            >
              {t.showAll.replace("{count}", String(hiddenCount))}
            </button>
          )}

          {total === 0 && (
            <p className="py-10 text-center text-sm text-cream-subtle">
              {t.notFound}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-ink-700 px-6 py-4">
          <p className="text-xs text-cream-subtle">
            {t.footerHint}
          </p>
          <button
            onClick={() => setShowSelector(false)}
            className="ml-4 flex-shrink-0 text-xs text-cream-subtle transition hover:text-cream"
          >
            {t.close} ✕
          </button>
        </div>
      </div>
    </div>
  );
}
