// Zentrale Definition aller Tools: Felder, Preis, Claude-Prompt, PDF-Titel.
// Neue Tools: hier eintragen, Slug zur ToolSlug-Union hinzufügen, fertig.

export type ToolSlug =
  | "mietbewerbung"
  | "kuendigung-wohnung"
  | "maengelruege"
  | "jobbewerbung"
  | "kuendigung-arbeit"
  | "arbeitszeugnis"
  | "lebenslauf"
  | "kuendigung"
  | "reklamation"
  | "krankenkasse";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "email" | "tel" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  options?: string[];                        // nur für type="select"
  countryOptions?: Record<string, string[]>; // länderspezifische Optionen, überschreiben options
  section?: string;                          // optionale Abschnitts-Überschrift vor diesem Feld
}

export interface ToolDefinition {
  slug: ToolSlug;
  priceChfRappen: number;
  documentTitleDe: string;
  descriptionDe: string;
  systemPrompt: string;
  fields: FieldDef[];
  // Einzelnes Dokument-Foto → Vision API analysiert es
  supportsDocumentUpload?: boolean;
  uploadLabelDe?: string;
  uploadHintDe?: string;
  // Mehrere Fotos → KEIN Vision, nur als Beilage ans PDF
  supportsPhotoGallery?: boolean;
  maxPhotos?: number;
  photoGalleryLabelDe?: string;
  photoGalleryHintDe?: string;
}

