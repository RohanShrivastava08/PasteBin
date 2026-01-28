"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPasteView = pathname.startsWith("/p/");

  return (
    <html lang="en">
      <body>
        {!isPasteView && (
          <header className="header">
            <h1>Pastebin Lite</h1>
            <p className="subtitle">
              Share text securely with expiry and view limits
            </p>
          </header>
        )}

        <main className={isPasteView ? "" : "container"}>
          {children}
        </main>

        {!isPasteView && (
          <footer className="footer">
            <span>Pastebin Lite © {new Date().getFullYear()}</span>
          </footer>
        )}
      </body>
    </html>
  );
}
