import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";
import { getCountry, LANG_NAMES } from "@/lib/countries";

export async function POST(req: NextRequest) {
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
  if (!countryCode) return basePrompt;
  const country = getCountry(countryCode);
  if (!country) return basePrompt;
  const langName = LANG_NAMES[country.documentLang] ?? country.documentLang;
  const countryNote =
    `WICHTIG — LÄNDERSPEZIFISCHE ANPASSUNG:\n` +
    `Dieses Dokument wird für einen Nutzer in ${country.name} (${country.flag}) erstellt.\n` +
    `Passe alle Formulierungen, Konventionen und formalen Anforderungen an die in ${country.name} üblichen Standards an.\n` +
    `Verfasse das gesamte Dokument auf ${langName}.\n`;
  return `${countryNote}\n${basePrompt}`;
}
