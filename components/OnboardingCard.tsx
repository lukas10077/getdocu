"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeMeta, Locale } from "@/i18n/config";
import { useCountry } from "./CountryProvider";
import { COUNTRIES, Country } from "@/lib/countries";

const STORAGE_KEY = "getdocu_onboarded";

function CountryRow({ c, highlight, onClick }: { c: Country; highlight: boolean; onClick: (c: Country) => void }) {
  return (
    <button
      onClick={() => onClick(c)}
      className={`flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm transition hover:bg-ink-800 active:scale-[0.98] ${
        highlight
          ? "bg-ink-800 font-semibold text-swiss-gold ring-1 ring-swiss-gold/30"
          : "text-cream-muted hover:text-cream"
      }`}
    >
      <span className="flex-shrink-0 text-base leading-none">{c.flag}</span>
      <span className="truncate">{c.name}</span>
      {highlight && (
        <svg className="ml-auto flex-shrink-0" width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

export default function OnboardingCard({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"language" | "country">("language");
  const [leaving, setLeaving] = useState(false);
  const [search, setSearch] = useState("");
  const { setCountry, country } = useCountry();
  const router = useRouter();
  const pathname = usePathname();

  // Detected country from IP (set by middleware)
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);
  const detectedRef = useRef<Country | null>(null);

  useEffect(() => {
    const code = readCookie("getdocu_detected_country");
    if (code) {
      const found = COUNTRIES.find((c) => c.code === code) ?? null;
      setDetectedCountry(found);
      detectedRef.current = found;
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  function dismiss(applyDetected = true) {
    // Wenn kein Land manuell gewählt → erkanntes Land anwenden
    if (applyDetected && !country && detectedRef.current) {
      setCountry(detectedRef.current);
    }
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }, 280);
  }

  function selectLanguage(picked: Locale) {
    if (picked !== locale) {
      const rest = pathname?.replace(new RegExp(`^/${locale}(?=/|$)`), "") ?? "";
      router.push(`/${picked}${rest}`);
    }
    setSearch("");
    setStep("country");
  }

  function selectCountry(c: Country) {
    setCountry(c);
    dismiss(false);
  }

  if (!visible) return null;

  const q = search.toLowerCase();
  const filtered = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
    : COUNTRIES;
  const europe   = filtered.filter((c) => c.continent === "europe");
  const americas = filtered.filter((c) => c.continent === "americas");
  const other    = filtered.filter((c) => c.continent !== "europe" && c.continent !== "americas");

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-80 rounded-sm border border-ink-700 bg-ink-900 shadow-2xl transition-all duration-300 ease-out ${
        leaving ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
      style={{ animation: leaving ? undefined : "onboarding-in 0.32s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-ink-700 px-5 py-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-cream-subtle">
            {step === "language" ? "Schritt 1 / 2" : "Schritt 2 / 2"}
          </p>
          <p className="mt-0.5 font-serif text-lg font-medium text-cream">
            {step === "language" ? "Deine Sprache" : "Dein Land"}
          </p>
          <p className="mt-0.5 text-xs text-cream-subtle">
            {step === "language"
              ? "Bereits erkannt — ändern falls nötig."
              : "Bereits erkannt — ändern falls nötig."}
          </p>
        </div>
        <button
          onClick={() => dismiss()}
          aria-label="Schliessen"
          className="ml-3 mt-0.5 flex-shrink-0 text-cream-subtle transition hover:text-cream"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Step 1: Language ─────────────────────────────────────────── */}
      {step === "language" && (
        <div className="grid grid-cols-2 gap-0.5 p-3">
          {(() => {
            const priority: Locale[] = ["en", "de", "es", "pt", "fr", "it"];
            const rest = locales.filter((l) => l !== locale && !priority.includes(l));
            const sorted = [
              locale,
              ...priority.filter((l) => l !== locale),
              ...rest,
            ];
            return sorted.map((l) => {
              const isActive = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => selectLanguage(l)}
                  className={`flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-left text-sm transition hover:bg-ink-800 active:scale-[0.98] ${
                    isActive
                      ? "bg-ink-800 font-semibold text-swiss-gold ring-1 ring-swiss-gold/30"
                      : "text-cream"
                  }`}
                >
                  <span className="truncate">{localeMeta[l].nativeName}</span>
                  {isActive && (
                    <svg className="ml-auto flex-shrink-0" width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            });
          })()}
        </div>
      )}

      {/* ── Step 2: Country ───────────────────────────────────────────── */}
      {step === "country" && (
        <>
          <div className="px-4 pt-3 pb-2">
            <input
              autoFocus
              type="text"
              placeholder="Land suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-sm border border-ink-700 bg-ink-800 px-3 py-2 text-sm text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold"
            />
          </div>
          <div className="max-h-72 overflow-y-auto px-3 pb-3">
            {/* Erkanntes / gewähltes Land zuerst pinnen */}
            {(() => {
              const pinned = detectedCountry ?? country ?? null;
              const pinnedInFiltered = pinned && filtered.find((c) => c.code === pinned.code);
              return pinnedInFiltered ? (
                <div className="mb-3">
                  <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-widest text-cream-subtle">
                    Erkannt
                  </p>
                  <CountryRow c={pinnedInFiltered} highlight onClick={selectCountry} />
                </div>
              ) : null;
            })()}

            {/* Normale Gruppen (ohne gepinntes Land) */}
            {[
              { label: "Europa", list: europe },
              { label: "Amerika", list: americas },
              { label: "Weitere", list: other },
            ].map(({ label, list }) => {
              const pinned = detectedCountry ?? country ?? null;
              const items = pinned ? list.filter((c) => c.code !== pinned.code) : list;
              return items.length === 0 ? null : (
                <div key={label} className="mb-3">
                  <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-widest text-cream-subtle">
                    {label}
                  </p>
                  {items.map((c) => (
                    <CountryRow key={c.code} c={c} highlight={false} onClick={selectCountry} />
                  ))}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-cream-subtle">Kein Land gefunden</p>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="flex items-center border-t border-ink-700 px-5 py-3">
        {step === "country" && (
          <button
            onClick={() => setStep("language")}
            className="text-xs text-cream-subtle transition hover:text-cream"
          >
            ← Zurück
          </button>
        )}
        <button
          onClick={() => step === "language" ? setStep("country") : dismiss()}
          className="ml-auto text-xs text-cream-subtle transition hover:text-cream"
        >
          {step === "language" ? "Weiter →" : "Bestätigen ✓"}
        </button>
      </div>

      <style jsx global>{`
        @keyframes onboarding-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
