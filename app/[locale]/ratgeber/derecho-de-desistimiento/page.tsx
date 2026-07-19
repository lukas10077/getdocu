import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "derecho-de-desistimiento";
const TITLE = "Derecho de desistimiento en España: 14 días para devolver";
const DESCRIPTION =
  "Cómo desistir de una compra online en España: el plazo de 14 días naturales, el formulario modelo, la devolución del dinero y las excepciones. Genera tu carta de desistimiento en minutos.";

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
    q: "¿Cuánto tiempo tengo para desistir de una compra?",
    a: "14 días naturales desde que recibes el producto (o desde la firma del contrato en el caso de servicios). Si el vendedor no te informó de este derecho, el plazo se amplía hasta 12 meses.",
  },
  {
    q: "¿Tengo que dar motivos para desistir?",
    a: "No. El derecho de desistimiento no requiere justificación: basta una declaración inequívoca de que quieres desistir del contrato.",
  },
  {
    q: "¿Me devuelven los gastos de envío?",
    a: "Sí, los gastos de entrega ordinarios. La empresa debe reembolsar todo lo pagado en un máximo de 14 días. Los gastos de devolución pueden correr a tu cargo si el vendedor te informó de ello.",
  },
  {
    q: "¿Hay productos que no admiten desistimiento?",
    a: "Sí. Por ejemplo bienes personalizados, productos precintados por higiene que ya se han abierto, o contenido digital ya descargado, entre otras excepciones legales.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/widerruf?country=ES`;

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
            Guía · Desistimiento
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Derecho de desistimiento
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            En las compras online y a distancia tienes derecho a desistir del contrato sin dar motivos.
            Te explicamos el plazo de 14 días, cómo ejercerlo y qué debe devolverte la empresa — y
            puedes generar tu carta de desistimiento en minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi carta de desistimiento →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                El plazo: 14 días naturales
              </h2>
              <p>
                El artículo 71 del texto refundido de la Ley General para la Defensa de los
                Consumidores y Usuarios reconoce un plazo mínimo de{" "}
                <strong className="text-cream">14 días naturales</strong> para desistir, que se cuenta
                desde la <strong className="text-cream">recepción del bien</strong> (o desde la firma
                del contrato en los servicios). Si el vendedor{" "}
                <strong className="text-cream">no te informó</strong> de este derecho, el plazo se
                amplía hasta 12 meses.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cómo ejercer el desistimiento
              </h2>
              <p>
                Puedes usar el <strong className="text-cream">formulario modelo</strong> que prevé la
                ley o cualquier otra <strong className="text-cream">declaración inequívoca</strong> de
                que deseas desistir. Envíalo por un medio que deje constancia y{" "}
                <strong className="text-cream">no necesitas explicar los motivos</strong>. Indica tu
                número de pedido o contrato para que te identifiquen sin problemas.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de desistimiento →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                La devolución del dinero
              </h2>
              <p>
                La empresa debe <strong className="text-cream">reembolsar todo lo pagado</strong>,
                incluidos los gastos de entrega ordinarios, sin demoras indebidas y en un máximo de{" "}
                <strong className="text-cream">14 días naturales</strong> desde que le comunicas tu
                decisión. Tú devuelves el producto; los gastos de devolución pueden correr a tu cargo
                solo si el vendedor te informó previamente de ello.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Excepciones al desistimiento
              </h2>
              <p>
                No todo admite desistimiento. Quedan excluidos, entre otros, los{" "}
                <strong className="text-cream">bienes personalizados</strong>, los productos{" "}
                <strong className="text-cream">precintados por higiene</strong> que ya se hayan abierto,
                los artículos perecederos y el contenido digital ya descargado. Revisa las condiciones
                antes de comprar si crees que podrías querer devolverlo.
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
                    Carta de desistimiento
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
              Nota: Esta página ofrece información general, no asesoría legal. Los plazos y excepciones
              pueden variar según el producto, el contrato y tu caso; en caso de duda, revisa las
              condiciones o consulta a un profesional. Información verificada en julio de 2026.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
