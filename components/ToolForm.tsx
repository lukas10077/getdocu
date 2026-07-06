"use client";

import { useEffect, useRef, useState } from "react";
import { ToolDefinition } from "@/lib/tools";
import { useCountry } from "./CountryProvider";
import { getStripeAmount, formatAmount } from "@/lib/countries";

type Stage = "form" | "previewing" | "preview" | "redirecting" | "generating" | "done" | "error";

interface Photo {
  dataUrl: string;
  mimeType: string;
  name: string;
}

interface Props {
  tool: ToolDefinition;
  locale: string;
  sessionId: string | null;
  dict?: any;
}

// ── IndexedDB helpers für Fotos (überleben Stripe-Redirect) ──────────
const IDB_NAME = "getdocu";
const IDB_STORE = "photos";
const IDB_VER = 1;

function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VER);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSave(key: string, data: unknown): Promise<void> {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(data, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbLoad<T>(key: string): Promise<T | null> {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Datei → Photo ────────────────────────────────────────────────────
function readFileAsPhoto(file: File): Promise<Photo> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ dataUrl: reader.result as string, mimeType: file.type || "image/jpeg", name: file.name });
    };
    reader.readAsDataURL(file);
  });
}

export default function ToolForm({ tool, locale, sessionId, dict }: Props) {
  const t = dict?.tools ?? {};
  const selectPlaceholder  = t.selectPlaceholder  ?? "— bitte wählen —";
  const withdrawalText     = t.withdrawalConsent  ?? "Ich stimme zu, dass die Lieferung des digitalen Dokuments sofort nach der Zahlung beginnt, und ich bestätige, dass ich damit mein gesetzliches Widerrufsrecht verliere. Ich habe die AGB gelesen und akzeptiere sie.";
  const withdrawalErrText  = t.withdrawalError    ?? "Bitte bestätige die Zustimmung, um fortzufahren.";
  const legalDisclaimer    = t.legalDisclaimer    ?? "Das generierte Dokument ist kein Ersatz für eine Rechtsberatung. Deine Formulardaten werden nach der Generierung sofort gelöscht.";
  const { country } = useCountry();
  const [stage, setStage] = useState<Stage>("form");
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [withdrawalConsent, setWithdrawalConsent] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState(false);
  const [previewText, setPreviewText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  // Währung für Einkommensfeld
  const [incomeCurrency, setIncomeCurrency] = useState<string>(country?.currency ?? "CHF");
  // Einzelbild / PDF / DOCX
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [docxText, setDocxText] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  // Foto-Galerie (kein Vision)
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreviewUrl(URL.createObjectURL(file));
    setImageMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = () => {
      const r = reader.result as string;
      setImageBase64(r.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function handleAllDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    const mime = file.type;

    if (mime === "application/pdf") {
      // PDF → base64 für Anthropic document API
      setImagePreviewUrl(null);
      setDocxText("");
      const reader = new FileReader();
      reader.onload = () => {
        const r = reader.result as string;
        setImageBase64(r.split(",")[1]);
        setImageMimeType("application/pdf");
      };
      reader.readAsDataURL(file);
    } else if (
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.endsWith(".docx")
    ) {
      // DOCX → mammoth text extraction
      setImageBase64(null);
      setImagePreviewUrl(null);
      setImageMimeType("");
      try {
        const mammoth = (await import("mammoth")).default;
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setDocxText(result.value);
      } catch {
        setDocxText("[DOCX konnte nicht gelesen werden]");
      }
    } else {
      // Bild (image/*)
      setDocxText("");
      setImagePreviewUrl(URL.createObjectURL(file));
      setImageMimeType(mime || "image/jpeg");
      const reader = new FileReader();
      reader.onload = () => {
        const r = reader.result as string;
        setImageBase64(r.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handlePhotosUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const maxPhotos = tool.maxPhotos ?? 100;
    const remaining = maxPhotos - photos.length;
    const toProcess = files.slice(0, remaining);
    const newPhotos = await Promise.all(toProcess.map(readFileAsPhoto));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = ""; // Reset damit gleiche Datei nochmal wählbar
  }

  function removePhoto(idx: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  }

  const storageKey = `getdocu_form_${tool.slug}`;
  const photosIdbKey = `${storageKey}_photos`;

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
      .then(async ({ documentText }) => {
        setResult(documentText);
        sessionStorage.removeItem(storageKey);
        // Fotos aus IndexedDB laden (überleben Stripe-Redirect)
        if (tool.supportsPhotoGallery) {
          const saved = await idbLoad<Photo[]>(photosIdbKey);
          if (saved?.length) {
            setPhotos(saved);
            await idbDelete(photosIdbKey);
          }
        }
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
    if (!withdrawalConsent) { setWithdrawalError(true); return; }
    setWithdrawalError(false);
    setStage("previewing");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: tool.slug,
          formData: values,
          // Für Galerie-Tools: keine Bilder an Claude senden
          imageBase64: tool.supportsPhotoGallery ? null : imageBase64,
          imageMimeType,
          docxText: docxText || undefined,
          countryCode: country?.code,
        }),
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
    sessionStorage.setItem(storageKey, JSON.stringify({
      ...values,
      __imageBase64: tool.supportsPhotoGallery ? "" : (imageBase64 ?? ""),
      __imageMimeType: imageMimeType,
      __incomeCurrency: incomeCurrency,
      __docxText: docxText ?? "",
    }));
    // Fotos in IndexedDB speichern (sessionStorage zu klein für viele Bilder)
    if (tool.supportsPhotoGallery && photos.length > 0) {
      await idbSave(photosIdbKey, photos);
    }
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

  // Preisberechnung
  const { currency: priceCurrency, amount: priceAmount } = country
    ? getStripeAmount(tool.priceChfRappen, country.currency)
    : { currency: "chf", amount: tool.priceChfRappen };
  const priceDisplay = formatAmount(priceAmount, priceCurrency);

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
    const photosHtml = photos.length > 0
      ? `<div style="margin-top:48px;border-top:1px solid #ddd;padding-top:24px">
           <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;margin-bottom:16px">
             Beilage — ${photos.length} Foto${photos.length !== 1 ? "s" : ""}
           </h3>
           <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
             ${photos.map((p, i) => `<div><img src="${p.dataUrl}" alt="Foto ${i + 1}" style="width:100%;border-radius:3px;object-fit:cover" /><p style="font-size:10px;color:#aaa;margin:4px 0 0">${i + 1}</p></div>`).join("")}
           </div>
         </div>`
      : "";

    return (
      <div className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-swiss-gold text-sm text-ink-950">✓</span>
          <h2 className="text-lg font-medium text-cream">Dein Dokument ist fertig</h2>
        </div>

        <div className="rounded-sm border border-ink-700 bg-ink-900 p-6 md:p-8">
          <div className="space-y-3 font-sans text-sm leading-relaxed text-cream-muted">
            {result.split(/\n\n+/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">{para}</p>
            ))}
          </div>
        </div>

        {/* Foto-Beilage anzeigen */}
        {photos.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
              Beilage — {photos.length} Foto{photos.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={photo.dataUrl} alt={`Foto ${i + 1}`}
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ))}
            </div>
          </div>
        )}

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
                <body>
                <button class="no-print" onclick="window.print()" style="margin-bottom:20px;padding:8px 16px;cursor:pointer">Drucken / Als PDF speichern</button>
                ${result.split(/\n\n+/).map(p => `<p style="margin:0 0 1.2em 0;white-space:pre-line">${p.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`).join('')}
                ${photosHtml}
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
          <p className="mt-3 text-xs text-cream-subtle">
            {country?.code === "CH"
              ? "💳 Kreditkarte · TWINT · Apple Pay · Google Pay"
              : "💳 Kreditkarte · Apple Pay · Google Pay"}
          </p>
        </div>
      </div>
    );
  }

  // ── Formular ──────────────────────────────────────────────────
  const inputClass = "w-full rounded-sm border bg-ink-900 px-4 py-3 text-sm text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold";
  const maxPhotos = tool.maxPhotos ?? 100;

  // i18n Placeholder-Lookup: placeholderKey → dict.placeholders[key] → field.placeholder
  function getPlaceholder(field: { placeholder?: string; placeholderKey?: string }): string | undefined {
    if (field.placeholderKey) {
      return (dict?.placeholders as Record<string, string> | undefined)?.[field.placeholderKey] ?? field.placeholder;
    }
    return field.placeholder;
  }

  // i18n Label- und Section-Lookup
  function getLabel(field: { key: string; label: string }): string {
    return (dict?.fieldLabels as Record<string, string> | undefined)?.[field.key] ?? field.label;
  }
  function getSectionLabel(section: string): string {
    return (dict?.sections as Record<string, string> | undefined)?.[section] ?? section;
  }

  // ── Kündigungsfrist → Datum automatisch berechnen ─────────────
  function calcTerminationDate(noticePeriodValue: string): string {
    const monthMap: Record<string, number> = {
      "1 Monat": 1, "2 Monate": 2, "3 Monate": 3, "6 Monate": 6, "1 Jahr": 12,
    };
    const months = monthMap[noticePeriodValue];
    if (!months) return "";
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    // Letzter Tag des Zielmonats (typisch für Kündigungen)
    d.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  function handleFieldChange(key: string, value: string) {
    const updated: Record<string, string> = { ...values, [key]: value };
    // Falls dieses Feld ein Datumsfeld befüllt, berechne das Datum
    const field = tool.fields.find((f) => f.key === key);
    if (field?.fillsDateField) {
      const computed = calcTerminationDate(value);
      if (computed) updated[field.fillsDateField] = computed;
    }
    setValues(updated);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-10">

      {/* Einzelbild-Upload (Vision-Tools) */}
      {tool.supportsDocumentUpload && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{tool.uploadLabelDe}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{tool.uploadHintDe}</p>
          <label className="group cursor-pointer">
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageUpload} />
            {imagePreviewUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreviewUrl} alt="Hochgeladenes Dokument" className="max-h-64 w-full rounded-sm object-contain" />
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

      {/* Multi-Format Upload: Bild + PDF + DOCX (z. B. Arbeitszeugnis) */}
      {tool.supportsAllDocumentTypes && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{tool.uploadLabelDe}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{tool.uploadHintDe}</p>
          <label className="group cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="sr-only"
              onChange={handleAllDocumentUpload}
            />
            {uploadedFileName ? (
              <div className="rounded-sm border border-swiss-gold/30 bg-ink-950 p-4">
                {imagePreviewUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={imagePreviewUrl} alt="Hochgeladenes Dokument" className="mb-2 max-h-48 w-full rounded-sm object-contain" />
                ) : null}
                <p className="text-xs text-swiss-gold">
                  ✓ {uploadedFileName}
                  {docxText && <span className="ml-2 text-cream-muted">(Text extrahiert)</span>}
                  {imageMimeType === "application/pdf" && <span className="ml-2 text-cream-muted">(PDF)</span>}
                </p>
                <p className="mt-1 text-xs text-cream-muted">Tippe um eine andere Datei zu wählen</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-700 py-8 transition group-hover:border-swiss-gold/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span className="text-xs text-cream-muted">Foto, PDF oder Word-Datei hochladen</span>
                <span className="text-xs text-cream-muted/60">(.jpg, .png, .pdf, .docx)</span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Foto-Galerie (kein Vision — nur Beilage) */}
      {tool.supportsPhotoGallery && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{tool.photoGalleryLabelDe}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{tool.photoGalleryHintDe}</p>

          {/* Bereits hochgeladene Fotos */}
          {photos.length > 0 && (
            <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {photos.map((photo, i) => (
                <div key={i} className="group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.dataUrl}
                    alt={`Foto ${i + 1}`}
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Foto entfernen"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-950/80 text-xs text-cream opacity-0 transition hover:bg-red-900 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Foto hinzufügen */}
          {photos.length < maxPhotos && (
            <label className="group cursor-pointer">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handlePhotosUpload}
              />
              <div className="flex items-center gap-3 rounded-sm border border-ink-700 px-4 py-3 transition group-hover:border-swiss-gold/50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-swiss-gold/60">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs text-cream-muted">
                  {photos.length === 0
                    ? "Fotos auswählen (mehrere möglich)"
                    : `Weitere Fotos hinzufügen (${photos.length}/${maxPhotos})`}
                </span>
              </div>
            </label>
          )}

          {photos.length >= maxPhotos && (
            <p className="mt-2 text-xs text-cream-subtle">Maximum von {maxPhotos} Fotos erreicht.</p>
          )}
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
                  <h3 className="text-xs font-medium uppercase tracking-widest text-cream-muted">{getSectionLabel(field.section!)}</h3>
                </div>
              )}
              <div>
                <label htmlFor={field.key} className="mb-2 block text-sm font-medium text-cream">
                  {getLabel(field)}{field.appendCurrency && <span className="ml-1 text-cream-muted">({country?.currency ?? "CHF"})</span>}
                  {field.required && <span className="ml-1 text-swiss-gold">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  >
                    <option value="">{selectPlaceholder}</option>
                    {(field.countryOptions?.[country?.code ?? ""] ?? field.options ?? []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    rows={5}
                    placeholder={getPlaceholder(field)}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} resize-y ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  />
                ) : field.appendCurrency ? (
                  <div className="flex gap-2">
                    <input
                      id={field.key}
                      type="number"
                      placeholder={getPlaceholder(field)}
                      value={values[field.key] ?? ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className={`${inputClass.replace("w-full", "flex-1 min-w-0")} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                    />
                    <select
                      value={incomeCurrency}
                      onChange={(e) => setIncomeCurrency(e.target.value)}
                      className={`${inputClass.replace("w-full", "")} shrink-0 border-ink-700`}
                      style={{ width: "96px" }}
                    >
                      {["CHF","EUR","USD","GBP","SEK","NOK","DKK","PLN","CZK","HUF","RON","TRY","UAH","AED","JPY","INR","AUD","NZD","CAD","BRL","MXN","ARS","COP","CLP","ZAR"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <input
                    id={field.key}
                    type={field.type}
                    placeholder={getPlaceholder(field)}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  />
                )}
                {field.autoFilledHint && values[field.key] && (
                  <p className="mt-1 text-xs text-swiss-gold/70">
                    ✓ Automatisch berechnet — du kannst das Datum anpassen.
                  </p>
                )}
                {field.hint && (
                  <p className="mt-1.5 text-xs text-cream-muted/70">{field.hint}</p>
                )}
                {errors[field.key] && <p className="mt-1 text-xs text-red-400">{errors[field.key]}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Widerrufsrecht-Checkbox */}
      <div className="mt-10">
        <label className={`flex cursor-pointer items-start gap-3 ${withdrawalError ? "text-red-400" : "text-cream-muted"}`}>
          <input
            type="checkbox"
            checked={withdrawalConsent}
            onChange={(e) => { setWithdrawalConsent(e.target.checked); setWithdrawalError(false); }}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-swiss-gold"
          />
          <span className="text-xs leading-relaxed">
            {withdrawalText.replace("AGB", "")}{" "}
            <a href={`/${locale}/legal/agb`} className="underline hover:text-cream">AGB</a>
          </span>
        </label>
        {withdrawalError && (
          <p className="mt-2 text-xs text-red-400">{withdrawalErrText}</p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-cream-subtle">
        {legalDisclaimer}
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
