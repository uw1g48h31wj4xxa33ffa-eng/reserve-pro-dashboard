import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "対応領域 | Dental Route",
  description: "予約導線・LINE運用・掘り起こし・採用・数値管理・業務改善など、歯科医院の運営で気になっている領域を確認・整理します。",
  robots: { index: false, follow: false },
};

const AREAS = [
  {
    icon: "📅",
    title: "予約導線",
    lines: [
      "予約フォーム、LINE導線、予約確定までの流れを確認します",
      "現場の運用に合わせて、無理のない導線を整理します",
    ],
  },
  {
    icon: "💬",
    title: "LINE運用",
    lines: [
      "リッチメニュー、配信内容、問い合わせ対応の流れを確認します",
      "患者様との接点を分かりやすく整理します",
    ],
  },
  {
    icon: "🔄",
    title: "掘り起こし",
    lines: [
      "休眠顧客への再案内や、再来院につながる流れを確認します",
      "無理な案内ではなく、状況に合わせた方法を考えます",
    ],
  },
  {
    icon: "👩‍⚕️",
    title: "採用",
    lines: [
      "求人文面、応募導線、媒体ごとの見え方を確認します",
      "採用活動の入り口を整理します",
    ],
  },
  {
    icon: "📊",
    title: "集計・数値管理",
    lines: [
      "問い合わせ数、予約数、媒体別の反応などを確認します",
      "日々の状況を見える形に整理します",
    ],
  },
  {
    icon: "⚙️",
    title: "業務改善",
    lines: [
      "手作業、確認漏れ、重複対応などを確認します",
      "現場で無理なく続けられる形を考えます",
    ],
  },
  {
    icon: "🌐",
    title: "ホームページ・LP",
    lines: [
      "ホームページや、問い合わせにつなげる1ページ型の案内ページを確認します",
      "見え方や導線を、状況に合わせて整理します",
    ],
  },
  {
    icon: "📱",
    title: "SNS運用",
    lines: [
      "投稿内容、更新頻度、反応の傾向を確認します",
      "続けやすい運用の形を一緒に考えます",
    ],
  },
];

export default function AreasPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-4xl pb-32 md:pb-48">
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            対応<span className="text-teal-600">領域</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            ツールありきではなく、現場の状況に合わせて実務の流れを整理します
          </p>
        </div>

        {/* 各領域カード */}
        <div className="space-y-4 md:space-y-6">
          {AREAS.map((area, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-teal-50 flex items-center justify-center text-2xl">
                  {area.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                    {area.title}
                  </h2>
                  <div className="space-y-2">
                    {area.lines.map((line, j) => (
                      <p
                        key={j}
                        className="text-sm text-gray-600 leading-loose"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 補足 */}
        <div className="mt-16 text-center space-y-2">
          <p className="text-xs text-gray-400">
            内容によっては、ご希望に添えない場合がございます
          </p>
          <p className="text-xs text-gray-400">
            まずは状況をお聞かせいただき、その上で一緒に考えます
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
