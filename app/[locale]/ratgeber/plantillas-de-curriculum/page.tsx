import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "es";
const SLUG = "plantillas-de-curriculum";
const TITLE = "Plantillas de currículum: cómo elegir y rellenar la tuya";
const DESCRIPTION =
  "Qué plantilla de currículum elegir según tu perfil, cómo rellenarla sin errores y por qué el contenido importa más que el diseño. Genera tu CV en PDF y Word en minutos.";

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
    q: "¿Qué plantilla de currículum es mejor?",
    a: "La más clara y legible. Para la mayoría de los puestos funciona mejor una plantilla sobria, de una columna, con buena jerarquía de títulos. Los diseños muy creativos solo convienen en sectores visuales (diseño, publicidad) y, aun así, deben poder leerse de un vistazo.",
  },
  {
    q: "¿Las plantillas con muchos colores y gráficos ayudan?",
    a: "Rara vez. Los gráficos de «nivel de aptitud» y los diseños muy cargados distraen y, además, los sistemas automáticos (ATS) que usan muchas empresas no los leen bien. Prioriza el contenido y un formato limpio.",
  },
  {
    q: "¿Cómo relleno la plantilla sin equivocarme?",
    a: "Empieza por los datos de contacto y un perfil breve; después la experiencia en orden cronológico inverso con dos o tres logros por puesto; luego formación, competencias e idiomas. Mantén el mismo estilo de fechas y viñetas en todo el documento.",
  },
  {
    q: "¿Necesito una plantilla distinta para cada oferta?",
    a: "No. Usa una buena base y adapta el contenido —el perfil y los logros destacados— a cada oferta. Cambiar la plantilla en cada envío no aporta; lo que marca la diferencia es el texto.",
  },
  {
    q: "¿En qué formato descargo el currículum?",
    a: "En PDF para enviarlo, porque conserva el diseño en cualquier dispositivo, y en Word por si la empresa lo pide editable. Con nuestra herramienta obtienes ambos.",
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
            Plantillas de currículum: cómo elegir y rellenar la tuya
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Buscar «plantilla de currículum» y perderte entre mil diseños es fácil. Lo importante no
            es el diseño más vistoso, sino el que deja leer tu experiencia en segundos. Aquí te
            explicamos qué plantilla elegir según tu perfil y cómo rellenarla — y puedes crear tu CV
            listo para enviar en minutos.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Crear mi currículum →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Vista previa gratis · PDF y Word · Tus datos se eliminan después
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                El contenido manda, no el diseño
              </h2>
              <p>
                Una plantilla bonita no consigue entrevistas; lo hace un contenido claro y relevante.
                Elige una plantilla <strong className="text-cream">sobria y legible</strong>, con
                buena jerarquía de títulos y espacio en blanco, y dedica tu energía a redactar bien la
                experiencia y los logros. Los diseños muy creativos solo compensan en sectores
                visuales — y, aun así, tienen que poder leerse de un vistazo.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué plantilla según tu perfil
              </h2>
              <p>
                Si tienes una trayectoria continua, una plantilla{" "}
                <strong className="text-cream">cronológica</strong> (experiencia primero) es la más
                segura. Si empiezas o cambias de sector, una plantilla que dé peso a{" "}
                <strong className="text-cream">competencias y formación</strong> te ayuda a compensar
                la falta de experiencia. Evita las de dos columnas muy apretadas: se leen peor y
                muchos sistemas automáticos las interpretan mal.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi currículum →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Cómo rellenarla sin errores
              </h2>
              <p>
                Sigue siempre el mismo orden: datos de contacto, perfil breve, experiencia en orden
                cronológico inverso, formación, competencias e idiomas. Mantén un{" "}
                <strong className="text-cream">estilo coherente</strong> de fechas, viñetas y tipos de
                letra en todo el documento. En cada empleo, sustituye las listas de tareas por dos o
                tres logros concretos con resultados. Y revisa la ortografía: un fallo en la plantilla
                más elegante sigue siendo un fallo.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Plantillas compatibles con ATS
              </h2>
              <p>
                Muchas empresas filtran los CV con software (ATS) antes de que los vea una persona.
                Para superar ese filtro, usa una plantilla de{" "}
                <strong className="text-cream">una sola columna</strong>, texto real (no imágenes),
                títulos estándar («Experiencia», «Formación») y las palabras clave de la oferta. Los
                iconos y las barras de progreso quedan bien en pantalla, pero el ATS no los entiende.
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
                  <Link href={`/${params.locale}/ratgeber/como-hacer-un-curriculum`} className="text-swiss-gold underline hover:opacity-80">
                    Cómo hacer un currículum profesional
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
              Nota: Esta página ofrece orientación general. Las convenciones de diseño y formato
              pueden variar según el país y el sector al que te presentes.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
