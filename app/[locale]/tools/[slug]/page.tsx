import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/i18n/config";
import { getTool, allToolSlugs } from "@/lib/tools";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolForm from "@/components/ToolForm";

export async function generateStaticParams() {
  return allToolSlugs.map((slug) => ({ slug }));
}

export default async function ToolPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const dict = await getDictionary(params.locale);
  const priceChf = (tool.priceChfRappen / 100).toFixed(2);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="border-b border-swiss-gray-100 pb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
              CHF {priceChf}
            </p>
            <h1 className="font-serif text-4xl font-light leading-tight text-swiss-black md:text-5xl">
              {tool.documentTitleDe}
            </h1>
            <p className="mt-3 text-base text-swiss-gray-500">{tool.descriptionDe}</p>

            {/* Trust pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["🔒 Daten sofort gelöscht", "⚡ Dokument in 20 Sek.", "💳 Stripe · TWINT"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-swiss-gray-200 px-3 py-1 text-xs text-swiss-gray-500"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Form — wrapped in Suspense because useSearchParams() needs it */}
          <Suspense fallback={<div className="mt-10 text-sm text-swiss-gray-500">Lädt…</div>}>
            <ToolForm tool={tool} locale={params.locale} />
          </Suspense>
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
