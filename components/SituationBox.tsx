"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountry } from "./CountryProvider";

// "Beschreibe deine Situation" — der Assistenten-Einstieg auf der Startseite.
// Die KI erkennt das passende Tool und leitet mit vorbefüllten Feldern weiter.
// Texte kommen aus dict.situation (Fallback Deutsch).
export type SituationDict = {
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
  loading: string;
  error: string;
};

const DEFAULT_T: SituationDict = {
  title: "Oder beschreibe einfach, was du erledigen willst",
  subtitle: "Die KI erkennt das passende Dokument und füllt erste Angaben für dich aus.",
  placeholder: "z.B. Ich möchte mein Fitnessabo bei Basefit kündigen, bin aber unsicher wegen der Frist …",
  button: "Passendes Dokument finden",
  loading: "Einen Moment — ich analysiere deine Situation …",
  error: "Das hat leider nicht geklappt. Wähle dein Dokument einfach unten aus.",
};

export default function SituationBox({ locale, t = DEFAULT_T }: { locale: string; t?: SituationDict }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const router = useRouter();
  const { country } = useCountry();

  async function submit() {
    if (busy || text.trim().length < 8) return;
    setBusy(true);
    setFailed(false);
    try {
      const res = await fetch("/api/situation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.slug) throw new Error();
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries((data.prefill ?? {}) as Record<string, string>)) {
        params.set(k, v);
      }
      if (country?.code) params.set("country", country.code);
      const qs = params.toString();
      router.push(`/${locale}/tools/${data.slug}${qs ? `?${qs}` : ""}`);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <section className="bg-ink-950 px-6 pb-4 pt-14 md:pt-20">
      <div className="mx-auto max-w-content">
        <div className="mx-auto max-w-2xl rounded-sm border border-swiss-gold/30 bg-ink-900 p-6 md:p-8">
          <h2 className="font-serif text-2xl font-medium text-cream md:text-3xl">{t.title}</h2>
          <p className="mt-2 text-sm text-cream-muted">{t.subtitle}</p>

          <textarea
            rows={3}
            value={text}
            onChange={(e) => { setText(e.target.value); setFailed(false); }}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); }}
            placeholder={t.placeholder}
            className="mt-5 w-full resize-y rounded-sm border border-ink-700 bg-ink-950 px-4 py-3 text-[16px] text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold"
          />

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={submit}
              disabled={busy || text.trim().length < 8}
              className="bg-swiss-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? t.loading : t.button}
            </button>
          </div>

          {failed && (
            <p className="mt-3 text-xs text-amber-400">{t.error}</p>
          )}
        </div>
      </div>
    </section>
  );
}
