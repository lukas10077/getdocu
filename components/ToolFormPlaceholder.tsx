"use client";

// Platzhalter für das eigentliche Tool-Formular.
// Nächster Implementierungsschritt: dynamisches Formular pro Tool (lib/tools.ts erweitern
// um Feld-Definitionen), Stripe Checkout via /api/checkout, danach Aufruf von /api/generate
// und PDF-Erzeugung (@react-pdf/renderer) zum Download — ohne Zwischenspeicherung.
export default function ToolFormPlaceholder({
  toolSlug,
  locale,
}: {
  toolSlug: string;
  locale: string;
}) {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-swiss-gray-200 bg-swiss-gray-50 p-10 text-center">
      <p className="text-base text-swiss-gray-700">
        Formular für <strong>{toolSlug}</strong> folgt im nächsten Schritt — inkl. Stripe-Checkout
        und automatischer PDF-Generierung.
      </p>
    </div>
  );
}
