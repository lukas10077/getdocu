# GetDocu

KI-gestützte Plattform, die Migrant:innen in der Schweiz hilft, wichtige Dokumente zu erstellen (Mietbewerbungen, Bewerbungen, Kündigungen, ...).

## Status dieser Lieferung

Fertig:

- Next.js 14 (App Router) + TypeScript + Tailwind Projekt-Setup, lauffähig (`npm run build` erfolgreich getestet)
- Vollständiges i18n-System für 15 Sprachen (de, en, fr, it, sq, pt, es, sr, ar, pl, hu, tr, ru, uk, ta), inkl. RTL-Support für Arabisch
- Apple.com-inspirierte Landingpage: Hero, Tools-Übersicht (3 MVP-Tools + "Bald verfügbar"-Liste), "So funktioniert's", Datenschutz-Trust-Section, Footer
- Sprachauswahl mit Flaggen + Eigennamen, automatische Spracherkennung via Browser (`middleware.ts`)
- Rechtsseiten (Impressum, Datenschutzerklärung, AGB) je Sprache abrufbar, mit den vorgegebenen Inhalten
- API-Skeleton: `/api/checkout` (Stripe Checkout Session), `/api/generate` (Claude API Aufruf inkl. Zahlungsverifikation, keine Persistierung der Eingabedaten), `/api/webhook` (anonyme Statistik)
- Zentrale Tool-Definition in `lib/tools.ts` (Preis, System-Prompt) — neue Tools einfach ergänzbar

Noch zu bauen (nächste Schritte):

- Die eigentlichen Formulare pro Tool (aktuell Platzhalter unter `app/[locale]/tools/[slug]/page.tsx` → `ToolFormPlaceholder`)
- Stripe-Checkout-Flow im Frontend anbinden (Button → `/api/checkout` → Redirect → zurück mit `session_id`)
- PDF-Erzeugung aus dem generierten Text (`@react-pdf/renderer` ist bereits als Dependency vorbereitet)
- Anonymer Nutzungszähler (z.B. via Vercel KV) in `/api/webhook` und `/api/generate`
- Übersetzung der vollständigen Rechtstexte (Datenschutz/AGB) in alle 15 Sprachen (aktuell auf Deutsch, UI-Strings sind aber bereits in allen Sprachen vorhanden)
- Domain-Setup (getdocu.com / getdocu.ch) + Vercel Deploy + GitHub Repo

## Setup

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY, STRIPE_SECRET_KEY etc. eintragen
npm run dev
```

## Ordnerstruktur

```
app/
  [locale]/            # alle lokalisierten Seiten (Landingpage, Tools, Legal)
  api/                 # checkout, generate, webhook
i18n/
  config.ts            # Locale-Liste, Metadaten, getDictionary()
  dictionaries/*.json   # eine Datei pro Sprache — neue Sprache = neue Datei + Eintrag in config.ts
components/            # Hero, ToolsSection, Nav, Footer, LanguageSwitcher, ...
lib/tools.ts           # Tool-Definitionen (Preis, Claude-Prompt) — hier neue Tools ergänzen
middleware.ts          # Browser-Spracherkennung + Locale-Redirect
```

## Datenschutz-Prinzip (wie umgesetzt)

`app/api/generate/route.ts` verifiziert die Stripe-Zahlung, ruft die Claude API auf und gibt das
Ergebnis direkt zurück. Die Formulardaten existieren ausschliesslich im Arbeitsspeicher dieser
einen Funktionsausführung — es gibt keinen Datenbank-Write, kein Logging von Klartext-Inhalten.
Nach der Response ist nichts mehr gespeichert.
