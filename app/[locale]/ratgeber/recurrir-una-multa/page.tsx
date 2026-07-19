import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "recurrir-una-multa";
const TITLE = "Cómo recurrir una multa de tráfico en España: plazos y pasos";
const DESCRIPTION =
  "Los plazos para recurrir una multa: 20 días naturales para alegaciones y un mes para el recurso de reposición. Ante quién se presenta, qué pasa con el descuento del 50% y cómo redactar tu escrito en minutos.";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  if (params.locale !== GUIDE_LOCALE) return {};
  const url = `${BASE_URL}/${GUIDE_LOCALE}/ratgeber/${SLUG}`;
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
    q: "¿Cuánto plazo tengo para recurrir una multa?",
    a: "Tienes 20 días naturales desde la notificación para presentar alegaciones. Si ya hay resolución sancionadora, puedes interponer un recurso de reposición (potestativo) en el plazo de un mes desde su notificación.",
  },
  {
    q: "¿Pierdo el descuento del 50% si recurro?",
    a: "Sí. El descuento del 50% es por pago voluntario en los primeros 20 días e implica renunciar a recurrir. Si presentas alegaciones y te las desestiman, deberás pagar el 100% de la sanción.",
  },
  {
    q: "¿Cuánto cuesta recurrir una multa?",
    a: "Presentar alegaciones y recursos ante Tráfico es un trámite gratuito.",
  },
  {
    q: "¿Ante quién se presenta el recurso?",
    a: "Ante el órgano que impuso la multa: la Jefatura Provincial de Tráfico (DGT) si es una multa de la DGT, o el Ayuntamiento correspondiente si es municipal.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/widerspruch?country=ES`;

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
            Guía · Multas y recursos
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Recurrir una multa
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Recurrir una multa de tráfico se hace por escrito y tiene plazos muy concretos. Te
            explicamos cuánto tiempo tienes, ante quién se presenta y qué ocurre con el descuento del
            50% — y puedes generar tu escrito de recurso en minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi escrito de recurso →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Los plazos: 20 días y un mes
              </h2>
              <p>
                Desde la notificación tienes{" "}
                <strong className="text-cream">20 días naturales para presentar alegaciones</strong> y
                aportar pruebas. Si el órgano las desestima y dicta resolución sancionadora, aún puedes
                interponer un <strong className="text-cream">recurso de reposición</strong>, con
                carácter potestativo, en el plazo de <strong className="text-cream">un mes</strong>{" "}
                desde su notificación. Después queda la vía del recurso contencioso-administrativo, en
                el plazo de dos meses.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                El descuento del 50%
              </h2>
              <p>
                Si pagas en los primeros 20 días, la sanción se reduce al{" "}
                <strong className="text-cream">50%</strong>, pero ese pago supone renunciar a recurrir.
                Al presentar alegaciones <strong className="text-cream">pierdes ese descuento</strong>:
                si tu recurso se desestima, tendrás que pagar el 100%. Conviene valorar tus
                posibilidades antes de decidir.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi escrito de recurso →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Dónde y cómo presentarlo
              </h2>
              <p>
                El escrito se dirige al{" "}
                <strong className="text-cream">órgano que impuso la multa</strong>: la Jefatura
                Provincial de Tráfico (DGT) o el Ayuntamiento, según el caso. Indica siempre el{" "}
                <strong className="text-cream">número de expediente o boletín</strong> y la fecha de
                notificación para que quede identificada la sanción. Presentar alegaciones y recursos es
                gratuito, y puedes hacerlo por registro electrónico o presencial.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué incluir en el escrito
              </h2>
              <p>
                Tus datos, la <strong className="text-cream">identificación de la sanción</strong>{" "}
                (expediente y fecha de notificación) y la declaración clara de que recurres dentro de
                plazo. La argumentación detallada y las pruebas puedes desarrollarlas aparte; lo
                esencial es dejar constancia por escrito de tu recurso <em>en plazo</em> para que tu
                derecho no decaiga.
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
                  <Link href={`/${params.locale}/ratgeber/carta-de-reclamacion`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo reclamar a una empresa
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber/derecho-de-desistimiento`} className="text-swiss-gold underline hover:opacity-80">
                    Derecho de desistimiento: 14 días
                  </Link>
                </li>
              </ul>
              <h2 className="mb-3 mt-6 text-xs font-medium uppercase tracking-widest text-cream">
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={toolHref} className="text-swiss-gold underline hover:opacity-80">
                    Escrito de recurso / alegaciones
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
              pueden variar según el organismo y tu caso; en caso de duda, revisa la notificación o
              consulta a un profesional. Información verificada en julio de 2026.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
