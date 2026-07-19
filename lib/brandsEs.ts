// Datenbasis für spanischsprachige Anbieter-/Kündigungsseiten ("dar de baja").
// Bewusst vom deutschen `lib/brands.ts` getrennt.
//
// LEITLINIE (wichtig): Hier nur Firmen aufnehmen, bei denen eine schriftliche Kündigung
// tatsächlich der verlangte/vorgeschriebene Weg ist (echter Dokument-Bedarf). Anbieter, die
// online/telefonisch/per App gekündigt werden (Telcos ES/LatAm, Streaming), gehören NICHT
// hierher — dort ist ein Kündigungsdokument überflüssig und würde Vertrauen kosten.
//
// WICHTIG: Kanäle, Fristen und Bedingungen pro Marke recherchieren und den Stand im
// sourceNote festhalten. Nichts erfinden — falsche Angaben schaden Vertrauen und Ranking.
// Neue Marke: hier einen Eintrag ergänzen — die Seite unter
// /es/ratgeber/dar-de-baja/<slug> entsteht automatisch (sitemap zieht die Slugs automatisch).

export interface BrandEs {
  slug: string;
  name: string;
  category: string;        // z.B. "Gimnasios"
  countryCode: string;     // "ES" | "MX" | "CO" | "AR" — steuert die Länder-Voreinstellung im Tool
  countryName: string;     // Anzeigename des Landes ("España", ...)
  intro: string;           // 1–2 Sätze Einstieg
  cancelMethods: string[]; // Wie man kündigt (Schriftform/Burofax, tienda, email …)
  facts: string[];         // Kernfakten (permanencia, preaviso, plazos …)
  faq: { q: string; a: string }[];
  sourceNote: string;      // Stand / Verifizierungshinweis
  global?: boolean;        // reserviert; aktuell ungenutzt
}

export const brandsEs: Record<string, BrandEs> = {
  // ── Gimnasios (España) ────────────────────────────────────────────────
  // Echter Dokument-Fall: Kündigung per Burofax/carta certificada mit 30 Tagen Frist.
  mcfit: {
    slug: "mcfit",
    name: "McFit",
    category: "Gimnasios",
    countryCode: "ES",
    countryName: "España",
    intro:
      "¿Vas a darte de baja de McFit? Aquí tienes cómo comunicar la baja, el preaviso y cómo generar una carta de baja formal en minutos, lista para enviar por burofax o correo.",
    cancelMethods: [
      "Por escrito con 30 días de preaviso: burofax o carta certificada al centro, correo a C/ Fuencarral 6, 3ª planta, 28004 Madrid, fax al 91 182 90 01 o email a atencioncliente@mcfit.com.",
      "También puedes acudir a tu gimnasio y comunicar la baja al personal (te pedirán un formulario o carta).",
    ],
    facts: [
      "Indica tu nombre y apellidos, tu número de socio y que solicitas la BAJA DEFINITIVA del contrato.",
      "El preaviso es de 30 días y aplica tanto a contratos de duración determinada como indefinida.",
      "Tienes 14 días naturales desde la firma para desistir del contrato.",
      "Un burofax o carta certificada con acuse de recibo es la forma más segura de dejar constancia de tu baja.",
    ],
    faq: [
      {
        q: "¿Cómo me doy de baja de McFit?",
        a: "Por escrito con 30 días de preaviso: burofax o carta certificada al centro, email a atencioncliente@mcfit.com, fax al 91 182 90 01, o en tu gimnasio. Indica tu número de socio y que pides la baja definitiva.",
      },
      {
        q: "¿Cuánto preaviso pide McFit?",
        a: "30 días, tanto para contratos de duración determinada como indefinida.",
      },
      {
        q: "¿Por qué enviar un burofax?",
        a: "Porque deja constancia legal de la fecha en que solicitaste la baja: es tu prueba si siguen cobrándote.",
      },
    ],
    sourceNote:
      "Datos verificados en la ayuda oficial de McFit, julio 2026. Las condiciones pueden cambiar; confirma en tu contrato y en la web oficial antes de tramitar.",
  },
};

export const allBrandEsSlugs = Object.keys(brandsEs);

export function getBrandEs(slug: string): BrandEs | undefined {
  return brandsEs[slug];
}
