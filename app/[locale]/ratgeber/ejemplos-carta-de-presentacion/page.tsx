import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "ejemplos-carta-de-presentacion";
const TITLE = "Ejemplos de carta de presentación (con y sin experiencia)";
const DESCRIPTION =
  "Ejemplos reales de carta de presentación para distintos casos: con experiencia, sin experiencia y cambio de sector. Copia la estructura y crea la tuya en minutos.";

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
    q: "¿Puedo copiar un ejemplo de carta de presentación tal cual?",
    a: "Úsalo como plantilla, no como copia literal. Los seleccionadores reconocen los modelos genéricos que circulan por internet. Toma la estructura y el tono, pero rellénala con tu experiencia y con datos de la oferta concreta.",
  },
  {
    q: "¿Cómo hago una carta de presentación sin experiencia?",
    a: "Enfócate en tu formación, prácticas, proyectos y competencias, y sobre todo en tu motivación y capacidad de aprender. Un ejemplo para recién graduado te sirve de base: destaca lo que sí tienes en lugar de disculparte por lo que falta.",
  },
  {
    q: "¿Qué diferencia hay entre los ejemplos según el puesto?",
    a: "El esqueleto es el mismo (apertura, encaje, motivación, cierre), pero los ejemplos y las palabras clave cambian. Elige el modelo más cercano a tu caso —con experiencia, sin experiencia o cambio de sector— y adáptalo.",
  },
  {
    q: "¿Los ejemplos valen para España y Latinoamérica?",
    a: "Sí. La estructura de una buena carta de presentación es común al ámbito hispanohablante. Ajusta solo el vocabulario y las fórmulas de cortesía a tu país si lo prefieres.",
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

  const exampleClass =
    "mt-4 rounded-sm border border-ink-700 bg-ink-900 p-5 text-sm italic leading-relaxed text-cream-muted";

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
            Ejemplos de carta de presentación
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Un buen ejemplo te ahorra el temido folio en blanco. Abajo tienes fragmentos para tres
            situaciones habituales — con experiencia, sin experiencia y cambio de sector. Tómalos como
            plantilla y adáptalos a tu caso; o genera tu carta completa en minutos.
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
                Ejemplo con experiencia
              </h2>
              <p>
                Cuando ya tienes trayectoria, apóyate en logros concretos y en cómo encajan con la
                oferta.
              </p>
              <p className={exampleClass}>
                Estimado equipo de selección: me presento a la vacante de coordinador de operaciones
                que han publicado. En mis últimos tres años gestioné un equipo de seis personas y
                reduje los tiempos de entrega un 20 %, una experiencia que encaja con los retos que
                describen en la oferta. Me atrae especialmente su enfoque en la mejora continua y me
                encantaría aportar mi experiencia a su equipo. Quedo a su disposición para una
                entrevista. Un cordial saludo.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Ejemplo sin experiencia
              </h2>
              <p>
                Si empiezas, el foco pasa a la formación, las prácticas y la motivación.
              </p>
              <p className={exampleClass}>
                Estimados señores: acabo de finalizar el grado en Marketing y me presento a su
                programa de prácticas. Durante la carrera coordiné un proyecto de redes sociales para
                una asociación local que triplicó su alcance en tres meses. Aún tengo mucho que
                aprender, pero aporto ganas, rigor y una base sólida en analítica digital. Me ilusiona
                la posibilidad de dar mis primeros pasos en un equipo como el suyo. Gracias por su
                tiempo y consideración.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de presentación →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Ejemplo de cambio de sector
              </h2>
              <p>
                Al cambiar de área, explica qué competencias trasladas y por qué el cambio tiene
                sentido.
              </p>
              <p className={exampleClass}>
                Estimado equipo: tras cinco años en atención al cliente, doy el paso hacia un puesto
                comercial como el que ofrecen. Esa trayectoria me ha dado un trato cercano con las
                personas, capacidad de resolver problemas y orientación a resultados — justo las
                cualidades que valoran en su descripción. Estoy convencido de que esas habilidades se
                traducen bien a las ventas y me motiva mucho su proyecto. Estaré encantado de
                explicárselo en una entrevista. Un saludo cordial.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cómo usar estos ejemplos
              </h2>
              <p>
                No los copies palabra por palabra: quien selecciona reconoce los modelos que circulan
                por internet. Quédate con la <strong className="text-cream">estructura</strong> y el
                <strong className="text-cream"> tono</strong>, cambia los ejemplos por los tuyos y
                menciona la empresa y las palabras clave de la oferta. Así tendrás una carta que suena
                a ti y responde a lo que piden.
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
                  <Link href={`/${params.locale}/ratgeber/carta-de-presentacion`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo escribir una carta de presentación
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
              Nota: Los ejemplos son orientativos y deben adaptarse a tu experiencia y a cada oferta.
              Las fórmulas de cortesía pueden variar según el país.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
