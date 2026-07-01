import Link from "next/link";
import { Locale } from "@/i18n/config";
import { allToolSlugs, getTool } from "@/lib/tools";
import RevealOnScroll from "./RevealOnScroll";

function ToolCard({
  href,
  title,
  description,
  priceChf,
  delay,
}: {
  href: string;
  title: string;
  description: string;
  priceChf: string;
  delay: number;
}) {
  return (
    <RevealOnScroll delay={delay} className="h-full">
      <Link
        href={href}
        className="group flex h-full flex-col justify-between rounded-sm border border-swiss-gray-100 bg-white p-7 transition hover:border-swiss-gray-200 hover:shadow-md"
      >
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
            CHF {priceChf}
          </p>
          <h3 className="font-serif text-xl font-normal leading-snug text-swiss-black">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-swiss-gray-500">{description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-swiss-gray-500 transition group-hover:text-swiss-black">
            Starten →
          </span>
        </div>
      </Link>
    </RevealOnScroll>
  );
}

export default function ToolsSection({ locale, dict }: { locale: Locale; dict: any }) {
  const toolList = allToolSlugs.map((slug) => getTool(slug)!);

  return (
    <section id="tools" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <RevealOnScroll>
          <h2 className="font-serif text-4xl font-normal text-swiss-black md:text-5xl">
            {dict.tools.title}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
          <p className="mt-4 max-w-xl text-base text-swiss-gray-500">{dict.tools.subtitle}</p>
        </RevealOnScroll>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {toolList.map((tool, i) => (
            <ToolCard
              key={tool.slug}
              href={`/${locale}/tools/${tool.slug}`}
              title={tool.documentTitleDe}
              description={tool.descriptionDe}
              priceChf={(tool.priceChfRappen / 100).toFixed(2)}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
