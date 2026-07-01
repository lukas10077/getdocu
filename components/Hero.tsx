import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-ink-950 flex items-center">

      {/* Full-bleed photo — right half, bleeds to viewport edge */}
      <div className="absolute inset-y-0 right-0 w-[58%]">
        <Image
          src="/hero.jpg"
          alt="Professionelles Dokument mit Stift"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Blend left edge into ink-950 */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent" />
        {/* Subtle top + bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/50 via-transparent to-ink-950/60" />
        {/* Very light gold tint to tie into brand */}
        <div className="absolute inset-0 bg-[rgba(200,144,46,0.03)]" />
      </div>

      {/* Text content */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 py-24 md:py-36">
        <div className="max-w-xl">
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
      </div>

    </section>
  );
}
