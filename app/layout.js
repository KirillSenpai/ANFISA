import "./globals.css";
import Script from "next/script";

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
      <body>
        <Script id="scroll-reset" strategy="beforeInteractive">{`
          (function () {
            function resetScroll() {
              if (window.location.hash) {
                history.replaceState(null, "", window.location.pathname + window.location.search);
              }
              window.scrollTo(0, 0);
            }

            if ("scrollRestoration" in history) {
              history.scrollRestoration = "manual";
            }

            window.addEventListener("load", resetScroll);
            window.addEventListener("pageshow", resetScroll);
            resetScroll();
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
