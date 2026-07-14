"use client";

import { useEffect } from "react";
import { COUNTRIES } from "@/lib/countries";
import { useCountry } from "./CountryProvider";

// Stellt das Land voraus, wenn der Nutzer von einer länderspezifischen Ratgeber-Seite kommt
// (CTA-Link mit ?country=XX). Da der Parameter NUR von länderspezifischen Seiten gesetzt wird
// (Schweizer Miet-Ratgeber → CH, US-Kündigung → US, o2 → DE …), ist das jeweilige Land immer
// das richtige. Deshalb wird es erzwungen — auch über eine bestehende Auswahl hinweg. Das Cookie
// wird mitgesetzt, damit die Auswahl den Stripe-Redirect übersteht (wichtig für die Generierung).
export default function CountryPresetter({ code }: { code?: string }) {
  const { country, setCountry } = useCountry();

  useEffect(() => {
    if (!code) return;
    const found = COUNTRIES.find((c) => c.code === code.toUpperCase());
    if (found && found.code !== country?.code) setCountry(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return null;
}
