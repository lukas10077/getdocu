"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { locales, localeMeta, Locale } from "@/i18n/config";
import { useCountry } from "./CountryProvider";
import { COUNTRIES, Country } from "@/lib/countries";

const STORAGE_KEY = "getdocu_onboarded";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}

export default function OnboardingCard({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { setCountry, country } = useCountry();
  const router = useRouter();
  const pathname = usePathname();

  const detectedRef = useRef<Country | null>(null);

  useEffect(() => {
    const code = readCookie("getdocu_detected_country");
    if (code) {
      const found = COUNTRIES.find((c) => c.code === code) ?? null;
      detectedRef.current = found;
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    // Erkanntes Land als Default setzen wenn noch keines gewählt
    if (!country && detectedRef.current) {
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
    dismiss();
  }

  if (!visible) return null;

  const priority: Locale[] = ["en", "de", "es", "pt", "fr", "it"];
  const rest = locales.filter((l) => l !== locale && !priority.includes(l));
  const sorted: Locale[] = [locale, ...priority.filter((l) => l !== locale), ...rest];

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
          <p className="font-serif text-lg font-medium text-cream">Deine Sprache</p>
          <p className="mt-0.5 text-xs text-cream-subtle">Bereits erkannt — ändern falls nötig.</p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Schliessen"
          className="ml-3 mt-0.5 flex-shrink-0 text-cream-subtle transition hover:text-cream"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Language grid */}
      <div className="grid grid-cols-2 gap-0.5 p-3">
        {sorted.map((l) => {
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
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end border-t border-ink-700 px-5 py-3">
        <button
          onClick={dismiss}
          className="text-xs text-cream-subtle transition hover:text-cream"
        >
          Bestätigen ✓
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
