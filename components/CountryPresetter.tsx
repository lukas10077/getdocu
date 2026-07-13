"use client";

import { useEffect } from "react";
import { COUNTRIES } from "@/lib/countries";
import { useCountry } from "./CountryProvider";

// Stellt das Land voraus, wenn der Nutzer von einer länderspezifischen Ratgeber-Seite kommt
// (CTA-Link mit ?country=XX). Setzt nur, wenn noch KEIN Land gewählt wurde — eine bestehende
// Auswahl des Nutzers wird nicht überschrieben.
export default function CountryPresetter({ code }: { code?: string }) {
  const { setCountry } = useCountry();

  useEffect(() => {
    if (!code) return;
    const hasCookie = /(?:^|;\s*)getdocu_country=[A-Z]{2}/.test(document.cookie);
    if (hasCookie) return;
    const found = COUNTRIES.find((c) => c.code === code.toUpperCase());
    if (found) setCountry(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return null;
}
