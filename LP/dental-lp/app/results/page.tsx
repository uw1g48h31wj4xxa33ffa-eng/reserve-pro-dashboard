import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "実績・運用例 | Dental Route",
  description: "歯科医院での実際の運用例の一部をご紹介します。内容は医院ごとの状況により異なります。",
  robots: { index: false, follow: false },
};

const STATS = [
  {
    label: "予約確定率",
    before: "30%",
    after: "50%",
    note: "予約フォームとLINE導線の整理後",
  },
  {
    label: "無断キャンセル（月間）",
    before: "月3件",
    after: "0〜1件",
    note: "リマインド配信の流れを整理後",
  },
  {
    label: "掘り起こし（月間）",
    before: "0件",
    after: "平均13件",
    note: "休眠患者への再案内フローを整理後",
  },
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-4xl pb-36 md:pb-56">
        {/* ページヘッダー */}
        <div className="text-center mb-4">
          <h1
            className="fade-up text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            style={{ animationDelay: "0.05s" }}
          >
            実績・<span className="text-teal-600">運用例</span>
          </h1>
          <p
            className="fade-up text-sm md:text-base text-gray-500 leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            実際に関わった医院での運用例の一部です
          </p>
        </div>

        {/* 重要な注意書き */}
        <div
          className="fade-up bg-gray-50 rounded-2xl p-5 md:p-6 mb-12 border border-gray-100"
          style={{ animationDelay: "0.35s" }}
        >
          <div className="space-y-1.5">
            <p className="text-xs text-gray-500">※ 個人情報・医院情報を伏せた実績表示です</p>
            <p className="text-xs text-gray-500">※ 実際の運用例の一部です</p>
            <p className="text-xs text-gray-500">※ 内容は医院ごとの状況により異なります</p>
          </div>
        </div>

        {/* 数値実績 */}
        <div className="mb-16">
          <h2
            className="fade-up text-lg font-bold text-gray-800 mb-6 text-center"
            style={{ animationDelay: "0.45s" }}
          >
            確認・整理した結果の変化
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="fade-up bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center"
                style={{ animationDelay: `${0.55 + i * 0.1}s` }}
              >
                <p className="text-sm font-bold text-gray-500 mb-6">{stat.label}</p>

                <div className="text-xl text-gray-300 font-bold mb-2">
                  {stat.before}
                </div>
                <div className="text-xl text-gray-200 mb-2">↓</div>
                <div className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4">
                  {stat.after}
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed">
                  {stat.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 運用例の補足説明 */}
        <div
          className="fade-up bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100"
          style={{ animationDelay: "0.85s" }}
        >
          <h2 className="text-base font-bold text-gray-800 mb-4">運用例について</h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              数値の変化は、状況確認・整理・試行錯誤の積み重ねの結果です
            </p>
            <p>
              同じ方法が必ずしも他の医院に合うとは限りません
            </p>
            <p>
              まず現在の状況を聞かせていただき、その上で何ができるかを一緒に考えます
            </p>
          </div>
        </div>

        {/* 補足 */}
        <div
          className="fade-up mt-12 text-center"
          style={{ animationDelay: "0.95s" }}
        >
          <p className="text-xs text-gray-400">
            成果を保証するものではありません
          </p>
        </div>

        {/* フッターとの余白 */}
        <div className="h-24 md:h-36" />
      </div>

      <Footer />
    </main>
  );
}
