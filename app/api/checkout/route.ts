import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getTool } from "@/lib/tools";
import { getCountry, getStripeAmount } from "@/lib/countries";
import { getDictionary, type Locale } from "@/i18n/config";

// Erstellt eine Stripe Checkout Session für ein Tool.
// WICHTIG: Die Formulardaten des Nutzers werden hier NICHT an Stripe übermittelt
// und NICHT in einer Datenbank gespeichert. Sie werden client-seitig zwischengehalten
// und erst nach erfolgreicher Zahlung an /api/generate gesendet (siehe dort für Löschung).
export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe ist nicht konfiguriert." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const { toolSlug, locale, countryCode, gclid } = await req.json();

  const tool = getTool(toolSlug);
  if (!tool) {
    return NextResponse.json({ error: "Unbekanntes Tool." }, { status: 400 });
  }

  // Lokalisierter Produktname für die Stripe-Bezahlseite — gleiche Logik wie auf
  // den Tool-Seiten (dict.tools.items[slug].title, Fallback: deutscher Titel).
  // getDictionary fällt bei unbekannter Locale auf Deutsch zurück.
  const dict = await getDictionary(locale as Locale);
  const productName: string =
    dict?.tools?.items?.[tool.slug]?.title ?? tool.documentTitleDe;

  // Währung und Betrag nach Land bestimmen
  const country = countryCode ? getCountry(countryCode) : null;
  const { currency, amount } = getStripeAmount(
    tool.priceChfRappen,
    country?.currency ?? "CHF",
    country?.priceFactor ?? 1
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Sprache der Stripe-Bezahlseite. Stripe akzeptiert nur bestimmte Locales —
  // nicht unterstützte App-Sprachen (sq, sr, ar, uk, ta) fallen auf "auto"
  // zurück, sonst würde stripe.checkout.sessions.create() einen Fehler werfen.
  // Für spanischsprachige Länder in Amerika lateinamerikanisches Spanisch (es-419).
  const STRIPE_LOCALES: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
    de: "de", en: "en", fr: "fr", it: "it", pt: "pt",
    es: "es", pl: "pl", hu: "hu", tr: "tr", ru: "ru",
  };
  let checkoutLocale: Stripe.Checkout.SessionCreateParams.Locale =
    STRIPE_LOCALES[locale as string] ?? "auto";
  if (locale === "es" && country?.continent === "americas") checkoutLocale = "es-419";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: checkoutLocale,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amount,
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],
      metadata: {
        toolSlug: tool.slug,
        countryCode: countryCode ?? "CH",
        // Google-Ads-Klick-ID (falls der Kauf über eine Anzeige kam) — ermöglicht
        // serverseitigen Conversion-Import unabhängig vom Browser des Käufers.
        ...(typeof gclid === "string" && gclid.length > 0 && gclid.length <= 200
          ? { gclid }
          : {}),
      },
      success_url: `${baseUrl}/${locale}/tools/${tool.slug}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${baseUrl}/${locale}/tools/${tool.slug}?status=cancelled`,
    });

    // Serverseitiges Funnel-Logging (adblock-unabhängig, keine PII) — Pendant zum
    // clientseitigen "Checkout gestartet"-Event, das Adblocker unterdrücken.
    console.log(JSON.stringify({
      funnel: "checkout_started",
      tool: tool.slug,
      country: countryCode ?? "unknown",
      locale: typeof locale === "string" ? locale : "unknown",
      viaAd: typeof gclid === "string" && gclid.length > 0,
      ts: new Date().toISOString(),
    }));

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unbekannter Stripe-Fehler";
    console.error("Stripe checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
