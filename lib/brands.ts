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

  vodafone: {
    slug: "vodafone",
    name: "Vodafone",
    category: "Handyvertrag",
    countryCode: "DE",
    intro:
      "Du willst deinen Vodafone-Vertrag (Mobilfunk, DSL oder Kabel) kündigen? Hier findest du die Frist, die richtige Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Nach Ablauf der Mindestlaufzeit ist dein Vertrag seit der TKG-Reform 2021 jederzeit mit einer Frist von genau 1 Monat kündbar. Innerhalb der Laufzeit gilt die vereinbarte Frist zum Ende der Mindestlaufzeit.",
    address: ["Vodafone GmbH", "40875 Ratingen"],
    facts: [
      "Diese Adresse gilt für Mobilfunk- und DSL-Verträge. Für Kabel-/TV-Verträge (teils ehemals Unitymedia) gelten andere Anschriften — die korrekte Adresse siehst du in „MeinVodafone“.",
      "Kündige in Textform: schriftlich per Post oder Fax (Einschreiben mit Rückschein empfohlen). Je nach Vertrag ist auch eine Online-Kündigung möglich.",
      "Massgebend ist der Zugang bei Vodafone, nicht der Poststempel — sende die Kündigung rechtzeitig vor Fristablauf.",
    ],
    faq: [
      {
        q: "Welche Kündigungsfrist hat Vodafone?",
        a: "Nach der Mindestlaufzeit ist der Vertrag jederzeit mit einer Frist von genau 1 Monat kündbar. Innerhalb der Laufzeit gilt die vereinbarte Frist zum Ende der Mindestlaufzeit.",
      },
      {
        q: "Wohin schicke ich die Vodafone-Kündigung?",
        a: "Für Mobilfunk und DSL an Vodafone GmbH, 40875 Ratingen. Für Kabel-/TV-Verträge gelten andere Adressen — die korrekte findest du in „MeinVodafone“.",
      },
      {
        q: "Muss die Kündigung schriftlich sein?",
        a: "Vodafone verlangt Textform: per Post oder Fax, je nach Vertrag auch online oder per E-Mail. Ein eingeschriebener Brief mit Rückschein ist der sicherste Nachweis.",
      },
    ],
    sourceNote:
      "Angaben Stand 2026. Adresse je nach Vertragstyp unterschiedlich — im Zweifel „MeinVodafone“ oder den Vertrag prüfen.",
  },

  telekom: {
    slug: "telekom",
    name: "Telekom",
    category: "Handyvertrag",
    countryCode: "DE",
    intro:
      "Du willst deinen Telekom-Vertrag (Festnetz, DSL oder Mobilfunk) kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Festnetz- und DSL-Verträge sind nach der Mindestlaufzeit jederzeit mit 1 Monat Frist kündbar (TKG-Reform 2021). Mobilfunkverträge haben oft 24 Monate Mindestlaufzeit mit 3 Monaten Frist zum Laufzeitende — achte auf deinen Vertragstyp.",
    address: ["Telekom Deutschland GmbH", "Kundenservice", "53171 Bonn"],
    facts: [
      "Kündige schriftlich — per Post, E-Mail, im Kundencenter oder über die MeinMagenta App. Für einen sicheren Nachweis ein Einschreiben mit Rückschein.",
      "Massgebend ist der Zugang bei der Telekom, nicht der Poststempel — rechtzeitig vor Fristablauf senden.",
      "Achte auf den Vertragstyp: Bei Mobilfunk gilt oft die längere 3-Monats-Frist, bei Festnetz/DSL nur 1 Monat nach der Mindestlaufzeit.",
    ],
    faq: [
      {
        q: "Welche Kündigungsfrist hat die Telekom?",
        a: "Festnetz/DSL: nach der Mindestlaufzeit jederzeit mit 1 Monat Frist. Mobilfunk: meist 24 Monate Mindestlaufzeit mit 3 Monaten Frist zum Laufzeitende.",
      },
      {
        q: "Wohin schicke ich die Telekom-Kündigung?",
        a: "An Telekom Deutschland GmbH, Kundenservice, 53171 Bonn. Ein Einwurf-/Einschreiben dokumentiert die Zustellung nachweisbar.",
      },
      {
        q: "Wie kann ich bei der Telekom kündigen?",
        a: "Schriftlich per Post oder E-Mail, im Kundencenter oder über die MeinMagenta App. Ein schriftliches Schreiben per Einschreiben ist der sicherste Nachweis.",
      },
    ],
    sourceNote:
      "Angaben Stand 2026. Fristen je nach Vertragstyp (Festnetz/DSL vs. Mobilfunk) unterschiedlich — im Zweifel den Vertrag prüfen.",
  },
};

export const allBrandSlugs: string[] = Object.keys(brands);

export function getBrand(slug: string): Brand | undefined {
  return brands[slug];
}
