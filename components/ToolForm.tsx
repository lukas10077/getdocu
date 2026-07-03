"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToolDefinition } from "@/lib/tools";
import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

type Stage = "form" | "previewing" | "preview" | "redirecting" | "generating" | "done" | "error";

interface Props {
  tool: ToolDefinition;
  locale: string;
}

export default function ToolForm({ tool, locale }: Props) {
  const searchParams = useSearchParams();
  const { country } = useCountry();
  const [stage, setStage] = useState<Stage>("form");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);
  const [previewText, setPreviewText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const hasFetched = useRef(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageBase64(result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  const sessionId = searchParams.get("session_id");
  const storageKey = `getdocu_form_${tool.slug}`;

  useEffect(() => {
    if (!sessionId || hasFetched.current) return;
    hasFetched.current = true;

    const saved = sessionStorage.getItem(storageKey);
    if (!saved) {
      setErrorMsg("Formulardaten nicht gefunden. Bitte erneut versuchen.");
      setStage("error");
      return;
    }

    setStage("generating");
    const formData = JSON.parse(saved);

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug: tool.slug, sessionId, formData }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Fehler ${res.status}`);
        }
        return res.json();
      })
      .then(({ documentText }) => {
        setResult(documentText);
        sessionStorage.removeItem(storageKey);
        setStage("done");
      })
      .catch((err) => {
        setErrorMsg(err.message || "Unbekannter Fehler");
        setStage("error");
      });
  }, [sessionId]);

  function validate() {
    const newErrors: Record<string, string> = {};
    for (const field of tool.fields) {
      if (field.required && !values[field.key]?.trim()) {
        newErrors[field.key] = "Pflichtfeld";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!withdrawalConsent) {
      setWithdrawalError(true);
      return;
    }
    setWithdrawalError(false);
    setStage("previewing");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug, formData: values, imageBase64, imageMimeType, countryCode: country?.code }),
      });
      const { previewText } = await res.json();
      setPreviewText(previewText);
      setStage("preview");
    } catch {
      await proceedToCheckout();
    }
  }

  async function proceedToCheckout() {
    setStage("redirecting");
    sessionStorage.setItem(storageKey, JSON.stringify({ ...values, __imageBase64: imageBase64 ?? "", __imageMimeType: imageMimeType }));
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug, locale, countryCode: country?.code }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setErrorMsg("Fehler beim Aufrufen der Zahlungsseite. Bitte erneut versuchen.");
      setStage("error");
    }
  }

  const priceChf = (tool.priceChfRappen / 100).toFixed(2);

  // Preis in Landeswährung berechnen
  const { currency: priceCurrency, amount: priceAmount } = country
    ? getStripeAmount(tool.priceChfRappen, country.currency)
    : { currency: "chf", amount: tool.priceChfRappen };
  const priceDisplay = formatAmount(priceAmount, priceCurrency);

  // Spinner-Komponente
  const Spinner = ({ label, sub }: { label: string; sub?: string }) => (
    <div className="mt-16 flex flex-col items-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink-700 border-t-swiss-gold" />
      <p className="text-sm text-cream">{label}</p>
      {sub && <p className="text-xs text-cream-muted">{sub}</p>}
    </div>
  );

  if (stage === "previewing") return <Spinner label="Vorschau wird erstellt…" sub="Dauert ca. 5 Sekunden." />;
  if (stage === "generating") return <Spinner label="Vollständiges Dokument wird erstellt…" sub="Das dauert ca. 10–20 Sekunden." />;
  if (stage === "redirecting") return <Spinner label="Weiterleitung zur Zahlung…" />;

  if (stage === "error") {
    return (
      <div className="mt-10 rounded-sm border border-red-800/50 bg-red-900/20 p-6">
        <p className="text-sm font-medium text-red-400">Ein Fehler ist aufgetreten</p>
        <p className="mt-1 text-sm text-red-300">{errorMsg}</p>
        <button onClick={() => { setStage("form"); setErrorMsg(""); }} className="mt-4 text-sm text-red-400 underline hover:text-red-300">
          Zurück zum Formular
        </button>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-swiss-gold text-sm text-ink-950">✓</span>
          <h2 className="text-lg font-medium text-cream">Dein Dokument ist fertig</h2>
        </div>
        <div className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-8">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-cream-muted">{result}</pre>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => {
              const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${tool.documentTitleDe.replace(/\s+/g, "_")}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
          >
            Als Text herunterladen
          </button>
          <button
            onClick={() => {
              const w = window.open("", "_blank")!;
              w.document.write(`<html><head><title>${tool.documentTitleDe}</title>
                <style>body{font-family:Georgia,serif;max-width:700px;margin:60px auto;font-size:14px;line-height:1.8;color:#111}
                .disclaimer{font-size:11px;color:#888;margin-top:40px;border-top:1px solid #eee;padding-top:12px}
                @media print{.no-print{display:none}}</style></head>
                <body><button class="no-print" onclick="window.print()" style="margin-bottom:20px;padding:8px 16px;cursor:pointer">Drucken / Als PDF speichern</button>
                <pre style="white-space:pre-wrap;font-family:Georgia,serif">${result}</pre>
                <div class="disclaimer">Dieses Dokument wurde mit GetDocuNow.com generiert und stellt keine Rechtsberatung dar.</div>
                </body></html>`);
              w.document.close();
            }}
            className="border border-ink-700 px-6 py-3 text-sm font-medium uppercase tracking-widest text-cream-muted transition hover:border-swiss-gold/50 hover:text-cream"
          >
            Als PDF drucken / speichern
          </button>
        </div>
        <p className="mt-6 text-xs text-cream-subtle">
          Deine Formulardaten wurden nach der Generierung sofort gelöscht.
        </p>
      </div>
    );
  }

  if (stage === "preview") {
    return (
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-swiss-gold">Vorschau</span>
          <span className="text-xs text-cream-muted">— Bezahle um das vollständige Dokument zu erhalten</span>
        </div>

        <div className="relative overflow-hidden rounded-sm border border-ink-700 bg-[#F5F0E6]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <span className="select-none text-4xl font-medium uppercase text-[#0D0B08]/15" style={{ transform: "rotate(-30deg)", letterSpacing: "0.3em" }}>
              VORSCHAU
            </span>
          </div>
          <div className="relative p-6 md:p-8" style={{ zIndex: 1 }}>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#2A2520]">{previewText}</pre>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to bottom, rgba(245,240,230,0) 0%, rgba(245,240,230,0.97) 100%)", zIndex: 3 }} />
        </div>

        <div className="mt-6 rounded-sm border border-swiss-gold/25 bg-swiss-gold/5 p-5">
          <p className="mb-4 text-sm text-cream-muted">
            <strong className="font-medium text-cream">Dein persönliches Dokument ist bereit.</strong>{" "}
            Bezahle einmalig {priceDisplay} für das vollständige, druckfertige Dokument — kein Abo, kein Konto.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={proceedToCheckout} className="bg-swiss-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark">
              Vollständiges Dokument — {priceDisplay}
            </button>
            <button onClick={() => setStage("form")} className="text-sm text-cream-subtle underline hover:text-cream-muted">
              Angaben ändern
            </button>
          </div>
          <p className="mt-3 text-xs text-cream-subtle">💳 Kreditkarte · TWINT · Apple Pay · Google Pay</p>
        </div>
      </div>
    );
  }

  // ── Formular ──────────────────────────────────────────────────
  const inputClass = "w-full rounded-sm border bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">

      {/* Document photo upload — only for supported tools */}
      {tool.supportsDocumentUpload && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{tool.uploadLabelDe}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{tool.uploadHintDe}</p>

          <label className="group cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={handleImageUpload}
            />
            {imagePreviewUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreviewUrl}
                  alt="Hochgeladenes Dokument"
                  className="max-h-64 w-full rounded-sm object-contain"
                />
                <span className="mt-2 block text-xs text-swiss-gold">✓ Bild hochgeladen — tippe um zu ändern</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-700 py-8 transition group-hover:border-swiss-gold/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs text-cream-muted">Foto aufnehmen oder aus Galerie wählen</span>
              </div>
            )}
          </label>
        </div>
      )}

      <div className="space-y-8">
        {tool.fields.map((field, idx) => {
          const prevField = tool.fields[idx - 1];
          const showSection = field.section && field.section !== prevField?.section;

          return (
            <div key={field.key}>
              {showSection && (
                <div className="mb-6 border-b border-ink-700 pb-2">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-cream-muted">
                    {field.section}
                  </h3>
                </div>
              )}
              <div className={showSection ? "" : ""}>
                <label htmlFor={field.key} className="mb-2 block text-sm font-medium text-cream">
                  {field.label}
                  {field.required && <span className="ml-1 text-swiss-gold">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  >
                    <option value="">— bitte wählen —</option>
                    {field.options!.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    rows={5}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className={`${inputClass} resize-y ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  />
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  />
                )}
                {errors[field.key] && <p className="mt-1 text-xs text-red-400">{errors[field.key]}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Widerrufsrecht-Checkbox (EU-Konformität) */}
      <div className="mt-10">
        <label className={`flex cursor-pointer items-start gap-3 ${withdrawalError ? "text-red-400" : "text-cream-muted"}`}>
          <input
            type="checkbox"
            checked={withdrawalConsent}
            onChange={(e) => { setWithdrawalConsent(e.target.checked); setWithdrawalError(false); }}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-swiss-gold"
          />
          <span className="text-xs leading-relaxed">
            Ich stimme zu, dass die Lieferung des digitalen Dokuments sofort nach der Zahlung beginnt, und ich bestätige, dass ich damit mein gesetzliches Widerrufsrecht verliere. Ich habe die{" "}
            <a href={`/${locale}/legal/agb`} className="underline hover:text-cream">AGB</a> gelesen und akzeptiere sie.
          </span>
        </label>
        {withdrawalError && (
          <p className="mt-2 text-xs text-red-400">Bitte bestätige die Zustimmung, um fortzufahren.</p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-cream-subtle">
        Das generierte Dokument ist kein Ersatz für eine Rechtsberatung.
        Deine Formulardaten werden nach der Generierung sofort gelöscht.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="bg-swiss-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
        >
          Vorschau erstellen — kostenlos
        </button>
        <span className="text-xs text-cream-muted">
          Danach {priceDisplay} für das vollständige Dokument
        </span>
      </div>
    </form>
  );
}
