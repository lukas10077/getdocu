// Zentrale Liste aller Ratgeber-Seiten (für die Übersichtsseite /[locale]/ratgeber,
// interne Verlinkung und Sitemap). Neue Ratgeber-Seite: hier eintragen.

export interface GuideLink {
  locale: string;   // Sprache/Locale der Seite
  slug: string;     // Pfad nach /ratgeber/
  title: string;    // Anzeigetitel in der Übersicht
  desc: string;     // kurze Beschreibung
  category: string; // Gruppierung in der Übersicht
}

export const guides: GuideLink[] = [
  {
    locale: "de",
    slug: "ausserterminliche-kuendigung",
    title: "Ausserterminliche Kündigung mit Nachmieter",
    desc: "Vorzeitig aus dem Mietvertrag – mit einem zumutbaren Nachmieter.",
    category: "Wohnung & Miete",
  },
  {
    locale: "de",
    slug: "fristlose-kuendigung-wohnung",
    title: "Fristlose Kündigung aus wichtigem Grund",
    desc: "Wegen Schimmel, Mängeln oder unbewohnbarer Wohnung raus.",
    category: "Wohnung & Miete",
  },
  {
    locale: "en",
    slug: "resign-immediately",
    title: "How to Resign Immediately (No Notice)",
    desc: "Quit fast — due to stress, a toxic workplace, or health.",
    category: "Work & Career",
  },
  {
    locale: "en",
    slug: "resignation-email",
    title: "Resignation Email — Template & Examples",
    desc: "How to write a short, professional resignation email.",
    category: "Work & Career",
  },
  {
    locale: "es",
    slug: "carta-de-renuncia",
    title: "Cómo escribir una carta de renuncia",
    desc: "En inglés para tu empleador en EE. UU., o en español.",
    category: "Trabajo",
  },
];

// Locales, für die eine Ratgeber-Übersicht existiert (Footer-Link + Overview-Seite).
export const ratgeberLocales = ["de", "en", "es"];

export const ratgeberLabel: Record<string, string> = {
  de: "Ratgeber",
  en: "Guides",
  es: "Guías",
};

export function guidesForLocale(locale: string): GuideLink[] {
  return guides.filter((g) => g.locale === locale);
}
