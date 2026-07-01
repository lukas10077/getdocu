import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Agb({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content">
          <h1 className="text-4xl font-medium tracking-tighter text-swiss-black">{dict.footer.agb}</h1>

          <div className="mt-8 max-w-2xl space-y-6 text-base leading-relaxed text-swiss-gray-700">
            <h2 className="text-xl font-medium text-swiss-black">1. Geltungsbereich</h2>
            <p>
              Diese Allgemeinen Geschäftsbedingungen regeln die Nutzung von GetDocu, einer Plattform
              der c/o F2BII E-Commerce #942, Hintergoldingerstrasse 30, 8638 Goldingen, Schweiz.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">2. Leistung</h2>
            <p>
              GetDocu erstellt mittels KI-Technologie (Claude API von Anthropic) auf Basis deiner
              Angaben Dokumente wie Mietbewerbungen, Bewerbungsschreiben und Kündigungen. Die Zahlung
              erfolgt vor Erstellung pro Dokument, kein Abonnement erforderlich.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">3. Keine Rechtsberatung</h2>
            <p>
              <strong>
                Die von GetDocu generierten Dokumente stellen keine Rechtsberatung dar.
              </strong>{" "}
              Sie sind als Hilfsmittel und Formulierungsvorschlag gedacht. Du bist selbst dafür
              verantwortlich, die inhaltliche Richtigkeit, Vollständigkeit und Rechtskonformität des
              Dokuments vor dessen Verwendung zu prüfen. Bei rechtlichen Fragen empfehlen wir, eine
              Fachperson (z.B. Mieterverband, Rechtsberatung) zu konsultieren.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">4. Haftungsausschluss</h2>
            <p>
              GetDocu und der Betreiber übernehmen keine Haftung für Schäden, die durch die Nutzung
              oder Verwendung der generierten Dokumente entstehen, insbesondere nicht für inhaltliche
              Fehler, Fristversäumnisse oder rechtliche Konsequenzen. Die Nutzung erfolgt auf eigenes
              Risiko.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">5. Zahlung & Rückerstattung</h2>
            <p>
              Die Zahlung erfolgt über Stripe vor der Dokumentenerstellung. Da die Leistung unmittelbar
              nach Zahlung digital erbracht wird, besteht grundsätzlich kein Widerrufsrecht nach
              erfolgter Generierung. Bei technischen Fehlern (z.B. fehlgeschlagene Generierung trotz
              erfolgter Zahlung) kontaktiere uns für eine Rückerstattung.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">6. Datenschutz</h2>
            <p>
              Informationen zur Verarbeitung deiner Daten findest du in unserer Datenschutzerklärung.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">7. Anwendbares Recht</h2>
            <p>Es gilt Schweizer Recht. Gerichtsstand ist der Sitz des Betreibers.</p>
          </div>
        </div>
      </section>
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
