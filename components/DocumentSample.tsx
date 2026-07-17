import { ToolDefinition } from "@/lib/tools";

// Beispiel-Dokument auf der Tool-Seite: zeigt dem Besucher VOR dem Ausfüllen,
// wie das fertige Schreiben aussieht (Conversion-Hebel). Der Betreff nutzt den
// bereits übersetzten Tool-Titel; der Fliesstext ist ein neutrales visuelles
// Skelett (grAue Balken), damit in keiner der 15 Sprachen falscher Text erscheint.
// Übersetzte Marketing-Strings kommen aus dict.tools.sampleDoc (mit DE-Fallback).

interface SampleDict {
  eyebrow?: string;
  badge?: string;
  salutation?: string;
  closing?: string;
  benefit1?: string;
  benefit2?: string;
  benefit3?: string;
  caption?: string;
  bodyCancel?: string;
  bodyComplaint?: string;
  bodyApply?: string;
  bodyWithdraw?: string;
  body2?: string;
  placeholder?: string;
  subjectCancel?: string;
  subjectRent?: string;
  subjectJobCancel?: string;
  subjectComplaint?: string;
  subjectDefect?: string;
  subjectApply?: string;
  subjectApplyHome?: string;
  subjectWithdraw?: string;
}

const FALLBACK: Required<SampleDict> = {
  eyebrow: "So sieht dein fertiges Dokument aus",
  badge: "Beispiel",
  salutation: "Sehr geehrte Damen und Herren",
  closing: "Freundliche Grüsse",
  benefit1: "Sauberes, professionelles Layout",
  benefit2: "Korrekte Anrede und Betreff",
  benefit3: "Als PDF zum Herunterladen",
  caption: "Vorschau gratis · Erst zahlen, wenn du zufrieden bist",
  bodyCancel: "Hiermit kündige ich meinen Vertrag ordentlich und fristgerecht zum nächstmöglichen Termin.",
  bodyComplaint: "Hiermit reklamiere ich den nachstehend geschilderten Sachverhalt und bitte Sie um eine zeitnahe Lösung.",
  bodyApply: "Mit grossem Interesse bewerbe ich mich bei Ihnen und stelle mich Ihnen gerne kurz vor.",
  bodyWithdraw: "Hiermit widerrufe ich meinen Vertrag beziehungsweise meine Bestellung fristgerecht.",
  body2: "Über eine kurze schriftliche Rückmeldung würde ich mich freuen.",
  placeholder: "Hier steht dein persönliches Anliegen – individuell für dich formuliert.",
  subjectCancel: "Kündigung meines Vertrags",
  subjectRent: "Kündigung meines Mietvertrags",
  subjectJobCancel: "Kündigung meines Arbeitsvertrags",
  subjectComplaint: "Reklamation",
  subjectDefect: "Mängel in meiner Wohnung",
  subjectApply: "Bewerbung um Ihre Stelle",
  subjectApplyHome: "Bewerbung um Ihre Wohnung",
  subjectWithdraw: "Widerruf meines Vertrags",
};

// Tools ohne klassisches Anschreiben (Lebenslauf-artig) bekommen ein CV-Skelett.
const CV_SLUGS = new Set(["lebenslauf", "arbeitszeugnis"]);
// Ordnet jedem Brief-Tool einen passenden echten Einleitungssatz zu.
const COMPLAINT_SLUGS = new Set(["reklamation", "maengelruege"]);
const APPLY_SLUGS = new Set(["mietbewerbung", "jobbewerbung", "komplettbewerbung"]);

function openingFor(slug: string, s: Required<SampleDict>): string {
  if (slug === "widerruf") return s.bodyWithdraw;
  if (COMPLAINT_SLUGS.has(slug)) return s.bodyComplaint;
  if (APPLY_SLUGS.has(slug)) return s.bodyApply;
  return s.bodyCancel;
}

function subjectFor(slug: string, s: Required<SampleDict>): string {
  switch (slug) {
    case "widerruf":
      return s.subjectWithdraw;
    case "mietbewerbung":
      return s.subjectApplyHome;
    case "jobbewerbung":
    case "komplettbewerbung":
      return s.subjectApply;
    case "kuendigung-wohnung":
    case "ausserterminliche-kuendigung":
    case "ausserordentliche-kuendigung":
      return s.subjectRent;
    case "kuendigung-arbeit":
      return s.subjectJobCancel;
    case "reklamation":
      return s.subjectComplaint;
    case "maengelruege":
      return s.subjectDefect;
    default:
      return s.subjectCancel; // kuendigung
  }
}

const PAPER = "#FBFAF7";
const BAR = "#E7E3DA";
const BAR_SOFT = "#EFEBE3";
const INK = "#2A2723";
const INK_SOFT = "#6B665E";

function Bar({ w, soft }: { w: string; soft?: boolean }) {
  return (
    <div
      style={{ width: w, height: 8, borderRadius: 999, backgroundColor: soft ? BAR_SOFT : BAR }}
    />
  );
}

