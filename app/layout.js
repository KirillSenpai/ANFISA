import "./globals.css";

import { SITE_METADATA } from "./invite-data";

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
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
