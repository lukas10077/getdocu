import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Stripe-Webhook: verifiziert die Zahlung serverseitig.
// Hinweis: Die Bestätigungs-E-Mail inkl. bearbeitbarer Word-Datei wird in
// /api/generate versendet (dort liegt der fertige Dokument-Inhalt) — bewusst
// nur EINE E-Mail an den Kunden, kein doppelter Versand hier.
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!webhookSecret || !stripeKey) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Ungültige Signatur." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // TODO: await incrementAnonymousUsageCounter(toolSlug) — bewusst kein PII-Logging.
    // E-Mail-Versand erfolgt in /api/generate (mit Word-Anhang).
  }

  return NextResponse.json({ received: true });
}
