import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "YaffoTLV — Luxury Residence in Jaffa, Tel Aviv. Superhost, 5-star rated. Book direct and save 10%.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#2c2926",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top decorative border */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "1px solid rgba(184, 151, 106, 0.3)",
            display: "flex",
          }}
        />

        {/* Inner decorative border */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: "1px solid rgba(184, 151, 106, 0.15)",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "#b8976a",
            marginBottom: 32,
            display: "flex",
          }}
        />

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: "#ffffff",
              letterSpacing: "0.15em",
              fontFamily: "serif",
            }}
          >
            YAFFO
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#b8976a",
              letterSpacing: "0.15em",
              fontFamily: "serif",
              marginLeft: 8,
            }}
          >
            TLV
          </span>
        </div>

        {/* Decorative divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 60,
              height: 1,
              backgroundColor: "rgba(184, 151, 106, 0.5)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              backgroundColor: "#b8976a",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: 60,
              height: 1,
              backgroundColor: "rgba(184, 151, 106, 0.5)",
              display: "flex",
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.85)",
            letterSpacing: "0.1em",
            fontFamily: "serif",
            fontWeight: 300,
          }}
        >
          Luxury Residence in Jaffa, Tel Aviv
        </div>

        {/* Stars and badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 28,
            fontSize: 18,
            color: "#b8976a",
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ fontSize: 20 }}>{"\u2605\u2605\u2605\u2605\u2605"}</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>{"\u00B7"}</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Superhost</span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>{"\u00B7"}</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>
            Book Direct & Save 10%
          </span>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: 120,
            height: 2,
            backgroundColor: "#b8976a",
            marginTop: 32,
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
