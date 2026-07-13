import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

// US-Pilot: englischsprachige Ratgeber-Seite, auf US-Kontext abgestimmt.
const GUIDE_LOCALE: Locale = "en";
const SLUG = "resign-immediately";
const TITLE = "Resignation Email — How to Resign Immediately (No Notice)";
const DESCRIPTION =
  "Need to quit fast — due to stress, a toxic workplace, or health? How to write a resignation email with immediate effect (no two weeks' notice) — done in minutes.";

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
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Do I have to give two weeks' notice in the US?",
    a: "In most cases, no. Under at-will employment — which covers the vast majority of U.S. jobs — you can resign at any time, with as much or as little notice as you want. Two weeks is a professional courtesy, not a legal requirement. The exception is if you signed a contract (or are covered by a union agreement) that specifies a notice period.",
  },
  {
    q: "Can I resign by email?",
    a: "Yes. A resignation email is widely accepted and often the fastest, clearest way to make your resignation official and time-stamped. Keep it short, professional, and state your last working day.",
  },
  {
    q: "How do I resign due to stress or burnout?",
    a: "You can keep it brief and professional without going into medical detail. State that you are resigning, give your effective date, and thank the employer. You are not obligated to explain your health or stress in the letter.",
  },
  {
    q: "How do I resign from a toxic workplace?",
    a: "Resist the urge to vent. A short, neutral, professional email protects your reputation and future references. State your resignation and last day, keep the tone civil, and leave detailed grievances out of the letter.",
  },
  {
    q: "Should I state my reason for leaving?",
    a: "You don't have to. A simple, polite resignation without a detailed reason is completely acceptable and often the smartest choice — especially when leaving on short notice.",
  },
  {
    q: "Can I resign for health reasons effective immediately?",
    a: "Yes. If you're an at-will employee you can set an immediate effective date. You can mention health reasons briefly, but you are not required to share medical details.",
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
            href={`/${params.locale}#tools`}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream"
          >
            ← Back
          </Link>
        </div>
      </div>

      <article className="px-6 py-10 md:py-16">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            Career Guide
          </p>
          <h1 className="font-serif text-4xl font-medium text-cream md:text-5xl">
            How to Resign Immediately — Resignation Email Templates When You Can't Give Notice
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            Sometimes you can't give two weeks' notice — because of stress, a toxic workplace, a
            health issue, or a family emergency. The good news: in most U.S. jobs you're allowed to
            resign right away. This guide shows you how to do it professionally, and lets you
            generate a clean resignation email in minutes — no account, no subscription.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Create your resignation now →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Free preview · Only pay if you're happy · Your data is deleted afterwards
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Do you have to give two weeks' notice?
              </h2>
              <p>
                In most cases, no. The vast majority of U.S. jobs are <strong className="text-cream">at-will</strong>,
                which means either you or your employer can end the relationship at any time — with
                as much or as little notice as you like. No federal or state law forces you to give
                two weeks' notice.
              </p>
              <p className="mt-3">
                The one real exception is a contract: if you signed an employment agreement (or are
                covered by a union contract) that requires a specific notice period, you're bound by
                it. Otherwise, two weeks is a professional courtesy — a good idea when you can manage
                it, but not a legal obligation.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Resignation email vs. letter
              </h2>
              <p>
                A resignation email is perfectly valid and, today, usually the fastest and clearest
                option. It's time-stamped, reaches your manager immediately, and creates a written
                record. Keep it short: state that you're resigning, give your last working day, and
                thank the employer briefly.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                When resigning immediately makes sense
              </h2>
              <p>
                <strong className="text-cream">Stress or burnout:</strong> You can keep it brief and
                professional without sharing medical details. State your resignation and effective
                date — that's enough.
              </p>
              <p className="mt-3">
                <strong className="text-cream">A toxic or hostile workplace:</strong> Resist the urge
                to vent. A calm, neutral email protects your reputation and your future references.
              </p>
              <p className="mt-3">
                <strong className="text-cream">Health or family reasons:</strong> You can set an
                immediate effective date and mention the reason in one line — you're not required to
                explain anything in detail.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Keep it professional — even now
              </h2>
              <p>
                However frustrated you are, a short and civil resignation is almost always the
                smarter move. You may cross paths with these people again, and future employers often
                check references. State the facts, keep the tone respectful, and leave detailed
                grievances out of the letter. You do not have to justify your decision.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Create your resignation email →
                </Link>
              </div>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl font-medium text-cream">Frequently asked questions</h2>
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
                Related documents
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/tools/kuendigung-arbeit`} className="text-swiss-gold underline hover:opacity-80">
                    Resignation letter / email
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/jobbewerbung`} className="text-swiss-gold underline hover:opacity-80">
                    Job application / cover letter
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/tools/lebenslauf`} className="text-swiss-gold underline hover:opacity-80">
                    Resume / CV
                  </Link>
                </li>
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Note: This page provides general information, not legal advice. Employment rules can
              vary by state and by your individual contract; if you're unsure about a notice period
              or contractual obligation, check your employment agreement or consult a professional.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
