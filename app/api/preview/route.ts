import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";
import { getCountry, LANG_NAMES } from "@/lib/countries";

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

  const { toolSlug, formData, imageBase64, imageMimeType, countryCode } = await req.json();

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

  const textPrompt = `Erstelle den ANFANG des Dokuments (nur die ersten 2–3 Absätze, ca. 120–150 Wörter) basierend auf folgenden Angaben. Höre mitten im Text auf — das vollständige Dokument wird nach Zahlung generiert.\n\n${lines}`;

  // Länderkontext in System-Prompt injizieren
  const systemPrompt = buildSystemPrompt(tool.systemPrompt, countryCode);

  const userContent: Anthropic.MessageParam["content"] = [];

  if (imageBase64 && imageMimeType) {
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
    max_tokens: 350,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const previewText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return NextResponse.json({ previewText });
}

function buildSystemPrompt(basePrompt: string, countryCode?: string): string {
  const formatRule =
    `AUSGABEFORMAT — ZWINGEND:\n` +
    `Erstelle das Dokument als sauberen, druckfertigen Brief ohne jegliches Markdown.\n` +
    `Verboten: # ## ### für Überschriften, ** oder __ für Fett, --- als Trennlinie, | für Tabellen, > für Blockquotes.\n` +
    `Erlaubt: Leerzeilen zur Gliederung, GROSSBUCHSTABEN für Betreff oder Abschnittstitel, normale Satzzeichen.\n` +
    `Struktur: Absender → Empfänger → Ort/Datum → Betreff → Anrede → Fliesstext → Gruss → Name.\n`;

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

  const countryNote =
    `WICHTIG — LÄNDERSPEZIFISCHE ANPASSUNG:\n` +
    `Dieses Dokument wird für einen Nutzer in ${country.name} (${country.flag}) erstellt.\n` +
    `Passe alle Formulierungen, Konventionen und Anforderungen an die in ${country.name} üblichen Standards an.\n` +
    `Erwähne niemals die Schweiz im Dokumenttext, ausser das Land ist CH.\n` +
    `Verwende keine Schweizer Eigenheiten (Anführungszeichen «», CHF, ss/ß-Regel) ausser das Land ist CH.\n` +
    `Verfasse das gesamte Dokument auf ${langName}.\n`;

  return `${formatRule}\n${countryNote}\n${adapted}`;
}
