import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";
import { getTool } from "@/lib/tools";

// Ablauf (siehe Projekt-Vorgaben zum Datenschutz):
// 1. Verifiziere, dass die Stripe Checkout Session bezahlt wurde.
// 2. Generiere das Dokument via Claude API basierend auf den vom Client übergebenen Formulardaten.
// 3. Sende das Ergebnis zurück.
// 4. Die Formulardaten existieren NUR im Request-Body dieser Funktion (in-memory) und werden
//    nirgends persistiert — kein DB-Write, kein Logging von Klartext-Inhalten. Nach Rückgabe
//    der Response ist der Prozess-Speicher für diesen Request beendet ("gelöscht").
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

  // 2. Dokument generieren
  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const userPrompt = buildUserPrompt(tool, formData);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: tool.systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const generatedText = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  // 3. + 4. formData und generatedText existieren ab hier nur noch lokal in dieser
  // Funktionsausführung. Es wird nichts in eine Datenbank oder Datei geschrieben.
  // Nur ein anonymer Zähler für Statistik wird erhöht (kein Personenbezug).
  // await incrementAnonymousUsageCounter(toolSlug) // TODO: Implementierung mit z.B. Vercel KV

  return NextResponse.json({ documentText: generatedText, title: tool.documentTitleDe });
}

function buildUserPrompt(tool: NonNullable<ReturnType<typeof getTool>>, formData: Record<string, string>): string {
  const lines = tool.fields
    .filter((f) => formData[f.key]?.trim())
    .map((f) => `${f.label}: ${formData[f.key]}`)
    .join("\n");
  return `Erstelle das Dokument basierend auf folgenden Angaben:\n\n${lines}`;
}
