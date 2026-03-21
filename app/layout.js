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
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
              window.scrollTo(0, 0);
            }

            function scheduleReset() {
              resetScroll();
              requestAnimationFrame(resetScroll);
              setTimeout(resetScroll, 0);
              setTimeout(resetScroll, 120);
              setTimeout(resetScroll, 400);
            }

            if ("scrollRestoration" in history) {
              history.scrollRestoration = "manual";
            }

            document.addEventListener("DOMContentLoaded", scheduleReset);
            window.addEventListener("load", scheduleReset);
            window.addEventListener("pageshow", scheduleReset);
            window.addEventListener("focus", scheduleReset);
            scheduleReset();
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
