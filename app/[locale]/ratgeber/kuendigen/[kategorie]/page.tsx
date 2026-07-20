import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import { getCategoryHub, allCategoryHubSlugs, brandsForCategory } from "@/lib/categoryHubs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";
const GUIDE_LOCALE: Locale = "de";

export async function generateStaticParams() {
  return allCategoryHubSlugs.map((kategorie) => ({ kategorie }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; kategorie: string };
}): Promise<Metadata> {
  const hub = getCategoryHub(params.kategorie);
  if (!hub || params.locale !== GUIDE_LOCALE) return {};
  const title = `${hub.title} — Frist, Vorlage & Anbieter`;
  const description = `${hub.title}: Kündigungsfrist, das richtige Vorgehen und ein fertiges Kündigungsschreiben in wenigen Minuten. Inklusive Kündigungsadresse aller Anbieter.`;
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/kuendigen/${hub.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "GetDocu", type: "article", locale: GUIDE_LOCALE },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryHubPage({
  params,
}: {
  params: { locale: Locale; kategorie: string };
}) {
  const hub = getCategoryHub(params.kategorie);
  if (!hub || params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const hubBrands = brandsForCategory(hub.category);
  const toolHref = `/${params.locale}/tools/${hub.toolSlug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faq.map((f) => ({
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
          <Link href={`/${params.locale}/ratgeber`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">
            ← Alle Ratgeber
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Ratgeber · Kündigen
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            {hub.title}
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">{hub.lead}</p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Kündigung jetzt erstellen →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vorschau gratis · Erst zahlen, wenn du zufrieden bist · Daten danach gelöscht
            </p>
          </div>

          {/* Spokes: alle Marken der Kategorie (Sektion nur zeigen, wenn es welche gibt) */}
          {hubBrands.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Anbieter direkt kündigen</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {hubBrands.map((b) => (
                  <Link
                    key={b.slug}
                    href={`/${params.locale}/ratgeber/anbieter/${b.slug}`}
                    className="flex items-center justify-between rounded-sm border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-cream transition hover:border-swiss-gold"
                  >
                    <span>{b.name} kündigen</span>
                    <span className="text-swiss-gold">→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Allgemeiner Ratgeber-Text */}
          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            {hub.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="mb-3 font-serif text-2xl font-medium text-cream">{s.heading}</h2>
                <p>{s.body}</p>
              </section>
            ))}

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Häufige Fragen</h2>
              <div className="space-y-6">
                {hub.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="mb-1 text-sm font-medium text-cream">{f.q}</h3>
                    <p className="text-sm text-cream-muted">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-ink-700 pt-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                Weitere Kategorien
              </h2>
              <ul className="space-y-2 text-sm">
                {allCategoryHubSlugs
                  .filter((s) => s !== hub.slug)
                  .map((s) => {
                    const other = getCategoryHub(s)!;
                    return (
                      <li key={s}>
                        <Link href={`/${params.locale}/ratgeber/kuendigen/${s}`} className="text-swiss-gold underline hover:opacity-80">
                          {other.title}
                        </Link>
                      </li>
                    );
                  })}
                <li>
                  <Link href={`/${params.locale}/ratgeber`} className="text-swiss-gold underline hover:opacity-80">
                    Alle Ratgeber ansehen →
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Hinweis: Allgemeine Informationen, keine Rechtsberatung. Angaben Stand 2026 — deine
              genaue Frist steht in deinem Vertrag bzw. deiner Police.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
