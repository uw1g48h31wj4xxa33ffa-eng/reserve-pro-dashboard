import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "歯科医院向け LINE予約導線改善サポート | DentalConnect",
  description:
    "問い合わせから予約確定・掘り起こしまで。歯科医院の予約率を改善する個人事業主によるLINE運用サポートサービスです。予約確定率30%→50%、無断キャンセル0〜1件の実績あり。",
  keywords: [
    "歯科医院",
    "予約率改善",
    "LINE予約",
    "無断キャンセル対策",
    "掘り起こし",
    "歯科経営",
    "LINE運用",
  ],
  authors: [{ name: "DentalConnect" }],
  openGraph: {
    title: "歯科医院向け LINE予約導線改善サポート | DentalConnect",
    description:
      "問い合わせから予約確定・掘り起こしまで。現場に合わせた個人サポートで予約率を改善します。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "歯科医院向け LINE予約導線改善サポート | DentalConnect",
    description: "問い合わせから予約・掘り起こしまで。歯科医院の予約率改善をサポートします。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
