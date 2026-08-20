import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";
import { getCountry, LANG_NAMES } from "@/lib/countries";
import { getDocStandards } from "@/lib/docStandards";

// ── Rate-Limiting ────────────────────────────────────────────────────────────
// Pro IP: max. 5 Vorschauen pro Minute.
// In-Memory — reicht für einen serverless-Instance; schützt gegen einfache Angriffe.
const RATE_LIMIT = 5;           // max. Anfragen
const WINDOW_MS  = 60_000;      // pro 60 Sekunden

const ipLog = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = ipLog.get(ip);

  if (!entry || now >= entry.resetAt) {
    ipLog.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}
// ────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate-Limit prüfen
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterSec } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte kurz warten." },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  const { toolSlug, formData, imageBase64, imageMimeType, docxText, listingText, tone, countryCode } = await req.json();

  const tool = getTool(toolSlug);
  if (!tool) {
    return NextResponse.json({ error: "Unbekanntes Tool." }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "Server nicht konfiguriert." }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const lines = tool.fields
    .filter((f) => formData[f.key]?.trim())
    .map((f) => `${f.label}: ${formData[f.key]}`)
    .join("\n");

  const today = new Date().toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });

  // Verlinktes Inserat als Kontext — Bewerbung geht gezielt auf die Anforderungen ein
  const listingBlock = typeof listingText === "string" && listingText.trim()
    ? `\n\nINHALT DES VERLINKTEN INSERATS (Stellen- oder Wohnungsinserat):\n${listingText.slice(0, 8000)}\n\nGehe im Dokument gezielt auf dieses Inserat ein: Greife die wichtigsten Anforderungen auf, betone passende Stärken des Bewerbers und übernimm erkennbare Empfängerdaten (Firma/Vermieter, Ansprechpartner, Adresse), sofern der Nutzer keine abweichenden Angaben gemacht hat. Ignoriere Navigations- und Werbetexte im Inserat-Inhalt.`
    : "";

  // Gewählte Tonalität (freundlich / neutral / bestimmt)
  const TONES: Record<string, string> = {
    freundlich: "freundlichen, warmen und persönlichen",
    neutral: "neutralen, sachlichen und professionellen",
    bestimmt: "bestimmten und nachdrücklichen, aber stets höflichen",
  };
  const toneBlock = typeof tone === "string" && TONES[tone]
    ? `\n\nTONALITÄT — ZWINGEND: Verfasse das gesamte Dokument in einem ${TONES[tone]} Ton.`
    : "";

  // Lebenslauf ist kein Brief: Die Vorschau muss wie das fertige CV-Dokument aussehen
  // (Kopfblock + Sektionen), nicht wie ein Bewerbungsschreiben mit Empfänger/Betreff.
  const isCvTool = tool.slug === "lebenslauf";

  const textPrompt = isCvTool
    ? `Heute ist der ${today}.\n\nErstelle den ANFANG des Lebenslaufs (ca. 180–220 Wörter) basierend auf folgenden Angaben. KEIN Briefkopf, KEIN Empfänger, KEIN Betreff, KEINE Anrede — ein Lebenslauf ist kein Brief. Beginne mit dem Kopfblock: Vor- und Nachname (Zeile 1), Berufsbezeichnung (Zeile 2), Adresse (Zeile 3), E-Mail und Telefon (Zeile 4, nur wenn angegeben). Danach die Sektion BERUFSERFAHRUNG mit den ersten Stationen (pro Stelle: Berufsbezeichnung Zeile 1, Firma und Ort Zeile 2, Zeitraum wie '2020 – 2023' Zeile 3, kurze Beschreibung Zeile 4), danach — falls noch Platz — der Beginn der Sektion AUSBILDUNG. Brich am Ende MITTEN IM SATZ ab und beende die Ausgabe mit "…" (das vollständige Dokument wird nach Zahlung generiert).\n\n${lines}${listingBlock}${toneBlock}`
    : `Heute ist der ${today}. Verwende dieses Datum im Dokument.\n\nErstelle den ANFANG des Dokuments (ca. 200–250 Wörter) basierend auf folgenden Angaben. Beginne mit dem vollständigen Briefkopf: Absender, dann der EMPFÄNGER mit Name und Adresse (aus den Angaben oder dem Inserat — der Empfänger muss immer sichtbar sein, er zeigt dem Nutzer, dass das Dokument korrekt adressiert ist; fehlen Empfängerdaten komplett, setze eine realistische Platzhalter-Zeile wie den Firmen-/Vermieternamen), dann Ort/Datum und Betreff. Danach der individuelle, persönliche Fliesstext — der Leser soll spüren, dass dieses Dokument exakt für seine Situation geschrieben wurde. Brich am Ende MITTEN IM SATZ ab und beende die Ausgabe mit "…" (das vollständige Dokument wird nach Zahlung generiert).\n\n${lines}${listingBlock}${toneBlock}`;

  // Länderkontext in System-Prompt injizieren
  const systemPrompt = buildSystemPrompt(tool.systemPrompt, countryCode, tool.slug, isCvTool);

  const userContent: Anthropic.MessageParam["content"] = [];

  if (docxText) {
    userContent.push({
      type: "text",
      text: `Hier ist der Inhalt des hochgeladenen Word-Dokuments:\n\n${docxText}\n\n---\n\n${textPrompt}`,
    });
  } else if (imageBase64 && imageMimeType === "application/pdf") {
    userContent.push({
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: imageBase64,
      },
    } as unknown as Anthropic.TextBlockParam);
    userContent.push({
      type: "text",
      text: `Im PDF oben siehst du das Dokument des Nutzers. Lies es und berücksichtige seinen Inhalt.\n\n${textPrompt}`,
    });
  } else if (imageBase64 && imageMimeType) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: imageBase64,
      },
    });
    userContent.push({
      type: "text",
      text: `Im Bild oben siehst du das Dokument des Nutzers. Lies es und berücksichtige seinen Inhalt.\n\n${textPrompt}`,
    });
  } else {
    userContent.push({ type: "text", text: textPrompt });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 550,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const previewText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // Serverseitiges Funnel-Logging (adblock-unabhängig, keine PII) — die clientseitigen
  // Google-Ads-Events werden von Adblockern geschluckt (bes. DACH); diese Log-Zeile in
  // den Vercel-Logs zeigt die tatsächliche Zahl generierter Vorschauen pro Land/Tool.
  console.log(JSON.stringify({
    funnel: "preview_generated",
    tool: tool.slug,
    country: countryCode ?? "unknown",
    ts: new Date().toISOString(),
  }));

  return NextResponse.json({ previewText });
}

