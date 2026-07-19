import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import { guidesForLocale, ratgeberLocales, ratgeberLabel } from "@/lib/guides";
import { brands, allBrandSlugs } from "@/lib/brands";
import { brandsEs, allBrandEsSlugs } from "@/lib/brandsEs";
import { categoryHubs, allCategoryHubSlugs } from "@/lib/categoryHubs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const META: Record<string, { title: string; desc: string; eyebrow: string; intro: string }> = {
  de: {
    title: "Ratgeber — Kündigung, Miete & mehr | GetDocu",
    desc: "Verständliche Ratgeber zu Kündigung, Mietrecht und Anbieter-Kündigungen — plus fertige Dokumente in Minuten.",
    eyebrow: "Ratgeber",
    intro: "Verständlich erklärt, worauf es ankommt — und für jeden Fall das passende Dokument in Minuten.",
  },
  en: {
    title: "Guides — Resignation, Documents & more | GetDocu",
    desc: "Clear guides on resigning, documents and more — plus ready-to-use documents in minutes.",
    eyebrow: "Guides",
    intro: "Clear, practical guides — and the right document ready in minutes.",
  },
  es: {
    title: "Guías — Renuncia, documentos y más | GetDocu",
    desc: "Guías claras sobre renuncia, documentos y más — con documentos listos en minutos.",
    eyebrow: "Guías",
    intro: "Guías claras y prácticas — y el documento adecuado listo en minutos.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const m = META[params.locale];
  if (!m) return {};
  const url = `${BASE_URL}/${params.locale}/ratgeber`;
  return {
    title: m.title,
    description: m.desc,
    alternates: { canonical: url },
    openGraph: { title: m.title, description: m.desc, url, siteName: "GetDocu", type: "website", locale: params.locale },
  };
}

export default async function RatgeberIndex({
  params,
}: {
  params: { locale: Locale };
}) {
  if (!ratgeberLocales.includes(params.locale)) notFound();

  const dict = await getDictionary(params.locale);
  const m = META[params.locale];
  const localeGuides = guidesForLocale(params.locale);

  // Kategorien zusammenstellen: Guides gruppiert + (nur DE) Anbieter-Seiten.
  const categories: { name: string; items: { href: string; title: string; desc: string }[] }[] = [];

  const byCategory = new Map<string, { href: string; title: string; desc: string }[]>();
  for (const g of localeGuides) {
    const item = { href: `/${params.locale}/ratgeber/${g.slug}`, title: g.title, desc: g.desc };
    byCategory.set(g.category, [...(byCategory.get(g.category) ?? []), item]);
  }
  for (const [name, items] of byCategory) categories.push({ name, items });

  if (params.locale === "de") {
    const hubItems = allCategoryHubSlugs.map((slug) => {
      const h = categoryHubs[slug];
      return {
        href: `/${params.locale}/ratgeber/kuendigen/${slug}`,
        title: h.title,
        desc: "Frist, Vorgehen und alle Anbieter auf einen Blick.",
      };
    });
    if (hubItems.length) categories.push({ name: "Nach Kategorie kündigen", items: hubItems });

    const brandItems = allBrandSlugs.map((slug) => {
      const b = brands[slug];
      return {
        href: `/${params.locale}/ratgeber/anbieter/${slug}`,
        title: `${b.name} kündigen`,
        desc: `${b.category} — Vorlage, Frist & Adresse.`,
      };
    });
    if (brandItems.length) categories.push({ name: "Anbieter kündigen", items: brandItems });
  }

  if (params.locale === "es") {
    const esCountryOrder = ["España", "México", "Colombia", "Argentina"];
    const byCountry = new Map<string, { href: string; title: string; desc: string }[]>();
    for (const slug of allBrandEsSlugs) {
      const b = brandsEs[slug];
      const item = {
        href: `/${params.locale}/ratgeber/dar-de-baja/${b.slug}`,
        title: `Dar de baja ${b.name}`,
        desc: `${b.category} — teléfono, pasos y carta de baja.`,
      };
      byCountry.set(b.countryName, [...(byCountry.get(b.countryName) ?? []), item]);
    }
    for (const country of esCountryOrder) {
      const items = byCountry.get(country);
      if (items && items.length) categories.push({ name: `Dar de baja en ${country}`, items });
    }
  }

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link href={`/${params.locale}`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">
            ← {ratgeberLabel[params.locale] ? "GetDocu" : "Home"}
          </Link>
        </div>
      </div>

      <section className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">{m.eyebrow}</p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">{ratgeberLabel[params.locale]}</h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream-muted">{m.intro}</p>

          <div className="mt-12 space-y-12">
            {categories.map((cat) => (
              <div key={cat.name}>
                <h2 className="mb-5 text-xs font-medium uppercase tracking-widest text-cream-muted">{cat.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cat.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className="group rounded-sm border border-ink-700 bg-ink-900 p-5 transition hover:border-swiss-gold/40 hover:bg-ink-800"
                    >
                      <h3 className="font-serif text-lg font-medium leading-snug text-cream">{it.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-cream-muted">{it.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
