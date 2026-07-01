import RevealOnScroll from "./RevealOnScroll";

export default function TrustSection({ dict }: { dict: any }) {
  const points = [
    { title: dict.trust.point1Title, body: dict.trust.point1 },
    { title: dict.trust.point2Title, body: dict.trust.point2 },
    { title: dict.trust.point3Title, body: dict.trust.point3 },
  ];

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <RevealOnScroll>
          <h2 className="text-balance text-4xl font-medium tracking-tighter text-swiss-black md:text-5xl">
            {dict.trust.title}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="mt-4 max-w-xl text-lg text-swiss-gray-700">{dict.trust.subtitle}</p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {points.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 100}>
              <div className="rounded-3xl border border-swiss-gray-100 p-8">
                <h3 className="text-xl font-medium tracking-tight text-swiss-black">{p.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-swiss-gray-700">{p.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
