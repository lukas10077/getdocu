import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { Locale } from "@/i18n/config";

export default function Nav({
  locale,
  dict,
}: {
  locale: Locale;
  dict: any;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-swiss-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="font-serif text-xl font-normal tracking-wide text-swiss-black">
          Get<span className="text-swiss-gold">Docu</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-swiss-gray-700 md:flex">
          <Link href={`/${locale}#tools`} className="transition hover:text-swiss-black">
            {dict.nav.tools}
          </Link>
          <Link href={`/${locale}#how-it-works`} className="transition hover:text-swiss-black">
            {dict.nav.howItWorks}
          </Link>
        </nav>

        <LanguageSwitcher current={locale} />
      </div>
    </header>
  );
}
