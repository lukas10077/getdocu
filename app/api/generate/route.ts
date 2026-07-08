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

  // 1. Zahlung verifizieren + Session-Replay-Schutz
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Zahlung nicht bestätigt." }, { status: 402 });
  }

  // Session bereits benutzt? → ablehnen
  if (session.metadata?.used === "true") {
    return NextResponse.json(
      { error: "Dieses Dokument wurde bereits generiert. Bitte starte einen neuen Kauf." },
      { status: 409 }
    );
  }

  // Session sofort als benutzt markieren (vor der Generierung, damit kein Race Condition)
  await stripe.checkout.sessions.update(sessionId, {
    metadata: { ...session.metadata, used: "true" },
  });

  // 2. Ländercode aus Stripe-Metadata lesen
  const countryCode = session.metadata?.countryCode;

  // 3. Bild/Dokument-Metadaten aus formData extrahieren (wird nach Nutzung nicht gespeichert)
  const imageBase64: string = formData.__imageBase64 ?? "";
  const imageMimeType: string = formData.__imageMimeType ?? "image/jpeg";
  const incomeCurrency: string = formData.__incomeCurrency ?? "";
  const docxText: string = formData.__docxText ?? "";
  const cleanFormData = { ...formData };
  delete cleanFormData.__imageBase64;
  delete cleanFormData.__imageMimeType;
  delete cleanFormData.__incomeCurrency;
  delete cleanFormData.__docxText;

  // 4. Dokument generieren
  const anthropic = new Anthropic({ apiKey: anthropicKey });
  const textPrompt = buildUserPrompt(tool, cleanFormData);
  const systemPrompt = buildSystemPrompt(tool.systemPrompt, countryCode, tool.slug, incomeCurrency);

  const userContent: Anthropic.MessageParam["content"] = [];

  if (docxText) {
    // DOCX: extrahierten Text als Kontext voranstellen
    userContent.push({
      type: "text",
      text: `Hier ist der Inhalt des hochgeladenen Word-Dokuments des Nutzers:\n\n${docxText}\n\n---\n\n${textPrompt}`,
    });
  } else if (imageBase64 && imageMimeType === "application/pdf") {
    // PDF: Anthropic native document support
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
      text: `Im PDF oben siehst du das bestehende Dokument des Nutzers. Lies es sorgfältig und berücksichtige seinen Inhalt vollständig beim Erstellen des neuen Dokuments.\n\n${textPrompt}`,
    });
  } else if (imageBase64) {
    // Bild: Vision
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
    max_tokens: tool.isBundle ? 4000 : 2000,
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
  const today = new Date().toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
  return `Heute ist der ${today}. Verwende dieses Datum im Dokument.\n\nErstelle das Dokument basierend auf folgenden Angaben:\n\n${lines}`;
}

function buildSystemPrompt(basePrompt: string, countryCode?: string, toolSlug?: string, incomeCurrency?: string): string {
  // Formatierungsregel: immer gültiger sauberer Brieftext, kein Markdown
  const formatRule =
    `AUSGABEFORMAT — ZWINGEND:\n` +
    `Erstelle das Dokument als sauberen, druckfertigen Brief ohne jegliches Markdown.\n` +
    `Verboten: # ## ### für Überschriften, ** oder __ für Fett, --- als Trennlinie, | für Tabellen.\n` +
    `Erlaubt: Leerzeilen zur Gliederung, GROSSBUCHSTABEN für Betreff oder Abschnittstitel, normale Satzzeichen.\n` +
    `Struktur: Absender → Empfänger → Ort/Datum → Betreff → Anrede → Fliesstext → Gruss → Name.\n` +
    `BETREFF-REGEL: Schreibe den Betreff mit dem Präfix "BETREFF: " gefolgt vom Betreff-Text in normaler Schreibweise (nicht in Grossbuchstaben), als einzelne Zeile ohne Umbruch, z.B. "BETREFF: Bewerbung für die Wohnung an der Musterstrasse 1". Das Präfix BETREFF: darf nie weggelassen werden.\n` +
    `SEITENREGEL: Das gesamte Dokument muss auf EINE A4-Seite passen. Formuliere präzise und kompakt. Kein unnötiger Fülltext.\n` +
    `KEINE PLATZHALTER: Fehlt eine Information (z.B. Telefonnummer), lass sie vollständig weg — niemals X, ?, 000 oder ähnliche Füllwerte einfügen.\n` +
    `KEINE ERFINDUNGEN: Nur die vom Nutzer explizit angegebenen Daten verwenden. Sprachen, Kenntnisse und Angaben nie eigenmächtig ergänzen oder erfinden.\n`;

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

  const srcCurrency = incomeCurrency || (countryCode === "CH" ? "CHF" : country.currency);
  const currencyNote = srcCurrency !== country.currency
    ? `Das Einkommen wurde in ${srcCurrency} angegeben. Rechne es näherungsweise in ${country.currency} um und verwende ausschliesslich ${country.currency} im Dokument.\n`
    : (countryCode !== "CH" ? `Verwende ausschliesslich ${country.currency} als Währung im Dokument.\n` : "");

  const countryNote =
    `LÄNDERSPEZIFISCHE ANPASSUNG:\n` +
    `Dieses Dokument wird für einen Nutzer in ${country.name} (${country.flag}) erstellt.\n` +
    `Passe alle Formulierungen, Konventionen und Anforderungen an die in ${country.name} üblichen Standards an.\n` +
    `Erwähne niemals die Schweiz im Dokumenttext, ausser das Land ist CH.\n` +
    `Verwende keine Schweizer Eigenheiten (Anführungszeichen «», CHF, ss/ß-Regel) ausser das Land ist CH.\n` +
    currencyNote +
    `Verfasse das gesamte Dokument auf ${langName}.\n`;

  // Gesetzesreferenzen für dieses Land und Dokument-Typ
  const legalRefs = toolSlug
    ? getLegalReferences(toolSlug as import("@/lib/tools").ToolSlug, countryCode)
    : "";

  const parts = [formatRule, countryNote, legalRefs, adapted].filter(Boolean);
  return parts.join("\n");
}
