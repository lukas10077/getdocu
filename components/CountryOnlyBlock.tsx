"use client";

import { useCountry } from "./CountryProvider";

// Zeigt den Inhalt nur, wenn das gewählte Land dem angegebenen Code entspricht
// oder noch kein Land gewählt wurde. Für explizit andere Länder wird ausgeblendet.
// Genutzt für länderspezifische Ratgeber-Links (z.B. CH-Mietrecht, US-Kündigung).
export default function CountryOnlyBlock({
  country: onlyCode,
  children,
}: {
  country: string;
  children: React.ReactNode;
}) {
  const { country } = useCountry();

  if (country && country.code !== onlyCode) return null;

  return <>{children}</>;
}
