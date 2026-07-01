import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Optionaler Stripe-Webhook (z.B. für anonyme Verkaufsstatistik "Tool X wurde Y mal gekauft").
// Speichert NIEMALS Formular-/Kundendaten — nur den toolSlug und einen Zeitstempel,
// idealerweise in einem simplen Key-Value-Store (z.B. Vercel KV) als Zähler.
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
    const session = event.data.object as Stripe.Checkout.Session;
    const toolSlug = session.metadata?.toolSlug;
    // TODO: await incrementAnonymousUsageCounter(toolSlug) — bewusst kein PII-Logging.
    console.log(`[anonym] Verkauf abgeschlossen für Tool: ${toolSlug}`);
  }

  return NextResponse.json({ received: true });
}
