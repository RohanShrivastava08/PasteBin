import "./globals.css";

export const metadata = {
  title: "Pastebin Lite",
  description: "Create and share text pastes with expiry and view limits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <h1>Pastebin Lite</h1>
          <p className="subtitle">
            Share text securely with expiry and view limits
          </p>
        </header>

        <main className="container">{children}</main>

        <footer className="footer">
          <span>Pastebin Lite © {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
