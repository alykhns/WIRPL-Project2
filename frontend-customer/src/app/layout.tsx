import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/context";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumière — Curated Fashion",
  description: "Lumière e-commerce — curated fashion pieces in premium fabrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={dmSans.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}