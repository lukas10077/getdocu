// Länderspezifische Dokument-STANDARDS (Struktur, Konventionen, Kultur).
// Ergänzen die Gesetzesreferenzen aus legalRefs.ts: Dort steht WAS zitiert
// werden darf, hier steht WIE das Dokument im jeweiligen Land aufgebaut ist.
// Wird in den Claude-System-Prompt injiziert (generate + preview).

import { ToolSlug } from "./tools";

type CountryStandards = Partial<Record<ToolSlug, string>>;

// ── Wiederverwendbare Bausteine ─────────────────────────────────────

const ZEUGNIS_DACH =
  "Vollständiges qualifiziertes Arbeitszeugnis mit Pflichtstruktur: Einleitung (Personalien, Funktion, Dauer), " +
  "Aufgabenbeschreibung, Leistungsbeurteilung, Verhaltensbeurteilung, Schlussformel mit Dank und guten Wünschen. " +
  "Grundsatz: wohlwollend, aber wahr. Verwende die übliche positive Zeugnissprache " +
  "(z.B. 'stets zu unserer vollsten Zufriedenheit' = sehr gut) und vermeide jede versteckte Negativ-Codierung.";

const ZEUGNIS_FACTUAL_EN =
  "In diesem Land ist aus Haftungsgründen eine sachliche 'factual reference' üblich: Bestätigung von " +
  "Anstellungsdauer und Funktion, optional ein kurzer positiver Schlusssatz. KEINE ausführliche " +
  "Leistungs- oder Verhaltensbeurteilung nach DACH-Muster.";

const CV_DACH =
  "Tabellarisch, rückwärts chronologisch, 1–2 Seiten. Foto und Geburtsdatum sind üblich (nur verwenden, " +
  "wenn vom Nutzer angegeben). Rubriken: Persönliche Daten, Berufserfahrung, Ausbildung, Sprachen, Kenntnisse.";

const CV_NO_PHOTO_EN =
  "KEIN Foto, KEIN Geburtsdatum/Alter, KEIN Familienstand, KEINE Nationalität (Antidiskriminierung). " +
  "Fokus auf Erfahrung, Verantwortung und konkrete Erfolge.";

const ZEUGNIS_CERTIFICADO_LATAM =
  "Üblich ist ein sachliches 'certificado de trabajo' (bzw. 'constancia laboral'): Bestätigung von " +
  "Anstellungsdauer und Funktion, optional ein kurzer positiver Schlusssatz. KEINE ausführliche " +
  "Leistungs- oder Verhaltensbeurteilung nach DACH-Muster.";

const CV_LATAM =
  "CV nach lateinamerikanischer Konvention: Foto und persönliche Angaben sind üblich (nur verwenden, " +
  "wenn vom Nutzer angegeben). 1–2 Seiten, rückwärts chronologisch.";

// ── Standards pro Land ──────────────────────────────────────────────

