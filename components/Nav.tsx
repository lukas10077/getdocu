"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import CountryButton from "./CountryButton";
import { Locale } from "@/i18n/config";

export default function Nav({ locale, dict }: { locale: Locale; dict: any }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur-md px-6">
      <div className="mx-auto flex max-w-content items-center justify-between py-4">

        {/* Logo */}
        <Link href={`/${locale}`} className="font-serif text-3xl font-medium tracking-wide text-cream transition hover:opacity-80">
          Get<span className="text-swiss-gold">Docu</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-base font-medium text-cream md:flex">
          <Link href={`/${locale}#tools`} className="relative transition after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-cream after:transition-all after:duration-300 hover:after:w-full">
            {dict.nav.tools}
          </Link>
          <Link href={`/${locale}#how-it-works`} className="relative transition after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-cream after:transition-all after:duration-300 hover:after:w-full">
            {dict.nav.howItWorks}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CountryButton />
          <LanguageSwitcher current={locale} />
          {/* Desktop CTA */}
          <Link
            href={`/${locale}#tools`}
            className="hidden bg-swiss-gold px-5 py-2 text-xs font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark md:block"
          >
            {dict.hero.cta}
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menü schliessen" : "Menü öffnen"}
            aria-expanded={open}
            className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
          >
            <span className={`block h-px w-6 bg-cream transition-all duration-200 ${open ? "translate-y-2.5 rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-cream transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-cream transition-all duration-200 ${open ? "-translate-y-2.5 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-ink-700 bg-ink-950 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1 px-2">
            <Link
              href={`/${locale}#tools`}
              onClick={() => setOpen(false)}
              className="rounded px-4 py-3 text-base font-medium text-cream transition hover:bg-ink-800"
            >
              {dict.nav.tools}
            </Link>
            <Link
              href={`/${locale}#how-it-works`}
              onClick={() => setOpen(false)}
              className="rounded px-4 py-3 text-base font-medium text-cream transition hover:bg-ink-800"
            >
              {dict.nav.howItWorks}
            </Link>
          </nav>
          <div className="mt-4 px-6">
            <Link
              href={`/${locale}#tools`}
              onClick={() => setOpen(false)}
              className="block w-full bg-swiss-gold py-3 text-center text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
            >
              {dict.hero.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
