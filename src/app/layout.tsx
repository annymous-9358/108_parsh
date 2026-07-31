import type { Metadata } from "next";
import { Tiro_Devanagari_Hindi, Hind, Inter } from "next/font/google";
import { SessionBootstrap } from "@/components/SessionBootstrap";
import "./globals.css";

const display = Tiro_Devanagari_Hindi({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Hind({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-body",
  display: "swap",
});

const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "१०८ पार्श्वनाथ तीर्थ दर्शन — 108 Parshwanath Tirtha Darshan",
  description:
    "श्री 108 पार्श्वनाथ भगवान के तीर्थों का इतिहास, दर्शन और मार्गदर्शन — the history, photographs and pilgrimage guide to the 108 Parshwanath Jain tirthas of India.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="hi"
      className={`${display.variable} ${body.variable} ${ui.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionBootstrap />
        {children}
      </body>
    </html>
  );
}
