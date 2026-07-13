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
}

export default function ToolCard({ href, title, description, priceChfRappen, startLabel, chOnly }: Props) {
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
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
          <PriceTag priceChfRappen={priceChfRappen} />
        </p>
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