export const tools: Record<ToolSlug, ToolDefinition> = {
  // ─────────────────────────────────────────────────────────────
  // MVP-Tools
  // ─────────────────────────────────────────────────────────────

  mietbewerbung: {
    slug: "mietbewerbung",
    priceChfRappen: 500,
    documentTitleDe: "Bewerbung Wohnung",
    descriptionDe:
      "Überzeuge Vermieter auf Anhieb. Professionell, persönlich, nach lokalem Standard.",
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
      { key: "birthDate",       label: "Geburtsdatum",                     type: "date",     required: true  },
      { key: "nationality",     label: "Nationalität",                     type: "text",     required: true  },
      { key: "residencePermit", label: "Aufenthaltsstatus",                type: "select",   required: true,
        options: ["Staatsbürger/in", "Dauerhaftes Aufenthaltsrecht", "Befristetes Aufenthaltsrecht", "Anderes"],
        countryOptions: {
          "CH": ["Schweizer Bürger/in", "C-Ausweis (Niederlassung)", "B-Ausweis (Aufenthalt)", "L-Ausweis (Kurzaufenthalt)", "EU/EFTA", "Anderes"],
          "DE": ["Deutsche/r Staatsbürger/in", "Niederlassungserlaubnis", "Aufenthaltserlaubnis", "EU/EWR-Bürger/in", "Anderes"],
          "AT": ["Österreichische/r Staatsbürger/in", "Rot-Weiß-Rot-Karte", "Aufenthaltsbewilligung", "EU/EWR-Bürger/in", "Anderes"],
          "FR": ["Citoyen/ne français/e", "Carte de résident", "Titre de séjour", "UE/EEE", "Autre"],
          "IT": ["Cittadino/a italiano/a", "Permesso di soggiorno CE", "Permesso di soggiorno", "UE/SEE", "Altro"],
          "ES": ["Ciudadano/a español/a", "Residencia permanente", "Tarjeta de residencia", "UE/EEE", "Otro"],
          "NL": ["Nederlandse staatsburger", "Verblijfsvergunning onbepaald", "Verblijfsvergunning bepaald", "EU/EER", "Anders"],
          "BE": ["Belge", "Carte A (résidence permanente)", "Carte B/E", "UE/EEE", "Autre"],
          "GB": ["British Citizen", "Settled Status (ILR)", "Pre-Settled Status", "Other"],
          "US": ["US Citizen", "Green Card (Permanent Resident)", "Work Visa", "Other"],
          "CA": ["Canadian Citizen", "Permanent Resident", "Work Permit", "Other"],
          "AU": ["Australian Citizen", "Permanent Resident", "Temporary Visa", "Other"],
          "NZ": ["New Zealand Citizen", "Permanent Resident", "Temporary Visa", "Other"],
        }
      },
      { key: "currentJob",      label: "Beruf / aktuelle Stelle",          type: "text",     required: true  },
      { key: "monthlyIncome",   label: "Monatliches Nettoeinkommen (CHF)", type: "number",   required: true,  placeholder: "5500" },
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
    documentTitleDe: "Bewerbung Arbeitsstelle",
    descriptionDe:
      "Zeig, warum du die richtige Person bist. Klar, überzeugend, professionell.",
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
      { key: "yearsExperience", label: "Jahre Berufserfahrung",                type: "number",   required: true,  placeholder: "4" },
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
    documentTitleDe: "Kündigung",
    descriptionDe:
      "Versicherung, Abonnement, Mitgliedschaft — korrekt und fristgerecht kündigen.",
    systemPrompt:
      "Du bist Experte für Kündigungsschreiben. Erstelle ein formell korrektes " +
      "Kündigungsschreiben auf Deutsch. Beachte: korrekter Absender, Empfänger, Ort/Datum, Betreff mit " +
      "klarer Nennung des Vertrags/Gegenstands der Kündigung, das gewünschte Kündigungsdatum, Bitte um " +
      "schriftliche Bestätigung, höflicher Abschluss. Weise NICHT auf gesetzliche Fristen hin — das ist " +
      "keine Rechtsberatung.",
    fields: [
      { key: "firstName",        label: "Vorname",                                type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                               type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse",                          type: "text",     required: true  },
      { key: "type",             label: "Was möchtest du kündigen?",              type: "select",   required: true,  section: "Kündigung",
        options: ["Versicherung", "Abonnement / Mitgliedschaft", "Anderes"] },
      { key: "recipientName",    label: "Name des Empfängers (Vermieter, Firma …)", type: "text",   required: true  },
      { key: "recipientAddress", label: "Adresse des Empfängers",                type: "text",     required: true  },
      { key: "contractRef",      label: "Vertrags-/Kunden-/Policennummer",        type: "text",     required: false, placeholder: "falls vorhanden" },
      { key: "terminationDate",  label: "Gewünschtes Kündigungsdatum",            type: "date",     required: true  },
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
    documentTitleDe: "Arbeitszeugnis verbessern",
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
    supportsPhotoGallery: true,
    maxPhotos: 100,
    photoGalleryLabelDe: "Fotos der Schäden hochladen (optional)",
    photoGalleryHintDe: "Lade bis zu 100 Fotos hoch — sie werden als Beilage ans Dokument angehängt.",
    documentTitleDe: "Wohnungsschaden beim Vermieter melden",
    descriptionDe:
      "Schäden in der Wohnung melden — schriftlich, fristwahrend, korrekt adressiert.",
    systemPrompt:
      "Du bist Experte für Mietrecht in der Schweiz. Erstelle eine formell korrekte Schadensmeldung " +
      "auf Deutsch. Struktur: Absender, Empfänger, Datum, Betreff (Schadensmeldung + Adresse Mietobjekt), " +
      "Einleitung (Bezug zum Mietvertrag), Auflistung der Schäden (nummeriert, präzise beschrieben), " +
      "Fristsetzung zur Behebung, Ankündigung weiterer Schritte bei Nicht-Behebung (ohne konkrete " +
      "Rechtsdrohung), Bitte um Bestätigung, Abschluss. Kein Tonfall, der unnötig aggressiv ist.",
    fields: [
      { key: "firstName",        label: "Vorname",                      type: "text",     required: true,  section: "Mieter" },
      { key: "lastName",         label: "Nachname",                     type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse (Mietobjekt)",   type: "text",     required: true  },
      { key: "landlordName",     label: "Name des Vermieters / Verwaltung", type: "text", required: true,  section: "Vermieter" },
      { key: "landlordAddress",  label: "Adresse des Vermieters",       type: "text",     required: true  },
      { key: "defects",          label: "Beschreibe die Schäden",       type: "textarea", required: true,
        placeholder: "Was ist defekt/kaputt? Seit wann? Wo genau in der Wohnung?",
        section: "Schäden" },
      { key: "deadline",         label: "Frist zur Behebung (Tage)",    type: "number",   required: true,  placeholder: "14" },
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
      { key: "deadline",         label: "Frist (Werktage)",             type: "number",   required: false, placeholder: "10" },
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
      "Dein CV wird analysiert und professionell überarbeitet — angepasst an deinen Arbeitsmarkt.",
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
      { key: "birthDate",      label: "Geburtsdatum",              type: "date",     required: true  },
      { key: "insuranceName",  label: "Name der Krankenkasse",     type: "text",     required: true,  section: "Krankenkasse" },
      { key: "policyNumber",   label: "Versicherungs-/Policennummer", type: "text",  required: true  },
      { key: "topic",          label: "Thema des Briefes",         type: "select",   required: true,
        options: ["Prämienreduktion beantragen", "Kostengutsprache / Leistungsanfrage", "Kündigung der Zusatzversicherung", "Reklamation / Einsprache", "Andere Anfrage"] },
      { key: "details",        label: "Dein Anliegen",             type: "textarea", required: true,
        placeholder: "Beschreibe dein Anliegen so präzise wie möglich.",
        section: "Anliegen" },
    ],
  },

  "kuendigung-wohnung": {
    slug: "kuendigung-wohnung",
    priceChfRappen: 300,
    documentTitleDe: "Kündigung Wohnung",
    descriptionDe:
      "Mietvertrag korrekt kündigen — mit Frist, Adresse und Bitte um Bestätigung.",
    systemPrompt:
      "Du bist Experte für Mietrecht. Erstelle ein formell korrektes Kündigungsschreiben für einen " +
      "Mietvertrag auf Deutsch. Struktur: vollständiger Absender, Vermieter als Empfänger, Ort/Datum, " +
      "Betreff mit Adresse des Mietobjekts, klare Kündigungserklärung mit Datum, Bitte um schriftliche " +
      "Bestätigung, höflicher Abschluss. Weise NICHT auf gesetzliche Fristen hin.",
    fields: [
      { key: "firstName",        label: "Vorname",                           type: "text", required: true,  section: "Mieter" },
      { key: "lastName",         label: "Nachname",                          type: "text", required: true  },
      { key: "currentAddress",   label: "Deine Adresse (Mietobjekt)",        type: "text", required: true  },
      { key: "landlordName",     label: "Name des Vermieters / Verwaltung",  type: "text", required: true,  section: "Vermieter" },
      { key: "landlordAddress",  label: "Adresse des Vermieters",            type: "text", required: true  },
      { key: "terminationDate",  label: "Gewünschtes Kündigungsdatum",       type: "date", required: true,  section: "Kündigung" },
      { key: "reason",           label: "Kündigungsgrund (optional)",        type: "textarea", required: false, placeholder: "Nur wenn du einen Grund angeben möchtest." },
    ],
  },

  "kuendigung-arbeit": {
    slug: "kuendigung-arbeit",
    priceChfRappen: 300,
    documentTitleDe: "Kündigung Arbeitsstelle",
    descriptionDe:
      "Arbeitsvertrag professionell kündigen — klar, höflich und fristgerecht.",
    systemPrompt:
      "Du bist Experte für Arbeitsrecht. Erstelle ein formell korrektes Kündigungsschreiben für eine " +
      "Arbeitsstelle auf Deutsch. Struktur: vollständiger Absender, Arbeitgeber als Empfänger, Ort/Datum, " +
      "Betreff mit Stellenbezeichnung, klare Kündigungserklärung mit Datum, Bitte um schriftliches " +
      "Arbeitszeugnis, Dank für die Zusammenarbeit, höflicher Abschluss. Weise NICHT auf gesetzliche Fristen hin.",
    fields: [
      { key: "firstName",        label: "Vorname",                     type: "text", required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                    type: "text", required: true  },
      { key: "currentAddress",   label: "Deine Adresse",               type: "text", required: true  },
      { key: "position",         label: "Deine Stelle / Funktion",     type: "text", required: true  },
      { key: "employer",         label: "Name des Arbeitgebers",       type: "text", required: true,  section: "Arbeitgeber" },
      { key: "employerAddress",  label: "Adresse des Arbeitgebers",    type: "text", required: true  },
      { key: "terminationDate",  label: "Gewünschtes Austrittsdatum",  type: "date", required: true,  section: "Kündigung" },
      { key: "reason",           label: "Kündigungsgrund (optional)",  type: "textarea", required: false, placeholder: "Nur wenn du einen Grund angeben möchtest." },
    ],
  },

};

export function getTool(slug: string): ToolDefinition | undefined {
  return tools[slug as ToolSlug];
}

export const allToolSlugs: ToolSlug[] = Object.keys(tools) as ToolSlug[];

export type CategoryKey = "wohnen" | "arbeit" | "alltag";

export const TOOL_CATEGORIES: { key: CategoryKey; slugs: ToolSlug[] }[] = [
  { key: "wohnen", slugs: ["mietbewerbung", "kuendigung-wohnung", "maengelruege"] },
  { key: "arbeit", slugs: ["jobbewerbung", "kuendigung-arbeit", "arbeitszeugnis", "lebenslauf"] },
  { key: "alltag", slugs: ["kuendigung", "reklamation", "krankenkasse"] },
];
