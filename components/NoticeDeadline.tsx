"use client";

import { useEffect, useState } from "react";
import { calcTerminationDate, formatGermanDate } from "@/lib/notice";

// Macht die abstrakte Frist ("1 Monat") zu einem konkreten Datum — das erzeugt
// ehrliche Dringlichkeit, ohne Fake-Countdown o.ä.
//
// Bewusst eine Client-Component: Die Marken-Seiten werden statisch gebaut. Würden
// wir das Datum serverseitig berechnen, würde es auf dem Build-Datum einfrieren und
// mit der Zeit falsch werden. Im Browser ist "heute" immer wirklich heute.
//
// Nur auf den deutschsprachigen Marken-Seiten im Einsatz → Text bewusst deutsch.

export default function NoticeDeadline({
  noticePeriod,
  brandName,
}: {
  noticePeriod: string;
  brandName: string;
}) {
  const [date, setDate] = useState<string>("");

  // Erst nach dem Mount berechnen — verhindert Hydration-Mismatch
  // (Server kennt "heute" nicht bzw. hat ein anderes Datum als der Client).
  useEffect(() => {
    setDate(calcTerminationDate(noticePeriod));
  }, [noticePeriod]);

  if (!date) return null;

  return (
    <div className="mt-8 rounded-sm border border-swiss-gold/25 bg-swiss-gold/5 p-5">
      <p className="mb-2 text-xs font-medium uppercase tracking-widest text-swiss-gold">
        Deine Frist
      </p>
      <p className="text-base leading-relaxed text-cream">
        Kündigst du heute, endet dein Vertrag frühestens am{" "}
        <strong className="font-medium">{formatGermanDate(date)}</strong>.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-cream-subtle">
        Berechnet mit der üblichen Frist von {noticePeriod} zum Monatsende. Dein tatsächliches
        Vertragsende hängt von deiner Mindestlaufzeit ab — massgebend ist der Zugang bei{" "}
        {brandName}, nicht der Poststempel.
      </p>
    </div>
  );
}
