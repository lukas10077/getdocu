// Baut die bearbeitbare Word-Datei (.doc, Word-kompatibles HTML) serverseitig.
// WICHTIG: identische Absatz-Logik wie der Word-Download im Client
// (components/ToolForm.tsx) — bei Änderungen dort bitte hier gleich mitziehen.
export function buildWordDoc(rawText: string, title: string): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const isBet = (p: string) =>
    /^BETREFF:\s*/i.test(p.trim()) ||
    /^[A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ][A-ZÄÖÜÀÁÂÃÉÈÊËÍÌÎÏÓÒÔÕÚÙÛÜ\s\-]{3,}$/.test(p.trim());
  const isDate = (p: string) => /^[A-ZÄÖÜ][a-zäöüA-ZÄÖÜ]{1,20},\s+\d/.test(p.trim());
  const isClose = (p: string) =>
    /^(Freundliche|Mit freundlichen|Herzliche|Viele\s+Gr[üu]sse|Mit besten|Hochachtungsvoll)/i.test(p.trim());

  const paras = (docText: string) =>
    docText
      .split(/\n\n+/)
      .map((p, i) => {
        const cleaned = p.trim().replace(/^BETREFF:\s*/i, "");
        let s = "margin:0 0 12pt 0;";
        // Empfängerblock (2. Absatz) deutlich vom Absender absetzen — Briefkonvention
        if (i === 1) s += "margin-top:28pt;";
        if (isDate(p) || isClose(p)) s += "margin-top:22pt;";
        if (isBet(p)) s += "font-weight:bold;";
        // Word ignoriert white-space:pre-wrap — Zeilenumbrüche müssen als <br> rein.
        return `<p style="${s}">${esc(cleaned).replace(/\n/g, "<br>")}</p>`;
      })
      .join("");

  // HINWEIS abtrennen — darf nicht im Dokument erscheinen
  const hinweisIdx = rawText.search(/\n*HINWEIS[:\s]/i);
  const fullResult = hinweisIdx >= 0 ? rawText.slice(0, hinweisIdx).trim() : rawText;

  // Bundle: Bewerbungsschreiben + Lebenslauf trennen
  const bundleSepIdx = fullResult.search(/===LEBENSLAUF===/);
  const cleanResult = bundleSepIdx >= 0 ? fullResult.slice(0, bundleSepIdx).trim() : fullResult;
  const lebenslaufResult =
    bundleSepIdx >= 0 ? fullResult.slice(bundleSepIdx).replace(/^===LEBENSLAUF===\n*/, "").trim() : null;

  let bodyHtml = paras(cleanResult);
  if (lebenslaufResult) {
    bodyHtml += `<br style="page-break-before:always">` + paras(lebenslaufResult);
  }

  return (
    `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">` +
    `<title>${esc(title)}</title>` +
    `<style>@page WordSection1 {size:595.3pt 841.9pt; margin:70.85pt 70.85pt 56.7pt 70.85pt;} div.WordSection1 {page:WordSection1;}</style>` +
    `</head>` +
    `<body style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.6">` +
    `<div class="WordSection1">${bodyHtml}</div></body></html>`
  );
}
