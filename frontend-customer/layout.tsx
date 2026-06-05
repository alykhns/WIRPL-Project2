import { DM_Sans } from "next/font/google";
const dmSans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}