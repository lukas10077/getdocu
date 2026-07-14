# GetDocu — Hinweise für Entwicklung mit KI-Agenten

## ⚠️ i18n-Guardrail: `components/ToolForm.tsx` (WICHTIG)

`components/ToolForm.tsx` enthält i18n-Übersetzungsaufrufe (`fs("…", "…")`, den Helper-Block am
Komponentenanfang sowie `uploadLabel` / `galleryLabel` / `toolTitle`). Diese dürfen bei Änderungen
**niemals entfernt oder durch hartcodierte deutsche Texte ersetzt werden** — sonst erscheint die
Website in allen 15 Sprachen mit deutschen Formular- und Kauf-Texten.

Regeln beim Bearbeiten dieser Datei:

- Nur **gezielte, kleine Edits** vornehmen — die Datei **nicht** neu generieren / komplett überschreiben.
- Alle bestehenden `fs(...)`-Wrapper und den Helper-Block am Komponentenanfang **unangetastet** lassen.
- Neue sichtbare Texte immer über die vorhandenen i18n-Helper führen, nie als deutscher String hartcodieren.

## i18n-Struktur (Kontext)

Übersetzungen liegen in `i18n/dictionaries/<locale>.json` (15 Sprachen: de, en, fr, it, sq, pt, es,
sr, ar, pl, hu, tr, ru, uk, ta). Relevante Objekte:

- `tools.items[<slug>]` → Titel/Beschreibung je Tool
- `fieldLabels[<key>]` → Feld-Labels
- `sections[<deutscher Sektionsname>]` → Abschnitts-Überschriften
- `options[<deutscher Optionswert>]` → Auswahl-Optionen (Wert bleibt deutsch, nur Anzeige übersetzt)

Anzeige fällt auf Deutsch zurück, wenn ein Key im Wörterbuch fehlt. **Beim Anlegen eines neuen Tools
oder neuer Felder daher immer die Einträge in ALLEN 15 Sprachdateien ergänzen**, sonst erscheinen die
neuen Texte in den anderen Sprachen auf Deutsch.
