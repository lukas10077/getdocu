import { getDictionary, Locale } from "@/i18n/config";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Datenschutz({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-content">
          <a href="/" className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">← Zurück</a>
        </div>
      </div>

      <section className="px-6 py-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Rechtliches
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Datenschutzerklärung
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-cream-muted">

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Verantwortliche Stelle
              </h2>
              <p>
                GetDocu, c/o F2BII E-Commerce #942, Hintergoldingerstrasse 30, 8638 Goldingen,
                Schweiz.{" "}
                <a href="mailto:support.lukaslast@gmail.com" className="text-swiss-gold underline hover:opacity-80">
                  support.lukaslast@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Grundsatz: Keine dauerhafte Datenspeicherung
              </h2>
              <p>
                GetDocu verarbeitet deine persönlichen Angaben (Name, Adresse, Lohndaten etc.)
                ausschliesslich zum Zweck der Dokumentenerstellung. Nach erfolgreicher Generierung
                werden diese Eingabedaten sofort und vollständig gelöscht. Wir führen keine
                Datenbank mit deinen persönlichen Inhalten.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Verarbeitung durch Anthropic (USA)
              </h2>
              <p>
                Zur Erstellung des Dokuments werden deine Eingaben einmalig an die Claude API von
                Anthropic PBC (San Francisco, USA) übermittelt. Diese Übermittlung dient
                ausschliesslich der Dokumentenerstellung und erfolgt verschlüsselt (HTTPS).
                Anthropic verwendet die Daten gemäss eigener Datenschutzrichtlinie; sie werden
                nicht für das Training von KI-Modellen verwendet (API-Nutzungsbedingungen
                von Anthropic).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Zustellung des Dokuments per E-Mail
              </h2>
              <p>
                Nach dem Kauf senden wir dir dein fertiges Dokument als bearbeitbare Word-Datei an
                die im Bezahlvorgang angegebene E-Mail-Adresse, damit du eine Kopie behältst. Der
                E-Mail-Versand erfolgt über den Dienstleister Resend (resend.com). Übermittelt werden
                dabei nur deine E-Mail-Adresse und das erstellte Dokument; nach dem Versand
                speichern wir den Dokumentinhalt nicht dauerhaft.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Zahlungsabwicklung (Stripe)
              </h2>
              <p>
                Zahlungen werden über Stripe Payments Europe Ltd. abgewickelt. Stripe verarbeitet
                deine Zahlungsdaten (Kreditkarte, TWINT) gemäss eigener Datenschutzerklärung
                (stripe.com/privacy). GetDocu erhält keine vollständigen Kartendaten — nur eine
                Bestätigung der erfolgreichen Zahlung sowie die Tool-Bezeichnung.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Anonyme Nutzungsstatistik
              </h2>
              <p>
                Wir erfassen ausschliesslich anonyme, aggregierte Nutzungsdaten (z.B. «Mietbewerbung
                wurde 42× erstellt»). Diese Daten enthalten keine Namen, Adressen oder
                Dokumentinhalte und ermöglichen keinen Rückschluss auf einzelne Personen.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Server-Logs (Vercel)
              </h2>
              <p>
                Die Website wird auf Vercel Inc. (USA) gehostet. Vercel speichert technische
                Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene URL) für einen kurzen Zeitraum
                aus Sicherheitsgründen. Weitere Informationen findest du in der Datenschutzerklärung
                von Vercel (vercel.com/legal/privacy-policy).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Cookies
              </h2>
              <p>
                GetDocu setzt keine Tracking-Cookies und verwendet kein Analytics-Tool
                (kein Google Analytics, kein Meta Pixel). Es werden lediglich technisch notwendige,
                kurzlebige Session-Daten im Browser (sessionStorage) verwendet, die nach
                Abschluss der Transaktion automatisch gelöscht werden.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Deine Rechte (DSG / DSGVO)
              </h2>
              <p>
                Da GetDocu keine personenbezogenen Daten dauerhaft speichert, sind
                Auskunfts-, Berichtigungs- und Löschansprüche faktisch bereits erfüllt — es
                existieren nach Abschluss deiner Bestellung keine gespeicherten persönlichen Daten
                mehr. Für Fragen wende dich an{" "}
                <a href="mailto:support.lukaslast@gmail.com" className="text-swiss-gold underline hover:opacity-80">
                  support.lukaslast@gmail.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Datensicherheit
              </h2>
              <p>
                Alle Datenübertragungen erfolgen verschlüsselt über HTTPS/TLS. API-Schlüssel und
                Zugangsdaten werden nie im Quellcode gespeichert und sind als Umgebungsvariablen
                auf dem Server hinterlegt.
              </p>
            </div>

            <p className="pt-4 text-xs text-cream-subtle">Stand: Juli 2025</p>
          </div>
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
