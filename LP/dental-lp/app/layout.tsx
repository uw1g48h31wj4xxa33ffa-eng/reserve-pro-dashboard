import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DentalConnect | 歯科医院向け予約率改善サービス",
  description:
    "歯科医院向けLINE予約導線最適化サービス。問い合わせから予約確定・掘り起こしまで、予約率改善のための仕組みをご提供します。予約率最大+20pt、無断キャンセルゼロへ。",
  keywords: ["歯科医院", "予約率改善", "LINE予約", "歯科クリニック", "掘り起こし", "無断キャンセル対策"],
  openGraph: {
    title: "DentalConnect | 歯科医院向け予約率改善サービス",
    description: "問い合わせを予約につなげる仕組みを。歯科医院向けLINE予約導線最適化サービス。",
    type: "website",
    locale: "ja_JP",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "DentalConnect",
              "description": "歯科医院向けLINE予約導線最適化サービス",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "description": "月額サブスクリプション"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "歯科医院"
              }
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
