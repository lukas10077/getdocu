import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

// Pilot US-hispano: página en español, dirigida a hispanohablantes en EE. UU.
const GUIDE_LOCALE: Locale = "es";
const SLUG = "carta-de-renuncia";
const TITLE = "Carta de renuncia (en inglés o español) — en minutos";
const DESCRIPTION =
  "Cómo escribir una carta de renuncia en EE. UU. — corta, profesional y lista en minutos. Disponible en inglés para tu empleador o en español.";

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
      locale: "es_US",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "¿Tengo que dar dos semanas de aviso en EE. UU.?",
    a: "En la mayoría de los casos, no. Bajo el empleo «at-will», que cubre a la gran mayoría de los trabajos en EE. UU., puedes renunciar en cualquier momento, con el aviso que quieras o sin aviso. Dos semanas es una cortesía profesional, no una obligación legal. La excepción es si firmaste un contrato (o estás cubierto por un convenio sindical) que fija un plazo de aviso.",
  },
  {
    q: "¿La carta debe estar en inglés?",
    a: "Si tu empleador habla inglés, lo mejor es entregar la carta en inglés — aunque la escribas pensando en español. Con nuestra herramienta puedes generarla directamente en inglés (elige «Estados Unidos» como país) o en español, según lo que necesites.",
  },
  {
    q: "¿Puedo renunciar por correo electrónico?",
    a: "Sí. Un correo de renuncia es válido y suele ser la forma más rápida y clara de dejar constancia. Manténlo breve: indica que renuncias, tu último día de trabajo y un agradecimiento breve.",
  },
  {
    q: "¿Cómo hago una carta de renuncia corta?",
    a: "Una buena carta de renuncia es breve: la fecha, el destinatario, una frase clara de renuncia, tu último día y un agradecimiento. No necesitas explicar tus motivos en detalle.",
  },
  {
    q: "¿Puedo renunciar de inmediato?",
    a: "Sí. Si eres empleado «at-will» puedes fijar una fecha efectiva inmediata. Puedes mencionar un motivo en una línea (por ejemplo, personal o de salud), pero no estás obligado a dar detalles.",
  },
  {
    q: "¿Necesito dar un motivo para renunciar?",
    a: "No. Una renuncia simple y cortés, sin un motivo detallado, es totalmente aceptable — y a menudo la opción más inteligente, sobre todo al renunciar con poco aviso.",
  },
];

export default async function RatgeberPage({
  params,
}: {
  params: { locale: Locale };
}) {
  if (params.locale !== GUIDE_LOCALE) notFound();

  const dict = await getDictionary(params.locale);
  const toolHref = `/${params.locale}/tools/kuendigung-arbeit?country=US`;

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
            href={`/${params.locale}#tools`}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream"
          >
            ← Volver
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Guía profesional
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            Cómo escribir una carta de renuncia (en inglés o español)
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            ¿Necesitas renunciar a tu trabajo en Estados Unidos y no sabes cómo redactar la carta —
            y menos aún en inglés para tu jefe? Te explicamos cómo hacerlo de forma profesional, y
            generamos tu carta de renuncia en minutos, en inglés para tu empleador o en español —
            sin cuenta, sin suscripción.
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
                ¿En inglés o en español?
              </h2>
              <p>
                Esta es la pregunta clave para quienes trabajan en EE. UU. Si tu supervisor o el
                departamento de Recursos Humanos habla inglés, lo más profesional es entregar la
                carta <strong className="text-cream">en inglés</strong> — aunque la pienses en
                español. Con nuestra herramienta eliges «Estados Unidos» como país y la carta se
                genera directamente en inglés, con el tono y el formato que se esperan allí. Si la
                necesitas en español, también puedes generarla en tu idioma.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                ¿Tienes que dar dos semanas de aviso?
              </h2>
              <p>
                En la mayoría de los casos, no. La gran mayoría de los empleos en EE. UU. son{" "}
                <strong className="text-cream">«at-will»</strong>, lo que significa que tú o tu
                empleador pueden terminar la relación en cualquier momento, con el aviso que quieras
                o sin aviso. Ninguna ley federal ni estatal te obliga a dar dos semanas.
              </p>
              <p className="mt-3">
                La única excepción real es un contrato: si firmaste un acuerdo (o estás cubierto por
                un convenio sindical) que exige un plazo de aviso, debes cumplirlo. Por lo demás, dos
                semanas es una cortesía profesional — recomendable cuando puedes, pero no una
                obligación.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Qué incluir en tu carta
              </h2>
              <p>
                Una buena carta de renuncia es breve y clara: la fecha, el destinatario, una frase
                directa que declare tu renuncia, tu último día de trabajo y un breve agradecimiento.
                No necesitas explicar tus motivos en detalle. Mantén un tono cortés y profesional,
                aunque te vayas por una mala experiencia — puede que te vuelvas a cruzar con estas
                personas, y los futuros empleadores suelen pedir referencias.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Crear mi carta de renuncia →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Renuncia inmediata o por motivos personales
              </h2>
              <p>
                Si necesitas irte de inmediato — por estrés, un ambiente laboral difícil o motivos de
                salud — puedes fijar una fecha efectiva inmediata. Basta con mencionar el motivo en
                una sola línea; no estás obligado a dar detalles médicos ni personales.
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
                Documentos relacionados
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/kuendigung-arbeit`} className="text-swiss-gold underline hover:opacity-80">
                    Carta de renuncia
                  </Link>
                </li>
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
              Nota: Esta página ofrece información general, no asesoría legal. Las reglas laborales
              pueden variar según el estado y tu contrato individual; si tienes dudas sobre un plazo
              de aviso o una obligación contractual, revisa tu contrato o consulta a un profesional.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
