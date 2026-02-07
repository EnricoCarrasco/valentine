import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "LoveRequest - Send heartfelt Valentine messages that touch the heart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(145deg, #FFF5F7 0%, #FFE0E6 50%, #FFF5F7 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative hearts */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            fontSize: 48,
            opacity: 0.15,
            display: "flex",
          }}
        >
          {"💕"}
        </div>
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 100,
            fontSize: 36,
            opacity: 0.12,
            display: "flex",
          }}
        >
          {"💗"}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 120,
            fontSize: 40,
            opacity: 0.1,
            display: "flex",
          }}
        >
          {"🌹"}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            right: 80,
            fontSize: 44,
            opacity: 0.12,
            display: "flex",
          }}
        >
          {"✨"}
        </div>

        {/* Heart SVG */}
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginBottom: 24 }}
        >
          <defs>
            <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B81" />
              <stop offset="100%" stopColor="#FF3B5C" />
            </linearGradient>
          </defs>
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill="url(#hg)"
          />
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#422429",
            lineHeight: 1.2,
            textAlign: "center",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Love isn&apos;t about the price,</span>
          <span
            style={{
              background: "linear-gradient(135deg, #FF6B81, #FF3B5C)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            it&apos;s about the feeling.
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#505662",
            marginTop: 20,
            display: "flex",
          }}
        >
          Make this Valentine&apos;s Day unforgettable
        </div>

        {/* Brand */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            fontWeight: 600,
            color: "#FF5A5F",
          }}
        >
          {"❤️ "}LoveRequest
        </div>
      </div>
    ),
    { ...size },
  );
}
