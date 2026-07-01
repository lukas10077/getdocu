import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Datenschutz({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content prose-content">
          <h1 className="text-4xl font-medium tracking-tighter text-swiss-black">
            {dict.footer.datenschutz}
          </h1>

          <div className="mt-8 max-w-2xl space-y-6 text-base leading-relaxed text-swiss-gray-700">
            <p>
              GetDocu wird betrieben von: c/o F2BII E-Commerce #942, Hintergoldingerstrasse 30, 8638
              Goldingen, Schweiz (lukaslast@gmail.com).
            </p>

            <h2 className="text-xl font-medium text-swiss-black">Keine dauerhafte Speicherung</h2>
            <p>
              Wenn du ein GetDocu-Tool nutzt, gibst du persönliche Angaben (z.B. Name, Adresse,
              Lohnangaben) in ein Formular ein. Diese Angaben werden ausschliesslich zur Erstellung
              deines Dokuments verwendet. Nach der Erstellung und dem Download deines Dokuments werden
              diese Eingabedaten unverzüglich gelöscht. Wir führen keine Datenbank mit deinen
              persönlichen Inhalten.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">Verarbeitung durch Anthropic (USA)</h2>
            <p>
              Zur Erstellung des Dokuments werden deine Eingaben an Anthropic, PBC (USA) übermittelt,
              die die Claude-API betreibt, mit der dein Dokument generiert wird. Diese Übermittlung
              erfolgt ausschliesslich zum Zweck der Dokumentenerstellung. Die Daten werden nicht für
              das Training von KI-Modellen verwendet und nicht dauerhaft bei uns gespeichert.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">Zahlungsabwicklung</h2>
            <p>
              Zahlungen werden über Stripe abgewickelt. Stripe verarbeitet deine Zahlungsdaten gemäss
              eigener Datenschutzerklärung. Wir erhalten keine vollständigen Kartendaten.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">Anonyme Statistik</h2>
            <p>
              Wir speichern ausschliesslich anonyme, aggregierte Nutzungsdaten (z.B. "Tool X wurde Y
              mal verwendet") zur Verbesserung unseres Angebots. Diese Daten enthalten keine Namen,
              Adressen oder Dokumentinhalte und lassen keinen Rückschluss auf einzelne Personen zu.
            </p>

            <h2 className="text-xl font-medium text-swiss-black">Deine Rechte</h2>
            <p>
              Da wir keine personenbezogenen Daten dauerhaft speichern, entfallen die meisten
              datenschutzrechtlichen Auskunfts- oder Löschansprüche faktisch — es existieren ab
              Abschluss deiner Bestellung keine gespeicherten Daten mehr, die gelöscht werden könnten.
              Für Fragen kontaktiere uns unter lukaslast@gmail.com.
            </p>
          </div>
        </div>
      </section>
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
