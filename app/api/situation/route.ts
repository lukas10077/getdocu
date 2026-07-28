import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTool, TOOL_CATEGORIES } from "@/lib/tools";

// "Beschreibe deine Situation" → KI erkennt das passende Tool und extrahiert
// erste Feldwerte. Der Nutzer landet direkt im richtigen, vorbefüllten Formular.
//
// Datenschutz: Die Eingabe wird nur für diese eine Klassifikation verwendet
// und nirgends gespeichert.

const RATE_LIMIT = 6;
const WINDOW_MS = 60_000;
const ipLog = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipLog.get(ip);
  if (!entry || now >= entry.resetAt) {
    ipLog.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Zu viele Anfragen. Bitte kurz warten." }, { status: 429 });
  }

  let text: unknown;
  try {
    ({ text } = await req.json());
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (typeof text !== "string" || text.trim().length < 8 || text.length > 2000) {
    return NextResponse.json({ error: "Bitte beschreibe deine Situation in ein bis drei Sätzen." }, { status: 400 });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json({ error: "Server nicht konfiguriert." }, { status: 500 });
  }

  // Tool-Katalog: slug + Beschreibung + verfügbare Feld-Keys (für die Vorbefüllung)
  const allSlugs = TOOL_CATEGORIES.flatMap((c) => c.slugs);
  const catalog = allSlugs
    .map((slug) => {
      const t = getTool(slug);
      if (!t) return null;
      const fields = t.fields.map((f) => `${f.key} (${f.label})`).join(", ");
      return `- slug: ${slug}\n  Zweck: ${t.documentTitleDe} — ${t.descriptionDe}\n  Felder: ${fields}`;
    })
    .filter(Boolean)
    .join("\n");

  const system =
    `Du ordnest die Situationsbeschreibung eines Nutzers dem passenden Dokument-Tool zu und extrahierst Feldwerte.\n\n` +
    `Verfügbare Tools:\n${catalog}\n\n` +
    `Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, ohne Markdown, in dieser Form:\n` +
    `{"slug": "<einer der obigen slugs>", "prefill": {"<feldKey>": "<Wert>"}}\n\n` +
    `Regeln:\n` +
    `- Wähle genau EIN Tool, das am besten passt.\n` +
    `- In prefill nur Felder aufnehmen, deren Wert KLAR aus der Beschreibung hervorgeht (z.B. Empfängername, Vertragsart, Anliegen). NICHTS erfinden.\n` +
    `- Werte in der Sprache der Nutzereingabe formulieren, kurz und wörtlich am Nutzertext orientiert.\n` +
    `- Freitext-Anliegen (z.B. "reason", "anliegen", "situation", "beschreibung"-artige Felder) darfst du mit einer knappen Zusammenfassung der Situation befüllen.\n` +
    `- Passt gar nichts, wähle das nächstliegende generische Tool (z.B. kuendigung für Vertragsbeendigungen).`;

  try {
    const anthropic = new Anthropic({ apiKey: anthropicKey });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: String(text).slice(0, 2000) }],
    });

    const raw = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim()
      .replace(/^```json?\s*/i, "")
      .replace(/```$/i, "");

    const parsed = JSON.parse(raw) as { slug?: string; prefill?: Record<string, unknown> };
    const tool = typeof parsed.slug === "string" ? getTool(parsed.slug) : undefined;
    if (!tool) {
      return NextResponse.json({ error: "Kein passendes Dokument gefunden." }, { status: 422 });
    }

    // Prefill härten: nur existierende Feld-Keys, nur Strings, Länge begrenzen
    const validKeys = new Set(tool.fields.map((f) => f.key));
    const prefill: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed.prefill ?? {})) {
      if (validKeys.has(k) && typeof v === "string" && v.trim() && v.length <= 300) {
        prefill[k] = v.trim();
      }
    }

    return NextResponse.json({ slug: tool.slug, prefill });
  } catch {
    return NextResponse.json({ error: "Analyse fehlgeschlagen. Bitte wähle dein Dokument manuell." }, { status: 500 });
  }
}
