import { getDictionary, Locale } from "@/i18n/config";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Impressum({ params }: { params: { locale: Locale } }) {
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
            Impressum
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-cream-muted">
            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Betreiber
              </h2>
              <p>GetDocu</p>
              <p>c/o F2BII E-Commerce #942</p>
              <p>Hintergoldingerstrasse 30</p>
              <p>8638 Goldingen</p>
              <p>Schweiz</p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Kontakt
              </h2>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:lukaslast@gmail.com"
                  className="text-swiss-gold underline hover:opacity-80"
                >
                  lukaslast@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Haftungsausschluss
              </h2>
              <p>
                Der Betreiber übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit und
                Aktualität der bereitgestellten Inhalte. Die Nutzung der Inhalte erfolgt auf eigene
                Gefahr. Haftungsansprüche gegen den Betreiber, die sich auf Schäden materieller oder
                ideeller Art beziehen, welche durch die Nutzung oder Nichtnutzung der dargebotenen
                Informationen entstanden sind, werden grundsätzlich abgelehnt.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Keine Rechtsberatung
              </h2>
              <p>
                Die von GetDocu generierten Dokumente sind Formulierungsvorschläge und stellen keine
                Rechtsberatung dar. Bei rechtlichen Fragen wenden Sie sich an eine zugelassene
                Rechtsberaterin oder einen zugelassenen Rechtsberater.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-cream">
                Anwendbares Recht
              </h2>
              <p>
                Für sämtliche Streitigkeiten gilt Schweizer Recht. Gerichtsstand ist der Sitz des
                Betreibers.
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
