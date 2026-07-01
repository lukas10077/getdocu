import Link from "next/link";
import { Locale } from "@/i18n/config";

export default function Footer({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <footer className="border-t border-swiss-gray-100 px-6 py-12">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-sm text-swiss-gray-500 md:flex-row">
        <div>
          <p className="font-medium text-swiss-black">
            GetDocu<span className="text-swiss-red">.</span>
          </p>
          <p className="mt-1">{dict.footer.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href={`/${locale}/legal/impressum`} className="transition hover:text-swiss-black">
            {dict.footer.impressum}
          </Link>
          <Link href={`/${locale}/legal/datenschutz`} className="transition hover:text-swiss-black">
            {dict.footer.datenschutz}
          </Link>
          <Link href={`/${locale}/legal/agb`} className="transition hover:text-swiss-black">
            {dict.footer.agb}
          </Link>
        </div>

        <p>© {new Date().getFullYear()} GetDocu. {dict.footer.rights}</p>
      </div>
    </footer>
  );
}
