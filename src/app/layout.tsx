import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GovWin AI — Win Your First Government Contract",
  description: "$160 billion in government contracts go to small businesses every year. Most never apply. GovWin AI finds, explains, and helps you win them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
