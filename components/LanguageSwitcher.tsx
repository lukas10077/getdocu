"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { locales, localeMeta, Locale } from "@/i18n/config";

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function switchTo(locale: Locale) {
    const rest = pathname?.replace(`/${current}`, "") || "";
    router.push(`/${locale}${rest}`);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-swiss-gray-200 px-4 py-2 text-sm font-medium text-swiss-black transition hover:border-swiss-gray-300"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-base">{localeMeta[current].flag}</span>
        <span>{localeMeta[current].nativeName}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="ml-1">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 max-h-96 w-64 overflow-y-auto rounded-2xl border border-swiss-gray-200 bg-white p-2 shadow-xl"
        >
          {locales.map((locale) => (
            <button
              key={locale}
              role="option"
              aria-selected={locale === current}
              onClick={() => switchTo(locale)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-swiss-gray-50 ${
                locale === current ? "font-semibold text-swiss-red" : "text-swiss-black"
              }`}
            >
              <span className="text-base">{localeMeta[locale].flag}</span>
              <span>{localeMeta[locale].nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
