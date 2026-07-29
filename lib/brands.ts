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
  // Kündigungsweg: steuert Badge + Aufbau der Seite.
  // "online"  → Schritt-für-Schritt-Anleitung im Vordergrund, Tool nur als dezenter Hinweis
  // "brief"   → Brief ist der sichere/verlangte Weg, Tool-CTA im Vordergrund (Standard)
  // "beides"  → beide Wege gleichwertig zeigen
  cancelChannel?: "online" | "brief" | "beides";
  // Schritt-für-Schritt für die Online-Kündigung (bei cancelChannel online/beides)
  onlineSteps?: string[];
  // Direktlink zur Kündigungs-/Kontoseite des Anbieters
  onlineUrl?: string;
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
  // ── Streaming & Digital-Abos (online kündbar) ────────────────────────
  // Bewusst aufgenommen für SEO-Reichweite: Die Seite zeigt ehrlich den Online-Weg
  // Schritt für Schritt; das Kündigungs-Tool erscheint nur als dezenter Hinweis.
  netflix: {
    slug: "netflix",
    name: "Netflix",
    category: "Streaming",
    countryCode: "DE",
    cancelChannel: "online",
    intro:
      "Netflix kündigst du direkt im Konto — ganz ohne Brief. Hier siehst du Schritt für Schritt, wie es geht, und worauf du achten solltest.",
    noticePeriod:
      "Keine Kündigungsfrist: Du kannst jederzeit kündigen. Das Abo läuft bis zum Ende des bereits bezahlten Abrechnungszeitraums weiter und endet dann automatisch.",
    address: [],
    onlineSteps: [
      "Melde dich auf netflix.com in deinem Konto an.",
      "Öffne über dein Profilbild oben rechts den Punkt „Konto“.",
      "Klicke unter „Mitgliedschaft“ auf „Mitgliedschaft kündigen“ und bestätige.",
      "Du erhältst eine Bestätigungs-E-Mail — das Abo läuft bis zum Ende des bezahlten Zeitraums.",
    ],
    onlineUrl: "https://www.netflix.com/cancelplan",
    facts: [
      "Nach der Kündigung kannst du bis zum Ende des bezahlten Zeitraums normal weiterschauen.",
      "Zahlst du über einen Drittanbieter (z.B. Apple, Google oder deinen Telekom-Anbieter), musst du dort kündigen — nicht bei Netflix.",
      "Dein Profil samt Merkliste bleibt 10 Monate gespeichert, falls du zurückkommst.",
    ],
    faq: [
      { q: "Wie kündige ich Netflix?", a: "Im Konto auf netflix.com unter „Mitgliedschaft“ → „Mitgliedschaft kündigen“. Ein Brief ist nicht nötig." },
      { q: "Gibt es bei Netflix eine Kündigungsfrist?", a: "Nein. Du kündigst jederzeit, das Abo endet zum Ende des bezahlten Abrechnungszeitraums." },
      { q: "Ich zahle über Apple/Google — wo kündige ich?", a: "Direkt beim Zahlungsanbieter: im App Store unter Abos bzw. bei Google Play unter Abos & Dienste." },
    ],
    sourceNote: "Angaben Stand Juli 2026, Netflix-Hilfe.",
  },

  spotify: {
    slug: "spotify",
    name: "Spotify",
    category: "Streaming",
    countryCode: "DE",
    cancelChannel: "online",
    intro:
      "Spotify Premium kündigst du in wenigen Klicks im Browser — nicht in der App. Hier ist der genaue Weg.",
    noticePeriod:
      "Keine Kündigungsfrist: Premium läuft bis zum Ende des bezahlten Abrechnungszeitraums und wechselt danach automatisch in die kostenlose Version.",
    address: [],
    onlineSteps: [
      "Öffne spotify.com/account im Browser und melde dich an (in der App geht es nicht).",
      "Gehe zu „Verfügbare Abos“ bzw. „Abo verwalten“.",
      "Wähle bei Premium „Kündigen“ und bestätige die Abfrage.",
      "Auf der Kontoseite steht anschließend das Datum, bis zu dem Premium aktiv bleibt.",
    ],
    onlineUrl: "https://www.spotify.com/account/",
    facts: [
      "In der Spotify-App selbst kannst du nicht kündigen — nur über die Konto-Seite im Browser.",
      "Nach dem Premium-Ende behältst du dein Konto, Playlists und Follower — nur mit Werbung und ohne Downloads.",
      "Hast du Premium über einen Drittanbieter (z.B. Apple oder deinen Mobilfunkanbieter) abgeschlossen, kündigst du dort.",
    ],
    faq: [
      { q: "Wie kündige ich Spotify Premium?", a: "Auf spotify.com/account im Browser anmelden, „Abo verwalten“ öffnen und Premium kündigen. In der App ist das nicht möglich." },
      { q: "Verliere ich meine Playlists?", a: "Nein. Konto, Playlists und gespeicherte Musik bleiben — du wechselst nur in die Gratis-Version mit Werbung." },
      { q: "Wann endet Premium nach der Kündigung?", a: "Zum Ende des bereits bezahlten Abrechnungszeitraums. Das genaue Datum siehst du auf deiner Kontoseite." },
    ],
    sourceNote: "Angaben Stand Juli 2026, Spotify-Support.",
  },

  "disney-plus": {
    slug: "disney-plus",
    name: "Disney+",
    category: "Streaming",
    countryCode: "DE",
    cancelChannel: "online",
    intro:
      "Disney+ kündigst du online im Konto — je nachdem, wo du das Abo abgeschlossen hast. Hier ist der Weg Schritt für Schritt.",
    noticePeriod:
      "Beim Monatsabo gibt es keine Frist: Es endet zum Ende des bezahlten Monats. Beim Jahresabo endet der Zugang zum Ende des bezahlten Jahres.",
    address: [],
    onlineSteps: [
      "Melde dich auf disneyplus.com im Browser an.",
      "Öffne über dein Profil „Konto“.",
      "Wähle dein Abo aus und klicke auf „Abo kündigen“, dann bestätigen.",
      "Du kannst bis zum Ende des bezahlten Zeitraums weiterschauen.",
    ],
    onlineUrl: "https://www.disneyplus.com/account",
    facts: [
      "Hast du Disney+ über Apple, Google oder Amazon abonniert, kündigst du direkt dort (App Store / Google Play / Amazon-Konto).",
      "Nach der Kündigung läuft der Zugang bis zum Ende des bezahlten Zeitraums — kein anteiliges Geld zurück.",
      "Beim Jahresabo lohnt ein Kalender-Reminder kurz vor der Verlängerung.",
    ],
    faq: [
      { q: "Wie kündige ich Disney+?", a: "Auf disneyplus.com anmelden, unter „Konto“ dein Abo auswählen und „Abo kündigen“ bestätigen." },
      { q: "Ich habe über Apple/Google/Amazon abonniert — wo kündige ich?", a: "Direkt beim jeweiligen Anbieter: App Store-Abos, Google Play-Abos bzw. Amazon-Konto unter Mitgliedschaften." },
      { q: "Bekomme ich Geld zurück?", a: "Nein, in der Regel nicht. Das Abo läuft bis zum Ende des bezahlten Zeitraums und endet dann." },
    ],
    sourceNote: "Angaben Stand Juli 2026, Disney+-Hilfe.",
  },

  "amazon-prime": {
    slug: "amazon-prime",
    name: "Amazon Prime",
    category: "Streaming",
    countryCode: "DE",
    cancelChannel: "online",
    intro:
      "Amazon Prime kündigst du direkt im Amazon-Konto. Hier siehst du den genauen Weg — und wann dir Amazon sogar Geld zurückerstattet.",
    noticePeriod:
      "Keine Kündigungsfrist: Du kündigst jederzeit zum Ende des bezahlten Zeitraums. Hast du Prime-Vorteile seit der letzten Zahlung nicht genutzt, erstattet Amazon den Beitrag oft anteilig oder ganz.",
    address: [],
    onlineSteps: [
      "Melde dich bei Amazon an und öffne „Konto und Listen“ → „Prime“.",
      "Klicke auf „Mitgliedschaft verwalten“ → „Mitgliedschaft aktualisieren, kündigen und mehr“.",
      "Wähle „Mitgliedschaft beenden“ und bestätige die Abfragen (Amazon fragt mehrfach nach).",
      "Du siehst am Ende, bis wann Prime aktiv bleibt bzw. ob eine Erstattung möglich ist.",
    ],
    onlineUrl: "https://www.amazon.de/mc",
    facts: [
      "Amazon zeigt im Kündigungsdialog mehrere Zwischenschritte — erst nach der letzten Bestätigung ist die Kündigung wirklich aktiv.",
      "Alternativ kannst du „An Mitgliedschaft erinnern“ wählen: Amazon erinnert dich vor der nächsten Verlängerung.",
      "Prime Video als Einzel-Abo kündigst du unter „Konten & Einstellungen“ direkt bei Prime Video.",
    ],
    faq: [
      { q: "Wie kündige ich Amazon Prime?", a: "Im Amazon-Konto unter „Prime“ → „Mitgliedschaft verwalten“ → „Mitgliedschaft beenden“ und alle Abfragen bestätigen." },
      { q: "Bekomme ich Geld zurück?", a: "Wenn du seit der letzten Abbuchung keine Prime-Vorteile genutzt hast, erstattet Amazon den Beitrag in der Regel." },
      { q: "Gibt es eine Kündigungsfrist?", a: "Nein. Prime endet zum Ende des bezahlten Zeitraums — oder sofort mit Erstattung, wenn du es nicht genutzt hast." },
    ],
    sourceNote: "Angaben Stand Juli 2026, Amazon-Hilfe.",
  },

  dazn: {
    slug: "dazn",
    name: "DAZN",
    category: "Streaming",
    countryCode: "DE",
    cancelChannel: "online",
    intro:
      "DAZN kündigst du im Konto auf der Website — Achtung bei Jahresverträgen mit monatlicher Zahlung. Hier ist der genaue Weg.",
    noticePeriod:
      "Flexibles Monatsabo: jederzeit zum Ende des Abrechnungsmonats kündbar. Jahresabo (auch bei monatlicher Zahlung): Kündigung erst zum Ende der 12-monatigen Laufzeit möglich.",
    address: [],
    onlineSteps: [
      "Melde dich auf dazn.com im Browser an (in der TV-App geht es nicht).",
      "Öffne „Mein Konto“ → „Abonnement“.",
      "Klicke auf „Abonnement kündigen“ und bestätige die Abfragen.",
      "Du erhältst eine Bestätigung mit dem Enddatum deines Zugangs.",
    ],
    onlineUrl: "https://www.dazn.com/account",
    facts: [
      "Wichtig: „Monatlich zahlen“ heißt bei DAZN nicht automatisch monatlich kündbar — beim Jahresvertrag bist du 12 Monate gebunden.",
      "Kündige einige Tage vor Ende des Abrechnungszeitraums, damit die Kündigung sicher rechtzeitig greift.",
      "Bei Abschluss über Apple, Google oder Amazon kündigst du direkt dort.",
    ],
    faq: [
      { q: "Wie kündige ich DAZN?", a: "Auf dazn.com anmelden, unter „Mein Konto“ → „Abonnement“ auf „Abonnement kündigen“ klicken und bestätigen." },
      { q: "Ich zahle monatlich — kann ich monatlich kündigen?", a: "Nur beim flexiblen Monatsabo. Beim Jahresvertrag mit monatlicher Zahlung bist du 12 Monate gebunden." },
      { q: "Wann endet mein Zugang?", a: "Beim Monatsabo zum Ende des Abrechnungsmonats, beim Jahresabo zum Ende der 12-Monats-Laufzeit." },
    ],
    sourceNote: "Angaben Stand Juli 2026, DAZN-Hilfe.",
  },

  // ── Telekom & Fitness & Krankenkasse (CH) ─────────────────────────────
  sunrise: {
    slug: "sunrise",
    name: "Sunrise",
    category: "Handyvertrag",
    countryCode: "CH",
    cancelChannel: "online",
    intro:
      "Wichtig zu wissen: Sunrise akzeptiert keine schriftlichen Kündigungen mehr. Gekündigt wird telefonisch oder per Chat — hier ist der genaue Ablauf.",
    noticePeriod:
      "In der Regel 60 Tage Kündigungsfrist auf Ende Monat (nach Ablauf einer allfälligen Mindestlaufzeit). Deine genaue Frist steht im Vertrag bzw. in My Sunrise.",
    address: [],
    onlineSteps: [
      "Rufe die Sunrise-Hotline 0800 100 600 an (kostenlos) oder starte den Chat auf sunrise.ch.",
      "Sage klar, dass du dein Abo kündigen willst — lass dich nicht in ein Rückhalte-Angebot drängen, wenn du sicher bist.",
      "Halte Kundennummer und Vertragsdaten bereit.",
      "Verlange eine schriftliche Kündigungsbestätigung per E-Mail und notiere Datum, Uhrzeit und Namen der Kontaktperson.",
    ],
    onlineUrl: "https://www.sunrise.ch/de/hilfe",
    facts: [
      "Briefe und E-Mails werden von Sunrise als Kündigung nicht akzeptiert — nur Telefon oder Chat zählen.",
      "Gerade deshalb ist Dokumentation wichtig: Bestätigungs-E-Mail verlangen und das Gespräch (Datum/Zeit/Name) festhalten.",
      "Bei Kündigung während der Mindestlaufzeit können Restgebühren anfallen.",
    ],
    faq: [
      { q: "Kann ich Sunrise per Brief kündigen?", a: "Nein. Sunrise akzeptiert schriftliche Kündigungen nicht mehr — kündige telefonisch (0800 100 600) oder per Chat und verlange eine schriftliche Bestätigung." },
      { q: "Welche Kündigungsfrist hat Sunrise?", a: "In der Regel 60 Tage auf Ende Monat, nach Ablauf einer allfälligen Mindestlaufzeit. Details stehen in deinem Vertrag." },
      { q: "Wie sichere ich mich ab?", a: "Verlange im Gespräch/Chat eine Kündigungsbestätigung per E-Mail und notiere Datum, Uhrzeit und den Namen der Kontaktperson." },
    ],
    defaultNoticePeriod: "2 Monate",
    sourceNote: "Angaben Stand Juli 2026, recherchiert. Konditionen können ändern — prüfe deinen Vertrag bzw. My Sunrise.",
  },

  swisscom: {
    slug: "swisscom",
    name: "Swisscom",
    category: "Handyvertrag",
    countryCode: "CH",
    cancelChannel: "beides",
    intro:
      "Swisscom kannst du telefonisch, im Chat oder klassisch per Brief kündigen. Der Brief per Einschreiben ist der Weg mit dem besten Nachweis — hier findest du beides.",
    noticePeriod:
      "Die Frist hängt von deinem Abo ab: Viele Abos sind nach Ablauf der Mindestlaufzeit (oft 12–24 Monate) mit kurzer Frist kündbar. Deine genaue Laufzeit und Frist siehst du in My Swisscom. Massgebend ist das Eingangsdatum der Kündigung.",
    address: ["Swisscom (Schweiz) AG", "Kundenservice", "Alte Tiefenaustrasse 6", "3050 Bern"],
    onlineSteps: [
      "Rufe die Swisscom-Hotline 0800 800 800 an oder starte den Chat auf swisscom.ch.",
      "Halte Kundennummer und Vertragsdaten bereit und nenne den gewünschten Kündigungstermin.",
      "Verlange eine schriftliche Kündigungsbestätigung per E-Mail.",
    ],
    onlineUrl: "https://www.swisscom.ch/de/privatkunden/hilfe.html",
    facts: [
      "Der eingeschriebene Brief an den Kundenservice in Bern ist der sicherste Nachweis für die rechtzeitige Kündigung.",
      "Bei Kündigung während der Mindestlaufzeit können Restgebühren anfallen — Laufzeit vorher in My Swisscom prüfen.",
      "Gib im Schreiben Kundennummer, Rufnummer bzw. Vertragsnummer und den Kündigungstermin an.",
    ],
    faq: [
      { q: "Wie kündige ich mein Swisscom-Abo?", a: "Telefonisch (0800 800 800), per Chat — oder am sichersten per eingeschriebenem Brief an Swisscom (Schweiz) AG, Kundenservice, Alte Tiefenaustrasse 6, 3050 Bern." },
      { q: "Welche Kündigungsfrist gilt?", a: "Das hängt vom Abo ab. Laufzeit und Frist siehst du in My Swisscom; massgebend ist das Eingangsdatum der Kündigung." },
      { q: "Was kostet die Kündigung während der Mindestlaufzeit?", a: "Es können Restgebühren bis zum Ende der Mindestlaufzeit anfallen. Prüfe deine Laufzeit vor der Kündigung." },
    ],
    sourceNote: "Angaben Stand Juli 2026, recherchiert. Konditionen abovariabel — prüfe My Swisscom.",
  },

  "activ-fitness": {
    slug: "activ-fitness",
    name: "Activ Fitness",
    category: "Fitnessstudio",
    countryCode: "CH",
    cancelChannel: "brief",
    intro:
      "Du willst dein Activ-Fitness-Abo kündigen? Hier findest du die Frist, die Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Das Abo ist mit einer Frist von 2 Monaten auf das Ende der Vertragsdauer schriftlich kündbar. Ohne rechtzeitige Kündigung verlängert es sich.",
    address: ["ACTIV FITNESS / movemi AG", "z.H. Kundenservice", "Thurgauerstrasse 32", "8050 Zürich"],
    facts: [
      "Kündige schriftlich per Brief — ein Einschreiben ist der sicherste Nachweis für die rechtzeitige Zustellung.",
      "Massgebend ist der Zugang bei Activ Fitness, nicht der Poststempel.",
      "Gib Mitgliedernummer und dein Studio an, damit die Kündigung zugeordnet werden kann.",
    ],
    faq: [
      { q: "Welche Kündigungsfrist hat Activ Fitness?", a: "2 Monate auf das Ende der Vertragsdauer. Das genaue Vertragsende steht in deinen Unterlagen." },
      { q: "Wohin schicke ich die Activ-Fitness-Kündigung?", a: "An ACTIV FITNESS / movemi AG, z.H. Kundenservice, Thurgauerstrasse 32, 8050 Zürich — am besten per Einschreiben." },
      { q: "Muss die Kündigung schriftlich sein?", a: "Ja. Ein eingeschriebener Brief dokumentiert den Zugang nachweisbar." },
    ],
    defaultNoticePeriod: "2 Monate",
    sourceNote: "Angaben Stand Juli 2026, recherchiert. Dein genaues Vertragsende steht in deinen Unterlagen.",
  },

  helsana: {
    slug: "helsana",
    name: "Helsana",
    category: "Versicherung",
    countryCode: "CH",
    cancelChannel: "brief",
    intro:
      "Du willst deine Helsana-Krankenversicherung kündigen? Hier findest du Stichtag, Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Grundversicherung: Die Kündigung muss bis spätestens 30. November bei Helsana eintreffen, damit du per 1. Januar wechseln kannst. Zusatzversicherungen haben meist längere Fristen (oft 3 Monate auf Jahresende) — prüfe deine Police.",
    address: ["Helsana Versicherungen AG", "IDPH Kündigungen D-CH", "Postfach", "8081 Zürich"],
    facts: [
      "Massgebend ist der Eingang bei Helsana, nicht der Poststempel — sende die Kündigung deutlich vor dem 30. November per Einschreiben.",
      "Alternativ akzeptiert Helsana Kündigungen per E-Mail an cancellation@helsana.ch — verlange eine Bestätigung.",
      "Die Grundversicherung darf erst enden, wenn der neue Versicherer die Aufnahme bestätigt hat — schliesse die neue Versicherung vorher ab.",
    ],
    faq: [
      { q: "Bis wann muss ich die Helsana-Grundversicherung kündigen?", a: "Die Kündigung muss bis 30. November bei Helsana eintreffen (Wechsel per 1. Januar). Der Poststempel zählt nicht." },
      { q: "Wohin schicke ich die Helsana-Kündigung?", a: "An Helsana Versicherungen AG, IDPH Kündigungen D-CH, Postfach, 8081 Zürich — oder per E-Mail an cancellation@helsana.ch." },
      { q: "Gilt der Stichtag auch für Zusatzversicherungen?", a: "Nein, Zusatzversicherungen haben eigene, meist längere Fristen (oft 3 Monate auf Jahresende). Prüfe deine Police." },
    ],
    sourceNote: "Angaben Stand Juli 2026, recherchiert. Fristen der Zusatzversicherungen stehen in deiner Police.",
  },

  css: {
    slug: "css",
    name: "CSS",
    category: "Versicherung",
    countryCode: "CH",
    cancelChannel: "brief",
    intro:
      "Du willst deine CSS-Krankenversicherung kündigen? Hier findest du Stichtag, Adresse und wie du in wenigen Minuten ein korrektes Kündigungsschreiben erstellst.",
    noticePeriod:
      "Grundversicherung: Die Kündigung muss bis spätestens 30. November bei der CSS eintreffen, damit du per 1. Januar wechseln kannst. Zusatzversicherungen haben meist 3 Monate Frist auf Jahresende — prüfe deine Police.",
    address: ["CSS Versicherung", "Kundenbetreuung", "Postfach 2550", "6002 Luzern"],
    facts: [
      "Massgebend ist der Eingang bei der CSS, nicht der Poststempel — sende die Kündigung deutlich vor dem 30. November per Einschreiben.",
      "Gib Versichertennummer und die zu kündigende Versicherung (Grund- bzw. Zusatzversicherung) klar an.",
      "Die Grundversicherung endet erst, wenn der neue Versicherer die Aufnahme bestätigt hat — schliesse die neue Versicherung vorher ab.",
    ],
    faq: [
      { q: "Bis wann muss ich die CSS-Grundversicherung kündigen?", a: "Die Kündigung muss bis 30. November bei der CSS eintreffen (Wechsel per 1. Januar). Der Poststempel zählt nicht." },
      { q: "Wohin schicke ich die CSS-Kündigung?", a: "An CSS Versicherung, Kundenbetreuung, Postfach 2550, 6002 Luzern — am besten per Einschreiben." },
      { q: "Welche Frist gilt für Zusatzversicherungen?", a: "Meist 3 Monate auf Jahresende — die genaue Frist steht in deiner Police." },
    ],
    sourceNote: "Angaben Stand Juli 2026, recherchiert. Fristen der Zusatzversicherungen stehen in deiner Police.",
  },
};

export const allBrandSlugs: string[] = Object.keys(brands);

export function getBrand(slug: string): Brand | undefined {
  return brands[slug];
}
