import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "carta-de-renuncia-voluntaria";
const TITLE = "Carta de renuncia voluntaria: qué incluir y cómo darla";
const DESCRIPTION =
  "Qué es una renuncia voluntaria, qué debe incluir la carta, cuánto preaviso dar y cómo entregarla dejando constancia. Genera tu carta profesional en minutos.";

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
    q: "¿Qué es una renuncia voluntaria?",
    a: "Es la decisión del trabajador de terminar la relación laboral por su propia voluntad, a diferencia del despido, que parte de la empresa. Se comunica por escrito mediante una carta de renuncia, indicando la fecha del último día de trabajo.",
  },
  {
    q: "¿Qué debe incluir la carta de renuncia voluntaria?",
    a: "El lugar y la fecha, los datos del destinatario (empresa o responsable), una frase clara que declare tu renuncia voluntaria, tu último día de trabajo, un agradecimiento breve y tu firma. No necesitas explicar los motivos en detalle.",
  },
  {
    q: "¿Cuánto preaviso tengo que dar?",
    a: "Depende del país y de tu contrato o convenio. En muchos casos se piden unos 15 días, pero puede variar. Revisa tu contrato y la normativa local para saber el plazo exacto; dar el preaviso correcto evita penalizaciones y deja una buena impresión.",
  },
  {
    q: "¿Tengo que explicar por qué renuncio?",
    a: "No. Una renuncia cortés y breve, sin detallar motivos, es totalmente válida y a menudo la opción más prudente. Mantener un tono profesional te ayuda a conservar buenas referencias.",
  },
  {
    q: "¿Cómo entrego la carta para que quede constancia?",
    a: "Entrégala por escrito y pide que te firmen o sellen una copia con la fecha de recepción; si no es posible, envíala por un medio que deje registro. Guarda siempre una copia. Así tienes prueba de cuándo comunicaste tu renuncia.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/kuendigung-arbeit`;

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
            Carta de renuncia voluntaria
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Renunciar de forma voluntaria se hace por escrito, con una carta breve y profesional. Te
            explicamos qué debe incluir, cuánto preaviso dar y cómo entregarla dejando constancia — y
            puedes generar la tuya en minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi carta de renuncia →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Renuncia voluntaria frente a despido
              </h2>
              <p>
                En la <strong className="text-cream">renuncia voluntaria</strong> eres tú quien
                decide terminar la relación laboral; en el despido, la decisión parte de la empresa.
                La forma de comunicarla es una carta escrita en la que dejas claro que la renuncia es
                voluntaria y en qué fecha será tu último día. Comunicarlo por escrito, y no solo de
                palabra, te protege y da claridad a ambas partes.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué incluir en la carta
              </h2>
              <p>
                Una carta de renuncia voluntaria es breve y contiene:{" "}
                <strong className="text-cream">lugar y fecha</strong>, los{" "}
                <strong className="text-cream">datos del destinatario</strong>, una{" "}
                <strong className="text-cream">frase clara de renuncia</strong>, tu{" "}
                <strong className="text-cream">último día de trabajo</strong>, un agradecimiento breve
                y tu <strong className="text-cream">firma</strong>. No hace falta explicar los
                motivos; un tono cortés basta y te ayuda a conservar buenas referencias.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de renuncia →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Preaviso: cuánto tiempo dar
              </h2>
              <p>
                El plazo de preaviso <strong className="text-cream">depende de tu país, tu contrato y
                tu convenio</strong>. En muchos casos ronda los 15 días, pero puede ser distinto según
                tu situación. Revisa tu contrato y la normativa local para calcular la fecha correcta
                de tu último día: dar el preaviso adecuado evita penalizaciones y deja una buena
                impresión de salida.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cómo entregarla y dejar constancia
              </h2>
              <p>
                Entrega la carta por escrito y pide que te firmen o sellen una copia con la fecha de
                recepción. Si no es posible en persona, usa un medio que deje registro de la entrega.
                Guarda siempre una copia: es tu prueba de cuándo comunicaste la renuncia y a partir de
                qué día corre el preaviso.
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
                  <Link href={`/${params.locale}/ratgeber/carta-de-renuncia`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo escribir una carta de renuncia
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
                  <Link href={`/${params.locale}/tools/kuendigung-arbeit`} className="text-swiss-gold underline hover:opacity-80">
                    Carta de renuncia
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
              Nota: Esta página ofrece información general, no asesoría legal. Los plazos de preaviso y
              las obligaciones varían según el país, el contrato y el convenio aplicable; en caso de
              duda, revisa tu contrato o consulta a un profesional.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
