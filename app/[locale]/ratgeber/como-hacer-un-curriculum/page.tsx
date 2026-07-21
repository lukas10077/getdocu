import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "como-hacer-un-curriculum";
const TITLE = "Cómo hacer un currículum profesional — guía paso a paso";
const DESCRIPTION =
  "Aprende a hacer un currículum que destaque: qué secciones incluir, cómo ordenarlas y los errores que más restan. Crea tu CV en minutos, sin cuenta y sin suscripción.";

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
    q: "¿Qué debe llevar un currículum?",
    a: "Los datos de contacto, un breve perfil o resumen profesional, tu experiencia laboral (de la más reciente a la más antigua), tu formación y una sección de aptitudes o competencias. Añade idiomas y, si aporta, certificaciones o proyectos. Evita datos innecesarios como el estado civil o el número de documento.",
  },
  {
    q: "¿Cuál es la longitud ideal de un CV?",
    a: "Una página si tienes menos de diez años de experiencia; dos como máximo para perfiles senior. Los seleccionadores dedican pocos segundos a la primera lectura, así que prioriza lo relevante y elimina el relleno.",
  },
  {
    q: "¿Debo poner una foto en el currículum?",
    a: "Depende del país y del sector. En gran parte de España y Latinoamérica es habitual incluir una foto profesional; en mercados anglosajones se recomienda no ponerla. Si la incluyes, que sea reciente, con fondo neutro y aspecto profesional.",
  },
  {
    q: "¿Cómo hago un currículum sin experiencia?",
    a: "Pon primero la formación y destaca prácticas, trabajos de verano, voluntariados, proyectos académicos y competencias. Un perfil breve que muestre tu motivación y tus puntos fuertes compensa la falta de experiencia formal.",
  },
  {
    q: "¿En qué formato debo enviar el currículum?",
    a: "En PDF, para que el diseño se mantenga igual en cualquier dispositivo. Guarda también una versión en Word por si la empresa la pide editable. Nuestra herramienta te entrega ambos formatos.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/lebenslauf`;

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
            Cómo hacer un currículum profesional
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Un buen currículum no cuenta toda tu vida: convence en pocos segundos de que eres la
            persona adecuada para el puesto. En esta guía verás qué incluir, cómo ordenarlo y los
            errores que más restan — y podrás generar tu CV en minutos, sin cuenta y sin suscripción.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi currículum →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · Pagas solo si te convence · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué debe incluir un buen currículum
              </h2>
              <p>
                Hay cinco bloques imprescindibles:{" "}
                <strong className="text-cream">datos de contacto</strong> (nombre, teléfono, correo y
                ciudad),{" "}
                <strong className="text-cream">un perfil o resumen</strong> de dos o tres líneas que
                resuma quién eres y qué aportas,{" "}
                <strong className="text-cream">experiencia laboral</strong>,{" "}
                <strong className="text-cream">formación</strong> y{" "}
                <strong className="text-cream">competencias</strong>. Como extras útiles: idiomas,
                certificaciones, proyectos o un enlace a tu perfil profesional. Deja fuera datos que
                ya no se piden, como el estado civil, la edad o el número de documento.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Estructura paso a paso
              </h2>
              <p>
                Ordena la experiencia y la formación en{" "}
                <strong className="text-cream">orden cronológico inverso</strong>: primero lo más
                reciente. En cada empleo indica el puesto, la empresa, las fechas y dos o tres logros
                concretos, mejor con números («aumenté las ventas un 20 %», «gestioné un equipo de 5
                personas»). Los verbos de acción y los resultados medibles pesan mucho más que una
                lista de tareas.
              </p>
              <p className="mt-3">
                Si tienes poca experiencia, coloca la formación antes que el empleo y da espacio a
                prácticas, voluntariados y proyectos. Si ya llevas años trabajando, resume la
                formación y deja que hable tu trayectoria.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi currículum →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Errores comunes que restan puntos
              </h2>
              <p>
                Los más frecuentes: faltas de ortografía, un correo poco serio, un diseño recargado
                que dificulta la lectura, textos genéricos que no dicen nada y un CV de tres o cuatro
                páginas. También resta enviar siempre el mismo currículum sin adaptarlo. Revisa el
                documento en voz alta antes de enviarlo o pide a alguien que lo lea: un error tonto en
                la primera línea puede costarte la entrevista.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Adáptalo a cada oferta
              </h2>
              <p>
                Lee la oferta y reordena tu CV para que las primeras líneas respondan a lo que pide.
                Usa las mismas palabras clave que aparecen en la descripción del puesto: muchas
                empresas filtran los currículums con sistemas automáticos (ATS) que buscan esos
                términos. No hace falta reescribirlo entero; basta con ajustar el perfil y resaltar la
                experiencia más relevante para cada candidatura.
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
                  <Link href={`/${params.locale}/ratgeber/plantillas-de-curriculum`} className="text-swiss-gold underline hover:opacity-80">
                    Plantillas de currículum: cómo elegir y rellenar
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/ratgeber/carta-de-presentacion`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo escribir una carta de presentación
                  </Link>
                </li>
              </ul>
              <h2 className="mb-3 mt-6 text-xs font-medium uppercase tracking-widest text-cream">
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/lebenslauf`} className="text-swiss-gold underline hover:opacity-80">
                    Currículum (CV)
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/jobbewerbung`} className="text-swiss-gold underline hover:opacity-80">
                    Carta de presentación / solicitud de empleo
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Nota: Esta página ofrece orientación general para redactar tu currículum. Las
              convenciones (foto, longitud, formato) pueden variar según el país y el sector.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
