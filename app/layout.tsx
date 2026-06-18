import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "../styles/globals.css";

// ─── Azedo (Headings) ─────────────────────────────────────────
const azedoBold = localFont({
  src: "../public/fonts/azedo/Azedo-Bold.otf",
  variable: "--font-azedo-bold",
  display: "swap",
});

const azedoLight = localFont({
  src: "../public/fonts/azedo/Azedo-Light.otf",
  variable: "--font-azedo-light",
  display: "swap",
});

// ─── Helvetica (Body & UI) ────────────────────────────────────
const helvetica = localFont({
  src: "../public/fonts/helvetica-255/Helvetica.ttf",
  variable: "--font-helvetica",
  display: "swap",
});

const helveticaLight = localFont({
  src: "../public/fonts/helvetica-255/helvetica-light-587ebe5a59211.ttf",
  variable: "--font-helvetica-light",
  display: "swap",
});

const helveticaBold = localFont({
  src: "../public/fonts/helvetica-255/Helvetica-Bold.ttf",
  variable: "--font-helvetica-bold",
  display: "swap",
});

const helveticaOblique = localFont({
  src: "../public/fonts/helvetica-255/Helvetica-Oblique.ttf",
  variable: "--font-helvetica-oblique",
  display: "swap",
});

const helveticaBoldOblique = localFont({
  src: "../public/fonts/helvetica-255/Helvetica-BoldOblique.ttf",
  variable: "--font-helvetica-bold-oblique",
  display: "swap",
});

const helveticaCompressed = localFont({
  src: "../public/fonts/helvetica-255/helvetica-compressed-5871d14b6903a.otf",
  variable: "--font-helvetica-compressed",
  display: "swap",
});

const helveticaRoundedBold = localFont({
  src: "../public/fonts/helvetica-255/helvetica-rounded-bold-5871d05ead8de.otf",
  variable: "--font-helvetica-rounded-bold",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulseWell",
  description: "Organizational wellbeing intelligence platform.",
  icons: {
    icon: "/favicon.webp",
    apple: "/favicon.webp",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es"
      className={[
        azedoBold.variable,
        azedoLight.variable,
        helvetica.variable,
        helveticaLight.variable,
        helveticaBold.variable,
        helveticaOblique.variable,
        helveticaBoldOblique.variable,
        helveticaCompressed.variable,
        helveticaRoundedBold.variable,
      ].join(" ")}
    >
      <body>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid #334155",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