function buildSystemPrompt(basePrompt: string, countryCode?: string, toolSlug?: string, isCv?: boolean): string {
  const formatRule = isCv
    ? `AUSGABEFORMAT — ZWINGEND:\n` +
      `Erstelle das Dokument als sauberen, druckfertigen LEBENSLAUF ohne jegliches Markdown.\n` +
      `Verboten: # ## ### für Überschriften, ** oder __ für Fett, --- als Trennlinie, | für Tabellen, > für Blockquotes.\n` +
      `Erlaubt: Leerzeilen zur Gliederung, GROSSBUCHSTABEN für Sektionstitel, normale Satzzeichen.\n` +
      `Struktur: Kopfblock (Name / Berufsbezeichnung / Adresse / Kontakt) → Sektionen in GROSSBUCHSTABEN (z.B. BERUFSERFAHRUNG, AUSBILDUNG, SPRACHEN, KENNTNISSE).\n` +
      `KEIN Absender-/Empfängerblock, KEIN Betreff, KEINE Anrede, KEINE Grussformel — ein Lebenslauf ist kein Brief.\n`
    : `AUSGABEFORMAT — ZWINGEND:\n` +
      `Erstelle das Dokument als sauberen, druckfertigen Brief ohne jegliches Markdown.\n` +
      `Verboten: # ## ### für Überschriften, ** oder __ für Fett, --- als Trennlinie, | für Tabellen, > für Blockquotes.\n` +
      `Erlaubt: Leerzeilen zur Gliederung, GROSSBUCHSTABEN für Betreff oder Abschnittstitel, normale Satzzeichen.\n` +
      `Struktur: Absender → Empfänger → Ort/Datum → Betreff → Anrede → Fliesstext → Gruss → Name.\n` +
      `BETREFF-REGEL: Schreibe den Betreff mit dem Präfix "BETREFF: " gefolgt vom Betreff-Text in normaler Schreibweise (nicht in Grossbuchstaben), als einzelne Zeile ohne Umbruch, z.B. "BETREFF: Bewerbung für die Wohnung an der Musterstrasse 1". Das Präfix BETREFF: darf nie weggelassen werden.\n`;

  if (!countryCode) return `${formatRule}\n${basePrompt}`;
  const country = getCountry(countryCode);
  if (!country) return `${formatRule}\n${basePrompt}`;
  const langName = LANG_NAMES[country.documentLang] ?? country.documentLang;

  // Schweizer Referenzen entfernen wenn Land nicht CH
  let adapted = basePrompt;
  if (countryCode !== "CH") {
    adapted = adapted
      .replace(/Schweizer\s+/g, "")
      .replace(/\bSchweiz\b/g, country.name)
      .replace(/schweizerisch\w*/gi, "lokal")
      .replace(/\s*\(KVG\/VVG\)/g, "")
      .replace(/\s*\(SchKG\)/g, "");
  }

  const currencyNote = countryCode !== "CH"
    ? `Falls Geldbeträge in CHF angegeben sind, rechne sie näherungsweise in ${country.currency} um und verwende nur ${country.currency} im Dokument.\n`
    : "";

  const countryNote =
    `WICHTIG — LÄNDERSPEZIFISCHE ANPASSUNG:\n` +
    `Dieses Dokument wird für einen Nutzer in ${country.name} (${country.flag}) erstellt.\n` +
    `Passe alle Formulierungen, Konventionen und Anforderungen an die in ${country.name} üblichen Standards an.\n` +
    `Erwähne niemals die Schweiz im Dokumenttext, ausser das Land ist CH.\n` +
    `Verwende keine Schweizer Eigenheiten (Anführungszeichen «», CHF, ss/ß-Regel) ausser das Land ist CH.\n` +
    currencyNote +
    `Verfasse das gesamte Dokument vollständig auf ${langName}.\n` +
    (country.documentLang !== "de"
      ? `WICHTIG — SPRACHE: Alle obigen Anweisungen und die Feldbezeichnungen der Nutzereingaben sind auf Deutsch und dienen nur deiner internen Orientierung. Übersetze im fertigen Dokument ausnahmslos jeden Begriff ins ${langName}; übernimm NIEMALS deutsche Wörter in den Dokumenttext (z.B. nicht „Frist", „Kündigung", „Vermieter", „Mieter", sondern jeweils die ${langName}-Entsprechung). Einzige Ausnahme: das strukturelle Präfix „BETREFF:" bleibt unverändert.\n`
      : "");

  const docStandards = toolSlug
    ? getDocStandards(toolSlug as import("@/lib/tools").ToolSlug, countryCode)
    : "";

  return [formatRule, countryNote, docStandards, adapted].filter(Boolean).join("\n");
}
