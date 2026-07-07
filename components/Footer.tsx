import Link from "next/link";
import { Locale } from "@/i18n/config";
import CountryText from "./CountryText";

export default function Footer({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <footer className="border-t border-ink-700 bg-ink-950 px-6 py-12">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-sm text-cream-muted md:flex-row">
        <div>
          <p className="font-serif text-base font-medium text-cream">
            Get<span className="text-swiss-gold">Docu</span>
          </p>
          <p className="mt-1 text-sm"><CountryText text={dict.footer.tagline} fallbackCountryName={dict.footer.yourCountry} /></p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href={`/${locale}/legal/impressum`} className="transition hover:text-cream">{dict.footer.impressum}</Link>
          <Link href={`/${locale}/legal/datenschutz`} className="transition hover:text-cream">{dict.footer.datenschutz}</Link>
          <Link href={`/${locale}/legal/agb`} className="transition hover:text-cream">{dict.footer.agb}</Link>
        </div>
        <p className="text-cream-subtle">© {new Date().getFullYear()} GetDocu. {dict.footer.rights}</p>
      </div>
    </footer>
  );
}
