import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

// Pilot: Inhalt ist auf die Schweizer Rechtslage (Deutsch) abgestimmt.
// Weitere Sprachen/Länder später mit eigener, rechtlich angepasster Version ergänzen.
const GUIDE_LOCALE: Locale = "de";
const SLUG = "ausserterminliche-kuendigung";
const TITLE = "Ausserterminliche Kündigung Wohnung – Nachmieter Schweiz";
const DESCRIPTION =
  "Wohnung ausserterminlich kündigen mit Nachmieter? So kommst du in der Schweiz vorzeitig aus dem Mietvertrag – Fristen, Bedingungen und fertiges Schreiben in Minuten.";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  if (params.locale !== GUIDE_LOCALE) return {};
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/${SLUG}`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: "GetDocu",
      type: "article",
      locale: GUIDE_LOCALE,
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Kann ich meine Wohnung in der Schweiz jederzeit ausserterminlich kündigen?",
    a: "Ja. Du kannst das Mietverhältnis vor dem ordentlichen Termin beenden, wenn du einen zumutbaren und zahlungsfähigen Nachmieter stellst, der den Vertrag zu den gleichen Bedingungen übernimmt (Art. 264 OR).",
  },
  {
    q: "Wie viele Nachmieter muss ich vorschlagen?",
    a: "Es genügt grundsätzlich ein einziger Nachmieter, sofern dieser zumutbar und zahlungsfähig ist und den Vertrag zu den gleichen Bedingungen übernimmt.",
  },
  {
    q: "Ab wann muss ich keine Miete mehr zahlen?",
    a: "Sobald ein zumutbarer und zahlungsfähiger Nachmieter nachweislich bereit ist, das Mietverhältnis zu den gleichen Bedingungen zu übernehmen.",
  },
  {
    q: "Was passiert, wenn der Vermieter den Nachmieter ablehnt?",
    a: "Lehnt der Vermieter einen zumutbaren und zahlungsfähigen Nachmieter ab, wirst du von deinen Vertragspflichten befreit. Unzulässige Ablehnungsgründe wie Herkunft oder Religion zählen nicht.",
  },
  {
    q: "Muss die Kündigung eingeschrieben verschickt werden?",
    a: "Empfohlen ja. Massgebend ist der Zeitpunkt der Zustellung beim Vermieter – ein eingeschriebener Brief dokumentiert diesen nachweisbar.",
  },
  {
    q: "Müssen beide Ehepartner unterschreiben?",
    a: "Bei einer Familienwohnung ja – beide Partner müssen unterschreiben, auch wenn nur eine Person im Mietvertrag steht.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/ausserterminliche-kuendigung`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const ctaClass =
    "inline-block bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Nav locale={params.locale} dict={dict} />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link
            href={`/${params.locale}#tools`}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream"
          >
            ← Zurück
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Ratgeber Schweiz
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Wohnung ausserterminlich kündigen – mit Nachmieter vorzeitig raus
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Du willst vor dem nächsten offiziellen Kündigungstermin aus deiner Wohnung – wegen
            Umzug, neuem Job oder einer anderen Lebenssituation? In der Schweiz geht das: mit einer
            ausserterminlichen Kündigung und einem zumutbaren Nachmieter. Wir erstellen dir das
            rechtlich korrekte Schreiben in wenigen Minuten – ohne Konto, ohne Abo, für 4.00 CHF.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Dokument jetzt erstellen →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vorschau gratis · Erst zahlen, wenn du zufrieden bist · Daten danach gelöscht
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Was bedeutet «ausserterminliche Kündigung»?
              </h2>
              <p>
                Normalerweise kannst du deine Wohnung nur auf die im Mietvertrag festgelegten
                Termine kündigen – mit einer Frist von mindestens drei Monaten. Eine
                ausserterminliche Kündigung heisst: Du gibst die Wohnung vor diesem Termin zurück.
                Rechtlich gilt das als vorzeitige Rückgabe des Mietobjekts nach Artikel 264 OR.
              </p>
              <p className="mt-3">
                Der Schlüssel dazu ist ein Nachmieter. Stellst du eine zumutbare und zahlungsfähige
                Ersatzperson, die den Mietvertrag zu den gleichen Bedingungen übernimmt, wirst du
                vorzeitig aus dem Vertrag entlassen – und musst ab dem Übernahmezeitpunkt keine
                Miete mehr zahlen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Die Bedingungen für den Nachmieter
              </h2>
              <p>
                Damit du aus dem Vertrag kommst, muss der vorgeschlagene Nachmieter drei
                Anforderungen erfüllen. Er muss zahlungsfähig (solvent) sein, zumutbar für den
                Vermieter, und bereit, den Vertrag zu den gleichen Bedingungen zu übernehmen.
                «Gleiche Bedingungen» bedeutet: derselbe Mietzins, die gleichen Nebenkosten und die
                bisherigen Kündigungsmodalitäten.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Ab wann endet deine Mietzinspflicht?
              </h2>
              <p>
                Deine Pflicht, Miete zu zahlen, endet genau dann, wenn ein zumutbarer und
                zahlungsfähiger Nachmieter nachweislich bereit ist, das Mietverhältnis zu den
                gleichen Bedingungen zu übernehmen. Bis dahin läuft die Miete weiter – deshalb lohnt
                es sich, den Nachmieter früh und mit allen Unterlagen schriftlich vorzuschlagen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Was, wenn der Vermieter ablehnt?
              </h2>
              <p>
                Lehnt der Vermieter einen zahlungsfähigen und zumutbaren Nachmieter ab, wirst du
                trotzdem von deinen Vertragspflichten befreit. Der Vermieter darf einen Nachmieter
                nicht aus persönlichen Vorbehalten ablehnen – Herkunft, Religion, Geschlecht oder
                sozialer Status sind laut mehrfacher Rechtsprechung des Bundesgerichts keine
                zulässigen Ablehnungsgründe. Der Vermieter hat aber das Recht, den Vorschlag innert
                angemessener Frist zu prüfen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                So kündigst du formell korrekt
              </h2>
              <p>
                Auch bei der ausserterminlichen Kündigung gelten die Schweizer Formvorschriften: Die
                Kündigung muss schriftlich erfolgen und von allen im Mietvertrag genannten Personen
                unterschrieben sein. Handelt es sich um eine Familienwohnung (Ehe oder eingetragene
                Partnerschaft), müssen beide Partner unterschreiben – auch wenn nur eine Person im
                Vertrag steht. Verschicke die Kündigung per eingeschriebenem Brief; massgebend ist
                nicht der Poststempel, sondern der Zeitpunkt der Zustellung beim Vermieter.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                In Minuten zum fertigen Schreiben
              </h2>
              <p>
                Statt selbst zu formulieren und Fehler zu riskieren: Beantworte ein paar einfache
                Fragen, sieh dein Dokument gratis als Vorschau, und lade es nach der Zahlung als PDF
                herunter. Der Text ist auf die Schweizer Rechtslage abgestimmt.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Ausserterminliche Kündigung erstellen →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Häufige Fragen</h2>
              <div className="space-y-6">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <h3 className="mb-1 text-sm font-medium text-cream">{f.q}</h3>
                    <p className="text-sm text-cream-muted">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-ink-700 pt-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                Verwandte Dokumente
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/kuendigung-wohnung`} className="text-swiss-gold underline hover:opacity-80">
                    Kündigung Wohnung (ordentlich)
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/maengelruege`} className="text-swiss-gold underline hover:opacity-80">
                    Wohnungsschaden / Mängel melden
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/mietbewerbung`} className="text-swiss-gold underline hover:opacity-80">
                    Mietbewerbung für die neue Wohnung
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Hinweis: Diese Seite bietet allgemeine Informationen zum Schweizer Mietrecht, keine
              Rechtsberatung im Einzelfall. Das erstellte Dokument ist auf die geprüfte Rechtslage
              abgestimmt; bei komplexen Situationen kann eine Fachstelle wie der Mieterverband
              weiterhelfen.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
