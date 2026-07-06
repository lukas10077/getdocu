import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocu.ch";

export default async function LandingPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  // Schema.org: FAQPage — erscheint als Rich Snippet in Google
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (dict.faq?.items ?? []).map((item: { q: string; a: string }) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a.replace("{priceRange}", "3–5 CHF") },
    })),
  };

  // Schema.org: Organization
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetDocu",
    url: `${BASE_URL}/${params.locale}`,
    logo: `${BASE_URL}/og-image.jpg`,
    description: dict.meta.description,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Nav locale={params.locale} dict={dict} />
      <Hero locale={params.locale} dict={dict} />
      <ToolsSection locale={params.locale} dict={dict} />
      <HowItWorks dict={dict} />
      <TrustSection dict={dict} />
      <FAQSection dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
