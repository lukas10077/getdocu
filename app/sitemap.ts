import { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { allToolSlugs } from "@/lib/tools";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocu.ch";

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

  return entries;
}
