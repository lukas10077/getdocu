"use client";

import { useEffect, useRef, useState } from "react";
import { ToolDefinition, getRelatedTools } from "@/lib/tools";
import { calcTerminationDate } from "@/lib/notice";
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
  prefill?: Record<string, string>;
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

// ── Funnel-Tracking (Google Ads / GA) ───────────────────────────────
// Feuert Zwischenschritte des Funnels, damit sichtbar wird, WO Nutzer
// abspringen (nicht nur die finale Conversion nach der Zahlung).
function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", event, params);
  }
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

export default function ToolForm({ tool, locale, sessionId, dict, prefill }: Props) {
  const t = dict?.tools ?? {};
  // i18n: Formular-UI-Strings (Fallback = Deutsch). NICHT ENTFERNEN —
  // ohne diese Helper erscheinen alle UI-Texte in allen Sprachen auf Deutsch!
  const f = (dict?.form ?? {}) as Record<string, string>;
  const fs = (key: string, fallback: string) => f[key] ?? fallback;
  const toolDict = (t.items as Record<string, any> | undefined)?.[tool.slug] ?? {};
  const uploadLabel = toolDict.uploadLabel ?? tool.uploadLabelDe;
  const uploadHint = toolDict.uploadHint ?? tool.uploadHintDe;
  const galleryLabel = toolDict.photoGalleryLabel ?? tool.photoGalleryLabelDe;
  const galleryHint = toolDict.photoGalleryHint ?? tool.photoGalleryHintDe;
  const toolTitle = toolDict.title ?? tool.documentTitleDe;
  const selectPlaceholder  = t.selectPlaceholder  ?? "— bitte wählen —";
  const withdrawalText     = t.withdrawalConsent  ?? "Ich stimme zu, dass die Lieferung des digitalen Dokuments sofort nach der Zahlung beginnt, und ich bestätige, dass ich damit mein gesetzliches Widerrufsrecht verliere. Ich habe die AGB gelesen und akzeptiere sie.";
  const withdrawalErrText  = t.withdrawalError    ?? "Bitte bestätige die Zustimmung, um fortzufahren.";
  const legalDisclaimer    = t.legalDisclaimer    ?? "Das generierte Dokument ist kein Ersatz für eine Rechtsberatung. Deine Formulardaten werden nach der Generierung sofort gelöscht.";
  const { country } = useCountry();
  const [stage, setStage] = useState<Stage>("form");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    const today = new Date();
    const curY = today.getFullYear();
    const curM = String(today.getMonth() + 1).padStart(2, "0");
    if (tool.fields.some(f => f.key === "birthDate")) {
      const d = String(today.getDate()).padStart(2, "0");
      init.birthDate = `${curY - 30}-${curM}-${d}`;
    }
    if (tool.fields.some(f => f.key === "startDate" && f.type === "monthyear")) {
      init.startDate = `${curY - 2}-${curM}`;
    }
    if (tool.fields.some(f => f.key === "endDate" && f.type === "monthyear")) {
      init.endDate = `${curY}-${curM}`;
    }
    // Vorbefüllung aus URL-Parametern (z.B. von Marken-/Ratgeber-Seiten)
    if (prefill) {
      for (const f of tool.fields) {
        const v = prefill[f.key];
        if (v == null || v === "") continue;
        init[f.key] = v;
        if (f.fillsDateField) {
          const computed = calcTerminationDate(v);
          if (computed) init[f.fillsDateField] = computed;
        }
      }
    }
    return init;
  });
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
  // Bewerbungsfoto (client-only, kein Claude)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string | null>(null);
  // Foto-Galerie (kein Vision)
  const [photos, setPhotos] = useState<Photo[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const hasFetched = useRef(false);

  // Adress-Builder (Strasse / Nr / PLZ / Ort)
  interface AddressParts { street: string; nr: string; zip: string; city: string; }
  const [addressValues, setAddressValues] = useState<Record<string, AddressParts>>({});
  function getAddressParts(key: string): AddressParts {
    return addressValues[key] ?? { street: "", nr: "", zip: "", city: "" };
  }
  function setAddressPart(key: string, part: keyof AddressParts, val: string) {
    setAddressValues(prev => ({ ...prev, [key]: { ...getAddressParts(key), [part]: val } }));
  }

  // Telefon-Vorwahl
  const PHONE_PREFIXES = [
    // DACH + Liechtenstein
    { code: "CH", prefix: "+41" }, { code: "DE", prefix: "+49" }, { code: "AT", prefix: "+43" }, { code: "LI", prefix: "+423" },
    // West-Europa
    { code: "FR", prefix: "+33" }, { code: "IT", prefix: "+39" }, { code: "ES", prefix: "+34" },
    { code: "PT", prefix: "+351" }, { code: "NL", prefix: "+31" }, { code: "BE", prefix: "+32" },
    { code: "GB", prefix: "+44" }, { code: "IE", prefix: "+353" }, { code: "LU", prefix: "+352" },
    { code: "MC", prefix: "+377" }, { code: "AD", prefix: "+376" }, { code: "SM", prefix: "+378" },
    // Nord-Europa
    { code: "SE", prefix: "+46" }, { code: "NO", prefix: "+47" }, { code: "DK", prefix: "+45" },
    { code: "FI", prefix: "+358" }, { code: "IS", prefix: "+354" },
    // Ost-Europa
    { code: "PL", prefix: "+48" }, { code: "CZ", prefix: "+420" }, { code: "SK", prefix: "+421" },
    { code: "HU", prefix: "+36" }, { code: "RO", prefix: "+40" }, { code: "BG", prefix: "+359" },
    { code: "HR", prefix: "+385" }, { code: "SI", prefix: "+386" }, { code: "RS", prefix: "+381" },
    { code: "BA", prefix: "+387" }, { code: "ME", prefix: "+382" }, { code: "MK", prefix: "+389" },
    { code: "AL", prefix: "+355" }, { code: "XK", prefix: "+383" },
    { code: "GR", prefix: "+30" }, { code: "CY", prefix: "+357" }, { code: "MT", prefix: "+356" },
    // Baltikum
    { code: "LT", prefix: "+370" }, { code: "LV", prefix: "+371" }, { code: "EE", prefix: "+372" },
    // Osteuropa / GUS
    { code: "UA", prefix: "+380" }, { code: "RU", prefix: "+7"   }, { code: "BY", prefix: "+375" },
    { code: "MD", prefix: "+373" }, { code: "TR", prefix: "+90"  },
    // Nordamerika
    { code: "US", prefix: "+1"   }, { code: "CA", prefix: "+1"   }, { code: "MX", prefix: "+52"  },
    // Mittelamerika & Karibik
    { code: "GT", prefix: "+502" }, { code: "HN", prefix: "+504" }, { code: "SV", prefix: "+503" },
    { code: "NI", prefix: "+505" }, { code: "CR", prefix: "+506" }, { code: "PA", prefix: "+507" },
    { code: "CU", prefix: "+53"  }, { code: "DO", prefix: "+1"   }, { code: "HT", prefix: "+509" },
    { code: "JM", prefix: "+1"   },
    // Südamerika
    { code: "BR", prefix: "+55"  }, { code: "CO", prefix: "+57"  }, { code: "AR", prefix: "+54"  },
    { code: "PE", prefix: "+51"  }, { code: "VE", prefix: "+58"  }, { code: "CL", prefix: "+56"  },
    { code: "EC", prefix: "+593" }, { code: "BO", prefix: "+591" }, { code: "PY", prefix: "+595" },
    { code: "UY", prefix: "+598" }, { code: "GY", prefix: "+592" }, { code: "SR", prefix: "+597" },
    // Ozeanien
    { code: "AU", prefix: "+61"  }, { code: "NZ", prefix: "+64"  },
  ];
  const defaultPrefix = PHONE_PREFIXES.find(p => p.code === (country?.code ?? "CH"))?.prefix ?? "+41";
  const [phonePrefix, setPhonePrefix] = useState(defaultPrefix);

  // Entry-Builder: Arbeitsstellen + Ausbildung
  interface WorkEntry { role: string; company: string; city: string; from: string; to: string; }
  interface EduEntry  { title: string; institution: string; from: string; to: string; }
  const hasWorkHistory = tool.fields.some(f => f.key === "workHistory");
  const hasEducation   = tool.fields.some(f => f.key === "education");
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>([{ role: "", company: "", city: "", from: "", to: "" }]);
  const [eduEntries,  setEduEntries]  = useState<EduEntry[]>([{ title: "", institution: "", from: "", to: "" }]);
  const YEAR_NOW = new Date().getFullYear();
  const YEARS = Array.from({ length: YEAR_NOW - 1959 }, (_, i) => String(YEAR_NOW - i));

  function serializeWork(): string {
    return workEntries
      .filter(e => e.role.trim() || e.company.trim())
      .map(e => {
        const range = e.from ? `${e.from} – ${e.to || "Bis heute"}` : (e.to || "");
        const parts = [e.role, e.company, e.city].filter(Boolean).join(", ");
        return range ? `${range}: ${parts}` : parts;
      })
      .join("\n");
  }

  function serializeEdu(): string {
    return eduEntries
      .filter(e => e.title.trim() || e.institution.trim())
      .map(e => {
        const range = e.from ? `${e.from} – ${e.to || "Bis heute"}` : (e.to || "");
        const parts = [e.title, e.institution].filter(Boolean).join(", ");
        return range ? `${range}: ${parts}` : parts;
      })
      .join("\n");
  }

  function getEffectiveValues(): Record<string, string> {
    const base = { ...values };
    if (hasWorkHistory) base.workHistory = serializeWork();
    if (hasEducation)   base.education   = serializeEdu();
    // Adressen kombinieren
    for (const field of tool.fields) {
      if (field.type === "address") {
        const p = getAddressParts(field.key);
        const line = [p.street && p.nr ? `${p.street} ${p.nr}` : p.street, p.zip && p.city ? `${p.zip} ${p.city}` : p.city].filter(Boolean).join(", ");
        base[field.key] = line;
      }
    }
    // Telefon: Vorwahl + Nummer kombinieren
    const hasPhone = tool.fields.some(f => f.type === "tel");
    if (hasPhone && base.phone?.trim()) {
      base.phone = `${phonePrefix} ${base.phone.trim()}`;
    }
    return base;
  }

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

    // Bewerbungsfoto wiederherstellen (überlebt Stripe-Redirect via sessionStorage)
    if (formData.__profilePhotoBase64) {
      setProfilePhotoUrl(formData.__profilePhotoBase64);
      setProfilePhotoBase64(formData.__profilePhotoBase64);
    }

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
        // Google Ads Conversion-Tracking
        if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-18318795248/Pxn5CPvrsM8cEPDDip9E",
            value: 1.0,
            currency: "CHF",
          });
        }
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
      if (!field.required) continue;
      if (field.type === "address") {
        const p = getAddressParts(field.key);
        if (!p.street.trim() || !p.city.trim()) newErrors[field.key] = "Pflichtfeld";
      } else if (field.key === "birthDate") {
        // Geburtsdatum: nur ungültig wenn leer ODER Jahr = aktuelles Jahr (= nicht verändert)
        const val = values[field.key]?.trim();
        if (!val) {
          newErrors[field.key] = "Pflichtfeld";
        } else {
          const year = new Date(val).getFullYear();
          if (year >= new Date().getFullYear()) newErrors[field.key] = "Pflichtfeld";
        }
      } else if (!values[field.key]?.trim()) {
        newErrors[field.key] = "Pflichtfeld";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Hinweis: Die Widerrufs-Einwilligung wird NICHT hier verlangt — die Vorschau
    // ist gratis. Die Einwilligung erfolgt erst beim Kauf (proceedToCheckout).
    const effectiveValues = getEffectiveValues();
    setStage("previewing");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: tool.slug,
          formData: effectiveValues,
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
      // Google-Ads-Conversion "Vorschau angesehen" (sekundär, nur Beobachtung)
      track("conversion", { send_to: "AW-18318795248/9S8sCOW13NEcEPDDip9E" });
    } catch {
      // Vorschau fehlgeschlagen → trotzdem Bezahl-/Einwilligungs-Box zeigen
      setPreviewText(fs("previewFailed", "Die Vorschau konnte nicht geladen werden. Dein vollständiges Dokument wird direkt nach der Zahlung erstellt."));
      setStage("preview");
    }
  }

  async function proceedToCheckout() {
    // Widerrufs-Einwilligung erst hier verlangen (beim Kauf, nicht bei der Vorschau)
    if (!withdrawalConsent) { setWithdrawalError(true); return; }
    setWithdrawalError(false);
    // Google-Ads-Conversion "Checkout gestartet" (sekundär, nur Beobachtung)
    track("conversion", { send_to: "AW-18318795248/zeOCCOK13NEcEPDDip9E" });
    const effectiveValues = getEffectiveValues();
    setStage("redirecting");
    sessionStorage.setItem(storageKey, JSON.stringify({
      ...effectiveValues,
      __imageBase64: tool.supportsPhotoGallery ? "" : (imageBase64 ?? ""),
      __imageMimeType: imageMimeType,
      __incomeCurrency: incomeCurrency,
      __docxText: docxText ?? "",
      __profilePhotoBase64: profilePhotoBase64 ?? "",
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
      const data = await res.json();
      if (!res.ok || !data.url) {
        setErrorMsg(data.error || fs("checkoutError", "Fehler beim Aufrufen der Zahlungsseite. Bitte erneut versuchen."));
        setStage("error");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg(fs("checkoutError", "Fehler beim Aufrufen der Zahlungsseite. Bitte erneut versuchen."));
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

  if (stage === "previewing") return <Spinner label={fs("previewLoading", "Vorschau wird erstellt…")} sub={fs("previewLoadingSub", "Dauert ca. 5 Sekunden.")} />;
  if (stage === "generating") return <Spinner label={fs("generating", "Vollständiges Dokument wird erstellt…")} sub={fs("generatingSub", "Das dauert ca. 10–20 Sekunden.")} />;
  if (stage === "redirecting") return <Spinner label={fs("redirecting", "Weiterleitung zur Zahlung…")} />;

  if (stage === "error") {
    return (
      <div className="mt-10 rounded-sm border border-red-800/50 bg-red-900/20 p-6">
        <p className="text-sm font-medium text-red-400">{fs("errorTitle", "Ein Fehler ist aufgetreten")}</p>
        <p className="mt-1 text-sm text-red-300">{errorMsg}</p>
        <button onClick={() => { setStage("form"); setErrorMsg(""); }} className="mt-4 text-sm text-red-400 underline hover:text-red-300">
          {fs("backToForm", "Zurück zum Formular")}
        </button>
      </div>
    );
  }

  if (stage === "done") {
    // Passende Folge-Dokumente für den Cross-Sell nach dem Kauf
    const related = getRelatedTools(tool.slug);
    // HINWEIS vom Dokument trennen — darf nicht in PDF erscheinen
    const hinweisIdx = result.search(/\n*HINWEIS[:\s]/i);
    const fullResult = hinweisIdx >= 0 ? result.slice(0, hinweisIdx).trim() : result;
    const hinweisText = hinweisIdx >= 0 ? result.slice(hinweisIdx).replace(/^\n+/, "").trim() : null;

    // Bundle: Bewerbungsschreiben + Lebenslauf trennen
    const bundleSepIdx = fullResult.search(/===LEBENSLAUF===/);
    const cleanResult = bundleSepIdx >= 0 ? fullResult.slice(0, bundleSepIdx).trim() : fullResult;
    const lebenslaufResult = bundleSepIdx >= 0 ? fullResult.slice(bundleSepIdx).replace(/^===LEBENSLAUF===\n*/, "").trim() : null;
    const isCV = tool.slug === "lebenslauf";
    // Design "Goldlinie" — nur für Bewerbungs-Tools
    const goldAccent = ["mietbewerbung", "jobbewerbung", "lebenslauf", "komplettbewerbung"].includes(tool.slug);

    // CV-Rendering für Lebenslauf-Tool (mit Foto) und Komplettbewerbung-Lebenslauf (ohne Foto)
    const renderCVDisplay = (cvText: string, withPhoto: boolean): React.ReactNode => {
      const cvParas = cvText.split(/\n\n+/);
      const isSec = (p: string) => /^[A-ZÄÖÜ][A-ZÄÖÜ\s&]{3,}$/.test(p.trim()) && !p.includes('\n');
      const firstLines = (cvParas[0] ?? '').split('\n').filter(Boolean);
      const bodyParas = cvParas.slice(1);
      return (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              {firstLines[0] && <p style={{ fontSize: 15, fontWeight: 700, margin: '0 0 5px', letterSpacing: '0.01em' }}>{firstLines[0]}</p>}
              {firstLines[1] && <p style={{ fontSize: 12, color: '#666', margin: '0 0 5px' }}>{firstLines[1]}</p>}
              {firstLines.length > 2 && <p style={{ fontSize: 11.5, color: '#555', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>{firstLines.slice(2).join('\n')}</p>}
            </div>
            {withPhoto && profilePhotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profilePhotoUrl} alt="Bewerbungsfoto" style={{ width: 88, height: 110, objectFit: 'cover', borderRadius: 2, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
            )}
          </div>
          {goldAccent && <div style={{ height: 1, background: "#C8902E", opacity: 0.5, margin: "12px 0 4px" }} />}
          {bodyParas.map((p, i) => {
            if (isSec(p)) return (
              <div key={i} style={{ marginTop: 18, paddingTop: 12, borderTop: '0.5px solid #d8d5ce' }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#888', margin: '0 0 10px' }}>{p.trim()}</p>
              </div>
            );
            const lines = p.split('\n').filter(Boolean);
            const dateIdx = lines.findIndex(l => /^\d{4}/.test(l.trim()));
            if (lines.length >= 2 && dateIdx >= 0) {
              const date = lines[dateIdx];
              const others = lines.filter((_, j) => j !== dateIdx);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0 16px', marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, margin: '0 0 5px', color: '#1a1a1a' }}>{others[0]}</p>
                    {others.slice(1).map((l, j) => <p key={j} style={{ fontSize: 11.5, color: '#555', margin: '0 0 4px' }}>{l}</p>)}
                  </div>
                  <span style={{ fontSize: 11, color: '#999', textAlign: 'right' as const, whiteSpace: 'nowrap', paddingTop: 1 }}>{date}</span>
                </div>
              );
            }
            return <p key={i} style={{ fontSize: 11.5, color: '#444', lineHeight: 1.6, margin: '0 0 8px', whiteSpace: 'pre-line' }}>{p}</p>;
          })}
        </>
      );
    };

    // Fotos: max. 4 pro Seite, 2-Spalten-Grid, background-image für drucksicheres Seitenverhältnis
    const PHOTOS_PER_PAGE = 4;
    const photoPageHtmls: string[] = [];
    for (let pi = 0; pi < photos.length; pi += PHOTOS_PER_PAGE) {
      const chunk = photos.slice(pi, pi + PHOTOS_PER_PAGE);
      const pageLabel = photos.length > PHOTOS_PER_PAGE
        ? `${fs("attachment", "Beilage")} — ${fs("photoPlural", "Fotos")} ${pi + 1}–${Math.min(pi + PHOTOS_PER_PAGE, photos.length)} / ${photos.length}`
        : `${fs("attachment", "Beilage")} — ${photos.length} ${photos.length === 1 ? fs("photoSingular", "Foto") : fs("photoPlural", "Fotos")}`;
      const cells = chunk.map((ph, j) =>
        `<div>
          <div style="padding-bottom:75%;position:relative;overflow:hidden;border-radius:4px;background-color:#f0f0f0;background-image:url('${ph.dataUrl}');background-size:contain;background-position:center;background-repeat:no-repeat;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div>
          <p style="font-size:10px;color:#aaa;margin:5px 0 0;text-align:center">${pi + j + 1}</p>
        </div>`
      ).join("");
      photoPageHtmls.push(
        `<div class="page"><div class="body" style="padding:14mm 18mm">
          <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#999;margin:0 0 16px;padding-bottom:8px;border-bottom:1px solid #eee">${pageLabel}</h3>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">${cells}</div>
        </div></div>`
      );
    }
    const photosHtml = photoPageHtmls.join("");

    return (
      <div className="mt-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-swiss-gold text-sm text-ink-950">✓</span>
          <h2 className="text-lg font-medium text-cream">{lebenslaufResult ? fs("doneBundleTitle", "Deine Bewerbungsunterlagen sind fertig") : fs("doneTitle", "Dein Dokument ist fertig")}</h2>
        </div>

        {/* Dokument-Vorschau — Paper-Design, gleiche Formatierung wie PDF */}
        {lebenslaufResult && (
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">{fs("coverLetter", "Bewerbungsschreiben")}</p>
        )}
        <div className="overflow-hidden shadow-xl" style={{ borderRadius: 2, minHeight: 780 }}>
          <div style={{ background: "#faf8f4", padding: "36px 44px", fontFamily: "Arial, sans-serif", fontSize: 13, lineHeight: 1.85, color: "#1a1a1a", minHeight: 780, position: "relative" }}>
            {goldAccent && <div style={{ position: "absolute", left: 20, top: 32, bottom: 32, width: 2, background: "#C8902E" }} />}
            {isCV ? renderCVDisplay(cleanResult, true) : (() => {
              const rawParas = cleanResult.split(/\n\n+/);
              const isBet  = (p: string) => /^BETREFF:\s*/i.test(p.trim()) || /^[A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ][A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ\s\-]{3,}$/.test(p.trim());
              const dispP  = (p: string) => p.replace(/^BETREFF:\s*/i, '');
              const isDate = (p: string) => /^[A-ZÄÖÜ][a-zäöüA-ZÄÖÜ]{1,20},\s+\d/.test(p.trim());
              const isClose= (p: string) => /^(Freundliche|Mit freundlichen|Herzliche|Viele\s+Gr[üu]sse|Mit besten|Hochachtungsvoll)/i.test(p.trim());
              const pStyle = (p: string): React.CSSProperties => ({
                marginBottom: "1.2em",
                marginTop: (isDate(p) || isClose(p)) ? "1.8em" : 0,
                fontWeight: isBet(p) ? 700 : 400,
                whiteSpace: "pre-line",
              });
              const header = rawParas.slice(0, 2);
              const body   = rawParas.slice(2);
              return (
                <>
                  {profilePhotoUrl ? (
                    <div style={{ display: "flex", gap: 0, marginBottom: 0 }}>
                      <div style={{ flex: 1, paddingRight: 16 }}>
                        {header.map((p, i) => <p key={i} style={pStyle(p)}>{dispP(p)}</p>)}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profilePhotoUrl} alt="Bewerbungsfoto" style={{ width: 135, height: 168, objectFit: "cover", borderRadius: 2, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", alignSelf: "flex-start" }} />
                    </div>
                  ) : (
                    header.map((p, i) => <p key={i} style={pStyle(p)}>{dispP(p)}</p>)
                  )}
                  {body.map((p, i) => <p key={i + 2} style={pStyle(p)}>{dispP(p)}</p>)}
                </>
              );
            })()}
          </div>
        </div>

        {/* Lebenslauf-Karte (nur bei Komplettbewerbung) */}
        {lebenslaufResult && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-swiss-gold">{fs("cv", "Lebenslauf")}</p>
            <div className="overflow-hidden shadow-xl" style={{ borderRadius: 2, minHeight: 780 }}>
              <div style={{ background: "#faf8f4", padding: "36px 44px", fontFamily: "Arial, sans-serif", fontSize: 13, lineHeight: 1.85, color: "#1a1a1a", minHeight: 780, position: "relative" }}>
                {goldAccent && <div style={{ position: "absolute", left: 20, top: 32, bottom: 32, width: 2, background: "#C8902E" }} />}
                {renderCVDisplay(lebenslaufResult, false)}
              </div>
            </div>
          </div>
        )}

        {/* HINWEIS — separat anzeigen, nicht im Dokument */}
        {hinweisText && (
          <div className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">{fs("noteTitle", "Hinweis zur Überprüfung")}</p>
            <p className="text-sm text-cream-muted">{hinweisText.replace(/^HINWEIS[:\s]*/i, "")}</p>
          </div>
        )}

        {/* Foto-Beilage */}
        {photos.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-subtle">
              {fs("attachment", "Beilage")} — {photos.length} {photos.length === 1 ? fs("photoSingular", "Foto") : fs("photoPlural", "Fotos")}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={photo.dataUrl} alt={`Foto ${i + 1}`} className="aspect-square w-full rounded-sm object-contain bg-ink-800" />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4">
          {/* PDF */}
          <button
            onClick={() => {
              const w = window.open("", "_blank")!;
              // Hilfsfunktion: Absatz → HTML
              function renderP(p: string): string {
                const isBet   = /^BETREFF:\s*/i.test(p.trim()) || /^[A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ][A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ\s\-]{3,}$/.test(p.trim());
                const cleaned = p.trim().replace(/^BETREFF:\s*/i, '');
                const esc = cleaned.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                const isDate  = /^[A-ZÄÖÜ][a-zäöüA-ZÄÖÜ]{1,20},\s+\d/.test(p.trim());
                const isClose = /^(Freundliche|Mit freundlichen|Herzliche|Viele\s+Gr[üu]sse|Mit besten|Hochachtungsvoll)/i.test(p.trim());
                let s = 'margin:0 0 1.2em 0;white-space:pre-line;font-size:13px;line-height:1.85;';
                if (isDate || isClose) s += 'margin-top:1.8em;';
                if (isBet) s += 'font-weight:700;letter-spacing:0.01em;';
                return `<p style="${s}">${esc}</p>`;
              }
              function renderCVHtml(cvText: string, withPhoto: boolean): string {
                const cvParas = cvText.split(/\n\n+/);
                const isSec = (p: string) => /^[A-ZÄÖÜ][A-ZÄÖÜ\s&]{3,}$/.test(p.trim()) && !p.includes('\n');
                const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
                const firstLines = (cvParas[0]||'').split('\n').filter((l: string) => l.trim());
                const bodyParas = cvParas.slice(1);
                const photoHtml = (withPhoto && profilePhotoUrl)
                  ? `<img src="${profilePhotoUrl}" style="width:88px;height:110px;object-fit:cover;border-radius:2px;box-shadow:0 2px 8px rgba(0,0,0,0.15)" alt="">`
                  : '';
                const nameHtml = `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
                  <div>
                    ${firstLines[0]?`<p style="font-size:15px;font-weight:700;margin:0 0 5px;letter-spacing:0.01em">${esc(firstLines[0])}</p>`:''}
                    ${firstLines[1]?`<p style="font-size:12px;color:#666;margin:0 0 5px">${esc(firstLines[1])}</p>`:''}
                    ${firstLines.length>2?`<p style="font-size:11.5px;color:#555;line-height:1.6;margin:0">${firstLines.slice(2).map(esc).join('<br>')}</p>`:''}
                  </div>${photoHtml}
                </div>`;
                const bodyHtml = bodyParas.map((p: string) => {
                  if (isSec(p)) return `<div style="margin-top:18px;padding-top:12px;border-top:0.5px solid #d8d5ce"><p style="font-size:10.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#888;margin:0 0 10px">${esc(p.trim())}</p></div>`;
                  const lines = p.split('\n').filter((l: string) => l.trim());
                  const dateIdx = lines.findIndex((l: string) => /^\d{4}/.test(l.trim()));
                  if (lines.length >= 2 && dateIdx >= 0) {
                    const date = lines[dateIdx];
                    const others = lines.filter((_: string, j: number) => j !== dateIdx);
                    return `<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:10px"><div><p style="font-size:12px;font-weight:700;margin:0 0 5px;color:#1a1a1a">${esc(others[0]||'')}</p>${others.slice(1).map((l: string)=>`<p style="font-size:11.5px;color:#555;margin:0 0 4px">${esc(l)}</p>`).join('')}</div><span style="font-size:11px;color:#999;white-space:nowrap;padding-top:1px">${esc(date)}</span></div>`;
                  }
                  return `<p style="font-size:11.5px;color:#444;line-height:1.6;margin:0 0 8px;white-space:pre-line">${esc(p)}</p>`;
                }).join('');
                const nameDivider = goldAccent
                  ? `<div style="height:1px;background:#C8902E;opacity:0.5;margin:12px 0 4px;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div>`
                  : '';
                return nameHtml + nameDivider + bodyHtml;
              }

              function buildDocHtml(docText: string, withPhoto: boolean, isFirstDoc: boolean, isCVDoc: boolean, hasNextPage?: boolean): string {
                const content = isCVDoc ? renderCVHtml(docText, withPhoto) : (() => {
                  const paras = docText.split(/\n\n+/);
                  const headerHtml = paras.slice(0, 2).map(renderP).join('');
                  const bodyHtml   = paras.slice(2).map(renderP).join('');
                  const photoCell  = (withPhoto && profilePhotoUrl)
                    ? `<td style="vertical-align:top;width:150px;padding-left:12px;text-align:right;border:none"><img src="${profilePhotoUrl}" width="135" height="168" style="width:135px;height:168px;object-fit:cover;border-radius:2px;box-shadow:0 2px 8px rgba(0,0,0,0.15)"></td>`
                    : '';
                  return (withPhoto && profilePhotoUrl)
                    ? `<table style="width:100%;border-collapse:collapse;margin-bottom:0"><tr><td style="vertical-align:top;border:none">${headerHtml}</td>${photoCell}</tr></table>${bodyHtml}`
                    : headerHtml + bodyHtml;
                })();
                const pageBreakStyle = (isFirstDoc && hasNextPage) ? 'page-break-after:always;' : '';
                const padding = isCVDoc ? '14mm 18mm 14mm 20mm' : '16mm 20mm 16mm 22mm';
                const accentBar = goldAccent
                  ? `<div style="position:absolute;left:11mm;top:14mm;bottom:14mm;width:0.7mm;background:#C8902E;-webkit-print-color-adjust:exact;print-color-adjust:exact"></div>`
                  : '';
                return `<div class="page" style="position:relative;${pageBreakStyle}">${accentBar}<div class="body" style="padding:${padding};font-size:13px;line-height:1.85;color:#1a1a1a">${content}</div></div>`;
              }

              const doc1Html = buildDocHtml(cleanResult, true, true, isCV, !!lebenslaufResult);
              const doc2Html = lebenslaufResult ? buildDocHtml(lebenslaufResult, false, false, true, false) : '';
              const photosSection = photosHtml; // already contains full page divs

              w.document.write(`<html><head><title>${toolTitle}</title><meta charset="utf-8">
                <style>
                  *{box-sizing:border-box;margin:0;padding:0}
                  body{font-family:Arial,sans-serif;background:#f0ede8;padding:30px 20px}
                  .page{background:#fff;max-width:740px;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.12);margin-bottom:20px}
                  .body{font-size:13px;line-height:1.85;color:#1a1a1a}
                  @media print{
                    @page{margin:0;size:A4 portrait}
                    body{background:#fff;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
                    .page{box-shadow:none;max-width:100%;width:100%;margin:0}
                  }
                </style></head>
                <body>${doc1Html}${doc2Html}${photosSection}</body></html>`);
              w.document.close();
              setTimeout(() => w.print(), 800);
            }}
            className="bg-swiss-gold px-6 py-3 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
          >
            {fs("downloadPdf", "Als PDF herunterladen")}
          </button>

          {/* Word-Export: gleiche Inhalte als bearbeitbare Datei — Nutzer können nachträglich anpassen */}
          <button
            onClick={() => {
              const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
              const paras = (docText: string) =>
                docText
                  .split(/\n\n+/)
                  .map((p) => `<p style="margin:0 0 12pt 0;white-space:pre-wrap">${esc(p)}</p>`)
                  .join("");
              let bodyHtml = paras(cleanResult);
              if (lebenslaufResult) {
                bodyHtml += `<br style="page-break-before:always">` + paras(lebenslaufResult);
              }
              const html =
                `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">` +
                `<title>${esc(toolTitle)}</title></head>` +
                `<body style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.6">${bodyHtml}</body></html>`;
              const blob = new Blob(["﻿", html], { type: "application/msword" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${tool.slug}.doc`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="border border-ink-700 px-6 py-3 text-sm font-medium uppercase tracking-widest text-cream transition hover:border-swiss-gold"
          >
            {fs("downloadWord", "Als Word-Datei herunterladen")}
          </button>

        </div>

        {/* Cross-Sell: passende weitere Dokumente — erhöht den Wert pro Kunde */}
        {related.length > 0 && (
          <div className="mt-10 border-t border-ink-700 pt-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-cream-muted">
              {fs("crossSellTitle", "Brauchst du noch etwas?")}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {related.map((slug) => (
                <a
                  key={slug}
                  href={`/${locale}/tools/${slug}`}
                  className="flex items-center justify-between rounded-sm border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-cream transition hover:border-swiss-gold"
                >
                  <span>{(t.items as Record<string, any> | undefined)?.[slug]?.title ?? slug}</span>
                  <span className="text-swiss-gold">→</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === "preview") {
    const goldAccent = ["mietbewerbung", "jobbewerbung", "lebenslauf", "komplettbewerbung"].includes(tool.slug);
    return (
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-swiss-gold">{fs("previewTag", "Vorschau")}</span>
          <span className="text-xs text-cream-muted">{fs("previewPayNote", "— Bezahle um das vollständige Dokument zu erhalten")}</span>
        </div>

        <div className="relative overflow-hidden shadow-xl" style={{ borderRadius: 2 }}>
          {/* Wasserzeichen */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ zIndex: 4 }}>
            <span className="select-none text-5xl font-medium uppercase" style={{ transform: "rotate(-30deg)", letterSpacing: "0.3em", color: "rgba(0,0,0,0.07)" }}>
              {fs("watermark", "VORSCHAU")}
            </span>
          </div>

          {/* Dokument-Body */}
          <div style={{ background: "#faf8f4", padding: "40px 48px", position: "relative", zIndex: 1, fontFamily: "Arial, sans-serif", fontSize: 13, lineHeight: 1.85, color: "#1a1a1a" }}>
            {goldAccent && <div style={{ position: "absolute", left: 22, top: 36, bottom: 36, width: 2, background: "#C8902E" }} />}
            {(() => {
              const rawParas = previewText.split(/\n\n+/);
              const isBet  = (p: string) => /^BETREFF:\s*/i.test(p.trim()) || /^[A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ][A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ\s\-]{3,}$/.test(p.trim());
              const dispP  = (p: string) => p.replace(/^BETREFF:\s*/i, '');
              const header = rawParas.slice(0, 2);
              const body   = rawParas.slice(2);
              return (
                <>
                  {profilePhotoUrl ? (
                    <div style={{ display: "flex", gap: 0 }}>
                      <div style={{ flex: 1, paddingRight: 16 }}>
                        {header.map((p, i) => <p key={i} style={{ marginBottom: "1.2em", whiteSpace: "pre-line", fontWeight: isBet(p) ? 700 : 400 }}>{dispP(p)}</p>)}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profilePhotoUrl} alt="Foto" style={{ width: 135, height: 168, objectFit: "cover", borderRadius: 2, flexShrink: 0, alignSelf: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} />
                    </div>
                  ) : (
                    header.map((p, i) => <p key={i} style={{ marginBottom: "1.2em", whiteSpace: "pre-line", fontWeight: isBet(p) ? 700 : 400 }}>{dispP(p)}</p>)
                  )}
                  {body.map((p, i) => <p key={i + 2} style={{ marginBottom: "1.2em", whiteSpace: "pre-line", fontWeight: isBet(p) ? 700 : 400 }}>{dispP(p)}</p>)}
                </>
              );
            })()}
          </div>

          {/* Fade-out unten */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40" style={{ background: "linear-gradient(to bottom, rgba(250,248,244,0) 0%, rgba(250,248,244,0.98) 100%)", zIndex: 3 }} />
        </div>

        <div className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">{fs("checkTitle", "Vor dem Kauf überprüfen")}</p>
          <p className="text-sm text-cream-muted">Bitte kontrolliere deine Angaben: vollständiger Name, Adresse, E-Mail-Adresse, Name des Unternehmens und genaue Berufsbezeichnung. Fehlerhafte Angaben können das Dokument beeinträchtigen.</p>
          <button onClick={() => setStage("form")} className="mt-2 text-xs text-amber-400 underline hover:text-amber-300">{fs("editData", "Angaben ändern")}</button>
        </div>

        <div className="mt-4 rounded-sm border border-swiss-gold/25 bg-swiss-gold/5 p-5">
          <p className="mb-4 text-sm text-cream-muted">
            <strong className="font-medium text-cream">{fs("readyTitle", "Dein persönliches Dokument ist bereit.")}</strong>{" "}
            {fs("readyBody", "Bezahle einmalig {price} für das vollständige, druckfertige Dokument — kein Abo, kein Konto.").replace("{price}", priceDisplay)}
          </p>

          {/* Wertrahmung: macht sichtbar, wofür der Preis steht */}
          <p className="mb-4 text-xs text-cream-subtle">
            {fs("valueLine", "Spart dir das Formulieren · Druckfertiges PDF · Sofort nach der Zahlung verfügbar")}
          </p>

          {/* Widerrufs-Einwilligung — hier beim Kauf, nicht bei der Gratis-Vorschau */}
          <label className={`mb-3 flex cursor-pointer items-start gap-3 ${withdrawalError ? "text-red-400" : "text-cream-muted"}`}>
            <input
              type="checkbox"
              checked={withdrawalConsent}
              onChange={(e) => { setWithdrawalConsent(e.target.checked); setWithdrawalError(false); }}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-swiss-gold"
            />
            <span className="text-xs leading-relaxed">
              {(() => {
                const parts = withdrawalText.split("AGB");
                if (parts.length === 2) {
                  return <>{parts[0]}<a href={`/${locale}/legal/agb`} className="underline hover:text-cream">AGB</a>{parts[1]}</>;
                }
                return <>{withdrawalText} <a href={`/${locale}/legal/agb`} className="underline hover:text-cream">AGB</a></>;
              })()}
            </span>
          </label>
          {withdrawalError && (
            <p className="mb-3 text-xs text-red-400">{withdrawalErrText}</p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button onClick={proceedToCheckout} className="bg-swiss-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark">
              {fs("payButton", "Vollständiges Dokument — {price}").replace("{price}", priceDisplay)}
            </button>
            <button onClick={() => setStage("form")} className="text-sm text-cream-subtle underline hover:text-cream-muted">
              {fs("editData", "Angaben ändern")}
            </button>
          </div>
          <p className="mt-3 text-xs text-cream-subtle">
            {country?.code === "CH"
              ? `💳 ${fs("creditCard", "Kreditkarte")} · TWINT · Apple Pay · Google Pay`
              : `💳 ${fs("creditCard", "Kreditkarte")} · Apple Pay · Google Pay`}
          </p>
        </div>
      </div>
    );
  }

  // ── Formular ──────────────────────────────────────────────────
  const inputClass = "w-full rounded-sm border bg-ink-900 px-4 py-3 text-base text-cream placeholder:text-cream-subtle outline-none transition focus:border-swiss-gold focus:ring-1 focus:ring-swiss-gold";
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

  // Kündigungsfrist → Datum: zentrale Funktion aus lib/notice (identisch zu den Marken-Seiten)

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

      {/* Bewerbungsfoto (client-only) — nur für Jobbewerbung oben; Lebenslauf kommt nach dem CV-Upload */}
      {tool.supportsProfilePhoto && tool.slug !== "lebenslauf" && (
        <div className="mb-10 flex items-start gap-6 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <label className="group cursor-pointer flex-shrink-0">
            <input type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setProfilePhotoUrl(URL.createObjectURL(file)); const reader = new FileReader(); reader.onload = () => { setProfilePhotoBase64(reader.result as string); }; reader.readAsDataURL(file); }} />
            {profilePhotoUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profilePhotoUrl} alt="Bewerbungsfoto" className="h-24 w-24 rounded-full object-cover border-2 border-swiss-gold/40" />
                <span className="absolute -bottom-5 left-0 right-0 text-center text-xs text-swiss-gold">{fs("changePhoto", "ändern")}</span>
              </div>
            ) : (
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-ink-700 bg-ink-950 transition group-hover:border-swiss-gold/50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
          </label>
          <div className="pt-1">
            <p className="text-sm font-medium text-cream">{fs("photoLabel", "Bewerbungsfoto (optional)")}</p>
            <p className="mt-1 text-xs leading-relaxed text-cream-muted">{fs("photoHint", "Lade ein Foto hoch — es wird oben rechts ins Dokument eingebettet. In der Schweiz ist ein Foto üblich, aber nicht Pflicht.")}</p>
          </div>
        </div>
      )}

      {/* Einzelbild-Upload (Vision-Tools) */}
      {tool.supportsDocumentUpload && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{uploadLabel}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{uploadHint}</p>
          <label className="group cursor-pointer">
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleImageUpload} />
            {imagePreviewUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreviewUrl} alt="Hochgeladenes Dokument" className="max-h-64 w-full rounded-sm object-contain" />
                <span className="mt-2 block text-xs text-swiss-gold">{fs("imageUploaded", "✓ Bild hochgeladen — tippe um zu ändern")}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-700 py-8 transition group-hover:border-swiss-gold/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs text-cream-muted">{fs("takePhoto", "Foto aufnehmen oder aus Galerie wählen")}</span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Multi-Format Upload: Bild + PDF + DOCX (z. B. Arbeitszeugnis) */}
      {tool.supportsAllDocumentTypes && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{uploadLabel}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{uploadHint}</p>
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
                  {docxText && <span className="ml-2 text-cream-muted">({fs("textExtracted", "Text extrahiert")})</span>}
                  {imageMimeType === "application/pdf" && <span className="ml-2 text-cream-muted">(PDF)</span>}
                </p>
                <p className="mt-1 text-xs text-cream-muted">{fs("changeFile", "Tippe um eine andere Datei zu wählen")}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-sm border border-ink-700 py-8 transition group-hover:border-swiss-gold/50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <span className="text-xs text-cream-muted">{fs("uploadPrompt", "Foto, PDF oder Word-Datei hochladen")}</span>
                <span className="text-xs text-cream-muted/60">(.jpg, .png, .pdf, .docx)</span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Profilfoto für Lebenslauf — erscheint direkt nach dem CV-Upload */}
      {tool.supportsProfilePhoto && tool.slug === "lebenslauf" && (
        <div className="mb-10 flex items-start gap-6 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <label className="group cursor-pointer flex-shrink-0">
            <input type="file" accept="image/*" capture="user" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; setProfilePhotoUrl(URL.createObjectURL(file)); const reader = new FileReader(); reader.onload = () => { setProfilePhotoBase64(reader.result as string); }; reader.readAsDataURL(file); }} />
            {profilePhotoUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profilePhotoUrl} alt="Profilfoto" className="h-24 w-24 rounded-full object-cover border-2 border-swiss-gold/40" />
                <span className="absolute -bottom-5 left-0 right-0 text-center text-xs text-swiss-gold">{fs("changePhoto", "ändern")}</span>
              </div>
            ) : (
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-ink-700 bg-ink-950 transition group-hover:border-swiss-gold/50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-swiss-gold/60"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
          </label>
          <div className="pt-1">
            <p className="text-sm font-medium text-cream">{fs("cvPhotoLabel", "Dein Foto (optional)")}</p>
            <p className="mt-1 text-xs leading-relaxed text-cream-muted">{fs("cvPhotoHint", "Für einen überzeugenden Lebenslauf empfehlen wir ein freundliches, professionelles Foto — es macht deine Bewerbung persönlicher und hinterlässt einen bleibenden ersten Eindruck.")}</p>
          </div>
        </div>
      )}

      {/* Foto-Galerie (kein Vision — nur Beilage) */}
      {tool.supportsPhotoGallery && (
        <div className="mb-10 rounded-sm border border-dashed border-swiss-gold/40 bg-ink-900 p-6">
          <p className="mb-1 text-sm font-medium text-cream">{galleryLabel}</p>
          <p className="mb-4 text-xs leading-relaxed text-cream-muted">{galleryHint}</p>

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
                    aria-label={fs("removePhoto", "Foto entfernen")}
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
                    ? fs("selectPhotos", "Fotos auswählen (mehrere möglich)")
                    : `${fs("addMorePhotos", "Weitere Fotos hinzufügen")} (${photos.length}/${maxPhotos})`}
                </span>
              </div>
            </label>
          )}

          {photos.length >= maxPhotos && (
            <p className="mt-2 text-xs text-cream-subtle">{fs("maxPhotosReached", "Maximum von {max} Fotos erreicht.").replace("{max}", String(maxPhotos))}</p>
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
                {field.type === "address" ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder={fs("street", "Strasse")}
                        value={getAddressParts(field.key).street}
                        onChange={e => setAddressPart(field.key, "street", e.target.value)}
                        className={`${inputClass} col-span-2 ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      />
                      <input
                        type="text"
                        placeholder={fs("nr", "Nr.")}
                        value={getAddressParts(field.key).nr}
                        onChange={e => setAddressPart(field.key, "nr", e.target.value)}
                        className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder={fs("zip", "PLZ")}
                        value={getAddressParts(field.key).zip}
                        onChange={e => setAddressPart(field.key, "zip", e.target.value)}
                        className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      />
                      <input
                        type="text"
                        placeholder={fs("city", "Ort")}
                        value={getAddressParts(field.key).city}
                        onChange={e => setAddressPart(field.key, "city", e.target.value)}
                        className={`${inputClass} col-span-2 ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      />
                    </div>
                  </div>
                ) : field.key === "workHistory" ? (
                  <div className="space-y-3">
                    {workEntries.map((entry, i) => (
                      <div key={i} className="rounded-sm border border-ink-700 bg-ink-950 p-3">
                        <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          <input
                            type="text"
                            placeholder={fs("rolePlaceholder", "Stelle / Funktion")}
                            value={entry.role}
                            onChange={e => setWorkEntries(prev => prev.map((x, j) => j === i ? { ...x, role: e.target.value } : x))}
                            className={`${inputClass} border-ink-700`}
                          />
                          <input
                            type="text"
                            placeholder={fs("companyPlaceholder", "Firma")}
                            value={entry.company}
                            onChange={e => setWorkEntries(prev => prev.map((x, j) => j === i ? { ...x, company: e.target.value } : x))}
                            className={`${inputClass} border-ink-700`}
                          />
                          <input
                            type="text"
                            placeholder={fs("cityOptional", "Ort (optional)")}
                            value={entry.city}
                            onChange={e => setWorkEntries(prev => prev.map((x, j) => j === i ? { ...x, city: e.target.value } : x))}
                            className={`${inputClass} border-ink-700 sm:col-span-1 col-span-2`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={entry.from}
                            onChange={e => setWorkEntries(prev => prev.map((x, j) => j === i ? { ...x, from: e.target.value } : x))}
                            className={`${inputClass} border-ink-700 flex-1`}
                          >
                            <option value="">{fs("fromYear", "Von (Jahr)")}</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          <span className="text-cream-subtle">–</span>
                          <select
                            value={entry.to}
                            onChange={e => setWorkEntries(prev => prev.map((x, j) => j === i ? { ...x, to: e.target.value } : x))}
                            className={`${inputClass} border-ink-700 flex-1`}
                          >
                            <option value="">{fs("untilToday", "Bis heute")}</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          {workEntries.length > 1 && (
                            <button type="button" onClick={() => setWorkEntries(prev => prev.filter((_, j) => j !== i))}
                              className="shrink-0 rounded-sm border border-ink-700 px-2 py-1 text-xs text-cream-subtle hover:border-red-700 hover:text-red-400 transition">✕</button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWorkEntries(prev => [...prev, { role: "", company: "", city: "", from: "", to: "" }])}
                      className="flex items-center gap-2 text-xs text-swiss-gold hover:text-swiss-goldDark transition"
                    >
                      <span className="text-base leading-none">+</span> {fs("addPosition", "Weitere Stelle hinzufügen")}
                    </button>
                  </div>
                ) : field.key === "education" ? (
                  <div className="space-y-3">
                    {eduEntries.map((entry, i) => (
                      <div key={i} className="rounded-sm border border-ink-700 bg-ink-950 p-3">
                        <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            placeholder={fs("degreePlaceholder", "Abschluss / Kurs")}
                            value={entry.title}
                            onChange={e => setEduEntries(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                            className={`${inputClass} border-ink-700`}
                          />
                          <input
                            type="text"
                            placeholder={fs("institutionPlaceholder", "Schule / Institution")}
                            value={entry.institution}
                            onChange={e => setEduEntries(prev => prev.map((x, j) => j === i ? { ...x, institution: e.target.value } : x))}
                            className={`${inputClass} border-ink-700`}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={entry.from}
                            onChange={e => setEduEntries(prev => prev.map((x, j) => j === i ? { ...x, from: e.target.value } : x))}
                            className={`${inputClass} border-ink-700 flex-1`}
                          >
                            <option value="">{fs("fromYear", "Von (Jahr)")}</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          <span className="text-cream-subtle">–</span>
                          <select
                            value={entry.to}
                            onChange={e => setEduEntries(prev => prev.map((x, j) => j === i ? { ...x, to: e.target.value } : x))}
                            className={`${inputClass} border-ink-700 flex-1`}
                          >
                            <option value="">{fs("untilToday", "Bis heute")}</option>
                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                          {eduEntries.length > 1 && (
                            <button type="button" onClick={() => setEduEntries(prev => prev.filter((_, j) => j !== i))}
                              className="shrink-0 rounded-sm border border-ink-700 px-2 py-1 text-xs text-cream-subtle hover:border-red-700 hover:text-red-400 transition">✕</button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEduEntries(prev => [...prev, { title: "", institution: "", from: "", to: "" }])}
                      className="flex items-center gap-2 text-xs text-swiss-gold hover:text-swiss-goldDark transition"
                    >
                      <span className="text-base leading-none">+</span> {fs("addEducation", "Weitere Ausbildung hinzufügen")}
                    </button>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    id={field.key}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  >
                    <option value="">{selectPlaceholder}</option>
                    {(field.countryOptions?.[country?.code ?? ""] ?? field.options ?? []).map((opt) => <option key={opt} value={opt}>{(dict?.options as Record<string, string> | undefined)?.[opt] ?? opt}</option>)}
                  </select>
                ) : field.type === "tel" ? (
                  <div className="flex gap-2">
                    <select
                      value={phonePrefix}
                      onChange={e => setPhonePrefix(e.target.value)}
                      className={`${inputClass} border-ink-700 shrink-0`}
                      style={{ width: 90 }}
                    >
                      {PHONE_PREFIXES.map(p => (
                        <option key={p.code} value={p.prefix}>{p.code} {p.prefix}</option>
                      ))}
                    </select>
                    <input
                      id={field.key}
                      type="tel"
                      placeholder="79 123 45 67"
                      value={values[field.key] ?? ""}
                      onChange={e => handleFieldChange(field.key, e.target.value)}
                      className={`${inputClass} flex-1 ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                    />
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.key}
                    rows={5}
                    placeholder={getPlaceholder(field)}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    className={`${inputClass} resize-y ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                  />
                ) : field.type === "monthyear" ? (() => {
                  const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
                  const parts = (values[field.key] ?? "").split("-");
                  const selY = parts[0] ?? String(new Date().getFullYear());
                  const selM = parts[1] ?? "01";
                  const years = Array.from({ length: 50 }, (_, i) => String(new Date().getFullYear() - i));
                  return (
                    <div className="flex gap-2">
                      <select
                        value={selM}
                        onChange={e => handleFieldChange(field.key, `${selY}-${e.target.value}`)}
                        className={`${inputClass} flex-1 ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      >
                        {MONTHS.map((name, i) => {
                          const v = String(i + 1).padStart(2, "0");
                          return <option key={v} value={v}>{name}</option>;
                        })}
                      </select>
                      <select
                        value={selY}
                        onChange={e => handleFieldChange(field.key, `${e.target.value}-${selM}`)}
                        className={`${inputClass} flex-1 ${errors[field.key] ? "border-red-500" : "border-ink-700"}`}
                      >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  );
                })() : field.appendCurrency ? (
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
                    {fs("autoCalculated", "✓ Automatisch berechnet — du kannst das Datum anpassen.")}
                  </p>
                )}
                {field.hint && (
                  <p className="mt-1.5 text-xs text-cream-muted/70">{(dict?.fieldHints as Record<string, string> | undefined)?.[field.key] ?? field.hint}</p>
                )}
                {errors[field.key] && <p className="mt-1 text-xs text-red-400">{errors[field.key]}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-xs leading-relaxed text-cream-subtle">
        {legalDisclaimer}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          className="bg-swiss-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-ink-950 transition hover:bg-swiss-goldDark"
        >
          {fs("previewButton", "Vorschau erstellen — kostenlos")}
        </button>
        <span className="text-xs text-cream-muted">
          {fs("previewAfter", "Danach {price} für das vollständige Dokument").replace("{price}", priceDisplay)}
        </span>
      </div>
    </form>
  );
}
