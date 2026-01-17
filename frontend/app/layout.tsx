import "./globals.css";

export const metadata = {
  title: "Invoice Extraction Demo",
  description: "Upload invoices, extract fields, edit, and save."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
