import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { allToolSlugs } from "@/lib/tools";
import { allBrandSlugs } from "@/lib/brands";
import { ratgeberLocales } from "@/lib/guides";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.getdocunow.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // Homepage
    entries.push({ url: `${BASE_URL}/${locale}`, changeFrequency: "weekly", priority: 1.0 });

    // Tool-Seiten
    for (const slug of allToolSlugs) {
      entries.push({ url: `${BASE_URL}/${locale}/tools/${slug}`, changeFrequency: "monthly", priority: 0.8 });
    }

    // Legal
    for (const page of ["impressum", "datenschutz", "agb"]) {
      entries.push({ url: `${BASE_URL}/${locale}/legal/${page}`, changeFrequency: "yearly", priority: 0.3 });
    }
  }

  // Ratgeber-Übersichtsseiten
  for (const locale of ratgeberLocales) {
    entries.push({ url: `${BASE_URL}/${locale}/ratgeber`, changeFrequency: "weekly", priority: 0.6 });
  }

  // Ratgeber-Seiten (SEO-Landingpages). Jeweils sprachspezifisch.
  const guides: { locale: string; slug: string }[] = [
    { locale: "de", slug: "ausserterminliche-kuendigung" },
    { locale: "de", slug: "fristlose-kuendigung-wohnung" },
    { locale: "en", slug: "resign-immediately" },
    { locale: "en", slug: "resignation-email" },
    { locale: "es", slug: "carta-de-renuncia" },
  ];
  for (const g of guides) {
    entries.push({
      url: `${BASE_URL}/${g.locale}/ratgeber/${g.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Marken-/Anbieter-Kündigungsseiten (aktuell nur Deutsch).
  for (const slug of allBrandSlugs) {
    entries.push({
      url: `${BASE_URL}/de/ratgeber/anbieter/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
