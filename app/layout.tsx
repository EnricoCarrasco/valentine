import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TikTokPixel } from "@/components/tiktok-pixel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wanttobemyvalentine.xyz"),
  title: "LoveRequest - Make This Valentine's Day Unforgettable",
  description:
    "Send the sweetest, most heartfelt Valentine's request with LoveRequest. Create personalized love messages that touch the heart.",
  openGraph: {
    title: "LoveRequest - Personalized Valentine Requests",
    description:
      "Love isn't about the price, it's about the feeling. Make this Valentine's Day unforgettable.",
    type: "website",
    siteName: "LoveRequest",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <TikTokPixel />
        {children}
      </body>
    </html>
  );
}
