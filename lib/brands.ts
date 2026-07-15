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
  // Optionale Voreinstellung der Frist im Tool — NUR setzen, wenn eindeutig ein
  // Wert aus der Auswahlliste passt ("1 Monat", "2 Monate", "3 Monate", "6 Monate", "1 Jahr").
  // Bei uneindeutiger/vertragsabhängiger Frist weglassen (Nutzer wählt selbst).
  defaultNoticePeriod?: string;
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
    defaultNoticePeriod: "1 Monat",
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
    defaultNoticePeriod: "1 Monat",
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

  adac: {
    slug: "adac",
    name: "ADAC",
    category: "Mitgliedschaft",
    countryCode: "DE",
    intro:
      "Du willst deine ADAC-Mitgliedschaft kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Die Mitgliedschaft kann bis spätestens drei Monate vor Ende der Beitragsperiode gekündigt werden. Kündigst du nicht rechtzeitig, verlängert sie sich um ein weiteres Jahr.",
    address: ["ADAC e.V.", "Hansastraße 19", "80686 München"],
    facts: [
      "Die Kündigung muss in Textform erfolgen — per Post, per E-Mail an service@adac.de oder über das Kündigungsformular auf adac.de.",
      "Massgebend ist der Eingang beim ADAC, nicht das Absendedatum — rechtzeitig einreichen.",
      "Ein eingeschriebener Brief dokumentiert die Zustellung nachweisbar.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat der ADAC?", a: "Du kannst bis spätestens drei Monate vor Ende der Beitragsperiode kündigen. Sonst verlängert sich die Mitgliedschaft um ein weiteres Jahr." },
      { q: "Wohin schicke ich die ADAC-Kündigung?", a: "An ADAC e.V., Hansastraße 19, 80686 München — oder per E-Mail an service@adac.de bzw. über das Kündigungsformular auf adac.de." },
      { q: "Muss die Kündigung schriftlich sein?", a: "Textform genügt: Post, E-Mail oder Online-Formular. Ein eingeschriebener Brief ist der sicherste Nachweis." },
    ],
    defaultNoticePeriod: "3 Monate",
    sourceNote: "Angaben Stand 2026. Im Zweifel die in deinen Unterlagen genannte Frist prüfen.",
  },

  mcfit: {
    slug: "mcfit",
    name: "McFit",
    category: "Fitnessstudio",
    countryCode: "DE",
    intro:
      "Du willst deinen McFit-Vertrag kündigen? Hier findest du die Frist, die richtige Adresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Bei McFit gilt eine Kündigungsfrist von 4 Wochen zum Ende der Vertragslaufzeit. Kündigst du nicht rechtzeitig, verlängert sich der Vertrag automatisch.",
    address: ["RSG Group GmbH", "Tannenberg 4", "96132 Schlüsselfeld"],
    facts: [
      "Vertragspartner ist die Muttergesellschaft RSG Group GmbH — deshalb geht die Kündigung dorthin (Schlüsselfeld).",
      "Gib immer deine McFit-Mitgliedsnummer an, damit die Kündigung zugeordnet werden kann.",
      "Der sicherste Weg ist der Brief per Einschreiben; zusätzlich gibt es das offizielle Kontaktformular und die McFit-App. Massgebend ist das Eingangsdatum.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat McFit?", a: "4 Wochen zum Ende der Vertragslaufzeit. Verpasst du die Frist, verlängert sich der Vertrag automatisch." },
      { q: "Wohin schicke ich die McFit-Kündigung?", a: "An RSG Group GmbH, Tannenberg 4, 96132 Schlüsselfeld — dein Vertragspartner ist die RSG Group." },
      { q: "Was muss im Kündigungsschreiben stehen?", a: "Deine McFit-Mitgliedsnummer sowie Name und Adresse, damit die Kündigung eindeutig zugeordnet werden kann." },
    ],
    sourceNote: "Angaben Stand 2026. Deine genaue Laufzeit/Frist steht in deinem Vertrag bzw. der Members Area.",
  },

  fitx: {
    slug: "fitx",
    name: "FitX",
    category: "Fitnessstudio",
    countryCode: "DE",
    intro:
      "Du willst deinen FitX-Vertrag kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Verträge ab März 2022 sind nach der Mindestlaufzeit (12 Monate) mit einer Frist von genau 1 Monat kündbar. Ältere Verträge haben oft 3 Monate Frist zum Vertragsende.",
    address: ["FitX Deutschland GmbH", "Stoppenberger Straße 61", "45141 Essen"],
    facts: [
      "Kündigen kannst du per Post, per E-Mail an info@fitx.de oder online in der Members Area (mein.fitx.de).",
      "Massgebend ist das Eingangsdatum der Kündigung, nicht das Absendedatum.",
      "Sonderkündigung möglich: bei dauerhafter Sportunfähigkeit, Schwangerschaft oder Umzug kannst du ausserordentlich kündigen.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat FitX?", a: "Verträge ab März 2022: nach der 12-monatigen Mindestlaufzeit 1 Monat Frist. Ältere Verträge oft 3 Monate zum Vertragsende." },
      { q: "Wohin schicke ich die FitX-Kündigung?", a: "An FitX Deutschland GmbH, Stoppenberger Straße 61, 45141 Essen — oder per E-Mail an info@fitx.de bzw. online in der Members Area." },
      { q: "Kann ich bei FitX ausserordentlich kündigen?", a: "Ja, z.B. bei dauerhafter Sportunfähigkeit, Schwangerschaft oder Umzug ist eine fristlose Kündigung möglich." },
    ],
    sourceNote: "Angaben Stand 2026. Frist je nach Vertragsdatum unterschiedlich — im Zweifel Vertrag/Members Area prüfen.",
  },

  parship: {
    slug: "parship",
    name: "Parship",
    category: "Abo / Dating",
    countryCode: "DE",
    intro:
      "Du willst deine Parship-Premium-Mitgliedschaft kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Die Frist variiert je nach Vertrag — meist 12 Wochen (3 Monate), teils nur 1 Monat. Deine genaue Frist steht in der Bestätigungsmail von Parship. Ohne rechtzeitige Kündigung verlängert sich die Mitgliedschaft automatisch.",
    address: ["PE Digital GmbH", "Kundenservice PARSHIP Deutschland", "Speersort 10", "20095 Hamburg"],
    facts: [
      "Gib zur Zuordnung deine bei Parship hinterlegte E-Mail-Adresse bzw. Chiffre und dein Service-Passwort an.",
      "Kündigen kannst du per Post, per E-Mail an kundenservice@parship.de oder per Fax an +49 40 46 00 26 596.",
      "Die kostenlose Basis-Mitgliedschaft kannst du jederzeit ohne Frist beenden.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat Parship?", a: "Meist 12 Wochen (3 Monate), teils nur 1 Monat. Die für dich gültige Frist steht in deiner Parship-Bestätigungsmail." },
      { q: "Wohin schicke ich die Parship-Kündigung?", a: "An PE Digital GmbH, Kundenservice PARSHIP Deutschland, Speersort 10, 20095 Hamburg — oder per E-Mail an kundenservice@parship.de." },
      { q: "Was muss in der Kündigung stehen?", a: "Deine hinterlegte E-Mail-Adresse bzw. Chiffre und dein Service-Passwort, damit Parship die Kündigung zuordnen kann." },
    ],
    sourceNote: "Angaben Stand 2026. Deine genaue Frist steht in der Parship-Bestätigungsmail.",
  },

  sky: {
    slug: "sky",
    name: "Sky",
    category: "Abo / TV",
    countryCode: "DE",
    intro:
      "Du willst dein Sky-Abo kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Aktuelle Verträge sind in der Regel mit 1 Monat Frist zum Ablauf der 12-monatigen Mindestlaufzeit kündbar. Ältere Verträge haben teils bis zu 2 Monate Frist und verlängern sich sonst um weitere 12 Monate.",
    address: ["Sky Deutschland", "22033 Hamburg"],
    facts: [
      "Kündigen kannst du per Brief, per E-Mail an service@sky.de, online im Kundenkonto, per Live-Chat oder Hotline.",
      "Ein eingeschriebener Brief ist der sicherste Nachweis für den fristgerechten Eingang.",
      "Nach der Kündigung Leihgeräte (Receiver, Smartcard) innerhalb von etwa 14 Tagen zurücksenden, um Zusatzkosten zu vermeiden.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat Sky?", a: "Aktuelle Verträge: 1 Monat vor Ablauf der 12-monatigen Mindestlaufzeit. Ältere Verträge teils bis zu 2 Monate." },
      { q: "Wohin schicke ich die Sky-Kündigung?", a: "An Sky Deutschland, 22033 Hamburg — oder per E-Mail an service@sky.de bzw. online im Kundenkonto." },
      { q: "Was passiert mit den Leihgeräten?", a: "Receiver und Smartcard musst du nach der Kündigung innerhalb von etwa 14 Tagen zurücksenden, sonst können Zusatzkosten entstehen." },
    ],
    defaultNoticePeriod: "1 Monat",
    sourceNote: "Angaben Stand 2026. Deine genaue Frist/Laufzeit steht in deinem Vertrag bzw. Kundenkonto.",
  },
};

export const allBrandSlugs: string[] = Object.keys(brands);

export function getBrand(slug: string): Brand | undefined {
  return brands[slug];
}
