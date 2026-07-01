import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 px-6 pb-28 pt-20 md:pt-32">
      {/* Radial glow behind image */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_72%_45%,rgba(200,144,46,0.07),transparent)]" />

      <div className="relative mx-auto max-w-content">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* Left: text */}
          <div>
            <h1 className="font-serif text-5xl font-medium leading-[1.05] text-cream md:text-6xl lg:text-7xl">
              {dict.hero.headline
                .split(/\.\s+/)
                .map((line: string, i: number, arr: string[]) => (
                  <span key={i}>
                    <span className={i === 1 ? "text-cream-muted" : ""}>
                      {line}{i < arr.length - 1 ? "." : ""}
                    </span>
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
            </h1>

            <div className="mt-8 h-px w-10 bg-swiss-gold opacity-70" />

            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-muted md:text-lg">
              {dict.hero.subheadline}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={`/${locale}#tools`}
                className="inline-block bg-swiss-gold px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
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

            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-widest text-cream-muted">
              <span>✓ Kein Konto</span>
              <span>✓ Kein Abo</span>
              <span>✓ Daten gelöscht</span>
              <span>✓ ab 3 CHF</span>
            </div>
          </div>

          {/* Right: hero photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm overflow-hidden rounded-sm md:max-w-md">
              {/* Subtle gold border glow */}
              <div className="absolute -inset-px rounded-sm bg-gradient-to-br from-swiss-gold/20 via-transparent to-swiss-gold/10 z-10 pointer-events-none" />
              <Image
                src="/hero.jpg"
                alt="Professionelles Dokument mit Stift"
                width={480}
                height={560}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
