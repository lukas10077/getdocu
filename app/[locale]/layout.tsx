import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { locales, isRtl, getDictionary, Locale } from "@/i18n/config";
import { CountryProvider } from "@/components/CountryProvider";
import CountrySelector from "@/components/CountrySelector";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dir = isRtl(params.locale) ? "rtl" : "ltr";
  return (
    <html lang={params.locale} dir={dir} suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`} suppressHydrationWarning>
        <CountryProvider>
          <CountrySelector />
          {children}
        </CountryProvider>
      </body>
    </html>
  );
}
