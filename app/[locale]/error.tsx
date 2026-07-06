"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 text-center">
      <p className="font-serif text-6xl font-medium text-swiss-gold">!</p>
      <h1 className="mt-6 font-serif text-3xl font-medium text-cream">
        Etwas ist schiefgelaufen
      </h1>
      <p className="mt-4 max-w-md text-base text-cream-muted">
        Es ist ein unerwarteter Fehler aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
        >
          Erneut versuchen
        </button>
        <Link
          href="/"
          className="border border-ink-700 px-6 py-3 text-sm font-medium uppercase tracking-widest text-cream-muted transition hover:text-cream"
        >
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
