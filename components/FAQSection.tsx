"use client";
import { useState } from "react";
import CountryText from "./CountryText";

function FAQItem({ question, answer, fallbackCountryName }: { question: string; answer: string; fallbackCountryName?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-700">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-6 text-left" aria-expanded={open}>
        <span className="font-serif text-xl font-medium text-cream md:text-2xl">{question}</span>
        <span className="ml-6 flex-shrink-0 text-xl font-light text-swiss-gold">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <p className="pb-7 pr-10 text-sm leading-relaxed text-cream-muted md:text-base">
          <CountryText text={answer} fallbackCountryName={fallbackCountryName} />
        </p>
      )}
    </div>
  );
}

export default function FAQSection({ dict }: { dict: any }) {
  const faqs = (dict.faq?.items ?? []) as { q: string; a: string }[];
  return (
    <section className="bg-ink-900 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <h2 className="font-serif text-4xl font-medium text-cream md:text-5xl">{dict.faq?.title}</h2>
        <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
        <div className="mt-12 max-w-2xl">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} question={faq.q} answer={faq.a} fallbackCountryName={dict.footer?.yourCountry} />
          ))}
        </div>
      </div>
    </section>
  );
}
