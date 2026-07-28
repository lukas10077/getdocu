import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n/config";
import HeroMinPrice from "./HeroMinPrice";
import HeroCountryPicker from "./HeroCountryPicker";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden bg-black px-6">

      {/* Desktop only: full-bleed photo on right */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[58%] bg-black">
        <Image
          src="/hero.jpg"
          alt={dict.hero.imageAlt ?? "Professionelles Dokument mit Stift"}
          fill
          className="object-contain object-right"
          priority
          sizes="58vw"
          style={{ filter: "brightness(0.92) contrast(1.04)" }}
        />
        <div className="absolute inset-y-0 left-0 w-[35%] bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-[8%] bg-gradient-to-l from-black to-transparent pointer-events-none" />
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-content pt-16 pb-10 md:py-28">
        <div className="md:max-w-[480px]">
          <h1 className="font-serif text-5xl font-medium leading-[1.05] text-cream md:text-6xl lg:text-7xl">
            {dict.hero.headline
              .split("|")
              .map((line: string, i: number, arr: string[]) => (
                <span key={i}>
                  <span className={i >= arr.length - 2 ? "text-swiss-gold" : ""}>
                    {line}
                  </span>
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
          </h1>

          <div className="mt-8 h-px w-10 bg-swiss-gold opacity-70" />

          <HeroCountryPicker
            text={dict.hero.pickCountry}
            landWord={dict.hero.pickCountryWord}
            tagline={dict.hero.pickCountryTagline}
          />

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}#tools`}
              className="inline-block bg-swiss-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark text-center"
            >
              {dict.hero.cta}
            </Link>
            <Link
              href={`/${locale}#how-it-works`}
              className="text-sm text-cream-muted transition hover:text-cream"
            >
              {dict.hero.ctaSecondary} →
            </Link>
          </div>

          {/* Zufriedenheitsgarantie — "erst sehen, dann zahlen" (ehrlich, kein Geld-zurück) */}
          <div className="mt-8 flex items-start gap-3 rounded-sm border border-swiss-gold/30 bg-swiss-gold/5 px-4 py-3 sm:max-w-md">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-swiss-gold" aria-hidden>
              <path d="M12 2l2.4 1.8 3-.1 1 2.8 2.4 1.7-.9 2.9.9 2.9-2.4 1.7-1 2.8-3-.1L12 22l-2.4-1.8-3 .1-1-2.8L3.2 15.8l.9-2.9-.9-2.9 2.4-1.7 1-2.8 3 .1L12 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-cream">{dict.hero.guaranteeTitle ?? "Zufriedenheitsgarantie"}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-cream-muted">{dict.hero.guaranteeText ?? "Nicht zufrieden mit deinem Dokument? Schreib uns eine kurze E-Mail und du bekommst dein Geld zurück."}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-widest text-cream-muted">
            {(dict.hero.badges ?? ["✓ Kein Konto", "✓ Kein Abo", "✓ Daten gelöscht"]).map((b: string) => (
              <span key={b}>{b}</span>
            ))}
            <HeroMinPrice label={dict.hero.fromPrice} />
          </div>
        </div>

        {/* Mobile only: image below text, right-aligned */}
        <div className="mt-10 md:hidden flex justify-end -mr-6">
          <Image
            src="/hero.jpg"
            alt={dict.hero.imageAlt ?? "Professionelles Dokument mit Stift"}
            width={800}
            height={900}
            className="w-[100%] rounded-l-sm object-cover"
            style={{ filter: "brightness(0.92) contrast(1.04)" }}
          />
        </div>
      </div>

    </section>
  );
}
