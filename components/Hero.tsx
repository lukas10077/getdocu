import Link from "next/link";
import { Locale } from "@/i18n/config";
import HeroCanvas from "./HeroCanvas";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-24 md:pt-36">
      {/* Animated background */}
      <HeroCanvas />

      <div className="relative mx-auto max-w-content text-center">
        {/* Headline */}
        <h1 className="font-serif text-5xl font-light leading-[1.04] text-swiss-black md:text-7xl">
          {dict.hero.headline
            .split(/\.\s+/)
            .map((line: string, i: number, arr: string[]) => (
              <span key={i}>
                <span className={i === 1 ? "text-swiss-gray-500" : ""}>
                  {line}{i < arr.length - 1 ? "." : ""}
                </span>
                {i < arr.length - 1 && <br />}
              </span>
            ))}
        </h1>

        {/* Gold divider */}
        <div className="mx-auto mt-8 h-px w-10 bg-swiss-gold opacity-60" />

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-swiss-gray-500 md:text-lg">
          {dict.hero.subheadline}
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={`/${locale}#tools`}
            className="bg-swiss-black px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-swiss-gray-900"
          >
            {dict.hero.cta}
          </Link>
          <span className="text-sm text-swiss-gold">
            ab 3 CHF &mdash; kein Konto nötig
          </span>
        </div>

        {/* Trust strip */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-swiss-gray-300">
          <span>🔒 Datenschutz</span>
          <span>⚡ Sofort</span>
          <span>🗑 Daten gelöscht</span>
          <span>💳 TWINT · Stripe</span>
        </div>
      </div>
    </section>
  );
}
