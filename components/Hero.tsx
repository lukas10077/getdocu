import Link from "next/link";
import { Locale } from "@/i18n/config";

export default function Hero({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 px-6 pb-28 pt-20 md:pt-32">
      {/* Radial glow behind document */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_72%_45%,rgba(200,144,46,0.09),transparent)]" />

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

          {/* Right: animated document illustration */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 md:w-[340px]">

              {/* Floating ground shadow */}
              <div
                className="doc-shadow absolute -bottom-6 left-1/2 h-6 w-4/5 -translate-x-1/2 rounded-full bg-swiss-gold"
                style={{ filter: "blur(18px)" }}
              />

              {/* Floating document */}
              <div className="doc-float relative" style={{ rotate: "2deg" }}>

                {/* Subtle gold border glow */}
                <div className="absolute -inset-px rounded-sm bg-gradient-to-br from-swiss-gold/20 via-transparent to-swiss-gold/10" />

                {/* Paper */}
                <div className="relative rounded-sm bg-[#F7F2E8] px-8 py-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">

                  {/* Letterhead row */}
                  <div className="mb-7 flex items-center gap-3">
                    <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#0D0B08]/12" />
                    <div className="space-y-2">
                      <div className="h-2 w-32 rounded-full bg-[#0D0B08]/18" />
                      <div className="h-1.5 w-22 rounded-full bg-[#0D0B08]/10" />
                    </div>
                  </div>

                  {/* Document title bar */}
                  <div className="mb-5 h-3 w-44 rounded-full bg-[#0D0B08]/22" />

                  {/* Body text lines */}
                  <div className="space-y-2.5">
                    {[82, 95, 74, 88, 62, 90, 70, 85, 55].map((w, i) => (
                      <div
                        key={i}
                        className="h-1.5 rounded-full bg-[#0D0B08]/10"
                        style={{ width: `${w}%` }}
                      />
                    ))}
                  </div>

                  {/* Divider + signature */}
                  <div className="mt-8 space-y-2">
                    <div className="h-px w-full bg-[#0D0B08]/10" />
                    <div className="h-2 w-28 rounded-full bg-[#0D0B08]/12" />
                  </div>

                  {/* Gold approval stamp — pulses */}
                  <div className="doc-stamp absolute bottom-7 right-7 flex h-14 w-14 items-center justify-center rounded-full border-2 border-swiss-gold bg-swiss-gold/5 text-swiss-gold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                </div>
              </div>

              {/* Pen — static, leaning against doc */}
              <div
                className="absolute -bottom-8 -left-3 h-1.5 w-28 rounded-full"
                style={{
                  rotate: "-38deg",
                  background: "linear-gradient(90deg, #4A4038, #2A2218, #1A1410)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              />
              <div
                className="absolute -bottom-8 -left-3 h-1.5 w-3 rounded-full"
                style={{
                  rotate: "-38deg",
                  marginLeft: "-2px",
                  background: "#C8902E",
                }}
              />

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
