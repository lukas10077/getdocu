"use client";

// Ratgeber-Übersicht: Suchfeld + gefilterte Karten-Liste.
// Rein clientseitig — die Kategorien kommen fertig sortiert vom Server.

import { useState } from "react";
import Link from "next/link";

export interface GuideDirectoryCategory {
  name: string;
  items: { href: string; title: string; desc: string }[];
}

// Akzent- und Groß/Klein-unabhängig vergleichen (z.B. "kundigung" findet "Kündigung")
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export default function GuideDirectory({
  categories,
  searchPlaceholder,
  noResultsText,
}: {
  categories: GuideDirectoryCategory[];
  searchPlaceholder: string;
  noResultsText: string;
}) {
  const [query, setQuery] = useState("");
  const q = norm(query.trim());

  const filtered = q
    ? categories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (it) => norm(it.title).includes(q) || norm(it.desc).includes(q)
          ),
        }))
        .filter((cat) => cat.items.length > 0)
    : categories;

  return (
    <div>
      <div className="relative mt-10">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-subtle"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-sm border border-ink-700 bg-ink-900 py-3 pl-11 pr-4 text-sm text-cream placeholder:text-cream-subtle focus:border-swiss-gold/60 focus:outline-none"
        />
      </div>

      <div className="mt-12 space-y-12">
        {filtered.length === 0 && (
          <p className="text-sm text-cream-muted">{noResultsText}</p>
        )}
        {filtered.map((cat) => (
          <div key={cat.name}>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-widest text-cream-muted">
              {cat.name}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {cat.items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className="group rounded-sm border border-ink-700 bg-ink-900 p-5 transition hover:border-swiss-gold/40 hover:bg-ink-800"
                >
                  <h3 className="font-serif text-lg font-medium leading-snug text-cream">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-muted">{it.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
