// Länderspezifische Gesetzesreferenzen pro Dokument-Typ.
// Werden automatisch in den Claude-Prompt injiziert um rechtskonformes,
// professionelles Dokument mit korrekten Gesetzesangaben zu erzeugen.

import { ToolSlug } from "./tools";

interface LegalRef {
  law: string;
  articles: string;
  note?: string;
}

type CountryRefs = Partial<Record<ToolSlug, LegalRef[]>>;

export const LEGAL_REFS: Record<string, CountryRefs> = {
  CH: {
    "maengelruege": [
      { law: "OR", articles: "Art. 258 ff.", note: "Zustand der Mietsache bei Übergabe und Mängelansprüche des Mieters" },
    ],
    "kuendigung-wohnung": [
      { law: "OR", articles: "Art. 266a–266o", note: "Kündigungsfristen, Form, Schutz vor missbräuchlicher Kündigung" },
    ],
    "kuendigung-arbeit": [
      { law: "OR", articles: "Art. 335–335i", note: "Ordentliche Kündigung, Kündigungsfristen" },
      { law: "OR", articles: "Art. 337", note: "Fristlose Kündigung aus wichtigem Grund" },
    ],
    "arbeitszeugnis": [
      { law: "OR", articles: "Art. 330a", note: "Anspruch auf Zeugnis, Inhalt, Herausgabepflicht" },
    ],
    "reklamation": [
      { law: "OR", articles: "Art. 197–210", note: "Gewährleistung bei Kauf" },
      { law: "OR", articles: "Art. 368–371", note: "Gewährleistung beim Werkvertrag" },
    ],
    "kuendigung": [
      { law: "OR", articles: "Art. 335–335i", note: "Ordentliche Kündigung" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  DE: {
    "maengelruege": [
      { law: "BGB", articles: "§§ 536–536d", note: "Minderung und Schadensersatz bei Sachmängeln" },
      { law: "BGB", articles: "§ 535 Abs. 1 S. 2", note: "Erhaltungspflicht des Vermieters" },
    ],
    "kuendigung-wohnung": [
      { law: "BGB", articles: "§ 568", note: "Form der Kündigung (schriftlich)" },
      { law: "BGB", articles: "§ 573c", note: "Kündigungsfristen für Mieter" },
    ],
    "kuendigung-arbeit": [
      { law: "BGB", articles: "§ 622", note: "Kündigungsfristen für Arbeitnehmer" },
      { law: "KSchG", articles: "§ 1", note: "Sozialwidrigkeit der Kündigung" },
    ],
    "arbeitszeugnis": [
      { law: "BGB", articles: "§ 630", note: "Anspruch auf Zeugnis" },
      { law: "GewO", articles: "§ 109", note: "Zeugnis für Arbeitnehmer" },
    ],
    "reklamation": [
      { law: "BGB", articles: "§§ 437–441", note: "Rechte des Käufers bei Sachmängeln" },
      { law: "BGB", articles: "§ 438", note: "Verjährung der Mängelansprüche" },
    ],
    "kuendigung": [
      { law: "BGB", articles: "§ 622", note: "Kündigungsfristen" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  AT: {
    "maengelruege": [
      { law: "ABGB", articles: "§§ 1096–1097", note: "Erhaltungs- und Reparaturpflicht des Vermieters" },
      { law: "MRG", articles: "§ 3", note: "Allgemeine Erhaltungspflicht" },
    ],
    "kuendigung-wohnung": [
      { law: "MRG", articles: "§§ 29–33", note: "Aufkündigung, Fristen, Formvorschriften" },
    ],
    "kuendigung-arbeit": [
      { law: "AngG", articles: "§§ 20–23", note: "Kündigung durch Angestellte, Fristen" },
      { law: "ABGB", articles: "§ 1159", note: "Allgemeine Kündigungsfristen" },
    ],
    "arbeitszeugnis": [
      { law: "AngG", articles: "§ 39", note: "Anspruch auf Dienstzeugnis" },
    ],
    "reklamation": [
      { law: "ABGB", articles: "§§ 922–933b", note: "Gewährleistung" },
      { law: "KSchG", articles: "§ 8", note: "Gewährleistung gegenüber Verbrauchern" },
    ],
    "kuendigung": [
      { law: "ABGB", articles: "§ 1159", note: "Kündigungsfristen" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  FR: {
    "maengelruege": [
      { law: "Code civil", articles: "Art. 1719–1721", note: "Obligations du bailleur, délivrance et entretien" },
      { law: "Loi n° 89-462 du 6 juillet 1989", articles: "Art. 6", note: "Obligation de délivrer un logement décent" },
    ],
    "kuendigung-wohnung": [
      { law: "Loi n° 89-462 du 6 juillet 1989", articles: "Art. 12 et 15", note: "Congé donné par le locataire, délai de préavis (3 mois, réduit à 1 mois en zone tendue ou logement meublé)" },
    ],
    "kuendigung-arbeit": [
      { law: "Code du travail", articles: "L. 1237-1", note: "Démission, préavis selon convention collective" },
    ],
    "arbeitszeugnis": [
      { law: "Code du travail", articles: "L. 1234-19", note: "Certificat de travail obligatoire" },
    ],
    "reklamation": [
      { law: "Code de la consommation", articles: "L. 217-1 à L. 217-20", note: "Garantie légale de conformité" },
      { law: "Code civil", articles: "Art. 1641–1649", note: "Garantie des vices cachés" },
    ],
    "kuendigung": [
      { law: "Code du travail", articles: "L. 1234-1", note: "Délai de préavis" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  IT: {
    "maengelruege": [
      { law: "Codice Civile", articles: "Art. 1576–1578", note: "Riparazioni e vizi della cosa locata" },
    ],
    "kuendigung-wohnung": [
      { law: "L. 392/1978", articles: "Art. 3", note: "Disdetta da parte del conduttore, preavviso" },
    ],
    "kuendigung-arbeit": [
      { law: "Codice Civile", articles: "Art. 2118", note: "Recesso dal contratto a tempo indeterminato" },
      { law: "L. 604/1966", articles: "Art. 1–10", note: "Disciplina dei licenziamenti individuali" },
    ],
    "arbeitszeugnis": [
      { law: "Codice Civile", articles: "Art. 2124", note: "Obbligo di rilascio del certificato di lavoro" },
    ],
    "reklamation": [
      { law: "Codice del Consumo", articles: "Art. 128–135", note: "Garanzia legale di conformità" },
      { law: "Codice Civile", articles: "Art. 1490–1495", note: "Garanzia per vizi della cosa venduta" },
    ],
    "kuendigung": [
      { law: "Codice Civile", articles: "Art. 2118", note: "Recesso dal contratto" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  ES: {
    "maengelruege": [
      { law: "LAU", articles: "Art. 21", note: "Obligación del arrendador de conservar la vivienda" },
    ],
    "kuendigung-wohnung": [
      { law: "LAU", articles: "Art. 11", note: "Desistimiento del contrato por el arrendatario" },
    ],
    "kuendigung-arbeit": [
      { law: "ET", articles: "Art. 49.1.d", note: "Dimisión del trabajador, preaviso según convenio (habitualmente 15 días)" },
    ],
    "arbeitszeugnis": [
      { law: "ET", articles: "Art. 8.5", note: "Certificado de empresa" },
    ],
    "reklamation": [
      { law: "LGDCU (RDL 1/2007)", articles: "Art. 114–126", note: "Garantías en la compraventa de bienes" },
    ],
    "kuendigung": [
      { law: "ET", articles: "Art. 49", note: "Extinción del contrato de trabajo" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  BE: {
    "maengelruege": [
      { law: "Code civil", articles: "Art. 1719–1721", note: "Obligations du bailleur (délivrance et entretien)" },
      { law: "Décret wallon / Vlaamse Wooncode", articles: "", note: "Normes régionales de salubrité du logement" },
    ],
    "kuendigung-wohnung": [
      { law: "Code civil", articles: "Art. 1736–1742", note: "Résiliation du bail par le locataire" },
    ],
    "kuendigung-arbeit": [
      { law: "Loi du 3 juillet 1978", articles: "Art. 37", note: "Délais de préavis selon l'ancienneté" },
    ],
    "arbeitszeugnis": [
      { law: "Loi du 3 juillet 1978", articles: "Art. 23", note: "Certificat de travail et document social" },
    ],
    "reklamation": [
      { law: "Code de droit économique", articles: "Art. V.1.1–V.1.15", note: "Garantie légale de conformité" },
    ],
    "kuendigung": [
      { law: "Loi du 3 juillet 1978", articles: "Art. 37", note: "Délais de préavis" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  NL: {
    "maengelruege": [
      { law: "BW", articles: "Art. 7:204–7:222", note: "Gebreken aan het gehuurde goed" },
    ],
    "kuendigung-wohnung": [
      { law: "BW", articles: "Art. 7:271", note: "Opzegging huurovereenkomst door huurder" },
    ],
    "kuendigung-arbeit": [
      { law: "BW", articles: "Art. 7:672", note: "Opzegtermijn voor de werknemer" },
    ],
    "arbeitszeugnis": [
      { law: "BW", articles: "Art. 7:656", note: "Recht op getuigschrift" },
    ],
    "reklamation": [
      { law: "BW", articles: "Art. 7:17–7:24", note: "Non-conformiteit en rechtsmiddelen" },
    ],
    "kuendigung": [
      { law: "BW", articles: "Art. 7:672", note: "Opzegtermijn" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  GB: {
    "maengelruege": [
      { law: "Landlord and Tenant Act 1985", articles: "s. 11", note: "Landlord's duty to keep structure and exterior in repair" },
      { law: "Housing Act 2004", articles: "HHSRS", note: "Housing Health and Safety Rating System" },
    ],
    "kuendigung-wohnung": [
      { law: "Renters' Rights Act 2025", articles: "s. 20", note: "Notice to quit by tenant: written, minimum 2 months (shorter if the tenancy agreement allows), expiring at the end of a rent period" },
    ],
    "kuendigung-arbeit": [
      { law: "Employment Rights Act 1996", articles: "s. 86", note: "Minimum statutory notice periods" },
    ],
    "arbeitszeugnis": [
      { law: "Employment Rights Act 1996", articles: "s. 1", note: "Written statement of employment particulars" },
    ],
    "reklamation": [
      { law: "Consumer Rights Act 2015", articles: "s. 19–24", note: "Right to repair, replacement or refund within 30 days" },
    ],
    "kuendigung": [
      { law: "Employment Rights Act 1996", articles: "s. 86", note: "Notice periods" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  PL: {
    "maengelruege": [
      { law: "KC", articles: "Art. 662–663", note: "Obowiązki wynajmującego dotyczące stanu technicznego" },
    ],
    "kuendigung-wohnung": [
      { law: "Ustawa o ochronie praw lokatorów", articles: "Art. 11", note: "Wypowiedzenie umowy najmu przez lokatora" },
    ],
    "kuendigung-arbeit": [
      { law: "KP", articles: "Art. 30–42", note: "Rozwiązanie umowy o pracę, okresy wypowiedzenia" },
    ],
    "arbeitszeugnis": [
      { law: "KP", articles: "Art. 97", note: "Świadectwo pracy — obowiązek wydania" },
    ],
    "reklamation": [
      { law: "KC", articles: "Art. 556–576", note: "Rękojmia za wady fizyczne i prawne" },
    ],
    "kuendigung": [
      { law: "KP", articles: "Art. 36", note: "Okresy wypowiedzenia" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  PT: {
    "maengelruege": [
      { law: "NRAU (Lei n.º 6/2006)", articles: "Art. 1032", note: "Obrigação de manutenção pelo senhorio" },
    ],
    "kuendigung-wohnung": [
      { law: "NRAU (Lei n.º 6/2006)", articles: "Art. 1098", note: "Denúncia pelo arrendatário" },
    ],
    "kuendigung-arbeit": [
      { law: "CT (Lei n.º 7/2009)", articles: "Art. 400", note: "Denúncia do contrato pelo trabalhador, aviso prévio" },
    ],
    "arbeitszeugnis": [
      { law: "CT (Lei n.º 7/2009)", articles: "Art. 341", note: "Certificado de trabalho" },
    ],
    "reklamation": [
      { law: "DL n.º 67/2003", articles: "Art. 2–5", note: "Garantia de conformidade na venda de bens" },
    ],
    "kuendigung": [
      { law: "CT (Lei n.º 7/2009)", articles: "Art. 400", note: "Aviso prévio" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },

  // ── Amerika ──────────────────────────────────────────────────

  US: {
    "kuendigung-arbeit": [],
    "reklamation": [
      { law: "Magnuson-Moss Warranty Act", articles: "15 U.S.C. §§ 2301–2312", note: "Federal warranty law for consumer products" },
      { law: "UCC", articles: "Art. 2 §§ 2-313–2-316", note: "Express and implied warranties (state law)" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [],
    "maengelruege": [], "kuendigung-wohnung": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  CA: {
    "maengelruege": [
      { law: "Residential Tenancies Act 2006 (Ontario)", articles: "s. 20", note: "Landlord's obligation to maintain premises in good repair" },
    ],
    "kuendigung-wohnung": [
      { law: "Residential Tenancies Act 2006 (Ontario)", articles: "s. 44", note: "Tenant's notice to terminate tenancy" },
    ],
    "kuendigung-arbeit": [
      { law: "Canada Labour Code", articles: "s. 230", note: "Notice of termination by employee (federally regulated)" },
    ],
    "reklamation": [
      { law: "Consumer Protection Act 2002 (Ontario)", articles: "s. 9", note: "Implied conditions and warranties" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  BR: {
    "maengelruege": [
      { law: "Código Civil", articles: "Art. 566–568", note: "Obrigações do locador quanto à manutenção" },
    ],
    "kuendigung-wohnung": [
      { law: "Lei 8.245/1991 (Lei do Inquilinato)", articles: "Art. 6", note: "Denúncia pelo locatário, prazo de 30 dias" },
    ],
    "kuendigung-arbeit": [
      { law: "CLT", articles: "Art. 487", note: "Aviso prévio proporcional ao tempo de serviço" },
    ],
    "arbeitszeugnis": [
      { law: "CLT", articles: "Art. 477", note: "Baixa na carteira de trabalho e rescisão" },
    ],
    "reklamation": [
      { law: "CDC (Lei 8.078/1990)", articles: "Art. 18–26", note: "Garantia legal de adequação e prazo para reclamação" },
    ],
    "kuendigung": [
      { law: "CLT", articles: "Art. 487", note: "Aviso prévio" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [],
  },

  MX: {
    "maengelruege": [
      { law: "Código Civil Federal", articles: "Art. 2412", note: "Obligaciones del arrendador de mantener la cosa arrendada" },
    ],
    "kuendigung-wohnung": [
      { law: "Código Civil Federal", articles: "Art. 2483", note: "Terminación del arrendamiento por el arrendatario" },
    ],
    "kuendigung-arbeit": [
      { law: "LFT (Ley Federal del Trabajo)", articles: "Art. 51", note: "Rescisión por parte del trabajador sin responsabilidad" },
    ],
    "reklamation": [
      { law: "LFPC (Ley Federal de Protección al Consumidor)", articles: "Art. 92", note: "Garantía legal, devolución o reparación" },
    ],
    "kuendigung": [
      { law: "LFT", articles: "Art. 51", note: "Rescisión del contrato" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [],
  },

  AR: {
    "maengelruege": [
      { law: "CCC (Ley 26.994)", articles: "Art. 1201", note: "Obligación del locador de conservar la cosa en buen estado" },
    ],
    "kuendigung-wohnung": [
      { law: "CCC (Ley 26.994)", articles: "Art. 1221", note: "Resolución anticipada por el locatario" },
    ],
    "kuendigung-arbeit": [
      { law: "LCT (Ley 20.744)", articles: "Art. 231–233", note: "Preaviso, plazos y compensación" },
    ],
    "reklamation": [
      { law: "Ley 24.240 (Defensa del Consumidor)", articles: "Art. 11–18", note: "Garantía legal por defectos" },
    ],
    "kuendigung": [
      { law: "LCT (Ley 20.744)", articles: "Art. 231", note: "Preaviso" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [],
  },

  CO: {
    "maengelruege": [
      { law: "Código Civil", articles: "Art. 1985", note: "Obligación del arrendador de mantener la cosa" },
    ],
    "kuendigung-wohnung": [
      { law: "Ley 820/2003", articles: "Art. 22", note: "Restitución del inmueble por el arrendatario" },
    ],
    "kuendigung-arbeit": [
      { law: "CST (Código Sustantivo del Trabajo)", articles: "Art. 47", note: "Aviso previo para terminar el contrato" },
    ],
    "reklamation": [
      { law: "Ley 1480/2011 (Estatuto del Consumidor)", articles: "Art. 7–11", note: "Garantía legal de calidad" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  CL: {
    "maengelruege": [
      { law: "Código Civil", articles: "Art. 1924", note: "Obligaciones del arrendador para mantener la cosa" },
    ],
    "kuendigung-wohnung": [
      { law: "Ley 18.101", articles: "Art. 3", note: "Desahucio por el arrendatario, plazo de aviso" },
    ],
    "kuendigung-arbeit": [
      { law: "Código del Trabajo", articles: "Art. 162", note: "Aviso previo de 30 días al empleador" },
    ],
    "reklamation": [
      { law: "Ley 19.496 (Protección al Consumidor)", articles: "Art. 20", note: "Garantía legal por defectos" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  // ── Asien & Naher Osten ──────────────────────────────────────

  JP: {
    "maengelruege": [
      { law: "民法 (Minpō)", articles: "606条", note: "賃貸人の修繕義務 (Pflicht zur Reparatur)" },
    ],
    "kuendigung-wohnung": [
      { law: "民法", articles: "617条・618条", note: "解約の申入れ (Kündigung durch Mieter; bei Gebäuden 3 Monate, sofern vertraglich nichts anderes gilt)" },
    ],
    "kuendigung-arbeit": [
      { law: "労働基準法 (Labor Standards Act)", articles: "20条", note: "解雇予告 (Kündigungsankündigung, 30 Tage)" },
    ],
    "arbeitszeugnis": [
      { law: "労働基準法", articles: "22条", note: "退職時等の証明 (Arbeitszeugnis bei Austritt)" },
    ],
    "reklamation": [
      { law: "消費者契約法", articles: "Art. 8–10", note: "消費者の権利 (Verbraucherrechte)" },
      { law: "民法", articles: "562–570条", note: "売買における契約不適合責任" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "kuendigung": [],
  },

  IN: {
    "maengelruege": [
      { law: "Transfer of Property Act 1882", articles: "s. 108(e)", note: "Lessor's duty to disclose material defects" },
    ],
    "kuendigung-wohnung": [
      { law: "Transfer of Property Act 1882", articles: "s. 106", note: "Notice to quit: 15 days (monthly tenancy)" },
    ],
    "kuendigung-arbeit": [
      { law: "Industrial Disputes Act 1947", articles: "s. 25F", note: "Notice and retrenchment compensation" },
    ],
    "reklamation": [
      { law: "Consumer Protection Act 2019", articles: "s. 2(47), s. 34–36", note: "Unfair trade practices, defective goods" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  AE: {
    "maengelruege": [
      { law: "Law No. 26 of 2007 (Dubai Tenancy Law)", articles: "Art. 16", note: "Landlord's obligation to maintain premises" },
    ],
    "kuendigung-wohnung": [
      { law: "Law No. 33 of 2008 (Dubai)", articles: "Art. 25", note: "Eviction notice requirements" },
    ],
    "kuendigung-arbeit": [
      { law: "UAE Labour Law (Federal Decree-Law No. 33 of 2021)", articles: "Art. 42", note: "Notice period for resignation" },
    ],
    "reklamation": [
      { law: "Federal Law No. 15 of 2020 (Consumer Protection)", articles: "Art. 10", note: "Warranty and liability for defective goods" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  // ── Ozeanien ─────────────────────────────────────────────────

  AU: {
    "maengelruege": [
      { law: "Residential Tenancies Act 2010 (NSW)", articles: "s. 52", note: "Landlord's duty to provide and maintain premises in reasonable state of repair" },
    ],
    "kuendigung-wohnung": [
      { law: "Residential Tenancies Act 2010 (NSW)", articles: "s. 97", note: "Termination of fixed-term agreement by tenant" },
    ],
    "kuendigung-arbeit": [
      { law: "Fair Work Act 2009", articles: "s. 117", note: "Minimum notice of termination by employee" },
    ],
    "arbeitszeugnis": [
      { law: "Fair Work Act 2009", articles: "s. 655", note: "Separation certificate on request" },
    ],
    "reklamation": [
      { law: "Australian Consumer Law (Competition and Consumer Act 2010, Sch. 2)", articles: "s. 54–64", note: "Consumer guarantees as to acceptable quality and fitness" },
    ],
    "kuendigung": [
      { law: "Fair Work Act 2009", articles: "s. 117", note: "Notice periods" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [],
  },

  NZ: {
    "maengelruege": [
      { law: "Residential Tenancies Act 1986", articles: "s. 45", note: "Landlord's responsibilities to maintain premises" },
    ],
    "kuendigung-wohnung": [
      { law: "Residential Tenancies Act 1986", articles: "s. 51", note: "Tenant's notice of termination (21 days)" },
    ],
    "kuendigung-arbeit": [
      { law: "Employment Relations Act 2000", articles: "s. 114", note: "Notice of resignation" },
    ],
    "reklamation": [
      { law: "Consumer Guarantees Act 1993", articles: "s. 6–18", note: "Guarantees as to acceptable quality, fitness for purpose" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  // ── Afrika ───────────────────────────────────────────────────

  ZA: {
    "maengelruege": [
      { law: "Rental Housing Act 50 of 1999", articles: "s. 4", note: "Landlord's obligation to maintain the dwelling" },
    ],
    "kuendigung-wohnung": [
      { law: "Rental Housing Act 50 of 1999", articles: "s. 5(5)", note: "Tenant's right to terminate lease" },
    ],
    "kuendigung-arbeit": [
      { law: "Basic Conditions of Employment Act 75 of 1997", articles: "s. 37", note: "Notice of termination of employment" },
    ],
    "reklamation": [
      { law: "Consumer Protection Act 68 of 2008", articles: "s. 55–61", note: "Consumer's right to safe, good quality goods" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  // ── Osteuropa / GUS ───────────────────────────────────────────

  RU: {
    "maengelruege": [
      { law: "ГК РФ", articles: "ст. 612", note: "Ответственность арендодателя за недостатки сданного имущества" },
    ],
    "kuendigung-wohnung": [
      { law: "ЖК РФ", articles: "ст. 83", note: "Расторжение договора найма жилого помещения" },
    ],
    "kuendigung-arbeit": [
      { law: "ТК РФ", articles: "ст. 80", note: "Расторжение по инициативе работника, предупреждение за 2 недели" },
    ],
    "arbeitszeugnis": [
      { law: "ТК РФ", articles: "ст. 62", note: "Выдача документов, связанных с работой" },
    ],
    "reklamation": [
      { law: "Закон о защите прав потребителей", articles: "ст. 18–21", note: "Права потребителя при продаже товара ненадлежащего качества" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "kuendigung": [],
  },

  UA: {
    "maengelruege": [
      { law: "ЦК України", articles: "ст. 776", note: "Обов'язок наймодавця усунути недоліки" },
    ],
    "kuendigung-wohnung": [
      { law: "ЦК України", articles: "ст. 825", note: "Розірвання договору найму наймачем" },
    ],
    "kuendigung-arbeit": [
      { law: "КЗпП України", articles: "ст. 38", note: "Розірвання трудового договору з ініціативи працівника" },
    ],
    "reklamation": [
      { law: "Закон України «Про захист прав споживачів»", articles: "ст. 8", note: "Права споживача у разі придбання товару неналежної якості" },
    ],
    "mietbewerbung": [], "jobbewerbung": [], "lebenslauf": [], "arbeitszeugnis": [], "kuendigung": [],
  },

  TR: {
    "maengelruege": [
      { law: "TBK", articles: "Art. 305–320", note: "Kiracının hakları, ayıp bildirimi" },
    ],
    "kuendigung-wohnung": [
      { law: "TBK", articles: "Art. 328", note: "Kiracı tarafından fesih" },
    ],
    "kuendigung-arbeit": [
      { law: "İş Kanunu (4857)", articles: "Md. 17", note: "Belirsiz süreli iş sözleşmesinin feshi, ihbar" },
    ],
    "arbeitszeugnis": [
      { law: "İş Kanunu (4857)", articles: "Md. 28", note: "Çalışma belgesi" },
    ],
    "reklamation": [
      { law: "TKHK (6502)", articles: "Md. 11", note: "Ayıplı mal, tüketici hakları" },
    ],
    "kuendigung": [
      { law: "İş Kanunu (4857)", articles: "Md. 17", note: "İhbar süreleri" },
    ],
    "mietbewerbung": [],
    "jobbewerbung": [],
    "lebenslauf": [],
  },
};

/**
 * Gibt relevante Gesetzesreferenzen als Text zurück,
 * bereit zur Injektion in den Claude-Prompt.
 */
export function getLegalReferences(toolSlug: ToolSlug, countryCode: string): string {
  const refs = LEGAL_REFS[countryCode]?.[toolSlug];
  if (!refs || refs.length === 0) return "";

  const lines = refs
    .filter(r => r.articles)
    .map(r => `- ${r.law} ${r.articles}${r.note ? ` (${r.note})` : ""}`)
    .join("\n");

  if (!lines) return "";

  return (
    `RECHTSGRUNDLAGEN (geprüft — NUR diese dürfen zitiert werden):\n${lines}\n` +
    `Erwähne höchstens ein bis zwei dieser Artikel als kurze, professionelle Referenz im Brieftext (z.B. "gemäss § 536 BGB" oder "conformément à l'art. 1719 du Code civil"), nur wo es inhaltlich passt.\n` +
    `Zitiere KEINE anderen Gesetzesartikel und nenne keine konkreten gesetzlichen Fristen aus eigenem Wissen — verwende ausschliesslich die vom Nutzer angegebene Frist.`
  );
}
