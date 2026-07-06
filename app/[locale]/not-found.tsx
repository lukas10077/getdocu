import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 text-center">
      <p className="font-serif text-8xl font-medium text-swiss-gold">404</p>
      <h1 className="mt-6 font-serif text-3xl font-medium text-cream">
        Seite nicht gefunden
      </h1>
      <p className="mt-4 max-w-md text-base text-cream-muted">
        Die gesuchte Seite existiert nicht. Vielleicht wurde sie verschoben oder der Link ist falsch.
      </p>
      <Link
        href="/"
        className="mt-8 bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
