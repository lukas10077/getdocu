import { getDictionary, Locale } from "@/i18n/config";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function Impressum({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);

  return (
    <main>
      <Nav locale={params.locale} dict={dict} />
      <section className="px-6 py-20">
        <div className="mx-auto max-w-content">
          <h1 className="text-4xl font-medium tracking-tighter text-swiss-black">
            {dict.footer.impressum}
          </h1>
          <div className="mt-8 space-y-1 text-base leading-relaxed text-swiss-gray-700">
            <p>GetDocu</p>
            <p>c/o F2BII E-Commerce #942</p>
            <p>Hintergoldingerstrasse 30</p>
            <p>8638 Goldingen</p>
            <p>Schweiz</p>
            <p className="mt-4">
              E-Mail:{" "}
              <a href="mailto:lukaslast@gmail.com" className="text-swiss-red">
                lukaslast@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer locale={params.locale} dict={dict} />
    </main>
  );
}
