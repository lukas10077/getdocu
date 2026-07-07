"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { COUNTRIES, Country } from "@/lib/countries";

interface CountryContextType {
  country: Country | null;
  setCountry: (c: Country) => void;
  showSelector: boolean;
  setShowSelector: (v: boolean) => void;
}

const CountryContext = createContext<CountryContextType>({
  country: null,
  setCountry: () => {},
  showSelector: false,
  setShowSelector: () => {},
});

export function useCountry() {
  return useContext(CountryContext);
}

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryState] = useState<Country | null>(null);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    // Cookie auslesen
    const match = document.cookie.match(/(?:^|;\s*)getdocu_country=([A-Z]{2})/);
    const code = match?.[1];
    if (code) {
      const found = COUNTRIES.find((c) => c.code === code);
      if (found) {
        setCountryState(found);
        return;
      }
    }
    // Kein gültiges Land → CountrySelector nur zeigen wenn Onboarding bereits abgeschlossen
    // (Erstbesucher bekommen stattdessen die OnboardingCard)
    if (localStorage.getItem("getdocu_onboarded")) {
      setShowSelector(true);
    }
  }, []);

  function setCountry(c: Country) {
    setCountryState(c);
    // Cookie setzen (1 Jahr gültig)
    document.cookie = `getdocu_country=${c.code};max-age=${60 * 60 * 24 * 365};path=/;SameSite=Lax`;
    setShowSelector(false);
  }

  return (
    <CountryContext.Provider value={{ country, setCountry, showSelector, setShowSelector }}>
      {children}
    </CountryContext.Provider>
  );
}
