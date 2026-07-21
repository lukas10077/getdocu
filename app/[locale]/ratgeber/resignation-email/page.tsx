import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

const GUIDE_LOCALE: Locale = "en";
const SLUG = "resignation-email";
const TITLE = "Resignation Email — Template & Examples";
const DESCRIPTION =
  "How to write a resignation email — with a simple template and examples. Short, professional and ready in minutes. Two weeks' notice or effective immediately.";

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
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  };
}

const FAQ: { q: string; a: string }[] = [
  {
    q: "Can I resign by email?",
    a: "Yes. A resignation email is widely accepted and is often the fastest, clearest way to make your resignation official. It's time-stamped and creates a written record. Keep it short and professional.",
  },
  {
    q: "What should a resignation email include?",
    a: "A clear subject line, a sentence stating that you are resigning, your last working day, a brief thank-you, and your name. That's all you need — you don't have to explain your reasons.",
  },
  {
    q: "How do I write a two weeks' notice email?",
    a: "State your resignation, set your last day two weeks from the date you send it, offer to help with the handover, and thank your employer. Keep the tone positive and concise.",
  },
  {
    q: "How do I write a short, simple resignation email?",
    a: "Three or four sentences is enough: that you're resigning, your final day, a thank-you, and a polite closing. Shorter is often more professional than a long letter.",
  },
  {
    q: "Should I state a reason in my resignation email?",
    a: "No. A simple, polite resignation without a detailed reason is completely acceptable. If you want, you can add one neutral line — but it's never required.",
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
            How to Write a Resignation Email — Template &amp; Examples
          </h1>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />

          <p className="mt-8 text-base leading-relaxed text-cream-muted">
            A resignation email is the simplest, fastest way to resign professionally. Below you'll
            find what to include and a clean template you can copy — or generate a personalized
            resignation email in minutes, no account, no subscription.
          </p>

          <div className="mt-8">
            <Link href={toolHref} className={ctaClass}>
              Create your resignation email →
            </Link>
            <p className="mt-3 text-xs text-cream-subtle">
              Free preview · Only pay if you're happy · Your data is deleted afterwards
            </p>
          </div>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-cream-muted">
            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                What to include in a resignation email
              </h2>
              <p>
                Keep it short and professional. A strong resignation email has just a few parts: a
                clear subject line, a sentence stating that you're resigning, your last working day,
                a brief thank-you, and your name. You don't need to explain your reasons.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Resignation email template
              </h2>
              <div className="rounded-sm border border-ink-700 bg-ink-900 p-5 text-sm leading-relaxed text-cream-muted">
                <p className="text-cream">Subject: Resignation — [Your Name]</p>
                <p className="mt-3">Dear [Manager's Name],</p>
                <p className="mt-3">
                  I am writing to formally resign from my position as [Job Title] at [Company], with
                  my last working day being [Date].
                </p>
                <p className="mt-3">
                  Thank you for the opportunity and support during my time here. I'm happy to help
                  ensure a smooth handover before I leave.
                </p>
                <p className="mt-3">Sincerely,<br />[Your Name]</p>
              </div>
              <p className="mt-4">
                That's the whole thing. For a two weeks' notice email, set the last day two weeks
                from the date you send it. For an immediate resignation, state that your last day is
                effective immediately.
              </p>
            </section>

            <section>
              <h2 className="mb-3 font-serif text-2xl font-medium text-cream">
                Email or letter — which should you use?
              </h2>
              <p>
                Today, an email is perfectly professional and usually the better choice: it reaches
                your manager instantly, is time-stamped, and creates a written record. A formal
                letter attached to the email is optional. If you want a polished, print-ready
                version too, our tool generates both.
              </p>
              <div className="mt-6">
                <Link href={toolHref} className={ctaClass}>
                  Generate your resignation email →
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
                Related guides &amp; documents
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}/ratgeber/resign-immediately`} className="text-swiss-gold underline hover:opacity-80">
                    Need to quit fast? How to resign immediately (no notice)
                  </Link>
                </li>
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
              </ul>
            </section>

            <p className="border-t border-ink-700 pt-6 text-xs text-cream-subtle">
              Note: This page provides general information, not legal advice. Notice requirements can
              depend on your individual contract; if in doubt, check your employment agreement.
            </p>
          </div>
        </div>
      </article>

      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
