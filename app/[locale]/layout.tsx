import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { locales, isRtl, getDictionary, Locale } from "@/i18n/config";
import { CountryProvider } from "@/components/CountryProvider";
import CountrySelector from "@/components/CountrySelector";
import OnboardingCard from "@/components/OnboardingCard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getdocunow.com";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const dict = await getDictionary(params.locale);
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(dict.meta.title)}&sub=${encodeURIComponent(dict.meta.description)}`;
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL(BASE_URL),
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${BASE_URL}/${params.locale}`,
      siteName: "GetDocu",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "GetDocu" }],
      type: "website",
      locale: params.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [ogImage],
    },
    alternates: { canonical: `${BASE_URL}/${params.locale}` },
    verification: { google: "nRDR8stm8HQD851NWN5-HGEvULriGIuPJsPjI9uF3jg" },
  };
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const dir = isRtl(params.locale) ? "rtl" : "ltr";
  return (
    <html lang={params.locale} dir={dir} suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18318795248"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18318795248');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`} suppressHydrationWarning>
        <CountryProvider>
          <CountrySelector />
          <OnboardingCard locale={params.locale} />
          {children}
        </CountryProvider>
      </body>
    </html>
  );
}
