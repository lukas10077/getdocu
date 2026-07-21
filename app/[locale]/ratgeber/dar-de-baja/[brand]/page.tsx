import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import { getBrandEs, allBrandEsSlugs, brandsEs } from "@/lib/brandsEs";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";
const GUIDE_LOCALE: Locale = "es";

export async function generateStaticParams() {
  return allBrandEsSlugs.map((brand) => ({ brand }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; brand: string };
}): Promise<Metadata> {
  const brand = getBrandEs(params.brand);
  if (!brand) return {};
  // Falsche Sprach-URL → Canonical aufs Original (konsolidiert Duplikate bei Google)
  if (params.locale !== GUIDE_LOCALE) {
    return { alternates: { canonical: `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/dar-de-baja/${brand.slug}` } };
  }
  const title = brand.global
    ? `Cancelar ${brand.name} — cómo darte de baja paso a paso`
    : `Dar de baja ${brand.name} en ${brand.countryName} — teléfono, pasos y carta de baja`;
  const description = brand.global
    ? `Cómo cancelar ${brand.name}: pasos para darte de baja desde tu cuenta, sin complicaciones. Guía clara y actualizada.`
    : `Cómo dar de baja ${brand.name} en ${brand.countryName}: teléfono, pasos y qué necesitas. Crea una carta de baja formal en minutos, sin cuenta y sin suscripción.`;
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/dar-de-baja/${brand.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "GetDocu", type: "article", locale: "es_ES" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DarDeBajaPage({
  params,
}: {
  params: { locale: Locale; brand: string };
}) {
  const brand = getBrandEs(params.brand);
  if (!brand || params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);

  const toolParams = new URLSearchParams({
    country: brand.countryCode,
    recipientName: brand.name,
    type: "Abonnement / Mitgliedschaft",
  });
  // Kündigungsadresse mitgeben, sofern strukturiert hinterlegt
  if (brand.address?.length) toolParams.set("recipientAddress", brand.address.join("\n"));
  const toolHref = `/${params.locale}/tools/kuendigung?${toolParams.toString()}`;

  // Otras compañías de la misma categoría (enlazado interno hub-and-spoke)
  const siblings = allBrandEsSlugs
    .map((slug) => brandsEs[slug])
    .filter(
      (b) =>
        b.slug !== brand.slug &&
        b.category === brand.category &&
        (brand.global ? b.global : !b.global && b.countryCode === brand.countryCode)
    );

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Nav locale={params.locale} dict={dict} />

      <div className="px-6 pt-8">
        <div className="mx-auto max-w-content">
          <Link
            href={`/${params.locale}/ratgeber`}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream"
          >
            ← Guías
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            {brand.global ? brand.category : `${brand.category} · ${brand.countryName}`}
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            {brand.global ? `Cancelar ${brand.name}` : `Dar de baja ${brand.name}`}
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">{brand.intro}</p>

          {!brand.global && (
            <div className="mt-8">
              <Link href={toolHref} className={ctaClass}>
                Crear mi carta de baja →
              </Link>
              <p className="mt-3 text-xs text-cream-subtle">
                Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
              </p>
            </div>
          )}

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                {brand.global ? `Cómo cancelar ${brand.name}` : `Cómo darte de baja de ${brand.name}`}
              </h2>
              <ul className="space-y-3">
                {brand.cancelMethods.map((m) => (
                  <li key={m} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-swiss-gold" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">Lo que debes saber</h2>
              <ul className="space-y-3">
                {brand.facts.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-swiss-gold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </section>

            {!brand.global && (
              <section>
                <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                  Deja constancia por escrito
                </h2>
                <p>
                  Aunque tramites la baja por teléfono, una carta de baja por escrito te sirve como
                  prueba de cuándo la solicitaste — útil si luego hay problemas con la facturación o si
                  quieres ejercer tu derecho de desistimiento. Con nuestra herramienta generas una carta
                  profesional para {brand.name} en minutos, lista para enviar o adjuntar.
                </p>
                <div className="mt-6">
                  <Link href={toolHref} className={ctaClass}>
                    Crear mi carta de baja →
                  </Link>
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Preguntas frecuentes</h2>
              <div className="space-y-6">
                {brand.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="mb-1 text-sm font-medium text-cream">{f.q}</h3>
                    <p className="text-sm text-cream-muted">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {siblings.length > 0 && (
              <section className="border-t border-ink-700 pt-8">
                <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                  {brand.global ? "Cancelar otros servicios" : "Dar de baja otras compañías"}
                </h2>
                <ul className="space-y-2 text-sm">
                  {siblings.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/${params.locale}/ratgeber/dar-de-baja/${b.slug}`}
                        className="text-swiss-gold underline hover:opacity-80"
                      >
                        {b.global ? `Cancelar ${b.name}` : `Dar de baja ${b.name}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="border-t border-ink-700 pt-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/kuendigung`} className="text-swiss-gold underline hover:opacity-80">
                    Carta de baja / cancelación
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber`} className="text-swiss-gold underline hover:opacity-80">
                    Todas las guías
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Nota: Esta página ofrece información general, no asesoría legal. {brand.sourceNote}
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
