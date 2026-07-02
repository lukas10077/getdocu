import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "@/i18n/config";

export default function Nav({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur-md px-6">
      <div className="mx-auto flex max-w-content items-center justify-between py-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="font-serif text-3xl font-medium tracking-wide text-cream">
          Get<span className="text-swiss-gold">Docu</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-8 text-base font-medium text-cream md:flex">
          <Link href={`/${locale}#tools`} className="transition hover:text-cream">
            {dict.nav.tools}
          </Link>
          <Link href={`/${locale}#how-it-works`} className="transition hover:text-cream">
            {dict.nav.howItWorks}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher current={locale} />
          <Link
            href={`/${locale}#tools`}
            className="hidden bg-swiss-gold px-5 py-2 text-xs font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark md:block"
          >
            {dict.hero.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
