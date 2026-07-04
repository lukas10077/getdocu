import Link from "next/link";
import { Locale } from "@/i18n/config";
import { allToolSlugs, getTool } from "@/lib/tools";
import PriceTag from "./PriceTag";

function ToolCard({ href, title, description, priceChfRappen, startLabel }: { href: string; title: string; description: string; priceChfRappen: number; startLabel: string }) {
  return (
    <Link href={href} className="group flex h-full flex-col justify-between rounded-sm border border-ink-700 bg-ink-900 p-7 transition hover:border-swiss-gold/40 hover:bg-ink-800">
      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold"><PriceTag priceChfRappen={priceChfRappen} /></p>
        <h3 className="font-serif text-xl font-medium leading-snug text-cream">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream-muted">{description}</p>
      </div>
      <div className="mt-6">
        <span className="text-xs font-medium uppercase tracking-widest text-cream-subtle transition group-hover:text-swiss-gold">{startLabel}</span>
      </div>
    </Link>
  );
}

export default function ToolsSection({ locale, dict }: { locale: Locale; dict: any }) {
  const toolList = allToolSlugs.map((slug) => getTool(slug)!);
  const startLabel: string = dict.tools.startButton ?? "Starten →";
  return (
    <section id="tools" className="bg-ink-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <h2 className="font-serif text-4xl font-medium text-cream md:text-5xl">{dict.tools.title}</h2>
        <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
        <p className="mt-4 max-w-xl text-base text-cream-muted">{dict.tools.subtitle}</p>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {toolList.map((tool) => {
            const item = dict.tools.items?.[tool.slug];
            return (
              <ToolCard
                key={tool.slug}
                href={`/${locale}/tools/${tool.slug}`}
                title={item?.title ?? tool.documentTitleDe}
                description={item?.description ?? tool.descriptionDe}
                priceChfRappen={tool.priceChfRappen}
                startLabel={startLabel}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
