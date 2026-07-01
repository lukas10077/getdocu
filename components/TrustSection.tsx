export default function TrustSection({ dict }: { dict: any }) {
  const points = [
    { title: dict.trust.point1Title, body: dict.trust.point1 },
    { title: dict.trust.point2Title, body: dict.trust.point2 },
    { title: dict.trust.point3Title, body: dict.trust.point3 },
  ];
  const paymentMethods = ["TWINT", "Visa", "Mastercard", "Apple Pay", "Google Pay"];
  return (
    <section className="bg-ink-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        {dict.trust.guaranteeTitle && (
          <div className="mb-16 flex items-center gap-6 rounded-sm border border-swiss-gold/25 bg-swiss-gold/5 px-8 py-7">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-swiss-gold/40 text-xl text-swiss-gold">✓</div>
            <div>
              <p className="font-serif text-xl font-medium text-cream">{dict.trust.guaranteeTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-cream-muted">{dict.trust.guaranteeBody}</p>
            </div>
          </div>
        )}
        <h2 className="font-serif text-4xl font-medium text-cream md:text-5xl">{dict.trust.title}</h2>
        <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
        <p className="mt-4 max-w-xl text-base text-cream-muted">{dict.trust.subtitle}</p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-sm border border-ink-700 bg-ink-900 p-8">
              <h3 className="font-serif text-xl font-medium text-cream">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-muted">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 border-t border-ink-700 pt-10">
          <p className="mb-5 text-xs uppercase tracking-widest text-cream-subtle">{dict.trust.paymentTitle}</p>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map((method) => (
              <span key={method} className="rounded-sm border border-ink-700 bg-ink-900 px-4 py-2 text-xs font-medium text-cream-muted">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
