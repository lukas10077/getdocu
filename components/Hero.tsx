import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden bg-black px-6">

      {/* Desktop only: full-bleed photo on right */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[58%] bg-black">
        <Image
          src="/hero.jpg"
          alt="Professionelles Dokument mit Stift"
          fill
          unoptimized
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

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-widest text-cream-muted">
            <span>✓ Kein Konto</span>
            <span>✓ Kein Abo</span>
            <span>✓ Daten gelöscht</span>
            <span>✓ ab 3 CHF</span>
          </div>
        </div>

        {/* Mobile only: image below text, right-aligned */}
        <div className="mt-10 md:hidden flex justify-end -mr-6">
          <Image
            src="/hero.jpg"
            alt="Professionelles Dokument mit Stift"
            width={800}
            height={900}
            unoptimized
            className="w-[100%] rounded-l-sm object-cover"
            style={{ filter: "brightness(0.92) contrast(1.04)" }}
          />
        </div>
      </div>

    </section>
  );
}
