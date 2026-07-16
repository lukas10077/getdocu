import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary, locales, Locale, isRtl } from "@/i18n/config";
import { getTool, allToolSlugs } from "@/lib/tools";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolForm from "@/components/ToolForm";
import ToolPageHeader from "@/components/ToolPageHeader";
import ChOnlyGuard from "@/components/ChOnlyGuard";
import CountryOnlyBlock from "@/components/CountryOnlyBlock";
import CountryPresetter from "@/components/CountryPresetter";
import DocumentSample from "@/components/DocumentSample";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.getdocunow.com";

export async function generateStaticParams() {
  return allToolSlugs.map((slug) => ({ slug }));
}

// SEO: eigener Titel, Beschreibung, Canonical und hreflang pro Tool-Seite.
// Ohne dies erben alle Tool-Seiten die Homepage-Metadaten (Duplicate Content).
export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const tool = getTool(params.slug);
  if (!tool) return {};
  const dict = await getDictionary(params.locale);
  const item = dict.tools?.items?.[params.slug];
  const title = `${item?.title ?? tool.documentTitleDe} — GetDocu`;
  const description = item?.description ?? tool.descriptionDe;
  const url = `${BASE_URL}/${params.locale}/tools/${params.slug}`;
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((l) => [l, `${BASE_URL}/${l}/tools/${params.slug}`])
  );
  languages["x-default"] = `${BASE_URL}/de/tools/${params.slug}`;
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(item?.title ?? tool.documentTitleDe)}&sub=${encodeURIComponent(description)}`;
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      title,
      description,
      url,
      siteName: "GetDocu",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "GetDocu" }],
      type: "website",
      locale: params.locale,
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function ToolPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; slug: string };
  searchParams?: { session_id?: string; country?: string; [key: string]: string | string[] | undefined };
}) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const dict = await getDictionary(params.locale);
  const sessionId = searchParams?.session_id ?? null;

  // Vorbefüllung: alle übrigen URL-Parameter (z.B. von Ratgeber-/Marken-Seiten)
  // werden an das Formular gereicht und dort in die passenden Felder übernommen.
  const reserved = new Set(["session_id", "country", "status"]);
  const prefill: Record<string, string> = {};
  for (const [k, v] of Object.entries(searchParams ?? {})) {
    if (!reserved.has(k) && typeof v === "string") prefill[k] = v;
  }

  const priceChf = (tool.priceChfRappen / 100).toFixed(2);

  // Schema.org: Product — zeigt Preis direkt in Google-Suchergebnissen
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: dict.tools.items?.[tool.slug]?.title ?? tool.documentTitleDe,
    description: dict.tools.items?.[tool.slug]?.description ?? tool.descriptionDe,
    url: `${BASE_URL}/${params.locale}/tools/${tool.slug}`,
    offers: {
      "@type": "Offer",
      price: priceChf,
      priceCurrency: "CHF",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "GetDocu" },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Nav locale={params.locale} dict={dict} />

      <CountryPresetter code={searchParams?.country} />

      {/* Back button */}
      <div className="bg-ink-950 px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link href={`/${params.locale}#tools`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">
            {dict.tools.back ?? "← Zurück"}
          </Link>
        </div>
      </div>

      <section className="bg-ink-950 px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <div className="border-b border-ink-700 pb-8">
            <ToolPageHeader
              tool={tool}
              title={dict.tools.items?.[tool.slug]?.title}
              description={dict.tools.items?.[tool.slug]?.description}
            />
            <div className="mt-5 flex flex-wrap gap-2">
              {(dict.tools.trustPills ?? ["🔒 Daten sofort gelöscht", "⚡ Dokument in 20 Sek.", "💳 Sicher via Stripe"]).map((t: string) => (
                <span key={t} className="rounded-full border border-ink-700 px-3 py-1 text-xs text-cream-muted">
                  {t}
                </span>
              ))}
            </div>

            {params.locale === "de" && tool.slug === "kuendigung-wohnung" && (
              <CountryOnlyBlock country="CH">
                <p className="mt-5 text-xs text-cream-muted">
                  Musst du vorzeitig aus dem Mietvertrag raus?{" "}
                  <Link
                    href={`/${params.locale}/ratgeber/ausserterminliche-kuendigung`}
                    className="text-swiss-gold underline hover:opacity-80"
                  >
                    Ratgeber: Ausserterminliche Kündigung mit Nachmieter →
                  </Link>
                </p>
              </CountryOnlyBlock>
            )}

            {params.locale === "de" && tool.slug === "maengelruege" && (
              <CountryOnlyBlock country="CH">
                <p className="mt-5 text-xs text-cream-muted">
                  Mangel wird nicht behoben?{" "}
                  <Link
                    href={`/${params.locale}/ratgeber/fristlose-kuendigung-wohnung`}
                    className="text-swiss-gold underline hover:opacity-80"
                  >
                    Ratgeber: Fristlose Kündigung aus wichtigem Grund →
                  </Link>
                </p>
              </CountryOnlyBlock>
            )}

            {params.locale === "en" && tool.slug === "kuendigung-arbeit" && (
              <CountryOnlyBlock country="US">
                <p className="mt-5 text-xs text-cream-muted">
                  Need to quit fast?{" "}
                  <Link
                    href={`/${params.locale}/ratgeber/resign-immediately`}
                    className="text-swiss-gold underline hover:opacity-80"
                  >
                    Guide: How to resign immediately (no notice) →
                  </Link>
                </p>
              </CountryOnlyBlock>
            )}

            {params.locale === "es" && tool.slug === "kuendigung-arbeit" && (
              <CountryOnlyBlock country="US">
                <p className="mt-5 text-xs text-cream-muted">
                  ¿En inglés o en español?{" "}
                  <Link
                    href={`/${params.locale}/ratgeber/carta-de-renuncia`}
                    className="text-swiss-gold underline hover:opacity-80"
                  >
                    Guía: cómo escribir tu carta de renuncia →
                  </Link>
                </p>
              </CountryOnlyBlock>
            )}
          </div>

          <DocumentSample tool={tool} dict={dict} prefill={prefill} rtl={isRtl(params.locale)} />

          <ChOnlyGuard enabled={tool.chOnly} locale={params.locale}>
            <ToolForm tool={tool} locale={params.locale} sessionId={sessionId} dict={dict} prefill={prefill} />
          </ChOnlyGuard>
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
