// Skalierbare Datenbasis für Marken-/Anbieter-Kündigungsseiten.
// Neue Marke: hier einen Eintrag ergänzen — die Seite unter
// /de/ratgeber/anbieter/<slug> entsteht automatisch, ebenso der Sitemap-Eintrag.
//
// WICHTIG: Fristen und Adressen müssen pro Marke recherchiert und verifiziert sein
// (Stand im sourceNote festhalten). Falsche Angaben schaden Vertrauen und Ranking.

export interface Brand {
  slug: string;
  name: string;
  category: string;      // z.B. "Handyvertrag", "Fitnessstudio", "Versicherung"
  countryCode: string;   // "DE" | "CH" | "AT" — steuert Land-Voreinstellung im Tool
  intro: string;         // 1–2 Sätze Einstieg
  noticePeriod: string;  // menschenlesbare Kündigungsfrist
  address: string[];     // Kündigungsadresse (Zeilen)
  facts: string[];       // Kernfakten (Form, Zustellung, Bestätigung …)
  faq: { q: string; a: string }[];
  sourceNote: string;    // Stand / Verifizierungshinweis
}

export const brands: Record<string, Brand> = {
  o2: {
    slug: "o2",
    name: "o2",
    category: "Handyvertrag",
    countryCode: "DE",
    intro:
      "Du willst deinen o2-Vertrag (Handy, DSL oder Prepaid) kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Nach Ablauf der Mindestlaufzeit ist dein Vertrag monatlich mit einer Frist von 1 Monat kündbar. Neuere Verträge (ab Dezember 2021) haben 12 Monate Laufzeit mit 1 Monat Frist; ältere oft 24 Monate mit 3 Monaten Frist.",
    address: ["Telefónica Germany GmbH & Co. OHG", "90345 Nürnberg"],
    facts: [
      "Kündige schriftlich per Post (eingeschriebener Brief empfohlen) — beim Handyvertrag ist auch eine Online-Kündigung möglich.",
      "Massgebend ist der Tag, an dem o2 dein Schreiben erhält, nicht der Poststempel. Sende die Kündigung mindestens 5 Werktage vor Fristablauf.",
      "o2 muss dir innerhalb von 2 Wochen eine Kündigungsbestätigung schicken — hebe sie gut auf.",
    ],
    faq: [
      {
        q: "Welche Kündigungsfrist hat o2?",
        a: "Nach der Mindestlaufzeit ist der Vertrag monatlich mit 1 Monat Frist kündbar. Innerhalb der Laufzeit gilt die vertraglich vereinbarte Frist (bei neueren Verträgen 1 Monat zum Laufzeitende, bei älteren oft 3 Monate).",
      },
      {
        q: "Wohin schicke ich die o2-Kündigung?",
        a: "An Telefónica Germany GmbH & Co. OHG, 90345 Nürnberg. Ein eingeschriebener Brief dokumentiert die Zustellung nachweisbar.",
      },
      {
        q: "Muss die Kündigung schriftlich sein?",
        a: "Ja, per Post oder Fax. Beim Handyvertrag bietet o2 zusätzlich eine Online-Kündigung an. Ein schriftliches Schreiben ist in jedem Fall ein sicherer Nachweis.",
      },
      {
        q: "Ab wann gilt die Kündigung als eingegangen?",
        a: "Es zählt der Zeitpunkt der Zustellung bei o2, nicht der Poststempel. Deshalb mindestens 5 Werktage vor Fristablauf verschicken.",
      },
    ],
    sourceNote:
      "Angaben Stand 2026. Im Zweifel die in deinem Vertrag genannte Frist und Adresse prüfen.",
  },
};

export const allBrandSlugs: string[] = Object.keys(brands);

export function getBrand(slug: string): Brand | undefined {
  return brands[slug];
}
