import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import { getTool, allToolSlugs } from "@/lib/tools";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ToolForm from "@/components/ToolForm";
import ToolPageHeader from "@/components/ToolPageHeader";

export async function generateStaticParams() {
  return allToolSlugs.map((slug) => ({ slug }));
}

export default async function ToolPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; slug: string };
  searchParams?: { session_id?: string };
}) {
  const tool = getTool(params.slug);
  if (!tool) notFound();

  const dict = await getDictionary(params.locale);
  const sessionId = searchParams?.session_id ?? null;

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />

      {/* Back button — outside main container, flush left */}
      <div className="bg-ink-950 px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link href={`/${params.locale}#tools`} className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream">
            {dict.tools.back ?? "← Zurück"}
          </Link>
        </div>
      </div>

      <section className="bg-ink-950 px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <div className="border-b border-ink-700 pb-8">
            <ToolPageHeader
              tool={tool}
              title={dict.tools.items?.[tool.slug]?.title}
              description={dict.tools.items?.[tool.slug]?.description}
            />

            {/* Trust pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {(dict.tools.trustPills ?? ["🔒 Daten sofort gelöscht", "⚡ Dokument in 20 Sek.", "💳 Sicher via Stripe"]).map((t: string) => (
                <span key={t} className="rounded-full border border-ink-700 px-3 py-1 text-xs text-cream-muted">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <ToolForm tool={tool} locale={params.locale} sessionId={sessionId} />
        </div>
      </section>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