const STANDARDS: Record<string, CountryStandards> = {
  CH: {
    arbeitszeugnis: ZEUGNIS_DACH,
    lebenslauf: CV_DACH,
    "kuendigung-wohnung":
      "Versand per Einschreiben ist Standard — erwähne im Brief, dass die Kündigung eingeschrieben erfolgt. " +
      "Bei einer Familienwohnung müssen beide Ehegatten/Partner unterschreiben: Wenn erkennbar zwei Personen betroffen sind, sieh zwei Unterschriftszeilen vor.",
    "kuendigung-arbeit":
      "Kündigung üblicherweise auf ein Monatsende. Höflicher, professioneller Ton; Dank für die Zusammenarbeit und Bitte um Arbeitszeugnis gehören zum Standard.",
    reklamation:
      "Sachlich-bestimmter Ton. Verweis auf die zweijährige Gewährleistung ist üblich; zuerst Nachbesserung/Ersatz verlangen, mit klarer Frist.",
    widerruf:
      "WICHTIG: In der Schweiz gibt es KEIN allgemeines gesetzliches Widerrufsrecht für Online-Käufe. " +
      "Behaupte deshalb NIE ein gesetzliches Widerrufsrecht. Stütze den Widerruf auf das vertragliche " +
      "Rückgaberecht bzw. die Rückgabebedingungen des Anbieters (Formulierung z.B. 'gestützt auf Ihre " +
      "Rückgabebedingungen'). Formuliere als höfliches, bestimmtes Rückabwicklungs-Begehren.",
    widerspruch:
      "In der Schweiz heisst der Rechtsbehelf gegen Verfügungen in der Regel 'Einsprache'. Verwende " +
      "durchgehend die Begriffe 'Einsprache' und 'Verfügung' statt 'Widerspruch' und 'Bescheid' — " +
      "auch im Betreff.",
  },
  DE: {
    arbeitszeugnis: ZEUGNIS_DACH,
    lebenslauf: CV_DACH,
    "kuendigung-wohnung":
      "Schriftform ist zwingend, eigenhändige Unterschrift erforderlich. Alle Mieter, die im Vertrag stehen, müssen unterschreiben. Bitte um schriftliche Kündigungsbestätigung ist üblich.",
    "kuendigung-arbeit":
      "Kündigung üblicherweise zum 15. oder zum Monatsende. Höflicher Ton, Dank und Bitte um qualifiziertes Arbeitszeugnis sind Standard.",
    reklamation:
      "Zuerst Nacherfüllung (Reparatur oder Ersatzlieferung) mit angemessener Frist verlangen — erst danach Rücktritt oder Minderung. Diese Reihenfolge im Brief einhalten.",
    widerruf:
      "Bei Fernabsatzverträgen ist das 14-tägige Widerrufsrecht Standard; Textform genügt. " +
      "Bitte um Erstattung aller Zahlungen einschliesslich der Standard-Lieferkosten auf das " +
      "ursprüngliche Zahlungsmittel.",
    widerspruch:
      "Der Widerspruch wird an die Behörde gerichtet, die den Bescheid erlassen hat. " +
      "Übliche Formulierung: 'lege ich hiermit fristwahrend Widerspruch ein'.",
  },
  AT: {
    arbeitszeugnis: ZEUGNIS_DACH,
    lebenslauf: CV_DACH,
    "kuendigung-wohnung":
      "Schriftliche Aufkündigung, oft an gesetzliche Kündigungstermine gebunden. Eingeschriebener Versand üblich.",
    "kuendigung-arbeit":
      "Angestellte kündigen üblicherweise zum Monatsletzten. Höflicher Ton, Bitte um Dienstzeugnis üblich.",
    reklamation:
      "Gewährleistung: zuerst Verbesserung oder Austausch verlangen, mit angemessener Frist.",
    widerruf:
      "Bei Fernabsatzverträgen ist das 14-tägige Rücktrittsrecht Standard — verwende die in Österreich " +
      "übliche Terminologie 'Rücktritt' ('trete ich vom Vertrag zurück') statt 'Widerruf'.",
    widerspruch:
      "In Österreich heisst der Rechtsbehelf gegen Bescheide in der Regel 'Beschwerde'. Verwende die " +
      "Begriffe 'Beschwerde' und 'Bescheid' — auch im Betreff (z.B. 'Beschwerde gegen den Bescheid vom …').",
  },
  FR: {
    arbeitszeugnis:
      "In Frankreich gibt es KEIN qualifiziertes Arbeitszeugnis. Erstelle ein 'certificat de travail': " +
      "Identität von Arbeitgeber und Arbeitnehmer, Eintritts- und Austrittsdatum, ausgeübte Funktion(en). " +
      "KEINE Leistungs- oder Verhaltensbeurteilung — sie ist in Frankreich nicht vorgesehen. Kurz, sachlich, formell.",
    lebenslauf:
      "1 Seite bevorzugt. " + CV_NO_PHOTO_EN + " Übliche Rubriken: Expérience professionnelle, Formation, Compétences, Langues.",
    jobbewerbung:
      "Die 'lettre de motivation' folgt klassisch dem Aufbau vous–moi–nous: zuerst das Unternehmen/die Stelle, dann die eigenen Stärken, dann der gemeinsame Nutzen. Formeller Ton mit klassischer Schlussformel.",
    "kuendigung-wohnung":
      "Versand per 'lettre recommandée avec accusé de réception' ist Standard — im Brief erwähnen.",
    "kuendigung-arbeit":
      "Démission formlos möglich, aber eingeschriebener Brief ist die Norm. Préavis richtet sich nach der Convention collective — nur die vom Nutzer angegebene Frist nennen.",
    reklamation:
      "Auf die 'garantie légale de conformité' verweisen; zuerst Reparatur oder Ersatz verlangen.",
  },
  IT: {
    arbeitszeugnis:
      "In Italien ist nur ein 'certificato di lavoro' üblich: Bestätigung von Beschäftigungsdauer und Funktion. " +
      "KEINE Leistungsbeurteilung nach DACH-Muster. Kurz und sachlich.",
    lebenslauf:
      "Europass-nahes Format ist verbreitet; Foto üblich, persönliche Angaben ausführlicher möglich. " +
      "Am Ende ist die Einwilligung zur Datenverarbeitung üblich: 'Autorizzo il trattamento dei miei dati personali ai sensi del GDPR (Reg. UE 2016/679).'",
    "kuendigung-wohnung":
      "Versand per 'raccomandata A/R' ist Standard — im Brief erwähnen. Fristen richten sich nach dem Vertrag (oft 6 Monate).",
    "kuendigung-arbeit":
      "Frist richtet sich nach dem anwendbaren CCNL (Branchentarifvertrag) — nur die vom Nutzer angegebene Frist nennen.",
    reklamation:
      "Auf die 'garanzia legale di conformità' verweisen; zuerst Reparatur oder Ersatz verlangen.",
  },
  ES: {
    lebenslauf: "Foto und persönliche Angaben sind üblich. 1–2 Seiten, rückwärts chronologisch.",
    "kuendigung-wohnung": "Schriftliche Mitteilung mit mindestens 30 Tagen Vorlauf ist üblich.",
    "kuendigung-arbeit": "Übliches Preaviso: 15 Tage (bzw. laut Convenio) — nur die vom Nutzer angegebene Frist nennen.",
  },

  // ── Lateinamerika ───────────────────────────────────────────────────

  AR: {
    arbeitszeugnis: ZEUGNIS_CERTIFICADO_LATAM,
    lebenslauf: CV_LATAM,
    "kuendigung-wohnung":
      "Formelle Kündigungen werden in Argentinien üblicherweise per 'carta documento' zugestellt — erwähne im Brief, dass die Mitteilung per carta documento erfolgt.",
    "kuendigung-arbeit":
      "Die 'carta de renuncia' ist kurz und formell; Versand per carta documento ist üblich. Preaviso nur nennen, wenn vom Nutzer angegeben.",
    reklamation:
      "Sachlich-bestimmter Ton. Auf die garantía legal verweisen; zuerst Reparatur oder Ersatz mit klarer Frist verlangen.",
  },
  MX: {
    arbeitszeugnis: ZEUGNIS_CERTIFICADO_LATAM,
    lebenslauf: CV_LATAM,
    "kuendigung-wohnung":
      "Schriftliche Mitteilung mit Empfangsbestätigung ('acuse de recibo') ist üblich; Frist laut Vertrag — nur die vom Nutzer angegebene Frist nennen.",
    "kuendigung-arbeit":
      "Die 'renuncia voluntaria' erfolgt schriftlich mit Datum und höflichem Dank; eine Kopie mit acuse de recibo behalten — im Brief um Empfangsbestätigung bitten.",
    reklamation:
      "Sachlich-bestimmter Ton; auf die Garantie verweisen. Zuerst Reparatur, Ersatz oder Erstattung mit klarer Frist verlangen.",
  },
  CO: {
    arbeitszeugnis: ZEUGNIS_CERTIFICADO_LATAM,
    lebenslauf:
      "Die 'hoja de vida' ist der Standard: Foto und persönliche Angaben üblich, 1–2 Seiten, rückwärts chronologisch.",
    "kuendigung-wohnung":
      "Schriftliche Mitteilung per Einschreiben ('correo certificado') ist üblich — im Brief um schriftliche Bestätigung bitten.",
    "kuendigung-arbeit":
      "Die 'carta de renuncia' ist kurz und formell mit Dank; Preaviso nur nennen, wenn vom Nutzer angegeben.",
    reklamation:
      "Sachlich-bestimmter Ton; auf die garantía legal verweisen; zuerst Reparatur oder Ersatz mit klarer Frist verlangen.",
  },
  CL: {
    arbeitszeugnis: ZEUGNIS_CERTIFICADO_LATAM,
    lebenslauf: CV_LATAM,
    "kuendigung-wohnung":
      "Formelle Kündigungen werden in Chile üblicherweise per 'carta certificada' zugestellt — im Brief erwähnen und um Bestätigung bitten.",
    "kuendigung-arbeit":
      "Die 'carta de renuncia' ist kurz und formell; üblich ist ein Aviso von 30 Tagen — nur die vom Nutzer angegebene Frist nennen.",
    reklamation:
      "Sachlich-bestimmter Ton; auf die garantía legal verweisen; zuerst Reparatur, Ersatz oder Erstattung verlangen.",
  },
  PE: {
    arbeitszeugnis: ZEUGNIS_CERTIFICADO_LATAM,
    lebenslauf: CV_LATAM,
    "kuendigung-wohnung":
      "Formelle Kündigungen werden in Peru üblicherweise per 'carta notarial' zugestellt — erwähne im Brief, dass die Mitteilung per carta notarial erfolgt.",
    "kuendigung-arbeit":
      "Die 'carta de renuncia' ist kurz und formell; üblich ist ein Aviso von 30 Tagen — nur die vom Nutzer angegebene Frist nennen. Zustellung per carta notarial ist verbreitet.",
    reklamation:
      "Sachlich-bestimmter Ton; auf die Rechte aus dem Konsumentenschutz verweisen ('Libro de Reclamaciones' ist bekanntes Druckmittel); zuerst Reparatur, Ersatz oder Erstattung verlangen.",
  },
  NL: {
    arbeitszeugnis:
      "Das 'getuigschrift' ähnelt dem DACH-Zeugnis, ist aber direkter und ohne Codierungssprache: " +
      "klare, ehrliche Aussagen zu Aufgaben und Leistung, ohne Floskel-Codes.",
    lebenslauf: "Kein Foto nötig, kurz und direkt, 1–2 Seiten. Persönliche Angaben minimal.",
    "kuendigung-wohnung": "Schriftlich, übliche Frist 1 Monat (Kündigung des Mieters).",
  },
  GB: {
    arbeitszeugnis: ZEUGNIS_FACTUAL_EN,
    lebenslauf: "CV, maximal 2 Seiten. " + CV_NO_PHOTO_EN,
    "kuendigung-wohnung":
      "Schriftliches 'notice to quit'. Seit dem Renters' Rights Act 2025 gilt für Mieter mindestens 2 Monate Frist (kürzer nur, wenn der Vertrag es erlaubt), endend auf das Ende einer Mietperiode. Nenne im Brief nur die vom Nutzer angegebene Frist. Klarer, knapper Stil.",
    "kuendigung-arbeit": "Kurzes, professionelles 'resignation letter'. Gesetzliches Minimum 1 Woche, vertraglich oft mehr — nur die vom Nutzer angegebene Frist nennen.",
    reklamation: "Auf den Consumer Rights Act 2015 verweisen: innert 30 Tagen volle Rückerstattung möglich, danach Reparatur/Ersatz.",
  },
  IE: {
    arbeitszeugnis: ZEUGNIS_FACTUAL_EN,
    lebenslauf: "CV, maximal 2 Seiten. " + CV_NO_PHOTO_EN,
  },
  US: {
    arbeitszeugnis:
      "In den USA gibt es kein standardisiertes Arbeitszeugnis. Erstelle einen 'letter of recommendation': " +
      "persönlich und narrativ aus Sicht des Vorgesetzten, konkrete Leistungen und Stärken, warmherziger professioneller Ton, kein starres Format.",
    lebenslauf:
      "Resume: 1 Seite (bei unter 10 Jahren Erfahrung). " + CV_NO_PHOTO_EN +
      " Stark leistungsorientiert: konkrete Erfolge mit Zahlen, aktive Verben. Keine 'References available upon request'-Floskel.",
    "kuendigung-wohnung": "Üblich sind 30 Tage schriftliche Ankündigung; Details variieren je nach Bundesstaat und Mietvertrag — auf den Vertrag Bezug nehmen.",
    "kuendigung-arbeit": "'At-will employment': keine gesetzliche Frist, 2 Wochen sind die professionelle Konvention. Kurz, positiv, dankbar — Brücken nicht abbrechen.",
    reklamation: "Auf Garantie/Warranty und Kaufbeleg Bezug nehmen; freundlich-bestimmter Ton, klare Forderung (refund, repair oder replacement) mit Frist.",
  },
  CA: {
    arbeitszeugnis:
      "Üblich ist ein 'letter of recommendation' oder 'reference letter': persönlich, narrativ, konkrete Stärken — kein DACH-Zeugnisformat.",
    lebenslauf: "Resume wie in den USA: " + CV_NO_PHOTO_EN + " 1–2 Seiten, leistungsorientiert.",
    "kuendigung-arbeit": "2 Wochen sind die übliche Konvention. Kurz, positiv, professionell.",
  },
  AU: {
    arbeitszeugnis: ZEUGNIS_FACTUAL_EN,
    lebenslauf: "Wie GB, aber 2–3 Seiten sind akzeptiert. " + CV_NO_PHOTO_EN,
    "kuendigung-arbeit": "Übliche Frist 1–4 Wochen je nach Beschäftigungsdauer bzw. laut Vertrag — nur die vom Nutzer angegebene Frist nennen.",
    reklamation:
      "Australian Consumer Law: starke 'consumer guarantees'. Bei einem 'major failure' hat der Konsument die Wahl zwischen Rückerstattung und Ersatz — das darf selbstbewusst eingefordert werden.",
  },
  NZ: {
    arbeitszeugnis: ZEUGNIS_FACTUAL_EN,
    lebenslauf: "Wie GB, 2–3 Seiten akzeptiert. " + CV_NO_PHOTO_EN,
    reklamation: "Auf den Consumer Guarantees Act 1993 verweisen (acceptable quality, fitness for purpose).",
  },
  PL: {
    arbeitszeugnis:
      "Das 'świadectwo pracy' ist ein rein administratives Dokument: Beschäftigungsdauer, Funktion, Art der Beendigung. " +
      "KEINE Qualitäts- oder Leistungsbeurteilung. Ein separates Empfehlungsschreiben ist nur auf ausdrücklichen Wunsch üblich.",
    lebenslauf: "CV mit Foto verbreitet; Einwilligungsklausel zur Datenverarbeitung (RODO/GDPR) am Ende ist üblich.",
  },
  JP: {
    arbeitszeugnis:
      "Das '在職証明書' bzw. '退職証明書' enthält nur Fakten: Beschäftigungszeitraum, Position, ggf. Beendigungsart. " +
      "KEINE Leistungsbeurteilung. Sehr formeller, knapper Stil.",
    lebenslauf:
      "Das '履歴書' (rirekisho) folgt einem stark standardisierten Format: Personalien, dann Bildungs- und Berufsweg " +
      "CHRONOLOGISCH AUFSTEIGEND (älteste Einträge zuerst — Vorrang vor anderslautenden Formatregeln!), Qualifikationen, kurzer Motivationsteil. Sehr formeller Ton.",
    "kuendigung-arbeit": "Das '退職届' ist extrem knapp und formelhaft: Rücktrittserklärung, Datum, Dank. Keine Begründung nötig ausser 一身上の都合 (persönliche Gründe).",
  },
  IN: {
    arbeitszeugnis:
      "Üblich sind 'experience letter' / 'relieving letter': kurz, bestätigt Titel, Beschäftigungsdaten und ordnungsgemässes Ausscheiden. Optional ein positiver Schlusssatz.",
    lebenslauf: "Mischung aus US-Resume und lokalen Erwartungen: 1–2 Seiten, leistungsorientiert; Foto optional, Geburtsdatum nur wenn angegeben.",
  },
};

