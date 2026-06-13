import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "歯科医院向け 運営改善パートナー | DentalConnect",
  description:
    "予約改善・LINE運用・掘り起こしから、採用・業務改善まで。歯科医院の運営課題を現場目線で解決する、個人事業主の伴走支援パートナーです。",
  keywords: [
    "歯科医院",
    "運営改善",
    "予約率改善",
    "LINE運用",
    "採用支援",
    "業務改善",
    "伴走支援",
  ],
  authors: [{ name: "DentalConnect" }],
  openGraph: {
    title: "歯科医院向け 運営改善パートナー | DentalConnect",
    description:
      "予約・LINE運用から採用・業務改善まで。医院ごとに最適な仕組みづくりをサポートします。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "歯科医院向け 運営改善パートナー | DentalConnect",
    description: "予約改善から採用まで。歯科医院の運営改善を現場目線でサポートします。",
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
