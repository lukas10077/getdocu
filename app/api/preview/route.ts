import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";

// Kostenlose Vorschau: generiert nur den Anfang des Dokuments (~300 Tokens).
// Kein Stripe-Check nötig — der Nutzer sieht sein personalisiertes Dokument
// mit Wasserzeichen und wird so zur Zahlung motiviert.
export async function POST(req: NextRequest) {
  const { toolSlug, formData } = await req.json();

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

  const userPrompt = `Erstelle den ANFANG des Dokuments (nur die ersten 2–3 Absätze, ca. 120–150 Wörter) basierend auf folgenden Angaben. Höre mitten im Text auf — das vollständige Dokument wird nach Zahlung generiert.\n\n${lines}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 350,
    system: tool.systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const previewText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return NextResponse.json({ previewText });
}
