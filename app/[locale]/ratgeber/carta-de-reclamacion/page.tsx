import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "carta-de-reclamacion";
const TITLE = "Cómo reclamar a una empresa en España: carta, hoja y arbitraje";
const DESCRIPTION =
  "Cómo reclamar a una empresa: la hoja de reclamaciones, la carta de reclamación por burofax, el plazo de respuesta y el arbitraje de consumo. Genera tu carta de reclamación en minutos.";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/${SLUG}`;
  // Falsche Sprach-URL → Canonical aufs Original (konsolidiert Duplikate bei Google)
  if (params.locale !== GUIDE_LOCALE) return { alternates: { canonical: url } };
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url,
      siteName: "GetDocu",
      type: "article",
      locale: "es_ES",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "¿Cómo reclamo a una empresa?",
    a: "Puedes pedir la hoja de quejas y reclamaciones oficial en el establecimiento o enviar una carta de reclamación directamente a la empresa, mejor por burofax con acuse de recibo. Explica el problema y lo que pides con claridad.",
  },
  {
    q: "¿Cuánto tiempo tiene la empresa para responder?",
    a: "La empresa dispone habitualmente de 10 días hábiles para contestar a la hoja de quejas y reclamaciones.",
  },
  {
    q: "¿Qué hago si la empresa no responde o no me satisface?",
    a: "Puedes presentar la reclamación ante la Administración de Consumo o la Oficina Municipal de Información al Consumidor (OMIC) de tu municipio, y acudir al Sistema Arbitral de Consumo.",
  },
  {
    q: "¿El arbitraje de consumo tiene coste?",
    a: "No. Es un procedimiento voluntario, gratuito y rápido en el que un órgano imparcial dicta un laudo vinculante para ambas partes.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/reklamation?country=ES`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
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
            Guía · Reclamaciones
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Carta de reclamación
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Cuando un producto sale defectuoso, un servicio falla o una factura es incorrecta, reclamar
            por escrito es la forma más eficaz de dejar constancia. Te explicamos las vías —hoja de
            reclamaciones, carta a la empresa y arbitraje— y puedes generar tu carta de reclamación en
            minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi carta de reclamación →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Las vías para reclamar
              </h2>
              <p>
                Puedes pedir la <strong className="text-cream">hoja de quejas y reclamaciones</strong>{" "}
                oficial en el propio establecimiento, o enviar una{" "}
                <strong className="text-cream">carta de reclamación</strong> directamente a la empresa.
                La carta por <strong className="text-cream">burofax con acuse de recibo</strong> es la
                opción más sólida, porque deja prueba de la fecha y del contenido. La empresa suele
                tener <strong className="text-cream">10 días hábiles</strong> para responder.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué incluir en la carta
              </h2>
              <p>
                Tus datos, la <strong className="text-cream">identificación del producto o servicio</strong>{" "}
                (número de pedido, factura o contrato), una descripción clara del problema y{" "}
                <strong className="text-cream">lo que pides</strong>: reembolso, reparación,
                sustitución o compensación. Añade un plazo razonable para la respuesta y un tono firme
                pero cortés.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de reclamación →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Si la empresa no responde
              </h2>
              <p>
                Si no contesta en plazo o su respuesta no te satisface, puedes acudir a la{" "}
                <strong className="text-cream">Administración de Consumo</strong> o a la{" "}
                <strong className="text-cream">OMIC</strong> de tu municipio. Otra vía es el{" "}
                <strong className="text-cream">Sistema Arbitral de Consumo</strong>: voluntario,
                gratuito y con una resolución (laudo) vinculante para ambas partes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Deja constancia
              </h2>
              <p>
                Envía la reclamación por un medio que deje registro —burofax con acuse de recibo o
                correo certificado— y <strong className="text-cream">guarda una copia</strong> junto
                con tickets, facturas o fotos. Esa documentación es tu prueba si el asunto escala a
                Consumo o al arbitraje.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Preguntas frecuentes</h2>
              <div className="space-y-6">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <h3 className="mb-1 text-sm font-medium text-cream">{f.q}</h3>
                    <p className="text-sm text-cream-muted">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-ink-700 pt-8">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-cream">
                Sigue leyendo
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/ratgeber/derecho-de-desistimiento`} className="text-swiss-gold underline hover:opacity-80">
                    Derecho de desistimiento: 14 días
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber/cancelar-seguro`} className="text-swiss-gold underline hover:opacity-80">
                    Cancelar un seguro
                  </Link>
                </li>
              </ul>
              <h2 className="mb-3 mt-6 text-xs font-medium uppercase tracking-widest text-cream">
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={toolHref} className="text-swiss-gold underline hover:opacity-80">
                    Carta de reclamación
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
              Nota: Esta página ofrece información general, no asesoría legal. Los plazos y trámites
              pueden variar según la comunidad autónoma y tu caso; en caso de duda, consulta con
              Consumo o con un profesional. Información verificada en julio de 2026.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
