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
  bodyObjection?: string;
  body2?: string;
  body2Apply?: string;
  placeholder?: string;
  subjectCancel?: string;
  subjectRent?: string;
  subjectJobCancel?: string;
  subjectComplaint?: string;
  subjectDefect?: string;
  subjectApply?: string;
  subjectApplyHome?: string;
  subjectWithdraw?: string;
  subjectObjection?: string;
}

const FALLBACK: Required<SampleDict> = {
  eyebrow: "So sieht dein fertiges Dokument aus",
  badge: "Beispiel",
  salutation: "Sehr geehrte Damen und Herren",
  closing: "Freundliche Grüsse",
  benefit1: "Sauberes, professionelles Layout",
  benefit2: "Korrekte Anrede und Betreff",
  benefit3: "Als PDF & bearbeitbare Word-Datei",
  caption: "Vorschau gratis · Erst zahlen, wenn du zufrieden bist",
  bodyCancel: "Hiermit kündige ich den bestehenden Vertrag unter Einhaltung der vertraglich vereinbarten Frist ordentlich und fristgerecht auf den ___. Dieses Schreiben wird Ihnen per Einschreiben zugestellt.",
  bodyComplaint: "Hiermit reklamiere ich ___ und bitte Sie um eine zeitnahe, verbindliche Lösung. Der Mangel besteht seit ___.",
  bodyApply: "Mit grossem Interesse bewerbe ich mich um ___. Meine Erfahrung als ___ und meine Motivation passen sehr gut zu Ihren Anforderungen.",
  bodyWithdraw: "Hiermit widerrufe ich den am ___ geschlossenen Vertrag (Bestell-/Vertragsnummer ___) fristgerecht.",
  bodyObjection: "Hiermit lege ich fristwahrend Widerspruch gegen Ihren Bescheid vom ___ (Aktenzeichen ___) ein.",
  body2: "Der Grund dafür ist ___. Ich bitte Sie, mir dies schriftlich zu bestätigen sowie mir die weiteren Schritte …",
  body2Apply: "Besonders wichtig ist mir dabei ___. Gerne überzeuge ich Sie in einem persönlichen Gespräch — ich freue mich auf Ihre Rückmeldung …",
  placeholder: "Hier steht dein persönliches Anliegen – individuell für dich formuliert.",
  subjectCancel: "Kündigung meines Vertrags",
  subjectRent: "Kündigung des Mietvertrags für die Wohnung an der ___",
  subjectJobCancel: "Kündigung meines Arbeitsvertrags",
  subjectComplaint: "Reklamation",
  subjectDefect: "Mängel in meiner Wohnung",
  subjectApply: "Bewerbung um Ihre Stelle",
  subjectApplyHome: "Bewerbung um Ihre Wohnung",
  subjectWithdraw: "Widerruf meines Vertrags",
  subjectObjection: "Widerspruch gegen Ihren Bescheid",
};

// Tools ohne klassisches Anschreiben (Lebenslauf-artig) bekommen ein CV-Skelett.
const CV_SLUGS = new Set(["lebenslauf", "arbeitszeugnis"]);
// Ordnet jedem Brief-Tool einen passenden echten Einleitungssatz zu.
const COMPLAINT_SLUGS = new Set(["reklamation", "maengelruege"]);
const APPLY_SLUGS = new Set(["mietbewerbung", "jobbewerbung", "komplettbewerbung"]);

function openingFor(slug: string, s: Required<SampleDict>): string {
  if (slug === "widerruf") return s.bodyWithdraw;
  if (slug === "widerspruch") return s.bodyObjection;
  if (COMPLAINT_SLUGS.has(slug)) return s.bodyComplaint;
  if (APPLY_SLUGS.has(slug)) return s.bodyApply;
  return s.bodyCancel;
}

function subjectFor(slug: string, s: Required<SampleDict>): string {
  switch (slug) {
    case "widerruf":
      return s.subjectWithdraw;
    case "widerspruch":
      return s.subjectObjection;
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

const PAPER = "#faf8f4";
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

// Maskierte Zeile — stellt persönliche Daten (Name, Adresse …) als Punkte dar,
// damit das Beispiel wie ein echter Brief wirkt, ohne echte oder erfundene Daten zu zeigen.
function Mask({ groups, bold, dim }: { groups: number[]; bold?: boolean; dim?: boolean }) {
  return (
    <span style={{ color: dim ? "#BCB6AA" : INK_SOFT, fontSize: 12, lineHeight: 1.7, fontWeight: bold ? 600 : 400, letterSpacing: 1.5 }}>
      {groups.map((n) => "•".repeat(n)).join(" ")}
    </span>
  );
}

// Text mit Inline-Maskierung: "___" im Übersetzungstext wird als Punkte gerendert —
// genau dort, wo im echten Dokument die Eingaben des Nutzers stehen.
function MaskedText({ text }: { text: string }) {
  const parts = text.split("___");
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && <span style={{ color: "#9A948A", letterSpacing: 2 }}>••••••</span>}
        </span>
      ))}
    </>
  );
}

