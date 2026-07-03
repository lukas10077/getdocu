// Zentrale Definition aller Tools: Felder, Preis, Claude-Prompt, PDF-Titel.
// Neue Tools: hier eintragen, Slug zur ToolSlug-Union hinzufügen, fertig.

export type ToolSlug =
  | "mietbewerbung"
  | "jobbewerbung"
  | "kuendigung"
  | "arbeitszeugnis"
  | "maengelruege"
  | "reklamation"
  | "lebenslauf"
  | "krankenkasse"
  | "spesen"
  | "lohnverhandlung"
  | "einwohnerkontrolle"
  | "betreibung";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "email" | "tel";
  placeholder?: string;
  required?: boolean;
  options?: string[]; // nur für type="select"
  section?: string;   // optionale Abschnitts-Überschrift vor diesem Feld
}

export interface ToolDefinition {
  slug: ToolSlug;
  priceChfRappen: number;
  documentTitleDe: string;
  descriptionDe: string;
  systemPrompt: string;
  fields: FieldDef[];
  supportsDocumentUpload?: boolean;
  uploadLabelDe?: string;    // Titel des Upload-Bereichs
  uploadHintDe?: string;     // Erklärtext unter dem Titel
}

export const tools: Record<ToolSlug, ToolDefinition> = {
  // ─────────────────────────────────────────────────────────────
  // MVP-Tools
  // ─────────────────────────────────────────────────────────────

  mietbewerbung: {
    slug: "mietbewerbung",
    priceChfRappen: 500,
    documentTitleDe: "Mietbewerbungsschreiben",
    descriptionDe:
      "Überzeuge Vermieter auf Anhieb. Professionell, persönlich, auf Schweizer Standard.",
    systemPrompt:
      "Du bist Experte für den Schweizer Wohnungsmarkt. Erstelle ein professionelles, " +
      "überzeugendes Mietbewerbungsschreiben auf Deutsch. Halte dich an Schweizer " +
      "Geschäftsbriefkonventionen: vollständiger Absender-Block oben links, Empfänger-Block, " +
      "Ort und Datum, Betreff (fett), formelle Anrede, klare Struktur (Einleitung / Zur Person / " +
      "Haushalt / Schluss), höflicher Abschluss mit Kontaktangebot. Sei persönlich, seriös und prägnant. " +
      "Füge KEINEN Platzhalter ein — nutze nur die gelieferten Angaben.",
    fields: [
      { key: "firstName",       label: "Vorname",                          type: "text",     required: true,  section: "Persönliche Angaben" },
      { key: "lastName",        label: "Nachname",                         type: "text",     required: true  },
      { key: "birthDate",       label: "Geburtsdatum (z.B. 15.03.1990)",   type: "text",     required: true  },
      { key: "nationality",     label: "Nationalität",                     type: "text",     required: true  },
      { key: "residencePermit", label: "Aufenthaltsstatus",                type: "select",   required: true,
        options: ["Schweizer Bürger", "C-Ausweis", "B-Ausweis", "L-Ausweis", "EU/EFTA", "Anderes"] },
      { key: "currentJob",      label: "Beruf / aktuelle Stelle",          type: "text",     required: true  },
      { key: "monthlyIncome",   label: "Monatliches Nettoeinkommen (CHF)", type: "text",     required: true,  placeholder: "z.B. 5 500" },
      { key: "currentAddress",  label: "Deine aktuelle Adresse",           type: "text",     required: true,  section: "Wohnsituation" },
      { key: "targetAddress",   label: "Adresse der Wunsch-Wohnung",       type: "text",     required: false, placeholder: "falls bekannt" },
      { key: "numberOfPersons", label: "Personen im Haushalt",             type: "select",   required: true,
        options: ["1 Person", "2 Personen", "3 Personen", "4 Personen", "5 oder mehr"] },
      { key: "pets",            label: "Haustiere",                        type: "select",   required: true,
        options: ["Keine Haustiere", "Hund", "Katze", "Andere Haustiere"] },
      { key: "motivation",      label: "Warum möchtest du diese Wohnung?", type: "textarea", required: true,
        placeholder: "Beschreibe kurz, warum du die Wohnung möchtest und was dich als Mieter auszeichnet.",
        section: "Motivationstext" },
      { key: "additionalInfo",  label: "Weitere Informationen (optional)", type: "textarea", required: false,
        placeholder: "z.B. Referenzen, besondere Umstände, …" },
    ],
  },

  jobbewerbung: {
    slug: "jobbewerbung",
    priceChfRappen: 500,
    documentTitleDe: "Motivationsschreiben",
    descriptionDe:
      "Zeig, warum du die richtige Person bist. Klar, überzeugend, auf Schweizer Niveau.",
    systemPrompt:
      "Du bist Experte für Bewerbungen auf dem Schweizer Arbeitsmarkt. Erstelle ein professionelles " +
      "Motivationsschreiben auf Deutsch. Halte dich an Schweizer Standards: Absender-Block oben links, " +
      "Empfänger-Block, Ort und Datum, Betreff, Anrede, klare Gliederung (Einleitung / Hauptteil mit " +
      "konkretem Bezug zur Stelle und zum Unternehmen / Schluss mit Call-to-Action), höflicher Abschluss. " +
      "Keine Übertreibungen, keine leeren Phrasen. Beziehe dich konkret auf die angegebene Stelle.",
    fields: [
      { key: "firstName",       label: "Vorname",                              type: "text",     required: true,  section: "Über dich" },
      { key: "lastName",        label: "Nachname",                             type: "text",     required: true  },
      { key: "currentAddress",  label: "Deine Adresse",                        type: "text",     required: true  },
      { key: "email",           label: "E-Mail",                               type: "email",    required: true  },
      { key: "phone",           label: "Telefon",                              type: "tel",      required: false },
      { key: "currentJob",      label: "Aktueller Beruf / Ausbildung",         type: "text",     required: true  },
      { key: "yearsExperience", label: "Jahre Berufserfahrung",                type: "text",     required: true,  placeholder: "z.B. 4" },
      { key: "topSkills",       label: "Wichtigste Fähigkeiten und Stärken",   type: "textarea", required: true,
        placeholder: "z.B. Projektmanagement, Deutsch/Englisch, SAP, Teamarbeit, …" },
      { key: "targetPosition",  label: "Stelle, auf die du dich bewirbst",     type: "text",     required: true,  section: "Die Stelle" },
      { key: "targetCompany",   label: "Name des Unternehmens",                type: "text",     required: true  },
      { key: "companyAddress",  label: "Adresse des Unternehmens",             type: "text",     required: false },
      { key: "whyCompany",      label: "Warum dieses Unternehmen?",            type: "textarea", required: true,
        placeholder: "Was interessiert dich an dieser Firma? Was weisst du über sie?" },
      { key: "whyYou",          label: "Warum bist du die richtige Person?",   type: "textarea", required: true,
        placeholder: "Konkrete Leistungen, Erfolge, passende Erfahrungen für diese Stelle." },
    ],
  },

  kuendigung: {
    slug: "kuendigung",
    priceChfRappen: 300,
    supportsDocumentUpload: true,
    uploadLabelDe: "Dokument hochladen (optional)",
    uploadHintDe: "Hast du eine Kündigung erhalten? Lade ein Foto hoch — wir lesen den Text automatisch.",
    documentTitleDe: "Kündigungsschreiben",
    descriptionDe:
      "Mietvertrag, Arbeitsvertrag, Krankenkasse, Abonnement — korrekt und fristgerecht.",
    systemPrompt:
      "Du bist Experte für Kündigungsschreiben in der Schweiz. Erstelle ein formell korrektes " +
      "Kündigungsschreiben auf Deutsch. Beachte: korrekter Absender, Empfänger, Ort/Datum, Betreff mit " +
      "klarer Nennung des Vertrags/Gegenstands der Kündigung, das gewünschte Kündigungsdatum, Bitte um " +
      "schriftliche Bestätigung, höflicher Abschluss. Weise NICHT auf gesetzliche Fristen hin — das ist " +
      "keine Rechtsberatung.",
    fields: [
      { key: "firstName",        label: "Vorname",                                type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                               type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse",                          type: "text",     required: true  },
      { key: "type",             label: "Was möchtest du kündigen?",              type: "select",   required: true,  section: "Kündigung",
        options: ["Mietvertrag", "Arbeitsvertrag", "Krankenkasse", "Abonnement/Mitgliedschaft", "Anderes Vertragsverhältnis"] },
      { key: "recipientName",    label: "Name des Empfängers (Vermieter, Firma …)", type: "text",   required: true  },
      { key: "recipientAddress", label: "Adresse des Empfängers",                type: "text",     required: true  },
      { key: "contractRef",      label: "Vertrags-/Kunden-/Policennummer",        type: "text",     required: false, placeholder: "falls vorhanden" },
      { key: "terminationDate",  label: "Gewünschtes Kündigungsdatum",            type: "text",     required: true,  placeholder: "z.B. 31.03.2026 oder nächstmöglicher Termin" },
      { key: "reason",           label: "Kündigungsgrund (optional)",             type: "textarea", required: false,
        placeholder: "Nur wenn du einen Grund angeben möchtest." },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Weitere Tools
  // ─────────────────────────────────────────────────────────────

  arbeitszeugnis: {
    slug: "arbeitszeugnis",
    priceChfRappen: 500,
    supportsDocumentUpload: true,
    uploadLabelDe: "Foto des Zeugnisses hochladen (optional)",
    uploadHintDe: "Hast du dein Zeugnis auf Papier? Mach ein Foto — wir lesen den Text automatisch. Du kannst den Text unten auch manuell einfügen.",
    documentTitleDe: "Arbeitszeugnis (verbessert)",
    descriptionDe:
      "Dein Zeugnis klingt mittelmässig? Wir schreiben es professionell um — nach Schweizer Standard.",
    systemPrompt:
      "Du bist Experte für Arbeitszeugnisse nach Schweizer Standard. Der Nutzer gibt dir sein " +
      "bestehendes Zeugnis und optional Hinweise. Schreibe das Zeugnis professionell um: " +
      "positiver Ton, klare Struktur (Einleitung mit Stellen-/Aufgabenbeschreibung, Hauptteil mit " +
      "konkreten Leistungen und Soft Skills, Schlussformel mit Dank und Wunsch für die Zukunft). " +
      "Keine negativen Kodierungen. Schweizer Du/Sie-Form konsistent. Gib das vollständige, " +
      "umgeschriebene Zeugnis aus — keine Erklärungen oder Kommentare.",
    fields: [
      { key: "firstName",        label: "Vorname",                          type: "text",     required: true, section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                         type: "text",     required: true },
      { key: "position",         label: "Deine Stelle / Funktion",          type: "text",     required: true },
      { key: "employer",         label: "Name des Arbeitgebers",            type: "text",     required: true },
      { key: "duration",         label: "Beschäftigungsdauer",              type: "text",     required: true, placeholder: "z.B. 01.01.2022 – 31.12.2024" },
      { key: "existingZeugnis",  label: "Bestehender Zeugnis-Text",        type: "textarea", required: true,
        placeholder: "Füge den kompletten Text deines aktuellen Zeugnisses hier ein.",
        section: "Zeugnis" },
      { key: "whatToImprove",    label: "Was soll verbessert werden?",      type: "textarea", required: false,
        placeholder: "z.B. Schlussformel klingt negativ, Führungskompetenz fehlt, zu kurz, …" },
    ],
  },

  maengelruege: {
    slug: "maengelruege",
    priceChfRappen: 400,
    supportsDocumentUpload: true,
    uploadLabelDe: "Foto des Mangels hochladen (optional)",
    uploadHintDe: "Lade ein Foto des Schadens oder des Mietvertrags hoch — wir berücksichtigen es im Schreiben.",
    documentTitleDe: "Mängelrüge",
    descriptionDe:
      "Schäden in der Wohnung melden — schriftlich, fristwahrend, korrekt adressiert.",
    systemPrompt:
      "Du bist Experte für Mietrecht in der Schweiz. Erstelle eine formell korrekte Mängelrüge " +
      "auf Deutsch. Struktur: Absender, Empfänger, Datum, Betreff (Mängelrüge + Adresse Mietobjekt), " +
      "Einleitung (Bezug zum Mietvertrag), Auflistung der Mängel (nummeriert, präzise beschrieben), " +
      "Fristsetzung zur Behebung, Ankündigung weiterer Schritte bei Nicht-Behebung (ohne konkrete " +
      "Rechtsdrohung), Bitte um Bestätigung, Abschluss. Kein Tonfall, der unnötig aggressiv ist.",
    fields: [
      { key: "firstName",        label: "Vorname",                      type: "text",     required: true,  section: "Mieter" },
      { key: "lastName",         label: "Nachname",                     type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse (Mietobjekt)",   type: "text",     required: true  },
      { key: "landlordName",     label: "Name des Vermieters / Verwaltung", type: "text", required: true,  section: "Vermieter" },
      { key: "landlordAddress",  label: "Adresse des Vermieters",       type: "text",     required: true  },
      { key: "defects",          label: "Beschreibe die Mängel",        type: "textarea", required: true,
        placeholder: "Was ist defekt/kaputt? Seit wann? Wo genau in der Wohnung?",
        section: "Mängel" },
      { key: "deadline",         label: "Frist zur Behebung",           type: "text",     required: true,  placeholder: "z.B. 14 Tage ab Erhalt dieses Schreibens" },
    ],
  },

  reklamation: {
    slug: "reklamation",
    priceChfRappen: 300,
    supportsDocumentUpload: true,
    uploadLabelDe: "Foto der Rechnung oder des Produkts hochladen (optional)",
    uploadHintDe: "Hast du eine fehlerhafte Rechnung oder ein defektes Produkt? Lade ein Foto hoch.",
    documentTitleDe: "Reklamationsbrief",
    descriptionDe:
      "Defekte Ware, schlechte Dienstleistung, falsche Rechnung — klar und bestimmt reklamieren.",
    systemPrompt:
      "Du bist Experte für Kundenkorrespondenz in der Schweiz. Erstelle einen professionellen " +
      "Reklamationsbrief auf Deutsch. Struktur: Absender, Empfänger, Datum, Betreff, " +
      "sachliche Schilderung des Problems, konkrete Forderung (Rückerstattung / Reparatur / " +
      "Entschuldigung / Nachlieferung), Frist, Abschluss. Ton: bestimmt, sachlich, nicht aggressiv.",
    fields: [
      { key: "firstName",        label: "Vorname",                      type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                     type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse",                type: "text",     required: true  },
      { key: "recipientName",    label: "Name des Unternehmens",        type: "text",     required: true,  section: "Empfänger" },
      { key: "recipientAddress", label: "Adresse des Empfängers",       type: "text",     required: true  },
      { key: "orderRef",         label: "Bestellnummer / Referenz",     type: "text",     required: false, placeholder: "falls vorhanden" },
      { key: "complaint",        label: "Was ist passiert?",            type: "textarea", required: true,
        placeholder: "Beschreibe das Problem sachlich: Was, Wann, Welche Bestellung/Dienstleistung.",
        section: "Reklamation" },
      { key: "demand",           label: "Was verlangst du?",            type: "textarea", required: true,
        placeholder: "z.B. vollständige Rückerstattung, kostenlose Reparatur, Ersatzlieferung, …" },
      { key: "deadline",         label: "Frist",                        type: "text",     required: false, placeholder: "z.B. 10 Werktage" },
    ],
  },

  lebenslauf: {
    slug: "lebenslauf",
    priceChfRappen: 500,
    supportsDocumentUpload: true,
    uploadLabelDe: "Deinen bestehenden Lebenslauf hochladen (optional)",
    uploadHintDe: "Hast du einen alten CV? Lade ein Foto oder Scan hoch — wir verbessern und erweitern ihn mit deinen neuen Angaben.",
    documentTitleDe: "Lebenslauf-Check",
    descriptionDe:
      "Dein CV wird analysiert und professionell überarbeitet — für den Schweizer Arbeitsmarkt.",
    systemPrompt:
      "Du bist Karriereberater mit Spezialisierung auf den Schweizer Arbeitsmarkt. " +
      "Analysiere den eingereichten Lebenslauf und erstelle eine überarbeitete, verbesserte Version " +
      "auf Deutsch. Schweizer CV-Standard: prägnant (max. 2 Seiten), klare Struktur " +
      "(Persönliche Daten / Berufserfahrung rückwärts chronologisch / Ausbildung / Sprachen / " +
      "Weiterbildungen & Zertifikate / Hobbys optional). Kein Foto-Pflicht erwähnen. " +
      "Gib den vollständigen, überarbeiteten Lebenslauf als Text aus. Keine Erklärungen, nur das Dokument.",
    fields: [
      { key: "existingCV",    label: "Dein aktueller Lebenslauf (als Text)", type: "textarea", required: true,
        placeholder: "Füge den kompletten Text deines Lebenslaufs hier ein.",
        section: "Lebenslauf" },
      { key: "targetJob",    label: "Für welche Art Stelle bewirbst du dich?", type: "text",  required: true,
        placeholder: "z.B. Sachbearbeiter Buchhaltung, Pflegefachperson, Lagerist, …" },
      { key: "improvements", label: "Worauf soll der Fokus gelegt werden?",   type: "textarea", required: false,
        placeholder: "z.B. Sprachen besser hervorheben, Lücken erklären, kompakter machen, …" },
    ],
  },

  krankenkasse: {
    slug: "krankenkasse",
    priceChfRappen: 400,
    documentTitleDe: "Krankenkassen-Brief",
    descriptionDe:
      "Prämienreduktion, Leistungsanfragen, Kündigung — korrekt und auf Deutsch formuliert.",
    systemPrompt:
      "Du bist Experte für Schweizer Krankenversicherung (KVG/VVG). Erstelle einen formellen " +
      "Brief an eine Schweizer Krankenkasse auf Deutsch. Struktur: Absender mit Policennummer, " +
      "Empfänger, Datum, klarer Betreff, präzises Anliegen, Bitte um schriftliche Antwort, " +
      "Abschluss. Ton: sachlich, respektvoll, klar. Keine juristischen Versprechen machen.",
    fields: [
      { key: "firstName",      label: "Vorname",                   type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",       label: "Nachname",                  type: "text",     required: true  },
      { key: "currentAddress", label: "Deine Adresse",             type: "text",     required: true  },
      { key: "birthDate",      label: "Geburtsdatum",              type: "text",     required: true  },
      { key: "insuranceName",  label: "Name der Krankenkasse",     type: "text",     required: true,  section: "Krankenkasse" },
      { key: "policyNumber",   label: "Versicherungs-/Policennummer", type: "text",  required: true  },
      { key: "topic",          label: "Thema des Briefes",         type: "select",   required: true,
        options: ["Prämienreduktion beantragen", "Kostengutsprache / Leistungsanfrage", "Kündigung der Zusatzversicherung", "Reklamation / Einsprache", "Andere Anfrage"] },
      { key: "details",        label: "Dein Anliegen",             type: "textarea", required: true,
        placeholder: "Beschreibe dein Anliegen so präzise wie möglich.",
        section: "Anliegen" },
    ],
  },

  spesen: {
    slug: "spesen",
    priceChfRappen: 300,
    documentTitleDe: "Spesenabrechnung",
    descriptionDe:
      "Professionelle Spesenabrechnung für deinen Arbeitgeber — klar strukturiert.",
    systemPrompt:
      "Du bist Experte für Arbeitsrecht und Administration in der Schweiz. Erstelle eine formelle " +
      "Spesenabrechnung als Brief/Memo auf Deutsch. Struktur: Absender, Empfänger, Datum, Betreff " +
      "(Spesenabrechnung + Zeitraum), tabellarisch aufgelistete Ausgaben (Datum | Beschreibung | " +
      "Betrag CHF), Gesamtsumme, Bitte um Rückerstattung auf angegebene Bankverbindung, Abschluss. " +
      "Hinweis: Belege sind beigefügt (ohne konkrete Anhänge zu erfinden).",
    fields: [
      { key: "firstName",    label: "Vorname",                       type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",     label: "Nachname",                      type: "text",     required: true  },
      { key: "employer",     label: "Name des Arbeitgebers",         type: "text",     required: true  },
      { key: "department",   label: "Abteilung (optional)",          type: "text",     required: false },
      { key: "period",       label: "Abrechnungsperiode",            type: "text",     required: true,  placeholder: "z.B. März 2025",  section: "Spesen" },
      { key: "expenses",     label: "Ausgaben (Datum, Beschreibung, Betrag)", type: "textarea", required: true,
        placeholder: "01.03. Zugticket Zürich–Bern CHF 48.00\n03.03. Mittagessen Kundentermin CHF 35.50\n…" },
      { key: "iban",         label: "IBAN für Rückerstattung",       type: "text",     required: false, placeholder: "CH56 0483 5012 3456 7800 9", section: "Bankverbindung" },
    ],
  },

  lohnverhandlung: {
    slug: "lohnverhandlung",
    priceChfRappen: 500,
    documentTitleDe: "Lohnverhandlung",
    descriptionDe:
      "Argumente, Formulierungen und einen Brief für deine Gehaltserhöhung — auf Schweizer Niveau.",
    systemPrompt:
      "Du bist Executive-Coach mit Schwerpunkt Schweizer Arbeitsmarkt. Erstelle zwei Teile: " +
      "1) Einen formellen Brief an den Arbeitgeber mit dem Wunsch nach einer Gehaltserhöhung " +
      "(Absender, Empfänger, Datum, Betreff, sachliche Begründung mit konkreten Leistungen, " +
      "Wunsch-Gehalt, Bitte um Gespräch, Abschluss). " +
      "2) Drei bis fünf starke Gesprächsargumente als Stichpunkte für das persönliche Gespräch. " +
      "Ton: selbstbewusst, sachlich, wertschätzend.",
    fields: [
      { key: "firstName",       label: "Vorname",                            type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",        label: "Nachname",                           type: "text",     required: true  },
      { key: "position",        label: "Deine Stelle / Funktion",            type: "text",     required: true  },
      { key: "employer",        label: "Name des Arbeitgebers",              type: "text",     required: true  },
      { key: "yearsAtCompany",  label: "Betriebszugehörigkeit (Jahre)",      type: "text",     required: true,  placeholder: "z.B. 3" },
      { key: "currentSalary",   label: "Aktuelles Jahresgehalt (CHF)",       type: "text",     required: true,  placeholder: "z.B. 72 000",  section: "Gehalt" },
      { key: "desiredSalary",   label: "Gewünschtes Jahresgehalt (CHF)",     type: "text",     required: true,  placeholder: "z.B. 80 000" },
      { key: "achievements",    label: "Deine wichtigsten Leistungen",       type: "textarea", required: true,
        placeholder: "Was hast du im letzten Jahr erreicht? Konkrete Ergebnisse, Projekte, Einsparungen, …",
        section: "Argumente" },
      { key: "marketRef",       label: "Marktvergleich (optional)",          type: "text",     required: false,
        placeholder: "z.B. Vergleichbare Stellen im Kanton zahlen CHF 78–85k laut salary.ch" },
    ],
  },

  einwohnerkontrolle: {
    slug: "einwohnerkontrolle",
    priceChfRappen: 300,
    documentTitleDe: "Anmeldung Einwohnerkontrolle",
    descriptionDe:
      "Checkliste, Anmeldeformular und Begleitschreiben für deine Anmeldung in der Gemeinde.",
    systemPrompt:
      "Du bist Experte für Schweizer Verwaltungsabläufe. Erstelle drei Teile auf Deutsch: " +
      "1) Ein kurzes Begleitschreiben an die Einwohnerkontrolle der angegebenen Gemeinde. " +
      "2) Eine Checkliste der typischerweise benötigten Dokumente für die Anmeldung (allgemein für " +
      "die angegebene Aufenthaltskategorie). " +
      "3) Drei häufige Fragen & Antworten zur Anmeldung. " +
      "Hinweis: Die Dokumente und Abläufe können je nach Gemeinde variieren — empfehle, die " +
      "Gemeinde-Website zu prüfen.",
    fields: [
      { key: "firstName",       label: "Vorname",                      type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",        label: "Nachname",                     type: "text",     required: true  },
      { key: "birthDate",       label: "Geburtsdatum",                 type: "text",     required: true  },
      { key: "nationality",     label: "Nationalität",                 type: "text",     required: true  },
      { key: "residencePermit", label: "Aufenthaltsstatus / Ausweis",  type: "select",   required: true,
        options: ["Schweizer Bürger", "EU/EFTA (Anmeldebescheinigung)", "B-Ausweis", "C-Ausweis", "L-Ausweis", "Asylbereich / N-Ausweis", "Anderes"] },
      { key: "newAddress",      label: "Neue Adresse",                 type: "text",     required: true,  section: "Umzug" },
      { key: "municipality",    label: "Gemeinde / Stadt",             type: "text",     required: true  },
      { key: "moveDate",        label: "Datum des Einzugs",            type: "text",     required: true,  placeholder: "z.B. 01.04.2025" },
      { key: "previousAddress", label: "Bisherige Adresse",            type: "text",     required: true  },
      { key: "maritalStatus",   label: "Zivilstand",                   type: "select",   required: true,
        options: ["Ledig", "Verheiratet / eingetragene Partnerschaft", "Getrennt", "Geschieden", "Verwitwet"] },
      { key: "additionalInfo",  label: "Besondere Situation (optional)", type: "textarea", required: false,
        placeholder: "z.B. Kinder, Wochenaufenthalter, erster Einzug in die Schweiz, …" },
    ],
  },

  betreibung: {
    slug: "betreibung",
    priceChfRappen: 400,
    documentTitleDe: "Betreibungsregisterauszug — Erklärung",
    descriptionDe:
      "Du hast einen Betreibungsauszug erhalten oder musst einen vorlegen? Wir erklären ihn dir.",
    systemPrompt:
      "Du bist Experte für Schweizer Schuldbetreibungsrecht (SchKG). " +
      "Erstelle zwei Teile auf Deutsch: " +
      "1) Erkläre den geschilderten Betreibungsauszug oder die Situation klar und verständlich " +
      "(Was bedeutet was? Was sind die nächsten Schritte?). " +
      "2) Schreibe — falls gewünscht — einen Brief an den Betreibungsamt oder den Gläubiger " +
      "(z.B. Einspruch gegen eine Betreibung, Zahlungsversprechen, Anfrage zur Tilgung). " +
      "Wichtiger Hinweis am Ende: Für konkrete rechtliche Schritte empfehlen wir, eine " +
      "Rechtsberatungsstelle aufzusuchen (z.B. Mieterverband, Pro Juventute, Caritas).",
    fields: [
      { key: "firstName",      label: "Vorname",                            type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",       label: "Nachname",                           type: "text",     required: true  },
      { key: "situation",      label: "Beschreibe deine Situation",         type: "textarea", required: true,
        placeholder: "z.B. Ich habe eine Betreibung erhalten über CHF 1 200 von der Firma X. Ich bin nicht einverstanden, weil …",
        section: "Situation" },
      { key: "desiredAction",  label: "Was möchtest du als Nächstes tun?",  type: "select",   required: true,
        options: ["Situation verstehen / erklären lassen", "Einspruch (Rechtsvorschlag) einlegen", "Zahlungsplan vorschlagen", "Anfrage an Gläubiger schreiben", "Anderes"] },
      { key: "additionalInfo", label: "Weitere Angaben (optional)",         type: "textarea", required: false,
        placeholder: "z.B. Betrag, Gläubiger, Datum der Betreibung, …" },
    ],
  },
};

export function getTool(slug: string): ToolDefinition | undefined {
  return tools[slug as ToolSlug];
}

export const allToolSlugs: ToolSlug[] = Object.keys(tools) as ToolSlug[];
