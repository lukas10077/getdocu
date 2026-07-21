import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import { getBrand, allBrandSlugs, brands } from "@/lib/brands";
import { hubForCategory } from "@/lib/categoryHubs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NoticeDeadline from "@/components/NoticeDeadline";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";
const GUIDE_LOCALE: Locale = "de";

export async function generateStaticParams() {
  return allBrandSlugs.map((brand) => ({ brand }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; brand: string };
}): Promise<Metadata> {
  const brand = getBrand(params.brand);
  if (!brand) return {};
  // Falsche Sprach-URL → Canonical aufs Original (konsolidiert Duplikate bei Google)
  if (params.locale !== GUIDE_LOCALE) {
    return { alternates: { canonical: `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/anbieter/${brand.slug}` } };
  }
  const title = `${brand.name} kündigen — Vorlage, Frist & Adresse`;
  const description = `${brand.name} kündigen: Kündigungsfrist, Kündigungsadresse und ein fertiges Kündigungsschreiben in wenigen Minuten — ohne Konto, ohne Abo.`;
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/anbieter/${brand.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "GetDocu", type: "article", locale: GUIDE_LOCALE },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BrandPage({
  params,
}: {
  params: { locale: Locale; brand: string };
}) {
  const brand = getBrand(params.brand);
  if (!brand || params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolParams = new URLSearchParams({
    country: brand.countryCode,
    recipientName: brand.name,
    recipientAddress: brand.address.join("\n"),
    // Kündigungstyp aus der Marken-Kategorie ableiten (Wert = deutsche Option im Tool)
    type: brand.category === "Versicherung" ? "Versicherung" : "Abonnement / Mitgliedschaft",
  });
  if (brand.defaultNoticePeriod) toolParams.set("noticePeriod", brand.defaultNoticePeriod);
  const toolHref = `/${params.locale}/tools/kuendigung?${toolParams.toString()}`;
  const hub = hubForCategory(brand.category);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: brand.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const ctaClass =
    "inline-block bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark";

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Nav locale={params.locale} dict={dict} />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link href={`/${params.locale}#tools`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">
            ← Zurück
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Ratgeber · {brand.category} kündigen
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            {brand.name} kündigen — Vorlage, Frist &amp; Adresse
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">{brand.intro}</p>

          {/* Konkretes Datum statt abstrakter Frist — nur wo die Frist eindeutig ist */}
          {brand.defaultNoticePeriod && (
            <NoticeDeadline noticePeriod={brand.defaultNoticePeriod} brandName={brand.name} />
          )}

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Kündigung jetzt erstellen →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vorschau gratis · Erst zahlen, wenn du zufrieden bist · Daten danach gelöscht
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">Kündigungsfrist</h2>
              <p>{brand.noticePeriod}</p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">Kündigungsadresse</h2>
              <div className="rounded-sm border border-ink-700 bg-ink-900 p-5 text-sm text-cream">
                {brand.address.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">Das solltest du beachten</h2>
              <ul className="space-y-2 text-sm">
                {brand.facts.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-swiss-gold">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">In Minuten zum fertigen Schreiben</h2>
              <p>
                Statt selbst zu formulieren: Beantworte ein paar einfache Fragen, sieh dein
                Kündigungsschreiben gratis als Vorschau und lade es nach der Zahlung als PDF herunter —
                mit korrekter Anrede, Betreff und Bitte um schriftliche Bestätigung.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  {brand.name}-Kündigung erstellen →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Häufige Fragen</h2>
              <div className="space-y-6">
                {brand.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="mb-1 text-sm font-medium text-cream">{f.q}</h3>
                    <p className="text-sm text-cream-muted">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-ink-700 pt-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                Weitere Anbieter kündigen
              </h2>
              <ul className="space-y-2 text-sm">
                {hub && (
                  <li>
                    <Link href={`/${params.locale}/ratgeber/kuendigen/${hub.slug}`} className="text-swiss-gold underline hover:opacity-80">
                      {hub.title} — Übersicht &amp; Frist
                    </Link>
                  </li>
                )}
                {allBrandSlugs
                  .filter((s) => s !== brand.slug)
                  .map((s) => (
                    <li key={s}>
                      <Link href={`/${params.locale}/ratgeber/anbieter/${s}`} className="text-swiss-gold underline hover:opacity-80">
                        {brands[s].name} kündigen
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link href={`/${params.locale}/ratgeber`} className="text-swiss-gold underline hover:opacity-80">
                    Alle Ratgeber ansehen →
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Hinweis: Allgemeine Informationen, keine Rechtsberatung. {brand.sourceNote}
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
