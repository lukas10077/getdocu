// Einheitliche Fristen-Berechnung — genutzt vom Tool-Formular UND den Marken-Seiten.
// WICHTIG: Beide müssen zwingend dasselbe Datum zeigen. Zwei Kopien dieser Logik
// würden über kurz oder lang auseinanderlaufen und Nutzer verwirren.

export const NOTICE_MONTHS: Record<string, number> = {
  "1 Monat": 1,
  "2 Monate": 2,
  "3 Monate": 3,
  "6 Monate": 6,
  "1 Jahr": 12,
};

// Lokales Datum als YYYY-MM-DD.
// NICHT toISOString() verwenden: das rechnet nach UTC um und verschiebt das Datum
// je nach Zeitzone/Uhrzeit um einen Tag (31.08. 01:00 MESZ → "2026-08-30").
function toISODate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Frühestes Kündigungsdatum: heute + Frist, jeweils zum Monatsende.
 * Gibt "" zurück, wenn die Frist unbekannt oder uneindeutig ist
 * (z.B. "Weiss nicht / laut Vertrag") — dann zeigen wir lieber nichts an.
 */
export function calcTerminationDate(noticePeriodValue: string, from: Date = new Date()): string {
  const months = NOTICE_MONTHS[noticePeriodValue];
  if (!months) return "";
  // Letzter Tag des Zielmonats, ohne Monats-Überlauf:
  // new Date(y, m+1, 0) = letzter Tag von Monat m. Damit wird aus dem 31.08. + 1 Monat
  // korrekt der 30.09. — und nicht (über den 01.10.) fälschlich der 31.10.
  const target = new Date(from.getFullYear(), from.getMonth() + months + 1, 0);
  return toISODate(target);
}

/** Für die Anzeige: "2026-08-31" → "31. August 2026" */
export function formatGermanDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  return `${d}. ${months[m - 1]} ${y}`;
}
