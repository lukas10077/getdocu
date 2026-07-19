import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "cancelar-seguro";
const TITLE = "Cancelar un seguro en España: plazo, carta y pasos (art. 22)";
const DESCRIPTION =
  "Cómo dar de baja un seguro en España: el preaviso de un mes antes de la renovación, cómo comunicarlo por escrito y las excepciones para cancelar fuera de plazo. Genera tu carta de cancelación en minutos.";

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
    q: "¿Con cuánto tiempo hay que avisar para cancelar un seguro?",
    a: "Al menos un mes antes del vencimiento de la póliza. Lo establece el artículo 22 de la Ley de Contrato de Seguro: si no te opones a tiempo, el contrato se prorroga automáticamente un año más.",
  },
  {
    q: "¿Cómo cancelo el seguro para que quede constancia?",
    a: "Por escrito, indicando tu número de póliza. Lo más seguro es un burofax con acuse de recibo o un email certificado; así tienes prueba de la fecha en que comunicaste la baja. Guarda siempre el justificante.",
  },
  {
    q: "¿Qué pasa si no aviso a tiempo?",
    a: "La póliza se renueva de forma automática (tácita reconducción) por otro año y sigues obligado al pago, salvo que se dé alguna excepción legal.",
  },
  {
    q: "¿Puedo cancelar el seguro fuera de plazo?",
    a: "En algunos casos sí: por ejemplo, si la aseguradora sube la prima o cambia las coberturas sin avisarte con la antelación debida, o si incumple su deber de información. Revisa las comunicaciones que te haya enviado.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/kuendigung?country=ES&type=Versicherung`;

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
            Guía · Seguros
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Cancelar un seguro
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            En España, dar de baja un seguro se hace por escrito y respetando un plazo de preaviso.
            Te explicamos cuánto tiempo hay que avisar, cómo comunicarlo para que quede constancia y
            en qué casos puedes cancelar fuera de plazo — y puedes generar tu carta de cancelación en
            minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi carta de cancelación →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                El plazo: un mes antes de la renovación
              </h2>
              <p>
                El <strong className="text-cream">artículo 22 de la Ley de Contrato de Seguro</strong>{" "}
                establece que las pólizas tienen duración anual y se renuevan automáticamente salvo que
                te opongas. Para evitar esa prórroga debes comunicar la baja{" "}
                <strong className="text-cream">al menos un mes antes del vencimiento</strong>. Si no lo
                haces a tiempo, el seguro se prorroga (tácita reconducción) por otro año y seguirás
                obligado al pago.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cómo comunicarlo por escrito
              </h2>
              <p>
                La cancelación debe hacerse <strong className="text-cream">por escrito</strong> para
                que quede constancia. Redacta un escrito indicando claramente tu{" "}
                <strong className="text-cream">número de póliza</strong>, tu voluntad de no renovar y,
                si quieres, la base legal (art. 22 LCS). Envíalo por{" "}
                <strong className="text-cream">burofax con acuse de recibo</strong> o por email
                certificado, y guarda el justificante.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de cancelación →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cancelar fuera de plazo: excepciones
              </h2>
              <p>
                Aunque el plazo general es de un mes, hay situaciones que permiten darte de baja fuera
                de plazo. Por ejemplo, si la aseguradora{" "}
                <strong className="text-cream">sube la prima o modifica las coberturas</strong> sin
                avisarte con la antelación debida, o si incumple su deber de información. La aseguradora
                está obligada a comunicarte cualquier modificación con dos meses de antelación; revisa
                las cartas y correos que te haya enviado antes de decidir.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Coche, hogar, salud o vida
              </h2>
              <p>
                El mismo criterio de preaviso de un mes se aplica a los seguros más habituales — coche,
                hogar, salud o vida. En los seguros{" "}
                <strong className="text-cream">contratados a distancia</strong> (por internet o
                teléfono) puede existir además un derecho de desistimiento inicial de varios días desde
                la firma; revisa tu póliza y las condiciones que te entregaron para confirmar los plazos
                exactos de tu caso.
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
                    Carta de cancelación de seguro
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
              Nota: Esta página ofrece información general, no asesoría legal. Los plazos y condiciones
              pueden variar según tu póliza y tu situación; en caso de duda, revisa tu contrato o
              consulta a un profesional. Información verificada en julio de 2026.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
