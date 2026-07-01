import RevealOnScroll from "./RevealOnScroll";

export default function HowItWorks({ dict }: { dict: any }) {
  const steps = [dict.howItWorks.step1, dict.howItWorks.step2, dict.howItWorks.step3, dict.howItWorks.step4];

  return (
    <section id="how-it-works" className="bg-swiss-gray-50 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <RevealOnScroll>
          <h2 className="text-balance text-4xl font-medium tracking-tighter text-swiss-black md:text-5xl">
            {dict.howItWorks.title}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="mt-4 max-w-xl text-lg text-swiss-gray-700">{dict.howItWorks.subtitle}</p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {steps.map((step: any, i: number) => (
            <RevealOnScroll key={step.title} delay={i * 100}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-swiss-black text-sm font-medium text-white">
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-medium tracking-tight text-swiss-black">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-swiss-gray-700">{step.description}</p>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
