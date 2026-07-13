"use client";

import Link from "next/link";
import { useCountry } from "./CountryProvider";

// Zeigt für CH-only Tools bei explizit gewähltem Nicht-CH-Land einen Hinweis
// statt des Formulars und verweist auf das international passende Tool.
export default function ChOnlyGuard({
  enabled,
  locale,
  children,
}: {
  enabled?: boolean;
  locale: string;
  children: React.ReactNode;
}) {
  const { country } = useCountry();

  if (enabled && country && country.code !== "CH") {
    return (
      <div className="mt-8 rounded-sm border border-ink-700 bg-ink-900 p-6 text-sm leading-relaxed text-cream-muted">
        <p className="mb-2 font-medium text-cream">Nur für die Schweiz verfügbar</p>
        <p>
          Dieses Dokument beruht auf schweizerischem Mietrecht (vorzeitiger Ausstieg durch Stellung
          eines Nachmieters). In {country.name} gibt es diesen Weg in der Regel nicht. Passend für
          dein Land ist die{" "}
          <Link
            href={`/${locale}/tools/ausserordentliche-kuendigung`}
            className="text-swiss-gold underline hover:opacity-80"
          >
            ausserordentliche Kündigung aus wichtigem Grund
          </Link>
          .
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
