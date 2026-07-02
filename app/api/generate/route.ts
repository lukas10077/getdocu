import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";

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

  // 2. Bild aus formData extrahieren (wird nach Nutzung nicht gespeichert)
  const imageBase64: string = formData.__imageBase64 ?? "";
  const imageMimeType: string = formData.__imageMimeType ?? "image/jpeg";
  const cleanFormData = { ...formData };
  delete cleanFormData.__imageBase64;
  delete cleanFormData.__imageMimeType;

  // 3. Dokument generieren
  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const textPrompt = buildUserPrompt(tool, cleanFormData);

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
    system: tool.systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const generatedText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  return NextResponse.json({ documentText: generatedText, title: tool.documentTitleDe });
}

function buildUserPrompt(tool: NonNullable<ReturnType<typeof getTool>>, formData: Record<string, string>): string {
  const lines = tool.fields
    .filter((f) => formData[f.key]?.trim())
    .map((f) => `${f.label}: ${formData[f.key]}`)
    .join("\n");
  return `Erstelle das Dokument basierend auf folgenden Angaben:\n\n${lines}`;
}
