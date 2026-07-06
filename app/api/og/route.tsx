import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Wichtige Dokumente. Einfach erstellt.";
  const sub   = searchParams.get("sub")   || "Professionelle Briefe & Dokumente — in Minuten, für dein Land.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#100E0B",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Gold accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "6px", background: "#F0B429" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "0px", marginBottom: "48px" }}>
          <span style={{ fontSize: "52px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-1px" }}>Get</span>
          <span style={{ fontSize: "52px", fontWeight: 700, color: "#F0B429", letterSpacing: "-1px" }}>Docu</span>
        </div>

        {/* Title */}
        <div style={{ fontSize: "56px", fontWeight: 600, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "24px", maxWidth: "900px" }}>
          {title}
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: "28px", color: "#C8BDB0", maxWidth: "800px", lineHeight: 1.4 }}>
          {sub}
        </div>

        {/* Bottom badges */}
        <div style={{ position: "absolute", bottom: "60px", left: "80px", display: "flex", gap: "24px" }}>
          {["✓ Kein Abo", "✓ Kein Konto", "✓ Daten gelöscht", "✓ ab CHF 3.–"].map((b) => (
            <div key={b} style={{ fontSize: "20px", color: "#C8BDB0", background: "#221E19", padding: "8px 20px", borderRadius: "4px" }}>
              {b}
            </div>
          ))}
        </div>

        {/* Bottom gold line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "#F0B429", opacity: 0.4 }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