// ── Defaults für nicht gelistete Länder ─────────────────────────────

const DEFAULTS: CountryStandards = {
  arbeitszeugnis:
    "Prüfe, was in diesem Land üblich ist: In den meisten Ländern ausserhalb DACH ist eine sachliche " +
    "Arbeitsbestätigung (Dauer, Funktion) mit optional kurzer positiver Würdigung der Standard — kein codiertes DACH-Zeugnis.",
  lebenslauf:
    "International übliches Format: rückwärts chronologisch, 1–2 Seiten. Im Zweifel kein Foto und kein Geburtsdatum verwenden.",
  "kuendigung-wohnung":
    "Nenne keine gesetzlichen Fristen aus eigenem Wissen — verweise auf die vertraglich vereinbarte bzw. die vom Nutzer angegebene Frist. Empfehle nachweisbaren Versand (eingeschrieben), wo üblich.",
  "kuendigung-arbeit":
    "Nenne keine gesetzlichen Fristen aus eigenem Wissen — verwende die vom Nutzer angegebene Frist oder verweise auf den Vertrag.",
  kuendigung:
    "Nenne keine gesetzlichen Fristen aus eigenem Wissen — verwende die vom Nutzer angegebene Frist oder verweise auf den Vertrag.",
  reklamation:
    "Berufe dich allgemein auf die gesetzliche Gewährleistung, ohne konkrete Gesetzesartikel zu nennen, wenn sie nicht in den Rechtsgrundlagen aufgeführt sind.",
};

/**
 * Gibt den landesüblichen Dokument-Standard als Prompt-Baustein zurück.
 * komplettbewerbung nutzt die Lebenslauf-Standards (CV-Teil des Bundles).
 */
export function getDocStandards(toolSlug: ToolSlug, countryCode: string): string {
  const effectiveSlug: ToolSlug = toolSlug === "komplettbewerbung" ? "lebenslauf" : toolSlug;
  const text = STANDARDS[countryCode]?.[effectiveSlug] ?? DEFAULTS[effectiveSlug];
  if (!text) return "";

  const bundleNote = toolSlug === "komplettbewerbung"
    ? "\nDiese Regeln gelten für den Lebenslauf-Teil. Das Bewerbungsschreiben folgt den üblichen formellen Konventionen des Landes."
    : "";

  return (
    `LANDESÜBLICHER DOKUMENT-STANDARD (hat Vorrang vor allgemeinen Formatangaben):\n` +
    `${text}${bundleNote}\n` +
    `Erfinde keine Gesetzesnormen, Fristen oder landesspezifischen Regeln, die dir nicht sicher bekannt sind.`
  );
}
