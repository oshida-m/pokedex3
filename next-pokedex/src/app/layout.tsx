import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ポケモン図鑑アプリ",
  description: "Next.js と TypeScript で作成したポケモン図鑑アプリです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* ナビゲーションメニュー */}
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-4 py-4 flex items-center gap-6">
            <Link href="/" className="font-bold text-lg hover:underline">
              ポケモン図鑑
            </Link>
            <Link href="/" className="hover:underline">
              ホーム
            </Link>
            <Link href="/pokemon" className="hover:underline">
              ポケモン一覧
            </Link>
            <Link href="/search" className="hover:underline">
              ポケモン検索
            </Link>
          </nav>
        </header>

        {/* ページの中身 */}
        {children}
      </body>
    </html>
  );
}