export default function DocumentSample({
  tool,
  dict,
  prefill,
  rtl = false,
  locale = "de",
}: {
  tool: ToolDefinition;
  dict: any;
  prefill?: Record<string, string>;
  rtl?: boolean;
  locale?: string;
}) {
  const s: Required<SampleDict> = { ...FALLBACK, ...(dict?.tools?.sampleDoc ?? {}) };
  const isCv = CV_SLUGS.has(tool.slug);
  // Echtes, lokalisiertes Datum — gibt dem Beispiel mehr Dokument-Charakter
  let sampleDate = "";
  try {
    sampleDate = new Date().toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    sampleDate = new Date().toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
  }
  const subject = subjectFor(tool.slug, s);
  const opening = openingFor(tool.slug, s);

  // Zweiter Absatz: bei Bewerbungs-Tools der Bewerbungs-Schluss, sonst Grund + Bestätigung.
  // WICHTIG: body2Apply existiert nur in DE/EN/ES — Sprachen ohne eigenen Wert nutzen
  // ihr eigenes body2 (statt des deutschen Fallbacks aus FALLBACK).
  const dictSample = dict?.tools?.sampleDoc ?? {};
  const second = APPLY_SLUGS.has(tool.slug)
    ? (dictSample.body2Apply ?? dictSample.body2 ?? FALLBACK.body2Apply)
    : s.body2;

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
          // Lebenslauf-Skelett: sieht wie ein echter, professioneller CV aus —
          // Foto, Name, Rolle, Kontaktzeile und datierte Abschnitte. Persönliche
          // Daten sind als Punkte maskiert (kein Text → in allen 15 Sprachen korrekt).
          <div style={{ fontFamily: "Georgia, serif", textAlign: rtl ? "right" : "left" }}>
            {/* Kopfbereich: Foto + Name + Rolle */}
            <div style={{ display: "flex", flexDirection: rtl ? "row-reverse" : "row", alignItems: "center", gap: 16 }}>
              <div style={{ width: 54, height: 54, borderRadius: 8, backgroundColor: BAR_SOFT, flexShrink: 0 }} />
              <div>
                <div style={{ marginBottom: 6 }}><Mask groups={[4, 6]} bold /></div>
                <span style={{ color: "#B8901F", fontSize: 12, letterSpacing: 1.5 }}>{"••••• ••••"}</span>
              </div>
            </div>

            {/* Kontaktzeile (E-Mail, Telefon, Adresse — maskiert) */}
            <div style={{ display: "flex", flexDirection: rtl ? "row-reverse" : "row", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
              {[5, 4, 6].map((n, i) => (
                <span key={i} style={{ color: "#BCB6AA", fontSize: 11, letterSpacing: 1.5 }}>{"•".repeat(n)}</span>
              ))}
            </div>

            {/* Trennlinie */}
            <div style={{ height: 1, backgroundColor: BAR, margin: "16px 0 18px" }} />

            {/* Abschnitte: je Gold-Überschrift, Datum (maskiert) + Position + Fliesstext */}
            <div className="space-y-5">
              {[["94%", "80%"], ["92%", "72%"], ["90%", "84%"]].map((widths, b) => (
                <div key={b}>
                  <div style={{ height: 9, width: "34%", borderRadius: 999, backgroundColor: "#C9A24B", marginLeft: rtl ? "auto" : 0 }} />
                  <div className="mt-3" style={{ display: "flex", flexDirection: rtl ? "row-reverse" : "row", gap: 12 }}>
                    <span style={{ color: "#BCB6AA", fontSize: 11, letterSpacing: 1.5, whiteSpace: "nowrap", marginTop: 2 }}>{"••••"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}><Mask groups={[5, 3]} bold dim /></div>
                      <div className="space-y-2">
                        <Bar w={widths[0]} />
                        <Bar w={widths[1]} soft />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, lineHeight: 1.85, color: "#1a1a1a", textAlign: rtl ? "right" : "left" }}>
            {/* Absender — persönliche Daten maskiert (3 Zeilen wie im echten Brief) */}
            <div>
              <div><Mask groups={[4, 5]} /></div>
              <div><Mask groups={[6, 2]} /></div>
              <div><Mask groups={[4, 6]} /></div>
            </div>

            {/* Empfänger: echte Daten bei Markenseiten, sonst maskiert */}
            <div style={{ marginTop: "1.2em" }}>
              {hasRecipient ? (
                <>
                  <p style={{ margin: 0, fontWeight: 600 }}>{recipientName}</p>
                  {recipientLines.map((l, i) => (
                    <p key={i} style={{ margin: 0 }}>{l}</p>
                  ))}
                </>
              ) : (
                <>
                  <div><Mask groups={[5]} /></div>
                  <div><Mask groups={[6, 4]} /></div>
                  <div><Mask groups={[4, 5]} /></div>
                </>
              )}
            </div>

            {/* Ort, Datum — links, wie in der echten Vorschau (Ort maskiert, Datum echt) */}
            <p style={{ margin: "1.8em 0 0" }}>
              <Mask groups={[4]} />, {sampleDate}
            </p>

            {/* Betreff = lokalisierter Tool-Titel (fett, ggf. mit maskierter Adresse) */}
            <p style={{ fontWeight: 700, margin: "1.8em 0 1.2em" }}><MaskedText text={subject} /></p>

            {/* Anrede (übersetzt) */}
            <p style={{ margin: "0 0 1.2em" }}>{s.salutation}</p>

            {/* Volltext wie in der echten Vorschau — Nutzereingaben als Punkte maskiert */}
            <p style={{ margin: "0 0 1.2em" }}><MaskedText text={opening} /></p>
            <p style={{ margin: "0 0 1.2em" }}><MaskedText text={second} /></p>

            {/* Angedeutete Folge-Zeilen — identisch zur echten Vorschau (Fade-out) */}
            <div style={{ marginTop: 10 }}>
              {[96, 100, 92, 88, 100, 64].map((w, i) => (
                <div key={i} style={{ height: 10, width: `${w}%`, background: "#e6e2da", borderRadius: 2, marginBottom: 11, marginLeft: rtl ? "auto" : 0 }} />
              ))}
            </div>
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

    </div>
  );
}
