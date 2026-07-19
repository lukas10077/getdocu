import { aboutText } from "@/i18n/about";
import type { Locale } from "@/i18n/config";

// "Über uns" — echter Mensch hinter der Marke (Vertrauen).
// Texte in allen 15 Sprachen aus i18n/about.ts. Foto: public/lukas.jpg.
export default function AboutFounder({ locale }: { locale: Locale }) {
  const t = aboutText[locale] ?? aboutText.de;
  return (
    <section className="bg-ink-950 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-content items-center gap-10 md:grid-cols-[auto_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lukas.jpg"
          alt={t.alt}
          className="mx-auto h-40 w-40 rounded-full border border-ink-700 object-cover md:mx-0 md:h-48 md:w-48"
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-swiss-gold">{t.eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-cream md:text-4xl">{t.title}</h2>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted">{t.p1}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-muted">{t.p2}</p>
          <p className="mt-6 text-sm font-medium text-cream">{t.signature}</p>
          <a
            href="mailto:support.lukaslast@gmail.com"
            className="mt-1 inline-block text-sm text-swiss-gold underline hover:text-swiss-goldDark"
          >
            support.lukaslast@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
