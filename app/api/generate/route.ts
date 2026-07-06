import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";
import { getCountry, LANG_NAMES } from "@/lib/countries";
import { getLegalReferences } from "@/lib/legalRefs";

export async function POST(req: NextRequest) {
  const { toolSlug, sessionId, formData } = await req.json();

  const tool = getTool(toolSlug);
  if (!tool) {
    return NextResponse.json({ error: "Unbekanntes Tool." }, { status: 400 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!stripeKey || !anthropicKey) {
    return NextResponse.json({ error: "Server nicht konfiguriert." }, { status: 500 });
  }

  // 1. Zahlung verifizieren
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Zahlung nicht bestätigt." }, { status: 402 });
  }

  // 2. Ländercode aus Stripe-Metadata lesen
  const countryCode = session.metadata?.countryCode;

  // 3. Bild aus formData extrahieren (wird nach Nutzung nicht gespeichert)
  const imageBase64: string = formData.__imageBase64 ?? "";
  const imageMimeType: string = formData.__imageMimeType ?? "image/jpeg";
  const cleanFormData = { ...formData };
  delete cleanFormData.__imageBase64;
  delete cleanFormData.__imageMimeType;

  // 4. Dokument generieren
  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const textPrompt = buildUserPrompt(tool, cleanFormData);
  const systemPrompt = buildSystemPrompt(tool.systemPrompt, countryCode, tool.slug);

  const userContent: Anthropic.MessageParam["content"] = [];

  if (imageBase64) {
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
      text: `Im Bild oben siehst du das bestehende Dokument des Nutzers. Lies es sorgfältig und berücksichtige seinen Inhalt vollständig beim Erstellen des neuen Dokuments.\n\n${textPrompt}`,
    });
  } else {
    userContent.push({ type: "text", text: textPrompt });
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const generatedText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return NextResponse.json({ documentText: generatedText, title: tool.documentTitleDe });
}

function formatFieldValue(type: string, value: string): string {
  if (type === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-");
    return `${d}.${m}.${y}`;
  }
  return value;
}

function buildUserPrompt(tool: NonNullable<ReturnType<typeof getTool>>, formData: Record<string, string>): string {
  const lines = tool.fields
    .filter((f) => formData[f.key]?.trim())
    .map((f) => `${f.label}: ${formatFieldValue(f.type, formData[f.key])}`)
    .join("\n");
  return `Erstelle das Dokument basierend auf folgenden Angaben:\n\n${lines}`;
}

function buildSystemPrompt(basePrompt: string, countryCode?: string, toolSlug?: string): string {
  // Formatierungsregel: immer gültiger sauberer Brieftext, kein Markdown
  const formatRule =
    `AUSGABEFORMAT — ZWINGEND:\n` +
    `Erstelle das Dokument als sauberen, druckfertigen Brief ohne jegliches Markdown.\n` +
    `Verboten: # ## ### für Überschriften, ** oder __ für Fett, --- als Trennlinie, | für Tabellen.\n` +
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
    `LÄNDERSPEZIFISCHE ANPASSUNG:\n` +
    `Dieses Dokument wird für einen Nutzer in ${country.name} (${country.flag}) erstellt.\n` +
    `Passe alle Formulierungen, Konventionen und Anforderungen an die in ${country.name} üblichen Standards an.\n` +
    `Verwende keine Schweizer Eigenheiten (Anführungszeichen «», CHF, ss/ß-Regel) ausser das Land ist CH.\n` +
    `Verfasse das gesamte Dokument auf ${langName}.\n`;

  // Gesetzesreferenzen für dieses Land und Dokument-Typ
  const legalRefs = toolSlug
    ? getLegalReferences(toolSlug as import("@/lib/tools").ToolSlug, countryCode)
    : "";

  const parts = [formatRule, countryNote, legalRefs, adapted].filter(Boolean);
  return parts.join("\n");
}
