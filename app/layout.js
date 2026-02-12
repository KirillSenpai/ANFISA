import "./globals.css";

export const metadata = {
  title: "Анфиса & Егор — приглашение на свадьбу",
  description: "15 августа, 16:00 — Челябинск",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Анфиса & Егор — приглашение на свадьбу",
    description: "15 августа, 16:00 — Челябинск",
    type: "website"
    // images: ["/og.jpg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}