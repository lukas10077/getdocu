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
  | "komplettbewerbung"
  | "kuendigung"
  | "reklamation"
  | "krankenkasse";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "email" | "tel" | "number" | "date" | "address";
  placeholder?: string;
  placeholderKey?: string;                   // i18n-Schlüssel → dict.placeholders[key]
  required?: boolean;
  options?: string[];                        // nur für type="select"
  countryOptions?: Record<string, string[]>; // länderspezifische Optionen, überschreiben options
  appendCurrency?: boolean;                  // Label um aktuelle Währung ergänzen
  section?: string;                          // optionale Abschnitts-Überschrift vor diesem Feld
  fillsDateField?: string;                   // wenn gesetzt: Auswahl berechnet Datum für dieses Feld automatisch
  autoFilledHint?: boolean;                  // zeigt Hinweis "automatisch berechnet" unter dem Datumsfeld
  hint?: string;                             // grauer Hilfstext unter dem Feld
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
  // Digitales Dokument: Bild + PDF + DOCX (PDF/DOCX werden direkt gelesen, kein Vision)
  supportsAllDocumentTypes?: boolean;
  // Bewerbungsfoto → wird in Vorschau + PDF eingebettet, geht NICHT durch Claude
  supportsProfilePhoto?: boolean;
  // Mehrere Fotos → KEIN Vision, nur als Beilage ans PDF
  supportsPhotoGallery?: boolean;
  maxPhotos?: number;
  photoGalleryLabelDe?: string;
  photoGalleryHintDe?: string;
  // Bundle: generiert zwei Dokumente mit ===LEBENSLAUF=== als Trenner
  isBundle?: boolean;
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
      { key: "monthlyIncome",   label: "Monatliches Nettoeinkommen",       type: "number",   required: true,  appendCurrency: true },
      { key: "currentAddress",  label: "Deine aktuelle Adresse",           type: "address",     required: true,  section: "Wohnsituation" },
      { key: "targetAddress",   label: "Adresse der Wunsch-Wohnung",       type: "text",     required: false, placeholderKey: "fallsKnown" },
      { key: "numberOfPersons", label: "Personen im Haushalt",             type: "select",   required: true,
        options: ["1 Person", "2 Personen", "3 Personen", "4 Personen", "5 oder mehr"] },
      { key: "pets",            label: "Haustiere",                        type: "select",   required: true,
        options: ["Keine Haustiere", "Hund", "Katze", "Andere Haustiere"] },
      { key: "motivation",      label: "Warum möchtest du diese Wohnung?", type: "textarea", required: true,
        placeholderKey: "motivationRental",
        section: "Motivationstext" },
      { key: "additionalInfo",  label: "Weitere Informationen (optional)", type: "textarea", required: false,
        placeholderKey: "additionalInfoField" },
    ],
  },

  jobbewerbung: {
    slug: "jobbewerbung",
    priceChfRappen: 500,
    supportsProfilePhoto: true,
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
      { key: "currentAddress",  label: "Deine Adresse",                        type: "address",     required: true  },
      { key: "email",           label: "E-Mail",                               type: "email",    required: true  },
      { key: "phone",           label: "Telefon",                              type: "tel",      required: false },
      { key: "currentJob",      label: "Aktueller Beruf / Ausbildung",         type: "text",     required: true  },
      { key: "yearsExperience", label: "Jahre Berufserfahrung",                type: "number",   required: true },
      { key: "topSkills",       label: "Wichtigste Fähigkeiten und Stärken",   type: "textarea", required: true,
        placeholderKey: "skillsExample" },
      { key: "targetPosition",  label: "Als was bewirbst du dich?",     type: "text",     required: true,  section: "Die Stelle" },
      { key: "targetCompany",   label: "Name des Unternehmens",                type: "text",     required: true  },
      { key: "companyAddress",  label: "Adresse des Unternehmens",             type: "text",     required: false },
      { key: "whyCompany",      label: "Warum dieses Unternehmen?",            type: "textarea", required: true,
        placeholderKey: "companyResearch" },
      { key: "whyYou",          label: "Warum bist du die richtige Person?",   type: "textarea", required: true,
        placeholderKey: "whyYou" },
    ],
  },

  kuendigung: {
    slug: "kuendigung",
    priceChfRappen: 300,
    documentTitleDe: "Kündigung",
    descriptionDe:
      "Versicherung, Abonnement, Mitgliedschaft — korrekt und fristgerecht kündigen.",
    systemPrompt:
      "Du bist Experte für Kündigungsschreiben. Erstelle ein formell korrektes " +
      "Kündigungsschreiben auf Deutsch. Beachte: korrekter Absender, Empfänger, Ort/Datum, Betreff mit " +
      "klarer Nennung des Vertrags/Gegenstands der Kündigung, das gewünschte Kündigungsdatum, Bitte um " +
      "schriftliche Bestätigung, höflicher Abschluss. Falls eine Kündigungsfrist angegeben ist, erwähne " +
      "sie im Brief (z.B. 'unter Einhaltung der vertraglich vereinbarten Frist von X Monaten'). " +
      "Weise NICHT auf gesetzliche Fristen hin — das ist keine Rechtsberatung.",
    fields: [
      { key: "firstName",        label: "Vorname",                                type: "text",     required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                               type: "text",     required: true  },
      { key: "currentAddress",   label: "Deine Adresse",                          type: "address",     required: true  },
      { key: "type",             label: "Was möchtest du kündigen?",              type: "select",   required: true,  section: "Kündigung",
        options: ["Versicherung", "Abonnement / Mitgliedschaft", "Anderes"] },
      { key: "recipientName",    label: "Name des Empfängers (Vermieter, Firma …)", type: "text",   required: true  },
      { key: "recipientAddress", label: "Adresse des Empfängers",                type: "text",     required: true  },
      { key: "contractRef",      label: "Vertrags-/Kunden-/Policennummer",        type: "text",     required: false, placeholderKey: "fallsAvailable" },
      { key: "noticePeriod",     label: "Kündigungsfrist",                        type: "select",   required: false,
        options: ["1 Monat", "2 Monate", "3 Monate", "6 Monate", "1 Jahr", "Weiss nicht / laut Vertrag"],
        fillsDateField: "terminationDate" },
      { key: "terminationDate",  label: "Kündigungsdatum",                        type: "date",     required: true,  autoFilledHint: true },
      { key: "reason",           label: "Kündigungsgrund (optional)",             type: "textarea", required: false,
        placeholderKey: "optionalReason" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // Weitere Tools
  // ─────────────────────────────────────────────────────────────

  arbeitszeugnis: {
    slug: "arbeitszeugnis",
    priceChfRappen: 500,
    supportsAllDocumentTypes: true,
    uploadLabelDe: "Zeugnis hochladen (optional)",
    uploadHintDe: "Lade dein Zeugnis hoch — als Foto, PDF oder Word-Datei. Wir lesen es automatisch.",
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
      { key: "firstName",     label: "Vorname",                      type: "text",     required: true, section: "Deine Angaben" },
      { key: "lastName",      label: "Nachname",                     type: "text",     required: true },
      { key: "position",      label: "Deine Stelle / Funktion",      type: "text",     required: true },
      { key: "employer",      label: "Name des Arbeitgebers",        type: "text",     required: true },
      { key: "duration",      label: "Beschäftigungsdauer",          type: "text",     required: true, placeholderKey: "dateRange" },
      { key: "whatToImprove", label: "Was soll verbessert werden?",  type: "textarea", required: false,
        section: "Verbesserungen",
        hint: "Kein Problem, wenn du nichts weisst — wir analysieren das Zeugnis und verbessern es automatisch." },
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
      { key: "currentAddress",   label: "Deine Adresse (Mietobjekt)",   type: "address",     required: true  },
      { key: "landlordName",     label: "Name des Vermieters / Verwaltung", type: "text", required: true,  section: "Vermieter" },
      { key: "landlordAddress",  label: "Adresse des Vermieters",       type: "text",     required: true  },
      { key: "defects",          label: "Beschreibe die Schäden",       type: "textarea", required: true,
        placeholderKey: "damageDescription",
        section: "Schäden" },
      { key: "deadline",         label: "Frist zur Behebung (Tage)",    type: "number",   required: true },
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
      { key: "currentAddress",   label: "Deine Adresse",                type: "address",     required: true  },
      { key: "recipientName",    label: "Name des Unternehmens",        type: "text",     required: true,  section: "Empfänger" },
      { key: "recipientAddress", label: "Adresse des Empfängers",       type: "text",     required: true  },
      { key: "orderRef",         label: "Bestellnummer / Referenz",     type: "text",     required: false, placeholderKey: "fallsAvailable" },
      { key: "complaint",        label: "Was ist passiert?",            type: "textarea", required: true,
        placeholderKey: "complaintDescription",
        section: "Reklamation" },
      { key: "demand",           label: "Was verlangst du?",            type: "textarea", required: true,
        placeholderKey: "desiredOutcome" },
      { key: "deadline",         label: "Frist (Werktage)",             type: "number",   required: false, placeholder: "10" },
    ],
  },

  lebenslauf: {
    slug: "lebenslauf",
    priceChfRappen: 500,
    supportsAllDocumentTypes: true,
    supportsProfilePhoto: true,
    uploadLabelDe: "Bestehenden Lebenslauf hochladen (optional)",
    uploadHintDe: "Hast du einen alten Lebenslauf? Lade ihn hoch — als Foto, PDF oder Word-Datei. Wir lesen ihn automatisch.",
    documentTitleDe: "Lebenslauf",
    descriptionDe:
      "Dein Lebenslauf — professionell aufgebaut, angepasst an deinen Arbeitsmarkt.",
    systemPrompt:
      "Du bist Karriereberater mit Spezialisierung auf den Schweizer Arbeitsmarkt. " +
      "Erstelle einen professionellen Lebenslauf auf Deutsch. Falls ein bestehender Lebenslauf hochgeladen wurde, " +
      "berücksichtige ihn vollständig. Nutze alle vom Nutzer angegebenen Daten (Arbeitsstellen, Ausbildung, Sprachen etc.). " +
      "Schweizer Standard: prägnant, maximal eine Seite, rückwärts chronologisch. " +
      "Gib nur das Dokument aus — keine Erklärungen.\n\n" +
      "AUSGABEFORMAT LEBENSLAUF — ZWINGEND:\n" +
      "Erster Block: Vor- und Nachname (Zeile 1), Berufsbezeichnung (Zeile 2), Adresse (Zeile 3), E-Mail und Telefon (Zeile 4, nur wenn angegeben).\n" +
      "Sektionen in GROSSBUCHSTABEN (z.B. BERUFSERFAHRUNG, AUSBILDUNG, SPRACHEN, KENNTNISSE).\n" +
      "Pro Stelle: Berufsbezeichnung (Zeile 1), Firma und Ort (Zeile 2), Zeitraum wie '2020 – 2023' (Zeile 3), kurze Beschreibung (Zeile 4).\n" +
      "Kein Markdown, keine Bindestriche als Listenpunkte, keine --- Trennlinien.",
    fields: [
      { key: "firstName",       label: "Vorname",                                 type: "text",     required: true,  section: "Persönliche Angaben" },
      { key: "lastName",        label: "Nachname",                                type: "text",     required: true  },
      { key: "currentAddress",  label: "Adresse",                                 type: "address",     required: true  },
      { key: "email",           label: "E-Mail",                                  type: "email",    required: true  },
      { key: "phone",           label: "Telefon",                                 type: "tel",      required: false },
      { key: "currentJob",      label: "Aktueller Beruf / Ausbildung",            type: "text",     required: false, section: "Berufserfahrung" },
      { key: "workHistory",     label: "Bisherige Arbeitsstellen",                type: "textarea", required: false },
      { key: "education",       label: "Ausbildung / Studium (optional)",         type: "textarea", required: false,
        section: "Ausbildung" },
      { key: "languages",       label: "Sprachen (mit Niveau)",                   type: "text",     required: false,
        placeholder: "Deutsch (Muttersprache), Englisch (C1), Französisch (B2)",
        section: "Sprachen & Kenntnisse" },
      { key: "topSkills",       label: "Wichtigste Fähigkeiten / Kenntnisse",     type: "textarea", required: false,
        placeholderKey: "skillsExample" },
      { key: "targetJob",       label: "Für welche Art Stelle bewirbst du dich?", type: "text",     required: false,
        placeholderKey: "targetJobExample",
        section: "Fokus" },
      { key: "improvements",    label: "Worauf soll der Fokus gelegt werden?",    type: "textarea", required: false,
        placeholderKey: "cvImprovements",
        hint: "Kein Problem, wenn du nichts weisst — wir optimieren automatisch." },
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
      { key: "currentAddress", label: "Deine Adresse",             type: "address",     required: true  },
      { key: "birthDate",      label: "Geburtsdatum",              type: "date",     required: true  },
      { key: "insuranceName",  label: "Name der Krankenkasse",     type: "text",     required: true,  section: "Krankenkasse" },
      { key: "policyNumber",   label: "Versicherungs-/Policennummer", type: "text",  required: true  },
      { key: "topic",          label: "Thema des Briefes",         type: "select",   required: true,
        options: ["Prämienreduktion beantragen", "Kostengutsprache / Leistungsanfrage", "Kündigung der Zusatzversicherung", "Reklamation / Einsprache", "Andere Anfrage"] },
      { key: "details",        label: "Dein Anliegen",             type: "textarea", required: true,
        placeholderKey: "concernDetails",
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
      "Bestätigung, höflicher Abschluss. Falls eine Kündigungsfrist angegeben ist, erwähne sie im Brief " +
      "(z.B. 'unter Einhaltung der vertraglich vereinbarten Frist von X Monaten'). " +
      "Weise NICHT auf gesetzliche Fristen hin.",
    fields: [
      { key: "firstName",        label: "Vorname",                           type: "text", required: true,  section: "Mieter" },
      { key: "lastName",         label: "Nachname",                          type: "text", required: true  },
      { key: "currentAddress",   label: "Deine Adresse (Mietobjekt)",        type: "address", required: true  },
      { key: "landlordName",     label: "Name des Vermieters / Verwaltung",  type: "text", required: true,  section: "Vermieter" },
      { key: "landlordAddress",  label: "Adresse des Vermieters",            type: "text", required: true  },
      { key: "noticePeriod",     label: "Kündigungsfrist",                   type: "select", required: false, section: "Kündigung",
        options: ["1 Monat", "2 Monate", "3 Monate", "6 Monate", "Weiss nicht / laut Vertrag"],
        fillsDateField: "terminationDate" },
      { key: "terminationDate",  label: "Kündigungsdatum",                   type: "date", required: true,  autoFilledHint: true },
      { key: "reason",           label: "Kündigungsgrund (optional)",        type: "textarea", required: false, placeholderKey: "optionalReason" },
    ],
  },

  komplettbewerbung: {
    slug: "komplettbewerbung",
    priceChfRappen: 800,
    isBundle: true,
    supportsProfilePhoto: true,
    supportsAllDocumentTypes: true,
    uploadLabelDe: "Bestehenden Lebenslauf hochladen (optional)",
    uploadHintDe: "Hast du einen alten Lebenslauf? Lade ihn hoch — als Foto, PDF oder Word-Datei. Wir lesen ihn automatisch und integrieren ihn in den neuen Lebenslauf.",
    documentTitleDe: "Komplettbewerbung",
    descriptionDe:
      "Bewerbungsschreiben + Lebenslauf in einem — professionell, aufeinander abgestimmt, sofort einsatzbereit.",
    systemPrompt:
      "Du bist Experte für Bewerbungen auf dem Schweizer Arbeitsmarkt. Erstelle ZWEI aufeinander abgestimmte Dokumente:\n\n" +
      "TEIL 1 — BEWERBUNGSSCHREIBEN:\n" +
      "Professionelles Motivationsschreiben nach Schweizer Standard: Absender-Block oben links, Empfänger-Block, " +
      "Ort und Datum, Betreff (in GROSSBUCHSTABEN), Anrede, klare Gliederung (Einleitung / Hauptteil mit " +
      "konkretem Bezug zur Stelle und zum Unternehmen / Schluss mit Call-to-Action), höflicher Abschluss.\n\n" +
      "Schreibe nach dem Bewerbungsschreiben auf einer eigenen Zeile exakt: ===LEBENSLAUF===\n\n" +
      "TEIL 2 — LEBENSLAUF:\n" +
      "Vollständiger, professioneller Lebenslauf nach Schweizer Standard: Persönliche Daten / " +
      "Berufserfahrung rückwärts chronologisch / Ausbildung / Sprachen / Weiterbildungen & Zertifikate. " +
      "Prägnant, übersichtlich, auf die angegebene Stelle ausgerichtet.\n\n" +
      "LEBENSLAUF AUSGABEFORMAT — ZWINGEND:\n" +
      "Erster Block: Vor- und Nachname (Zeile 1), Berufsbezeichnung (Zeile 2), Adresse (Zeile 3), E-Mail und Telefon (Zeile 4, nur wenn angegeben).\n" +
      "Sektionen in GROSSBUCHSTABEN (z.B. BERUFSERFAHRUNG, AUSBILDUNG, SPRACHEN, KENNTNISSE).\n" +
      "Pro Stelle: Berufsbezeichnung (Zeile 1), Firma und Ort (Zeile 2), Zeitraum wie '2020 – 2023' (Zeile 3), kurze Beschreibung (Zeile 4).\n" +
      "Verwende alle angegebenen Arbeitsstellen und Jahreszahlen exakt wie angegeben. Lebenslauf maximal eine Seite. Kein Markdown, keine Bindestriche als Listenpunkte, keine --- Trennlinien.",
    fields: [
      { key: "firstName",       label: "Vorname",                              type: "text",     required: true,  section: "Über dich" },
      { key: "lastName",        label: "Nachname",                             type: "text",     required: true  },
      { key: "currentAddress",  label: "Deine Adresse",                        type: "address",     required: true  },
      { key: "email",           label: "E-Mail",                               type: "email",    required: true  },
      { key: "phone",           label: "Telefon",                              type: "tel",      required: false },
      { key: "currentJob",      label: "Aktueller Beruf / Ausbildung",            type: "text",     required: false },
      { key: "workHistory",     label: "Bisherige Arbeitsstellen",                type: "textarea", required: false },
      { key: "education",       label: "Ausbildung / Studium (optional)",         type: "textarea", required: false },
      { key: "topSkills",       label: "Wichtigste Fähigkeiten und Stärken",      type: "textarea", required: true,
        placeholderKey: "skillsExample" },
      { key: "languages",       label: "Sprachen (mit Niveau)",                   type: "text",     required: false, placeholder: "Deutsch (Muttersprache), Englisch (C1), Französisch (B2)" },
      { key: "targetPosition",  label: "Als was bewirbst du dich?",        type: "text",     required: true,  section: "Die Stelle" },
      { key: "targetCompany",   label: "Name des Unternehmens",                type: "text",     required: true  },
      { key: "companyAddress",  label: "Adresse des Unternehmens",             type: "text",     required: false },
      { key: "whyCompany",      label: "Warum dieses Unternehmen?",            type: "textarea", required: true,
        placeholderKey: "companyResearch" },
      { key: "whyYou",          label: "Warum bist du die richtige Person?",   type: "textarea", required: true,
        placeholderKey: "whyYou" },
      { key: "improvements",    label: "Fokus für den Lebenslauf (optional)",  type: "textarea", required: false,
        hint: "Was soll im Lebenslauf besonders hervorgehoben werden? Kein Problem, wenn du nichts weisst — wir optimieren ihn automatisch." },
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
      "Arbeitszeugnis, Dank für die Zusammenarbeit, höflicher Abschluss. Falls eine Kündigungsfrist " +
      "angegeben ist, erwähne sie im Brief (z.B. 'unter Einhaltung der Kündigungsfrist von X Monaten'). " +
      "Weise NICHT auf gesetzliche Fristen hin.",
    fields: [
      { key: "firstName",        label: "Vorname",                     type: "text", required: true,  section: "Deine Angaben" },
      { key: "lastName",         label: "Nachname",                    type: "text", required: true  },
      { key: "currentAddress",   label: "Deine Adresse",               type: "address", required: true  },
      { key: "position",         label: "Deine Stelle / Funktion",     type: "text", required: true  },
      { key: "employer",         label: "Name des Arbeitgebers",       type: "text", required: true,  section: "Arbeitgeber" },
      { key: "employerAddress",  label: "Adresse des Arbeitgebers",    type: "text", required: true  },
      { key: "noticePeriod",     label: "Kündigungsfrist",             type: "select", required: false, section: "Kündigung",
        options: ["1 Monat", "2 Monate", "3 Monate", "Weiss nicht / laut Vertrag"],
        fillsDateField: "terminationDate" },
      { key: "terminationDate",  label: "Austrittsdatum",              type: "date", required: true,  autoFilledHint: true },
      { key: "reason",           label: "Kündigungsgrund (optional)",  type: "textarea", required: false, placeholderKey: "optionalReason" },
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
  { key: "arbeit", slugs: ["komplettbewerbung", "jobbewerbung", "lebenslauf", "kuendigung-arbeit", "arbeitszeugnis"] },
  { key: "alltag", slugs: ["kuendigung", "reklamation", "krankenkasse"] },
];
