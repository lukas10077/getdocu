import Link from "next/link";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 px-6 pb-24 pt-20 md:pt-28">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_40%,rgba(200,144,46,0.07),transparent)]" />

      <div className="relative mx-auto max-w-content">
        <div className="grid items-center gap-12 md:grid-cols-2">

          {/* Left: text */}
          <div>
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-swiss-gold">
              {dict.hero.eyebrow ?? "Gemacht für die Schweiz"}
            </p>

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

          {/* Right: document illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 md:w-80">
              {/* Shadow/glow layer */}
              <div className="absolute -bottom-3 -right-3 h-full w-full rounded-sm bg-swiss-gold/10" />
              {/* Document card */}
              <div className="relative rounded-sm bg-[#F5F0E6] px-8 py-10 shadow-2xl">
                {/* Letterhead */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#0D0B08]/10" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-28 rounded-full bg-[#0D0B08]/15" />
                    <div className="h-1.5 w-20 rounded-full bg-[#0D0B08]/10" />
                  </div>
                </div>
                {/* Doc title */}
                <div className="mb-4 h-3 w-40 rounded-full bg-[#0D0B08]/20" />
                {/* Body lines */}
                <div className="space-y-2">
                  {[48, 56, 44, 52, 36, 50, 42].map((w, i) => (
                    <div key={i} className="h-2 rounded-full bg-[#0D0B08]/10" style={{ width: `${w}%` }} />
                  ))}
                </div>
                {/* Signature */}
                <div className="mt-8 h-px w-full bg-[#0D0B08]/10" />
                <div className="mt-3 h-2 w-24 rounded-full bg-[#0D0B08]/15" />
                {/* Gold checkmark stamp */}
                <div className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-swiss-gold/60 text-swiss-gold">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              {/* Pen decoration */}
              <div className="absolute -bottom-5 -left-4 h-1 w-24 rotate-[-35deg] rounded-full bg-gradient-to-r from-[#3A3328] to-[#2A2520]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
