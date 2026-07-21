import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "carta-de-presentacion";
const TITLE = "Cómo escribir una carta de presentación — guía y estructura";
const DESCRIPTION =
  "Qué es una carta de presentación, cómo estructurarla en cuatro párrafos y cómo adaptarla a cada oferta. Crea la tuya en minutos, sin cuenta y sin suscripción.";

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
    q: "¿Qué es una carta de presentación?",
    a: "Es el texto que acompaña a tu currículum y explica, en pocas líneas, por qué encajas en el puesto y qué puedes aportar. El CV enumera tu trayectoria; la carta la conecta con la oferta concreta y le da un tono personal.",
  },
  {
    q: "¿Cuánto debe medir una carta de presentación?",
    a: "Media página, entre 200 y 300 palabras. Quien selecciona lee muchas candidaturas: una carta breve, concreta y bien estructurada gana siempre a una larga y genérica.",
  },
  {
    q: "¿Cómo empiezo una carta de presentación?",
    a: "Con un saludo a la persona o al departamento y una primera frase que diga a qué puesto te presentas y por qué te interesa. Evita fórmulas huecas como «Por la presente me dirijo a ustedes»; ve al grano y muestra interés real.",
  },
  {
    q: "¿Tengo que adaptarla a cada oferta?",
    a: "Sí. Una carta genérica se nota y resta. No hace falta reescribirla entera: menciona la empresa, adapta uno o dos ejemplos a lo que pide la oferta y usa sus mismas palabras clave.",
  },
  {
    q: "¿Es lo mismo carta de presentación que carta de motivación?",
    a: "Son muy parecidas. La carta de presentación acompaña a una candidatura laboral; la de motivación se usa más para estudios, becas o programas. La estructura y el objetivo —convencer de tu encaje— son casi idénticos.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/jobbewerbung`;

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
            Guía profesional
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Cómo escribir una carta de presentación
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            La carta de presentación es tu oportunidad de conectar tu currículum con el puesto
            concreto y mostrar por qué encajas. Bien hecha, marca la diferencia entre una candidatura
            más y una entrevista. Aquí tienes la estructura que funciona — y puedes generar la tuya en
            minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi carta de presentación →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Para qué sirve (y para qué no)
              </h2>
              <p>
                La carta no repite el currículum: lo{" "}
                <strong className="text-cream">interpreta</strong> para un puesto concreto. Sirve para
                explicar por qué te interesa esa empresa, qué problema puedes resolverle y qué te
                diferencia. No sirve para contar tu biografía ni para rellenar con frases hechas. Si
                una frase podría valer para cualquier oferta, sobra.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Estructura en cuatro párrafos
              </h2>
              <p>
                <strong className="text-cream">1. Apertura:</strong> saludo y una frase que diga a qué
                puesto te presentas y por qué te interesa.{" "}
                <strong className="text-cream">2. Encaje:</strong> uno o dos ejemplos concretos de tu
                experiencia que respondan a lo que pide la oferta.{" "}
                <strong className="text-cream">3. Motivación:</strong> qué te atrae de esa empresa en
                particular.{" "}
                <strong className="text-cream">4. Cierre:</strong> agradecimiento y una invitación
                cordial a la entrevista, con una despedida profesional.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de presentación →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Tono, formato y longitud
              </h2>
              <p>
                Mantén un tono <strong className="text-cream">profesional pero cercano</strong>, en
                media página (200–300 palabras). Dirígete a la persona por su nombre si lo conoces; si
                no, usa el departamento («Equipo de selección»). Cuida la ortografía y usa el mismo
                encabezado que tu currículum para que ambos documentos formen un conjunto coherente.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Adáptala a cada oferta
              </h2>
              <p>
                El mayor error es enviar la misma carta a todas partes. Antes de escribir, subraya en
                la oferta las dos o tres cosas que más importan y asegúrate de que tu carta las
                responde con ejemplos. Nombrar la empresa y usar sus palabras clave demuestra que te
                has fijado — y eso es justo lo que busca quien selecciona.
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
                  <Link href={`/${params.locale}/ratgeber/ejemplos-carta-de-presentacion`} className="text-swiss-gold underline hover:opacity-80">
                    Ejemplos de carta de presentación
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber/como-hacer-un-curriculum`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo hacer un currículum profesional
                  </Link>
                </li>
              </ul>
              <h2 className="mb-3 mt-6 text-xs font-medium uppercase tracking-widest text-cream">
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/jobbewerbung`} className="text-swiss-gold underline hover:opacity-80">
                    Carta de presentación / solicitud de empleo
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/lebenslauf`} className="text-swiss-gold underline hover:opacity-80">
                    Currículum (CV)
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Nota: Esta página ofrece orientación general para redactar tu carta de presentación. Las
              convenciones pueden variar según el país y el sector.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
