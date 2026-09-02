import "./globals.css";
import { Nunito, Caveat } from "next/font/google";

import { SITE_METADATA } from "./birthday-data";

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body"
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-script"
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  metadataBase: new URL(SITE_METADATA.metadataBase),
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${nunito.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
