import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

// Pilot: Inhalt ist auf die Schweizer Rechtslage (Deutsch) abgestimmt.
const GUIDE_LOCALE: Locale = "de";
const SLUG = "fristlose-kuendigung-wohnung";
const TITLE = "Fristlose Kündigung der Wohnung – aus wichtigem Grund (Schweiz)";
const DESCRIPTION =
  "Wohnung fristlos oder ausserordentlich kündigen wegen Schimmel, schweren Mängeln oder unbewohnbarer Wohnung? Wann es in der Schweiz erlaubt ist – und ein fertiges Schreiben in Minuten.";

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
    q: "Kann ich meine Wohnung wegen Schimmel fristlos kündigen?",
    a: "In gravierenden Fällen ja: Wenn der Schimmel die Wohnung unbewohnbar macht und der Vermieter ihn trotz Meldung und angemessener Frist nicht behebt, kann eine fristlose Kündigung nach Art. 259b OR möglich sein. Wichtig ist, den Mangel vorher schriftlich zu melden und Beweise (Fotos) zu sichern.",
  },
  {
    q: "Was gilt als «wichtiger Grund»?",
    a: "Ein Grund ist nur dann wichtig, wenn die Fortsetzung des Mietverhältnisses für dich unzumutbar geworden ist (Art. 266g OR). Die Gerichte legen diesen Massstab streng aus – ein blosser Umzug oder Jobwechsel genügt dafür nicht.",
  },
  {
    q: "Muss ich dem Vermieter zuerst eine Frist zur Behebung setzen?",
    a: "Bei Mängeln ja: Du meldest den Mangel schriftlich und setzt eine angemessene Frist zur Behebung. Erst wenn der Vermieter nicht reagiert, kommt eine fristlose Kündigung in Betracht.",
  },
  {
    q: "Ist die ausserordentliche Kündigung immer fristlos?",
    a: "Nein. Bei einem sehr schweren, nicht behobenen Mangel kann fristlos gekündigt werden (Art. 259b OR). Bei anderen wichtigen Gründen gilt die gesetzliche Kündigungsfrist – du kannst aber auf einen beliebigen Zeitpunkt kündigen (Art. 266g OR).",
  },
  {
    q: "Bekomme ich Schadenersatz, wenn ich vorzeitig ausziehen muss?",
    a: "Wenn du wegen eines schweren Mangels berechtigt vorzeitig ausziehst, hast du grundsätzlich Anspruch auf Ersatz des Schadens, der dir dadurch entsteht.",
  },
  {
    q: "Muss die Kündigung eingeschrieben verschickt werden?",
    a: "Empfohlen ja. Sie muss schriftlich erfolgen; ein eingeschriebener Brief dokumentiert den Zeitpunkt der Zustellung beim Vermieter nachweisbar. Bei einer Familienwohnung müssen beide Ehepartner unterschreiben.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/ausserordentliche-kuendigung?country=CH`;

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
            Fristlose Kündigung der Wohnung – wann du aus wichtigem Grund vorzeitig raus kannst
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Schimmel, den der Vermieter nicht behebt? Eine unbewohnbare Wohnung? Manchmal willst oder
            musst du raus, bevor der ordentliche Kündigungstermin kommt – nicht wegen eines Umzugs,
            sondern weil etwas ernsthaft nicht stimmt. In der Schweiz ist das aus wichtigem Grund
            möglich. Wir erstellen dir das passende Schreiben in wenigen Minuten – ohne Konto, ohne
            Abo, für 4.00 CHF.
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
                Zwei Wege, aus wichtigem Grund zu kündigen
              </h2>
              <p>
                Das Schweizer Mietrecht kennt zwei Situationen, in denen du das Mietverhältnis nicht
                erst auf den nächsten ordentlichen Termin beenden musst:
              </p>
              <p className="mt-3">
                <strong className="text-cream">Fristlos bei schwerem Mangel (Art. 259b OR):</strong>{" "}
                Hat die Wohnung einen sehr schweren Mangel, den der Vermieter trotz Meldung und
                angemessener Frist nicht behebt, kannst du fristlos – also ohne Einhaltung eines
                Termins – kündigen.
              </p>
              <p className="mt-3">
                <strong className="text-cream">
                  Aus wichtigem Grund mit gesetzlicher Frist (Art. 266g OR):
                </strong>{" "}
                Ist die Fortsetzung des Mietverhältnisses aus einem anderen wichtigen Grund
                unzumutbar geworden, kannst du auf einen beliebigen Zeitpunkt kündigen – allerdings
                unter Einhaltung der gesetzlichen Kündigungsfrist (bei Wohnungen drei Monate).
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Typische Gründe
              </h2>
              <p>
                Anerkannt werden vor allem Fälle, in denen das Wohnen wirklich unzumutbar wird:
                massiver Schimmelbefall, der die Wohnung unbewohnbar macht, gravierende bauliche
                Mängel, gesundheitsgefährdende Zustände oder erhebliche Pflichtverletzungen des
                Vermieters. Extremer Schimmel kann eine Wohnung rechtlich unbewohnbar machen.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Wichtig: Die Gerichte sind streng
              </h2>
              <p>
                Sei dir bewusst: Die Rechtsprechung ist bei der Anerkennung «wichtiger Gründe»
                zurückhaltend. Ein blosser Umzug, ein neuer Job oder Unzufriedenheit reichen nicht –
                dafür ist der Weg über einen Nachmieter gedacht. Für eine Kündigung aus wichtigem
                Grund muss die Situation objektiv unzumutbar sein. Melde Mängel darum immer zuerst
                schriftlich, setze eine Frist zur Behebung und sichere Beweise (Fotos, Korrespondenz)
                – das ist die Grundlage für eine berechtigte Kündigung.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                So kündigst du formell korrekt
              </h2>
              <p>
                Die Kündigung muss schriftlich erfolgen und von allen im Mietvertrag genannten
                Personen unterschrieben sein. Bei einer Familienwohnung (Ehe oder eingetragene
                Partnerschaft) müssen beide Partner unterschreiben. Verschicke sie per
                eingeschriebenem Brief – massgebend ist der Zeitpunkt der Zustellung beim Vermieter,
                nicht der Poststempel. Schildere den wichtigen Grund im Schreiben sachlich und
                konkret.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Kündigung aus wichtigem Grund erstellen →
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
                  <Link href={`/${params.locale}/tools/maengelruege`} className="text-swiss-gold underline hover:opacity-80">
                    Mangel / Wohnungsschaden melden (zuerst)
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber/ausserterminliche-kuendigung`} className="text-swiss-gold underline hover:opacity-80">
                    Ohne wichtigen Grund raus? Ausserterminliche Kündigung mit Nachmieter
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/kuendigung-wohnung`} className="text-swiss-gold underline hover:opacity-80">
                    Kündigung Wohnung (ordentlich)
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Hinweis: Diese Seite bietet allgemeine Informationen zum Schweizer Mietrecht, keine
              Rechtsberatung im Einzelfall. Ob ein «wichtiger Grund» vorliegt, beurteilt im
              Streitfall ein Gericht; bei Unsicherheit hilft eine Fachstelle wie der Mieterverband
              weiter.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
