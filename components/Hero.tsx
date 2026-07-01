import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-ink-950 flex items-center">

      {/* Photo — covers right 60%, bleeds to edge */}
      <div className="absolute inset-y-0 right-0 w-[62%]">
        <Image
          src="/hero.jpg"
          alt="Professionelles Dokument mit Stift"
          fill
          quality={100}
          className="object-cover object-left"
          priority
          style={{ filter: "contrast(1.18) saturate(1.1) brightness(1.04)" }}
        />
        {/* Only a narrow left-edge fade so text stays readable */}
        <div className="absolute inset-y-0 left-0 w-[38%] bg-gradient-to-r from-ink-950 to-transparent" />
        {/* Very subtle bottom-only vignette */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950/70 to-transparent" />
      </div>

      {/* Text */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 py-28 md:py-40">
        <div className="max-w-[480px]">
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
