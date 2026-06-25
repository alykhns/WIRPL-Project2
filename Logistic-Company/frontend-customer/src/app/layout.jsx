import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "BabaExpress",
  description: "BabaExpress customer app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