export default function DocumentSample({
  tool,
  dict,
  prefill,
  rtl = false,
}: {
  tool: ToolDefinition;
  dict: any;
  prefill?: Record<string, string>;
  rtl?: boolean;
}) {
  const s: Required<SampleDict> = { ...FALLBACK, ...(dict?.tools?.sampleDoc ?? {}) };
  const isCv = CV_SLUGS.has(tool.slug);
  const subject = subjectFor(tool.slug, s);
  const opening = openingFor(tool.slug, s);

  const recipientName = prefill?.recipientName;
  const recipientLines = prefill?.recipientAddress
    ? prefill.recipientAddress.split("\n").filter(Boolean)
    : [];
  const hasRecipient = Boolean(recipientName);

  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
        {s.eyebrow}
      </p>

      <div className="relative overflow-hidden rounded-lg" style={{ backgroundColor: PAPER, padding: "24px 26px" }}>
        <div
          className="absolute top-4 rounded-sm text-[10px] font-medium uppercase tracking-widest"
          style={{ backgroundColor: "#F0B429", color: "#4A3606", padding: "5px 12px", [rtl ? "left" : "right"]: -6 }}
        >
          {s.badge}
        </div>

        {isCv ? (
          <div style={{ fontFamily: "Georgia, serif" }}>
            <div style={{ height: 14, width: "45%", borderRadius: 999, backgroundColor: INK }} />
            <div className="mt-2" style={{ height: 9, width: "32%", borderRadius: 999, backgroundColor: INK_SOFT }} />
            <div className="mt-6 space-y-5">
              {[0, 1, 2].map((b) => (
                <div key={b}>
                  <div style={{ height: 9, width: "38%", borderRadius: 999, backgroundColor: "#C9A24B" }} />
                  <div className="mt-3 space-y-2">
                    <Bar w="92%" />
                    <Bar w="86%" soft />
                    <Bar w="70%" soft />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "Georgia, serif" }}>
            {/* Absenderzeile (neutral) */}
            <Bar w="58%" soft />

            {/* Empfänger: echte Daten bei Markenseiten, sonst Skelett */}
            <div className="mt-5">
              {hasRecipient ? (
                <div style={{ color: INK, fontSize: 12, lineHeight: 1.6 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{recipientName}</p>
                  {recipientLines.map((l, i) => (
                    <p key={i} style={{ margin: 0 }}>{l}</p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Bar w="40%" />
                  <Bar w="46%" soft />
                  <Bar w="34%" soft />
                </div>
              )}
            </div>

            {/* Datumzeile */}
            <div className="mt-4 flex justify-start">
              <Bar w="26%" soft />
            </div>

            {/* Betreff = lokalisierter Tool-Titel */}
            <p className="mt-4" style={{ color: INK, fontSize: 13, fontWeight: 700, margin: "16px 0 12px" }}>
              {subject}
            </p>

            {/* Anrede (übersetzt) */}
            <p style={{ color: INK, fontSize: 12, lineHeight: 1.7, margin: "0 0 10px" }}>{s.salutation}</p>

            {/* Ein echter, überzeugender Einleitungssatz (pro Tool-Typ) */}
            <p style={{ color: INK, fontSize: 12, lineHeight: 1.7, margin: "0 0 10px" }}>{opening}</p>

            {/* Hervorgehobene Platzhalter-Zeile: zeigt die Individualisierung */}
            <div
              className="flex items-center gap-2"
              style={{ backgroundColor: "#FBF0D5", borderRadius: 5, padding: "8px 10px", margin: "0 0 12px" }}
            >
              <span style={{ color: "#B07E12", fontSize: 12 }}>✎</span>
              <span style={{ color: "#8A6410", fontSize: 12, lineHeight: 1.5, fontStyle: "italic" }}>{s.placeholder}</span>
            </div>

            {/* Zweiter echter Satz (Abschluss der Bitte) */}
            <p style={{ color: INK, fontSize: 12, lineHeight: 1.7, margin: "0 0 10px" }}>{s.body2}</p>

            {/* Angedeuteter Rest (Skelett) – verhindert vollständiges Abschreiben */}
            <div className="space-y-2">
              <Bar w="70%" soft />
            </div>

            {/* Gruss + Signatur (übersetzt) */}
            <p style={{ color: INK_SOFT, fontSize: 12, lineHeight: 1.7, margin: "18px 0 8px" }}>{s.closing}</p>
            <Bar w="30%" />
          </div>
        )}
      </div>

      {/* Nutzenversprechen */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[s.benefit1, s.benefit2, s.benefit3].map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 px-3 py-1.5 text-xs text-cream-muted"
          >
            <span className="text-swiss-gold">✓</span> {b}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-cream-subtle">{s.caption}</p>
    </div>
  );
}
