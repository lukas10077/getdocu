import { Locale } from "@/i18n/config";
import { getTool, TOOL_CATEGORIES } from "@/lib/tools";
import ToolsCountryBadge from "./ToolsCountryBadge";
import ToolCard from "./ToolCard";

export default function ToolsSection({ locale, dict }: { locale: Locale; dict: any }) {
  const startLabel: string = dict.tools.startButton ?? "Starten →";
  const cats: Record<string, string> = dict.tools.categories ?? {};

  return (
    <section id="tools" className="bg-ink-950 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-4xl font-medium text-cream md:text-5xl">{dict.tools.title}</h2>
            <div className="mt-3 h-px w-10 bg-swiss-gold opacity-60" />
            <p className="mt-4 max-w-xl text-base text-cream-muted">{dict.tools.subtitle}</p>
          </div>
          <ToolsCountryBadge />
        </div>

        <div className="mt-14 space-y-14">
          {TOOL_CATEGORIES.map((cat) => (
            <div key={cat.key}>
              {/* Category label */}
              <div className="mb-6 flex items-center gap-4">
                <h3 className="font-serif text-2xl font-medium text-cream md:text-3xl">
                  {cats[cat.key] ?? cat.key}
                </h3>
                <div className="h-px flex-1 bg-ink-700" />
              </div>
              {/* Tool cards */}
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {cat.slugs.map((slug) => {
                  const tool = getTool(slug);
                  if (!tool) return null;
                  const item = dict.tools.items?.[slug];
                  return (
                    <ToolCard
                      key={slug}
                      href={`/${locale}/tools/${slug}`}
                      title={item?.title ?? tool.documentTitleDe}
                      description={item?.description ?? tool.descriptionDe}
                      priceChfRappen={tool.priceChfRappen}
                      startLabel={startLabel}
                      chOnly={tool.chOnly}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
