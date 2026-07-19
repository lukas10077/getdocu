// "Über uns" — echter Mensch hinter der Marke (Vertrauen).
// Text vorerst auf Deutsch (Primärmarkt); kann später in die Wörterbücher übersetzt werden.
// Das Foto muss unter public/lukas.jpg liegen.
export default function AboutFounder() {
  return (
    <section className="bg-ink-950 px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-content items-center gap-10 md:grid-cols-[auto_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lukas.jpg"
          alt="Lukas, Gründer von GetDocu"
          className="mx-auto h-40 w-40 rounded-full border border-ink-700 object-cover md:mx-0 md:h-48 md:w-48"
        />
        <div>
          <p className="text-xs uppercase tracking-widest text-swiss-gold">Hinter GetDocu</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-cream md:text-4xl">
            Ein Mensch, eine Mission
          </h2>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-muted">
            Ich habe immer wieder erlebt, wie Menschen wegen fehlender Sprachkenntnisse — oder
            weil sie nicht wussten, wie ein gutes Dokument aussieht — schlechtere Chancen hatten:
            bei der Wohnung, im Job, bei Behörden. Das wollte ich ändern.
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-muted">
            GetDocu gibt jedem in wenigen Minuten ein sauberes, korrektes Dokument — in vielen
            Sprachen, ohne Konto, ohne Abo. Deine Daten werden nach der Erstellung sofort gelöscht.
          </p>
          <p className="mt-6 text-sm font-medium text-cream">Lukas · Gründer von GetDocu</p>
          <a
            href="mailto:support.lukaslast@gmail.com"
            className="mt-1 inline-block text-sm text-swiss-gold underline hover:text-swiss-goldDark"
          >
            support.lukaslast@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
