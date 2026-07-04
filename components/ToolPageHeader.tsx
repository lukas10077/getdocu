"use client";

import PriceTag from "./PriceTag";
import { ToolDefinition } from "@/lib/tools";

interface Props {
  tool: Pick<ToolDefinition, "priceChfRappen" | "documentTitleDe" | "descriptionDe">;
  title?: string;
  description?: string;
}

export default function ToolPageHeader({ tool, title, description }: Props) {
  return (
    <>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">
        <PriceTag priceChfRappen={tool.priceChfRappen} />
      </p>
      <h1 className="font-serif text-4xl font-medium leading-tight text-cream md:text-5xl">
        {title ?? tool.documentTitleDe}
      </h1>
      <p className="mt-3 text-base text-cream-muted">{description ?? tool.descriptionDe}</p>
    </>
  );
}
