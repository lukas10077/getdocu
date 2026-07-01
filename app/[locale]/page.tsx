import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ToolsSection from "@/components/ToolsSection";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

export default async function LandingPage({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />
      <Hero locale={params.locale} dict={dict} />
      <ToolsSection locale={params.locale} dict={dict} />
      <HowItWorks dict={dict} />
      <TrustSection dict={dict} />
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
