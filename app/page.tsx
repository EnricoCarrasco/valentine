"use client";

import { useEffect, useCallback } from "react";
import Script from "next/script";
import { Heart } from "lucide-react";
import { trackClickButton } from "@/components/tiktok-pixel";

declare global {
  interface Window {
    ogblock?: boolean;
    call_locker?: (options?: Record<string, string>) => void;
  }
}

const floatingHearts = [
  { top: "10%", left: "5%", size: 24, opacity: 0.15, animation: "animate-float" },
  { top: "20%", right: "8%", size: 32, opacity: 0.1, animation: "animate-float-delayed" },
  { top: "45%", left: "3%", size: 20, opacity: 0.12, animation: "animate-float-slow" },
  { top: "60%", right: "5%", size: 28, opacity: 0.08, animation: "animate-float" },
  { top: "75%", left: "10%", size: 18, opacity: 0.15, animation: "animate-float-delayed" },
  { top: "85%", right: "12%", size: 22, opacity: 0.1, animation: "animate-float-slow" },
  { top: "30%", left: "90%", size: 16, opacity: 0.12, animation: "animate-float" },
  { top: "55%", left: "92%", size: 26, opacity: 0.08, animation: "animate-float-delayed" },
];

export default function Home() {
  // Adblock detection fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.ogblock) {
        window.location.href = "https://pixelbux.online/adblock";
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const openLocker = useCallback(() => {
    trackClickButton();

    // TODO: restore locker after video proof
    window.location.href = "/message";
    // if (typeof window.call_locker === "function") {
    //   window.call_locker();
    // }
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Floating hearts background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {floatingHearts.map((heart, i) => (
          <svg
            key={i}
            className={`absolute ${heart.animation} animate-pulse-soft`}
            style={{
              top: heart.top,
              left: heart.left,
              right: heart.right,
              opacity: heart.opacity,
            }}
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="#FF5A5F"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ))}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-5 py-12 sm:px-8">
        <div className="flex w-full max-w-lg flex-col items-center text-center">
          {/* Heart icon */}
          <div className="mb-5 animate-fade-in-up">
            <Heart
              className="h-10 w-10 text-accent sm:h-12 sm:w-12"
              fill="#FF5A5F"
              strokeWidth={0}
            />
          </div>

          {/* Headline */}
          <h1 className="mb-4 animate-fade-in-up font-[family-name:var(--font-playfair)] text-2xl leading-snug font-bold tracking-tight text-primary sm:text-3xl md:text-4xl">
            Love isn&apos;t about the price,{" "}
            <span className="gradient-romantic">
              it&apos;s about the feeling.
            </span>{" "}
            Make this Valentine&apos;s Day unforgettable.
          </h1>

          {/* Subtitle */}
          <p className="mb-8 animate-fade-in-up delay-200 text-base leading-relaxed text-muted opacity-0 sm:text-lg">
            Send the sweetest, most heartfelt request this Valentine&apos;s with{" "}
            <strong className="text-primary">LoveRequest</strong>.
          </p>

          {/* CTA Button */}
          <div className="mb-10 animate-fade-in-up delay-400 opacity-0">
            <button
              type="button"
              className="btn-cta"
              onClick={openLocker}
            >
              <Heart className="h-5 w-5" fill="white" strokeWidth={0} />
              Get Yours Now
            </button>
          </div>

          {/* Phone Mockup */}
          <div className="relative animate-fade-in-up delay-600 opacity-0">
            <div className="phone-frame">
              <div className="phone-notch" />
              {/* Side buttons */}
              <div className="phone-btn-right" style={{ top: "120px", height: "40px" }} />
              <div className="phone-btn-right" style={{ top: "180px", height: "60px" }} />
              <div className="phone-btn-left" style={{ top: "140px", height: "50px" }} />
              <video
                autoPlay
                loop
                playsInline
                muted
                poster=""
                className="h-full w-full object-cover"
              >
                <source src="/loverequest-demo.mov" type="video/quicktime" />
                <source src="/loverequest-demo.mov" type="video/mp4" />
              </video>
            </div>

          </div>

          {/* "Make it personal" badge */}
          <div className="mt-6 animate-fade-in-up delay-600 opacity-0">
            <span className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-primary shadow-lg sm:text-base">
              Make it personal
            </span>
          </div>
        </div>
      </main>

      {/* OGAds Content Locker — preloaded, triggered by call_locker() on click */}
      <Script id="ogads-init" strategy="beforeInteractive">
        {`var ogblock = true;`}
      </Script>
      <Script
        id="ogjs"
        src="https://pixelbux.online/cl/js/4oog21"
        strategy="afterInteractive"
      />
      <noscript>
        <meta httpEquiv="refresh" content="0;url=https://pixelbux.online/noscript" />
      </noscript>
    </div>
  );
}
