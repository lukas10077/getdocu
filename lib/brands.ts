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

  "clever-fit": {
    slug: "clever-fit",
    name: "Clever Fit",
    category: "Fitnessstudio",
    countryCode: "DE",
    intro:
      "Du willst deinen Clever-Fit-Vertrag kündigen? Hier findest du die Frist, den richtigen Empfänger und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Verträge ab März 2022 sind nach der Erstlaufzeit mit 1 Monat Frist kündbar. Ältere Verträge haben meist 3 Monate Frist. Die Mindestlaufzeit beträgt oft 12 Monate.",
    address: ["An dein lokales Clever-Fit-Studio", "(Adresse laut Mitgliedsvertrag bzw. Impressum der Studio-Website)"],
    facts: [
      "Wichtig: Clever Fit ist ein Franchise. Dein Vertragspartner ist dein lokales Studio, nicht die Zentrale — eine Kündigung an die Zentrale ist rechtlich unwirksam. Die genaue Adresse steht in deinem Vertrag oder im Impressum der Studio-Website.",
      "Kündige in Textform (Brief oder E-Mail), am sichersten per Einschreiben mit Rückschein.",
      "Massgebend ist das Eingangsdatum der Kündigung, nicht das Absendedatum.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat Clever Fit?", a: "Verträge ab März 2022: nach der Erstlaufzeit 1 Monat. Ältere Verträge meist 3 Monate. Die Mindestlaufzeit ist oft 12 Monate." },
      { q: "Wohin schicke ich die Clever-Fit-Kündigung?", a: "An dein lokales Vertragsstudio — nicht an die Zentrale. Die Adresse findest du in deinem Mitgliedsvertrag oder im Impressum der Studio-Website." },
      { q: "Warum nicht an die Zentrale?", a: "Weil Clever Fit ein Franchise ist: Vertragspartner ist der Betreiber deines Studios. Eine Kündigung an die Zentrale ist rechtlich unwirksam." },
    ],
    sourceNote: "Angaben Stand 2026. Kündigungsadresse = dein lokales Studio; Frist je nach Vertragsdatum unterschiedlich.",
  },

  "huk-coburg": {
    slug: "huk-coburg",
    name: "HUK-Coburg",
    category: "Versicherung",
    countryCode: "DE",
    intro:
      "Du willst deine HUK-Coburg-Versicherung kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Bei der Kfz-Versicherung gilt 1 Monat Frist zum Ende des Versicherungsjahres — meist der 30. November. Andere Sparten haben oft 3 Monate Frist vor Ablauf. Bei einer Beitragserhöhung oder nach einem Schadenfall besteht ein Sonderkündigungsrecht.",
    address: ["HUK-COBURG", "Kontakt-Center", "96444 Coburg"],
    facts: [
      "Kündige schriftlich per Brief (Einschreiben empfohlen), per Fax oder per E-Mail an info@huk-coburg.de — die Kündigung muss unterschrieben sein.",
      "Gib unbedingt deine Versicherungsscheinnummer und die genaue Versicherungsart an, damit die Kündigung korrekt zugeordnet wird.",
      "Massgebend ist der Zugang bei der HUK-Coburg, nicht der Poststempel. Vermerk auf dem Umschlag hilft (z.B. „KFZ-Versicherung“).",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die HUK-Coburg?", a: "Kfz-Versicherung: 1 Monat zum Ende des Versicherungsjahres (meist 30. November). Andere Sparten meist 3 Monate vor Ablauf." },
      { q: "Wohin schicke ich die HUK-Coburg-Kündigung?", a: "An HUK-COBURG, Kontakt-Center, 96444 Coburg — oder per E-Mail an info@huk-coburg.de. Ein Einschreiben ist der sicherste Nachweis." },
      { q: "Kann ich wegen Beitragserhöhung sofort kündigen?", a: "Ja. Bei einer Beitragserhöhung oder nach einem Schadenfall hast du ein Sonderkündigungsrecht und musst die reguläre Frist nicht abwarten." },
    ],
    defaultNoticePeriod: "1 Monat",
    sourceNote: "Angaben Stand 2026. Frist je nach Sparte unterschiedlich — im Zweifel Police prüfen.",
  },

  fitnesspark: {
    slug: "fitnesspark",
    name: "Fitnesspark",
    category: "Fitnessstudio",
    countryCode: "CH",
    intro:
      "Du willst dein Fitnesspark-Abo (Migros) kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Die Mitgliedschaft ist mit einer Frist von 2 Monaten auf das Ende der Vertragsdauer schriftlich kündbar. Das genaue Vertragsende steht in deinen Vertragsunterlagen.",
    address: ["Fitnesspark / movemi AG", "z.H. Kundenservice", "Thurgauerstrasse 32", "8050 Zürich"],
    facts: [
      "Kündige schriftlich per Brief — ein Einschreiben ist der sicherste Nachweis für die rechtzeitige Zustellung.",
      "Massgebend ist der Zugang beim Fitnesspark, nicht der Poststempel. Sende die Kündigung mindestens 2 Monate vor Vertragsende.",
      "Prüfe dein genaues Vertragsende in den Unterlagen, bevor du kündigst.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat der Fitnesspark?", a: "2 Monate auf das Ende der Vertragsdauer. Das genaue Datum steht in deinem Vertrag." },
      { q: "Wohin schicke ich die Fitnesspark-Kündigung?", a: "An Fitnesspark / movemi AG, z.H. Kundenservice, Thurgauerstrasse 32, 8050 Zürich — am besten per Einschreiben." },
      { q: "Muss die Kündigung schriftlich sein?", a: "Ja, die Kündigung muss schriftlich erfolgen. Ein Einschreiben dokumentiert den Zugang nachweisbar." },
    ],
    defaultNoticePeriod: "2 Monate",
    sourceNote: "Angaben Stand 2026. Dein genaues Vertragsende steht in deinen Unterlagen.",
  },

  allianz: {
    slug: "allianz",
    name: "Allianz",
    category: "Versicherung",
    countryCode: "DE",
    intro:
      "Du willst deine Allianz-Versicherung kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Kfz-Versicherung: 1 Monat zum Ende des Versicherungsjahres (meist 30. November). Andere Sparten: oft 3 Monate vor Ablauf. Bei Beitragserhöhung, Schadenfall oder Fahrzeugwechsel besteht ein Sonderkündigungsrecht mit 1 Monat Frist.",
    address: ["Allianz Versicherungs-AG", "Kundenbetreuung", "10900 Berlin"],
    facts: [
      "Kündige schriftlich per Brief (Einschreiben empfohlen) oder per E-Mail an sachversicherung@allianz.de.",
      "Gib deine Versicherungsscheinnummer und die genaue Versicherungsart an, damit die Kündigung korrekt zugeordnet wird.",
      "Massgebend ist der Zugang bei der Allianz, nicht der Poststempel.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die Allianz?", a: "Kfz-Versicherung 1 Monat zum Ende des Versicherungsjahres (meist 30. November), andere Sparten oft 3 Monate vor Ablauf." },
      { q: "Wohin schicke ich die Allianz-Kündigung?", a: "An Allianz Versicherungs-AG, Kundenbetreuung, 10900 Berlin — oder per E-Mail an sachversicherung@allianz.de." },
      { q: "Kann ich nach einem Schadenfall sofort kündigen?", a: "Ja. Nach einem Schadenfall, bei Beitragserhöhung oder Fahrzeugwechsel hast du ein Sonderkündigungsrecht mit 1 Monat Frist." },
    ],
    sourceNote: "Angaben Stand 2026. Frist je nach Sparte unterschiedlich — im Zweifel Police prüfen.",
  },

  axa: {
    slug: "axa",
    name: "AXA",
    category: "Versicherung",
    countryCode: "DE",
    intro:
      "Du willst deine AXA-Versicherung kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Bei Verträgen mit mehr als einem Jahr Laufzeit meist 3 Monate zum Ende der Vertragslaufzeit. Kfz-Versicherung: 1 Monat zum Ende des Versicherungsjahres. Bei Beitragserhöhung oder Schadenfall besteht ein Sonderkündigungsrecht.",
    address: ["AXA Versicherung AG", "Kundenbetreuung", "51171 Köln"],
    facts: [
      "Kündige schriftlich per Brief (Einschreiben empfohlen) oder per E-Mail an service@axa.de — mit Unterschrift.",
      "Gib deine Versicherungsscheinnummer und die Versicherungsart an.",
      "Massgebend ist der Zugang bei der AXA, nicht der Poststempel.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die AXA?", a: "Bei Verträgen über einem Jahr meist 3 Monate zum Ende der Laufzeit; Kfz-Versicherung 1 Monat zum Ende des Versicherungsjahres." },
      { q: "Wohin schicke ich die AXA-Kündigung?", a: "An AXA Versicherung AG, Kundenbetreuung, 51171 Köln — oder per E-Mail an service@axa.de." },
      { q: "Muss die Kündigung schriftlich sein?", a: "Ja, per Brief oder E-Mail mit Unterschrift. Ein Einschreiben ist der sicherste Nachweis." },
    ],
    sourceNote: "Angaben Stand 2026. Frist je nach Sparte unterschiedlich — im Zweifel Police prüfen.",
  },

  ergo: {
    slug: "ergo",
    name: "ERGO",
    category: "Versicherung",
    countryCode: "DE",
    intro:
      "Du willst deine ERGO-Versicherung kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Kfz- und Lebensversicherung: 1 Monat zum Ende des Versicherungsjahres. Haftpflicht, Hausrat und weitere Sparten: 3 Monate vor Ablauf. Eine Kündigung in Textform (Brief oder E-Mail) genügt.",
    address: ["ERGO Versicherung AG", "ERGO-Platz 1", "40477 Düsseldorf"],
    facts: [
      "Eine Kündigung in Textform reicht — per Brief oder per E-Mail an service@ergo.de. Wichtig ist, dass du als Absender erkennbar bist.",
      "Gib deine Versicherungsscheinnummer und die Versicherungsart an.",
      "Massgebend ist der Zugang bei der ERGO, nicht der Poststempel.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die ERGO?", a: "Kfz und Leben 1 Monat zum Ende des Versicherungsjahres; Haftpflicht, Hausrat und weitere Sparten 3 Monate vor Ablauf." },
      { q: "Wohin schicke ich die ERGO-Kündigung?", a: "An ERGO Versicherung AG, ERGO-Platz 1, 40477 Düsseldorf — oder per E-Mail an service@ergo.de." },
      { q: "Reicht eine Kündigung per E-Mail?", a: "Ja, ERGO akzeptiert die Textform. Für einen Zustellnachweis ist ein Einschreiben dennoch sicherer." },
    ],
    sourceNote: "Angaben Stand 2026. Frist je nach Sparte unterschiedlich — im Zweifel Police prüfen.",
  },

  devk: {
    slug: "devk",
    name: "DEVK",
    category: "Versicherung",
    countryCode: "DE",
    intro:
      "Du willst deine DEVK-Versicherung kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein rechtssicheres Kündigungsschreiben erstellst.",
    noticePeriod:
      "Kfz-Versicherung: 1 Monat zum Ende des Versicherungsjahres (meist 30. November). Andere Sparten: 3 Monate vor Ablauf. Eine Kündigung in Textform (Brief, Fax oder E-Mail) genügt.",
    address: ["DEVK Versicherungen", "Riehler Straße 190", "50735 Köln"],
    facts: [
      "Kündige in Textform per Brief (Einschreiben empfohlen), Fax oder E-Mail an info@devk.de.",
      "Gib deine Versicherungsscheinnummer und die Versicherungsart an.",
      "Massgebend ist der Zugang bei der DEVK, nicht der Poststempel.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die DEVK?", a: "Kfz-Versicherung 1 Monat zum Ende des Versicherungsjahres (meist 30. November); andere Sparten 3 Monate vor Ablauf." },
      { q: "Wohin schicke ich die DEVK-Kündigung?", a: "An DEVK Versicherungen, Riehler Straße 190, 50735 Köln — oder per E-Mail an info@devk.de." },
      { q: "In welcher Form muss ich kündigen?", a: "In Textform — per Brief, Fax oder E-Mail. Ein Einschreiben liefert den sichersten Zustellnachweis." },
    ],
    sourceNote: "Angaben Stand 2026. Frist je nach Sparte unterschiedlich — im Zweifel Police prüfen.",
  },

  "die-mobiliar": {
    slug: "die-mobiliar",
    name: "Die Mobiliar",
    category: "Versicherung",
    countryCode: "CH",
    intro:
      "Du willst deine Versicherung bei der Mobiliar kündigen? Hier findest du die Frist, die Kündigungsadresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Je nach Vertrag 1 bis 3 Monate zum Vertragsende — die genaue Frist steht in deiner Police bzw. den Allgemeinen Versicherungsbedingungen (AVB). Nach einem Schadenfall besteht oft ein Sonderkündigungsrecht.",
    address: ["Schweizerische Mobiliar Versicherungsgesellschaft AG", "Bundesgasse 35", "3001 Bern"],
    facts: [
      "Kündige schriftlich per eingeschriebenem Brief — das dokumentiert den Zugang nachweisbar.",
      "Massgebend ist der Zugang bei der Mobiliar, nicht der Poststempel. Das Risiko einer verspäteten Zustellung trägt der Absender.",
      "Bitte im Schreiben um eine schriftliche Bestätigung und bewahre die Postquittung auf, bis diese eintrifft.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat die Mobiliar?", a: "Je nach Vertrag 1 bis 3 Monate zum Vertragsende. Die genaue Frist steht in deiner Police bzw. den AVB." },
      { q: "Wohin schicke ich die Mobiliar-Kündigung?", a: "An Schweizerische Mobiliar Versicherungsgesellschaft AG, Bundesgasse 35, 3001 Bern — am besten per Einschreiben." },
      { q: "Kann ich nach einem Schadenfall kündigen?", a: "Ja, nach einem Schadenfall besteht in der Regel ein Sonderkündigungsrecht. Die Details stehen in deinen AVB." },
    ],
    sourceNote: "Angaben Stand 2026. Deine genaue Frist steht in deiner Police bzw. den AVB.",
  },
};

export const allBrandSlugs: string[] = Object.keys(brands);

export function getBrand(slug: string): Brand | undefined {
  return brands[slug];
}
