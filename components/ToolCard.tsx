"use client";

import Link from "next/link";
import { useCountry } from "./CountryProvider";
import PriceTag from "./PriceTag";

interface Props {
  href: string;
  title: string;
  description: string;
  priceChfRappen: number;
  startLabel: string;
  chOnly?: boolean;
  slug?: string;
}

// Minimales Linien-Icon je Dokumenttyp — macht die Karten auf einen Blick
// unterscheidbar (Kündigung vs. Bewerbung vs. Reklamation …)
function ToolIcon({ slug }: { slug: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  // Bewerbungen → Papierflieger (etwas losschicken)
  if (slug.includes("bewerbung")) {
    return (
      <svg {...common}>
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22l-4-9-9-4 20-7z" />
      </svg>
    );
  }
  // Lebenslauf & Arbeitszeugnis → Personen-Dokument
  if (slug === "lebenslauf" || slug === "arbeitszeugnis") {
    return (
      <svg {...common}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <circle cx="12" cy="13" r="2" />
        <path d="M8.5 18.5a3.5 3.5 0 0 1 7 0" />
      </svg>
    );
  }
  // Widerruf → Zurück-Pfeil
  if (slug.includes("widerruf")) {
    return (
      <svg {...common}>
        <path d="M9 14L4 9l5-5" />
        <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
      </svg>
    );
  }
  // Widerspruch → Waage (Recht)
  if (slug.includes("widerspruch")) {
    return (
      <svg {...common}>
        <path d="M12 3v18" />
        <path d="M8 21h8" />
        <path d="M5 7h14" />
        <path d="M5 7l-2.5 5a2.5 2.5 0 0 0 5 0L5 7z" />
        <path d="M19 7l-2.5 5a2.5 2.5 0 0 0 5 0L19 7z" />
      </svg>
    );
  }
  // Reklamation / Mängel / Schaden → Warndreieck
  if (slug.includes("reklamation") || slug.includes("maengel") || slug.includes("schaden")) {
    return (
      <svg {...common}>
        <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }
  // Kündigungen & Standard → Dokument mit ✕
  return (
    <svg {...common}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9.5 12.5l5 5" />
      <path d="M14.5 12.5l-5 5" />
    </svg>
  );
}

export default function ToolCard({ href, title, description, priceChfRappen, startLabel, chOnly, slug }: Props) {
  const { country } = useCountry();

  // CH-only Tools nur zeigen, wenn Land die Schweiz ist oder noch kein Land gewählt wurde.
  // Für explizit gewählte Nicht-CH-Länder ausblenden (länderspezifisches Recht).
  if (chOnly && country && country.code !== "CH") return null;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-sm border border-ink-700 bg-ink-900 p-6 transition hover:border-swiss-gold/40 hover:bg-ink-800"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-swiss-gold/25 bg-swiss-gold/10 text-swiss-gold transition group-hover:bg-swiss-gold/20">
            <ToolIcon slug={slug ?? ""} />
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-swiss-gold">
            <PriceTag priceChfRappen={priceChfRappen} />
          </span>
        </div>
        <h3 className="font-serif text-xl font-medium leading-snug text-cream">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-muted">{description}</p>
      </div>
      <div className="mt-6">
        <span className="text-xs font-medium uppercase tracking-widest text-cream-subtle transition group-hover:text-swiss-gold">
          {startLabel}
        </span>
      </div>
    </Link>
  );
}
