// Kategorie-Hub-Seiten ("Hub-and-Spoke"): eine Überblicksseite pro Kategorie,
// die den generischen Suchbegriff (z.B. "Handyvertrag kündigen") abfängt und auf
// alle Marken der Kategorie verlinkt. Die Marken-Daten kommen aus lib/brands.ts.
//
// Neue Kategorie: hier einen Eintrag ergänzen — die Seite unter
// /de/ratgeber/kuendigen/<slug> entsteht automatisch, ebenso der Sitemap-Eintrag.
// WICHTIG: `category` muss exakt der Brand.category der zugehörigen Marken entsprechen.

import { brands, Brand } from "./brands";

export interface HubSection {
  heading: string;
  body: string;
}

export interface CategoryHub {
  slug: string;       // URL-Segment, z.B. "handyvertrag"
  category: string;   // muss Brand.category exakt entsprechen
  title: string;      // H1 / Betreff, z.B. "Handyvertrag kündigen"
  lead: string;       // Einleitung
  sections: HubSection[];
  faq: { q: string; a: string }[];
  toolSlug: string;   // Ziel des CTA-Buttons
}

export const categoryHubs: Record<string, CategoryHub> = {
  handyvertrag: {
    slug: "handyvertrag",
    category: "Handyvertrag",
    title: "Handyvertrag kündigen",
    lead:
      "Du willst deinen Handy- oder Internetvertrag kündigen? Hier erfährst du, welche Fristen gelten und worauf du beim Kündigungsschreiben achten musst — und du findest die Kündigungsadresse deines Anbieters direkt verlinkt.",
    sections: [
      {
        heading: "Kündigungsfrist bei Handyverträgen",
        body:
          "Bei Verträgen ab Dezember 2021 ist der Vertrag nach Ablauf der Mindestlaufzeit monatlich mit einer Frist von einem Monat kündbar. Ältere Verträge haben oft 3 Monate Frist. Prepaid-Tarife sind meist jederzeit ohne Frist kündbar. Deine genaue Frist steht in deinem Vertrag bzw. Kundenkonto.",
      },
      {
        heading: "So kündigst du richtig",
        body:
          "Kündige schriftlich per Brief (Einschreiben empfohlen) oder — sofern dein Anbieter das anbietet — per E-Mail oder Online-Formular. Gib deine Rufnummer und Kundennummer an und bitte um eine schriftliche Bestätigung. Massgebend ist der Zugang beim Anbieter, nicht der Poststempel — sende die Kündigung deshalb rechtzeitig.",
      },
      {
        heading: "Sonderkündigungsrecht",
        body:
          "Bei einer Preiserhöhung oder bei einem Umzug, an dem der Anbieter die Leistung nicht erbringen kann, besteht oft ein ausserordentliches Kündigungsrecht mit kürzerer Frist.",
      },
    ],
    faq: [
      { q: "Wie lange ist die Kündigungsfrist bei Handyverträgen?", a: "Nach der Mindestlaufzeit meist 1 Monat (Verträge ab Dezember 2021), bei älteren Verträgen oft 3 Monate." },
      { q: "Muss ich schriftlich kündigen?", a: "Ein schriftliches Kündigungsschreiben ist der sicherste Weg. Viele Anbieter akzeptieren zusätzlich E-Mail oder eine Online-Kündigung." },
      { q: "Kann ich bei einer Preiserhöhung sofort kündigen?", a: "Ja, bei einer Preiserhöhung besteht in der Regel ein Sonderkündigungsrecht mit kürzerer Frist." },
    ],
    toolSlug: "kuendigung",
  },

  versicherung: {
    slug: "versicherung",
    category: "Versicherung",
    title: "Versicherung kündigen",
    lead:
      "Du willst eine Versicherung kündigen — Kfz, Hausrat, Haftpflicht oder eine andere Police? Hier erfährst du, welche Fristen gelten und wie du korrekt kündigst — und findest die Kündigungsadresse deines Versicherers direkt verlinkt.",
    sections: [
      {
        heading: "Kündigungsfrist bei Versicherungen",
        body:
          "Bei der Kfz-Versicherung gilt meist 1 Monat Frist zum Ende des Versicherungsjahres (häufig der 30. November). Andere Sparten wie Hausrat oder Haftpflicht haben oft 3 Monate Frist vor Ablauf der Vertragslaufzeit. Die für dich gültige Frist steht in deiner Police.",
      },
      {
        heading: "So kündigst du richtig",
        body:
          "Kündige schriftlich per Brief (Einschreiben empfohlen); viele Versicherer akzeptieren auch Textform per E-Mail oder Fax. Gib unbedingt deine Versicherungsscheinnummer und die genaue Versicherungsart an. Massgebend ist der Zugang beim Versicherer, nicht der Poststempel.",
      },
      {
        heading: "Sonderkündigungsrecht",
        body:
          "Nach einer Beitragserhöhung oder einem Schadenfall besteht in der Regel ein Sonderkündigungsrecht — dann musst du die reguläre Frist nicht abwarten.",
      },
    ],
    faq: [
      { q: "Welche Kündigungsfrist gilt bei Versicherungen?", a: "Kfz meist 1 Monat zum Ende des Versicherungsjahres, andere Sparten oft 3 Monate vor Ablauf. Die genaue Frist steht in deiner Police." },
      { q: "Kann ich nach einer Beitragserhöhung kündigen?", a: "Ja, nach einer Beitragserhöhung oder einem Schadenfall besteht in der Regel ein Sonderkündigungsrecht." },
      { q: "In welcher Form muss ich kündigen?", a: "Schriftlich per Brief ist am sichersten; viele Versicherer akzeptieren auch die Textform per E-Mail oder Fax. Versicherungsscheinnummer angeben." },
    ],
    toolSlug: "kuendigung",
  },

  fitnessstudio: {
    slug: "fitnessstudio",
    category: "Fitnessstudio",
    title: "Fitnessstudio kündigen",
    lead:
      "Du willst dein Fitnessstudio-Abo kündigen? Hier erfährst du, welche Fristen gelten und worauf du beim Kündigungsschreiben achten musst — und findest die Kündigungsadresse deines Studios direkt verlinkt.",
    sections: [
      {
        heading: "Kündigungsfrist bei Fitnessstudios",
        body:
          "In Deutschland sind Verträge ab März 2022 nach der Erstlaufzeit mit einem Monat Frist kündbar; ältere Verträge haben oft 3 Monate. In der Schweiz gelten häufig 2 Monate zum Ende der Vertragsdauer. Die Mindestlaufzeit beträgt meist 12 Monate — dein genaues Vertragsende steht in deinen Unterlagen.",
      },
      {
        heading: "So kündigst du richtig",
        body:
          "Kündige schriftlich in Textform (Brief oder E-Mail), am sichersten per Einschreiben mit Rückschein. Bei Franchise-Studios ist wichtig: Vertragspartner ist oft dein lokales Studio, nicht die Zentrale. Massgebend ist der Zugang, nicht der Poststempel.",
      },
      {
        heading: "Sonderkündigungsrecht",
        body:
          "Bei einem Umzug an einen Ort ohne Studio des Anbieters oder bei dauerhafter Trainingsunfähigkeit (ärztliches Attest) besteht oft ein ausserordentliches Kündigungsrecht.",
      },
    ],
    faq: [
      { q: "Wie lange ist die Kündigungsfrist im Fitnessstudio?", a: "DE: nach der Erstlaufzeit 1 Monat (Verträge ab März 2022), ältere oft 3 Monate. CH: häufig 2 Monate zum Vertragsende." },
      { q: "An wen schicke ich die Kündigung bei einem Franchise-Studio?", a: "An dein lokales Vertragsstudio — nicht an die Zentrale. Die Adresse steht in deinem Vertrag oder im Impressum der Studio-Website." },
      { q: "Kann ich bei einem Umzug vorzeitig kündigen?", a: "Bei einem Umzug an einen Ort ohne Studio des Anbieters oder bei ärztlich bescheinigter Trainingsunfähigkeit besteht oft ein Sonderkündigungsrecht." },
    ],
    toolSlug: "kuendigung",
  },
};

export const allCategoryHubSlugs: string[] = Object.keys(categoryHubs);

export function getCategoryHub(slug: string): CategoryHub | undefined {
  return categoryHubs[slug];
}

// Alle Marken einer Kategorie (für die Verlinkung Hub → Spokes).
export function brandsForCategory(category: string): Brand[] {
  return Object.values(brands).filter((b) => b.category === category);
}

// Passender Hub zu einer Marken-Kategorie (für die Verlinkung Spoke → Hub).
export function hubForCategory(category: string): CategoryHub | undefined {
  return Object.values(categoryHubs).find((h) => h.category === category);
}
