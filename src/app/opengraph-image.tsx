import { ImageResponse } from "next/og";

// Site-wide OG image (02 §0.6): deep green, lime accent, "VB-TEC" + tagline.
export const alt = "VB-TEC – energie-ingenieurs voor jouw woning";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b4a3f",
          color: "#fff",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: "#efd9ff" }} />
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 1 }}>VB-TEC</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 76, lineHeight: 1.04, maxWidth: 960 }}>Je energiefactuur zo dicht mogelijk bij €0.</div>
          <div style={{ fontSize: 32, color: "#c3dcd5", maxWidth: 900 }}>Ingenieurs die rekenen, geen verkopers die duwen.</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {["Zon & PVT", "Warmtepomp", "Batterij", "Laadpaal"].map((t) => (
            <div key={t} style={{ display: "flex", padding: "12px 24px", borderRadius: 999, background: "#efd9ff", color: "#05231d", fontSize: 24 }}>
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
