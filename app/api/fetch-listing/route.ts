import { NextRequest, NextResponse } from "next/server";

// Holt den Text eines Stellen- oder Wohnungsinserats im Auftrag des Nutzers
// (Einzelabruf, wie ein Browser). Der extrahierte Text wird NICHT gespeichert,
// sondern nur an den Client zurückgegeben und dort für die Generierung genutzt.
//
// Sicherheit:
// - nur http/https
// - private/interne Hosts blockiert (SSRF-Schutz)
// - Timeout 8s, Antwort auf 500 KB begrenzt, Ausgabe auf 8000 Zeichen

const PRIVATE_HOST =
  /^(localhost|127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i;

export async function POST(req: NextRequest) {
  let url: unknown;
  try {
    ({ url } = await req.json());
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (typeof url !== "string" || url.length > 2000) {
    return NextResponse.json({ error: "Ungültige URL." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return NextResponse.json({ error: "Ungültige URL." }, { status: 400 });
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return NextResponse.json({ error: "Nur http/https erlaubt." }, { status: 400 });
  }
  const host = parsed.hostname.toLowerCase();
  if (PRIVATE_HOST.test(host) || host.endsWith(".local") || host.endsWith(".internal") || host === "::1" || host === "[::1]") {
    return NextResponse.json({ error: "Adresse nicht erlaubt." }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Realistischer UA — viele Inserat-Portale blocken generische Bots
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*",
        "Accept-Language": "de,en;q=0.8,es;q=0.7",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ error: "Seite nicht erreichbar." }, { status: 422 });
    }
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json({ error: "Kein lesbarer Inhalt." }, { status: 422 });
    }

    const raw = (await res.text()).slice(0, 500_000);
    const text = raw
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<(head|nav|footer|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#\d+;/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 8000);

    if (text.length < 100) {
      return NextResponse.json({ error: "Kein lesbarer Inhalt gefunden." }, { status: 422 });
    }
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Seite konnte nicht geladen werden." }, { status: 422 });
  }
}
