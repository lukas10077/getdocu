"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ToolDefinition } from "@/lib/tools";

type Stage = "form" | "previewing" | "preview" | "redirecting" | "generating" | "done" | "error";

interface Props {
  tool: ToolDefinition;
  locale: string;
}

export default function ToolForm({ tool, locale }: Props) {
  const searchParams = useSearchParams();
  const [stage, setStage] = useState<Stage>("form");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewText, setPreviewText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const hasFetched = useRef(false);

  const sessionId = searchParams.get("session_id");
  const storageKey = `getdocu_form_${tool.slug}`;

  // ── Nach Stripe-Redirect: auto-generieren ─────────────────────
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

  // ── Validierung ───────────────────────────────────────────────
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

  // ── Submit → Vorschau ─────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStage("previewing");

    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug, formData: values }),
      });
      const { previewText } = await res.json();
      setPreviewText(previewText);
      setStage("preview");
    } catch {
      await proceedToCheckout();
    }
  }

  // ── Zur Zahlung weiterleiten ──────────────────────────────────
  async function proceedToCheckout() {
    setStage("redirecting");
    sessionStorage.setItem(storageKey, JSON.stringify(values));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug, locale }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setErrorMsg("Fehler beim Aufrufen der Zahlungsseite. Bitte erneut versuchen.");
      setStage("error");
    }
  }

  const priceChf = (tool.priceChfRappen / 100).toFixed(2);

  // ── Done ──────────────────────────────────────────────────────
  if (stage === "done") {
    return (
      <div className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-swiss-gold text-sm text-white">✓</span>
          <h2 className="text-lg font-medium text-swiss-black">Dein Dokument ist fertig</h2>
        </div>
        <div className="rounded-sm border border-swiss-gray-200 bg-swiss-gray-50 p-6 md:p-8">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-swiss-gray-700">{result}</pre>
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
            className="bg-swiss-black px-6 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-swiss-gray-900"
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
            className="border border-swiss-gray-200 px-6 py-3 text-sm font-medium uppercase tracking-widest text-swiss-gray-700 transition hover:border-swiss-gray-300"
          >
            Als PDF drucken / speichern
          </button>
        </div>
        <p className="mt-6 text-xs text-swiss-gray-500">
          Deine Formulardaten wurden nach der Generierung sofort gelöscht.
        </p>
      </div>
    );
  }

  // ── Vorschau ──────────────────────────────────────────────────
  if (stage === "preview") {
    return (
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-swiss-gold">Vorschau</span>
          <span className="text-xs text-swiss-gray-400">— Bezahle um das vollständige Dokument zu erhalten</span>
        </div>

        <div className="relative overflow-hidden rounded-sm border border-swiss-gray-200 bg-white">
          {/* Wasserzeichen */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <span
              className="select-none text-4xl font-medium uppercase text-swiss-gray-200"
              style={{ transform: "rotate(-30deg)", opacity: 0.7, letterSpacing: "0.3em" }}
            >
              VORSCHAU
            </span>
          </div>

          {/* Text */}
          <div className="relative p-6 md:p-8" style={{ zIndex: 1 }}>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-swiss-gray-700">
              {previewText}
            </pre>
          </div>

          {/* Fade-out */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.97) 100%)", zIndex: 3 }}
          />
        </div>

        {/* CTA Box */}
        <div className="mt-6 rounded-sm border border-swiss-gray-100 bg-swiss-gray-50 p-5">
          <p className="mb-4 text-sm text-swiss-gray-700">
            <strong className="font-medium text-swiss-black">Dein persönliches Dokument ist bereit.</strong>{" "}
            Bezahle einmalig CHF {priceChf} für das vollständige, druckfertige Dokument — kein Abo, kein Konto.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={proceedToCheckout}
              className="bg-swiss-black px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-swiss-gray-900"
            >
              Vollständiges Dokument — CHF {priceChf}
            </button>
            <button
              onClick={() => setStage("form")}
              className="text-sm text-swiss-gray-400 underline hover:text-swiss-gray-700"
            >
              Angaben ändern
            </button>
          </div>
          <p className="mt-3 text-xs text-swiss-gray-400">
            💳 Kreditkarte · TWINT · Apple Pay · Google Pay
          </p>
        </div>
      </div>
    );
  }

  // ── Spinners ──────────────────────────────────────────────────
  if (stage === "previewing") {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-swiss-gray-200 border-t-swiss-gold" />
        <p className="text-sm text-swiss-gray-500">Vorschau wird erstellt…</p>
        <p className="text-xs text-swiss-gray-300">Dauert ca. 5 Sekunden.</p>
      </div>
    );
  }

  if (stage === "generating") {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-swiss-gray-200 border-t-swiss-gold" />
        <p className="text-sm text-swiss-gray-500">Vollständiges Dokument wird erstellt…</p>
        <p className="text-xs text-swiss-gray-300">Das dauert ca. 10–20 Sekunden.</p>
      </div>
    );
  }

  if (stage === "redirecting") {
    return (
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-swiss-gray-200 border-t-swiss-gold" />
        <p className="text-sm text-swiss-gray-500">Weiterleitung zur Zahlung…</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="mt-10 rounded-sm border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-700">Ein Fehler ist aufgetreten</p>
        <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
        <button onClick={() => { setStage("form"); setErrorMsg(""); }} className="mt-4 text-sm underline text-red-700">
          Zurück zum Formular
        </button>
      </div>
    );
  }

  // ── Formular ──────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">
      <div className="space-y-10">
        {tool.fields.map((field, idx) => {
          const prevField = tool.fields[idx - 1];
          const showSection = field.section && field.section !== prevField?.section;

          return (
            <div key={field.key}>
              {showSection && (
                <div className="mb-6 border-b border-swiss-gray-100 pb-2">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-swiss-gray-500">
                    {field.section}
                  </h3>
                </div>
              )}
              <div className={showSection ? "" : "-mt-4"}>
                <label htmlFor={field.key} className="mb-1.5 block text-sm font-medium text-swiss-black">
                  {field.label}
                  {field.required && <span className="ml-1 text-swiss-gold">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-swiss-black outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold ${errors[field.key] ? "border-red-300" : "border-swiss-gray-200"}`}
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
                    className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-swiss-black outline-none transition resize-y focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold ${errors[field.key] ? "border-red-300" : "border-swiss-gray-200"}`}
                  />
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={values[field.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-swiss-black outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold ${errors[field.key] ? "border-red-300" : "border-swiss-gray-200"}`}
                  />
                )}
                {errors[field.key] && <p className="mt-1 text-xs text-red-500">{errors[field.key]}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-swiss-gray-500">
        Mit dem Klick auf «Vorschau erstellen» stimmst du unseren{" "}
        <a href={`/${locale}/legal/agb`} className="underline hover:text-swiss-black">AGB</a> zu.
        Das generierte Dokument ist kein Ersatz für eine Rechtsberatung.
        Deine Formulardaten werden nach der Generierung sofort gelöscht.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="bg-swiss-black px-8 py-4 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-swiss-gray-900"
        >
          Vorschau erstellen — kostenlos
        </button>
        <span className="text-xs text-swiss-gray-500">
          Danach CHF {priceChf} für das vollständige Dokument
        </span>
      </div>
    </form>
  );
}
