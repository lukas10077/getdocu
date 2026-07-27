# Projekt-Morgenbericht — Sonntag, 26. Juli 2026

*Google Ads: Daten vom 25. Juli (gestern) · Apps: letzter verfügbarer Tag 24. Juli*

> **Noch kein echter GetDocu-Verkauf.** Die einzige Stripe-Zahlung (4,75 €, 20. Juli) war ein interner Test eines Kollegen — kein Kundenumsatz. Erster echter Verkauf steht weiter aus.
>
> **Aber: klarer Aufwärtstrend im Funnel-Einstieg.** Die Vorschauen beschleunigen sich deutlich (siehe unten).

---

## Trend: Vorschauen ziehen stark an

| Zeitraum | Vorschauen | Checkout-Starts |
|---|---|---|
| Woche 1 (12.–18. Juli) | ~1 | 0 |
| Woche 2 (19.–25. Juli) | 37 | 6 |
| davon gestern (25. Juli) | 11 | 4 |

Der Funnel-Einstieg ist innerhalb einer Woche von praktisch null auf 37 Vorschauen gesprungen, gestern war mit 11 der bisher stärkste Tag. Das Interesse wächst also real — der Engpass sitzt erst ganz unten beim Bezahlen.

---

## 1. Google Ads — gestern (25. Juli)

| Kampagne | Klicks | CTR | Kosten | Ø CPC | Vorschau | Checkout | Käufe |
|---|---|---|---|---|---|---|---|
| GetDocu – Suche [DACH] | 21 | 3,63 % | 5,28 CHF | 0,25 CHF | 0 | 0 | 0 |
| GetDocu – España | 6 | 2,47 % | 1,13 CHF | 0,19 CHF | 0 | 0 | 0 |
| GetDocu – LatAm | 63 | 4,18 % | 2,73 CHF | 0,04 CHF | 11 | 4 | 0 |
| **Gesamt** | **90** | **3,87 %** | **9,14 CHF** | **0,10 CHF** | **11** | **4** | **0** |

**Einordnung:** Der gesamte Funnel kam gestern aus **LatAm** — günstiger CPC (0,04 CHF), hohes Volumen. Alle CTRs liegen unter den bisherigen Benchmarks (LatAm 4,18 % vs. ~11–13 %, España 2,47 % vs. ~7 %, DACH 3,63 % vs. ~4 %), die CPCs dafür deutlich darunter (0,04–0,25 statt 0,16–0,38 CHF). **DACH** hat sein Budget ausgeschöpft (5,28/5 CHF, „durch Budget eingeschränkt"), lieferte aber 0 Funnel-Aktivität. **España** ist die schwächste Kampagne.

**Wichtig zur Messung:** Die „0 Käufe" sind nur bedingt aussagekräftig — die Conversion-Aktion **„Kauf" steht auf Inaktiv**, Google Ads kann Käufe aktuell gar nicht erfassen. Das Kauf-Tracking läuft bislang nur clientseitig (adblock-anfällig); der serverseitige Upload im Webhook ist noch nicht gebaut. Stripe bestätigt aber unabhängig davon: 0 echte Käufe.

**Meldungen aus Google Ads** (nichts übernommen): ⚠️ Dauerbanner **Werbetreibenden-Verifizierung erforderlich** (droht mit Anzeigen-Stopp). Automatische Vorschläge (Budgets anpassen, Displaynetzwerk, Portfoliostrategie, redundante Keywords). **Keine abgelehnten Anzeigen.**

---

## 2. Apps — App Store Connect (Stand 24. Juli)

| App | Downloads | Impr. | Produktseitenaufrufe | Konv.-Rate | Updates | In-App-Käufe / Erlöse |
|---|---|---|---|---|---|---|
| Lumio Notes | 7 | 620 | 58 | 1,79 % | 26 | noch keine |
| Tradelog – Trading Journal | 8 | 265 | 42 | 5,48 % | 5 | noch keine |

Tradelog konvertiert Produktseitenaufrufe klar besser (5,48 % vs. 1,79 %), erhält aber weniger als die Hälfte der Impressionen.

---

## 3. Digitale Produkte / Stripe

Stripe zeigt genau **1 Zahlung** (4,75 €, 20. Juli) — interner Test, kein Umsatz. **0 fehlgeschlagene, 0 unvollständige** Zahlungen. Das heißt: Die LatAm-Checkout-Abbrecher werden nicht an der Karte abgelehnt, sondern springen vor dem Zahlungsversuch ab (stiller Abbruch). Ursache also eher Preis/Vertrauen/Zahlungsmethoden-Angebot als ein technischer Fehler — der Checkout selbst funktioniert (Test lief durch).

---

## Empfehlungen (priorisiert, max. 3 — nur vorgeschlagen)

1. **Werbetreibenden-Verifizierung durchlaufen.** Höchste Priorität — ohne Abschluss kann Google die gesamte Anzeigenschaltung stoppen.
2. **Kauf-Conversion-Tracking reparieren** (an einem anderen Tag geplant). Solange „Kauf" inaktiv ist und nur clientseitig gemessen wird, bleibt der erste echte Verkauf für Googles Gebotsoptimierung unsichtbar — sie optimiert blind.
3. **LatAm-Abbrüche adressieren oder Fokus verschieben.** Da es stille Abbrüche sind: Vertrauen/Preis auf der Bezahlseite prüfen bzw. lokale Zahlungsmethoden erwägen. Alternativ Budget stärker Richtung DACH/España lenken (passendere Zahlungsmethoden) — dort zuerst klären, warum DACH trotz ausgeschöpftem Budget 0 Funnel liefert (Keywords/Landingpage).

*Heute umgesetzt: `locale`-Fix im Checkout — Stripe-Bezahlseite erscheint nun in der Nutzersprache (LatAm: es-419).*
