import "./globals.css";

export const metadata = {
  title: "Logistik Admin",
  description: "Dashboard Admin Logistik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
