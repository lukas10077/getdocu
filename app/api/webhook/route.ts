import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

// Tool-Namen für die E-Mail (Slug → lesbarer Name)
const TOOL_NAMES: Record<string, string> = {
  "mietbewerbung":      "Mietbewerbung",
  "kuendigung-wohnung": "Kündigung Wohnung",
  "maengelruege":       "Schadensmeldung",
  "jobbewerbung":       "Jobbewerbung",
  "kuendigung-arbeit":  "Kündigung Arbeit",
  "arbeitszeugnis":     "Arbeitszeugnis verbessern",
  "lebenslauf":         "Lebenslauf",
  "komplettbewerbung":  "Komplettbewerbung",
  "kuendigung":         "Kündigungsbrief",
  "reklamation":        "Reklamationsbrief",
};

function buildEmailHtml(toolName: string, amountChf: string, date: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#0f0f0f;padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;letter-spacing:0.05em;">GetDocu</p>
            <p style="margin:6px 0 0;font-size:13px;color:#888;">Professionelle Dokumente in Minuten</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:20px;font-weight:600;color:#1a1a1a;">Vielen Dank für deinen Kauf!</p>
            <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">Dein Dokument wurde erfolgreich generiert und steht dir zum Download bereit.</p>

            <!-- Receipt box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:8px;padding:24px;margin-bottom:28px;">
              <tr>
                <td style="font-size:13px;color:#888;padding-bottom:12px;">BESTELLDETAILS</td>
              </tr>
              <tr>
                <td style="font-size:15px;color:#1a1a1a;font-weight:500;padding-bottom:6px;">${toolName}</td>
              </tr>
              <tr>
                <td style="border-top:1px solid #e5e5e5;padding-top:12px;margin-top:12px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:14px;color:#555;">Betrag</td>
                      <td align="right" style="font-size:14px;font-weight:600;color:#1a1a1a;">CHF ${amountChf}</td>
                    </tr>
                    <tr>
                      <td style="font-size:14px;color:#555;padding-top:6px;">Datum</td>
                      <td align="right" style="font-size:14px;color:#555;padding-top:6px;">${date}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 6px;font-size:14px;color:#555;line-height:1.6;">Falls du Fragen hast, antworte einfach auf diese E-Mail.</p>
            <p style="margin:0;font-size:14px;color:#555;line-height:1.6;">Wir wünschen dir viel Erfolg mit deinem Dokument.</p>

            <p style="margin:32px 0 0;font-size:14px;color:#1a1a1a;font-weight:500;">Das GetDocu-Team</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f8f8;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} GetDocu · getdocunow.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;

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
    const toolSlug = session.metadata?.toolSlug ?? "";
    const toolName = TOOL_NAMES[toolSlug] ?? "Dokument";
    const customerEmail = session.customer_details?.email;
    const amountTotal = session.amount_total ?? 0;
    const amountChf = (amountTotal / 100).toFixed(2);
    const date = new Date().toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });

    // Bestätigungs-E-Mail senden
    if (customerEmail && resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "GetDocu <noreply@getdocunow.com>",
        to: customerEmail,
        subject: `Deine Bestellung: ${toolName}`,
        html: buildEmailHtml(toolName, amountChf, date),
      });
    }

    // TODO: await incrementAnonymousUsageCounter(toolSlug) — bewusst kein PII-Logging.
  }

  return NextResponse.json({ received: true });
}
