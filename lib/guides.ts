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
    slug: "como-hacer-un-curriculum",
    title: "Cómo hacer un currículum profesional",
    desc: "Qué incluir, cómo ordenarlo y los errores que más restan.",
    category: "Currículum",
  },
  {
    locale: "es",
    slug: "plantillas-de-curriculum",
    title: "Plantillas de currículum",
    desc: "Cómo elegir y rellenar la plantilla adecuada para tu perfil.",
    category: "Currículum",
  },
  {
    locale: "es",
    slug: "carta-de-presentacion",
    title: "Cómo escribir una carta de presentación",
    desc: "Estructura en cuatro párrafos y cómo adaptarla a cada oferta.",
    category: "Carta de presentación",
  },
  {
    locale: "es",
    slug: "ejemplos-carta-de-presentacion",
    title: "Ejemplos de carta de presentación",
    desc: "Modelos con experiencia, sin experiencia y cambio de sector.",
    category: "Carta de presentación",
  },
  {
    locale: "es",
    slug: "carta-de-renuncia-voluntaria",
    title: "Carta de renuncia voluntaria",
    desc: "Qué incluir, cuánto preaviso dar y cómo dejar constancia.",
    category: "Renuncia laboral",
  },
  {
    locale: "es",
    slug: "carta-de-renuncia",
    title: "Cómo escribir una carta de renuncia",
    desc: "En inglés para tu empleador en EE. UU., o en español.",
    category: "Renuncia laboral",
  },
  {
    locale: "es",
    slug: "cancelar-seguro",
    title: "Cancelar un seguro en España",
    desc: "Plazo de preaviso, cómo comunicarlo por escrito y excepciones.",
    category: "Seguros",
  },
  {
    locale: "es",
    slug: "recurrir-una-multa",
    title: "Cómo recurrir una multa de tráfico",
    desc: "Plazos de 20 días y un mes, ante quién y el descuento del 50%.",
    category: "Multas y recursos",
  },
  {
    locale: "es",
    slug: "carta-de-reclamacion",
    title: "Cómo reclamar a una empresa",
    desc: "Hoja de reclamaciones, carta por burofax y arbitraje de consumo.",
    category: "Reclamaciones",
  },
  {
    locale: "es",
    slug: "derecho-de-desistimiento",
    title: "Derecho de desistimiento: 14 días",
    desc: "Desistir de una compra online: plazo, formulario y devolución.",
    category: "Desistimiento",
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
