import { getDictionary, Locale } from "@/i18n/config";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Agb({ params }: { params: { locale: Locale } }) {
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
            Allgemeine Geschäftsbedingungen
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-cream-muted">

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                1. Geltungsbereich
              </h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung von GetDocu
                (getdocu.ch), betrieben von c/o F2BII E-Commerce #942, Hintergoldingerstrasse 30,
                8638 Goldingen, Schweiz. Mit der Nutzung des Dienstes akzeptierst du diese AGB.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                2. Leistungsbeschreibung
              </h2>
              <p>
                GetDocu erstellt mittels KI-Technologie (Claude API, Anthropic PBC, USA) auf Basis
                deiner Eingaben Dokumente wie Mietbewerbungen, Bewerbungsschreiben, Kündigungen und
                weitere. Die Dienstleistung wird einmalig pro Dokument abgerechnet; es besteht kein
                Abonnement. Der Dienst ist ausschliesslich für natürliche Personen und nicht für
                kommerzielle Weiterverwendung bestimmt.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                3. Keine Rechtsberatung
              </h2>
              <p>
                <strong className="font-medium text-cream">
                  Die von GetDocu generierten Dokumente stellen keine Rechtsberatung dar.
                </strong>{" "}
                Sie sind als Formulierungshilfe gedacht. Du bist allein verantwortlich für die
                inhaltliche Richtigkeit, Vollständigkeit und rechtliche Konformität des verwendeten
                Dokuments. Bei Unsicherheiten empfehlen wir die Konsultation einer Fachperson
                (Mieterverband, Anwältin, Rechtsberatungsstelle).
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                4. Haftungsausschluss
              </h2>
              <p>
                GetDocu und der Betreiber haften nicht für Schäden, die durch die Nutzung oder
                Nichtnutzung der generierten Dokumente entstehen, insbesondere nicht für inhaltliche
                Fehler, Fristversäumnisse, abgelehnte Bewerbungen oder rechtliche Konsequenzen.
                Die Nutzung des Dienstes erfolgt auf eigene Verantwortung.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                5. Zahlung
              </h2>
              <p>
                Die Zahlung erfolgt vor der Dokumentenerstellung über den Zahlungsdienstleister
                Stripe (inkl. TWINT). Preise in Schweizer Franken (CHF), inklusive MwSt. Da die
                digitale Leistung unmittelbar nach erfolgter Zahlung erbracht wird, besteht
                grundsätzlich kein Widerrufsrecht nach abgeschlossener Generierung.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                6. Rückerstattung
              </h2>
              <p>
                Bei technisch fehlgeschlagener Dokumentenerstellung trotz erfolgter Zahlung
                erstatten wir den bezahlten Betrag vollständig. Bitte kontaktiere uns dafür unter{" "}
                <a href="mailto:lukaslast@gmail.com" className="text-swiss-gold underline hover:opacity-80">
                  lukaslast@gmail.com
                </a>{" "}
                mit Angabe des Fehlers und der Transaktions-ID.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                7. Datenschutz
              </h2>
              <p>
                Informationen zur Verarbeitung deiner Daten findest du in unserer{" "}
                <a href="../datenschutz" className="text-swiss-gold underline hover:opacity-80">
                  Datenschutzerklärung
                </a>
                . Formulardaten werden ausschliesslich zur Dokumentenerstellung verwendet und
                danach sofort gelöscht.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                8. Verfügbarkeit
              </h2>
              <p>
                GetDocu strebt eine hohe Verfügbarkeit an, übernimmt jedoch keine Garantie für
                ununterbrochene Erreichbarkeit. Bei technischen Störungen besteht kein Anspruch
                auf Entschädigung.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                9. Änderungen der AGB
              </h2>
              <p>
                GetDocu behält sich vor, diese AGB jederzeit zu ändern. Massgeblich ist die zum
                Zeitpunkt der Nutzung auf dieser Seite veröffentlichte Fassung.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                10. Anwendbares Recht &amp; Gerichtsstand
              </h2>
              <p>
                Es gilt ausschliesslich Schweizer Recht unter Ausschluss des UN-Kaufrechts.
                Gerichtsstand für Streitigkeiten ist der Sitz des Betreibers (Kanton St. Gallen).
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
