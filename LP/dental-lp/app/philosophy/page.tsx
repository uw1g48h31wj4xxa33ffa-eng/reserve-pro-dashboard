import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "大切にしていること | Dental Route",
  description: "Dental Routeが大切にしている考え方についてご紹介します。",
  robots: { index: false, follow: false },
};

const VALUES = [
  {
    heading: "人が主体",
    body: "ツールや仕組みは、あくまで手段です\nどんな状況でも、判断するのは人です",
  },
  {
    heading: "まず状況を知る",
    body: "状況が分からないまま、何かを決めることはありません\nまず現在どうなっているかを確認することから始めます",
  },
  {
    heading: "話してから深く考える",
    body: "一度話を聞いてみて、その上で何ができるかを考えます\n初回から全てを決める必要はありません",
  },
  {
    heading: "無理に受けない",
    body: "対応できないと判断した場合は、正直にお伝えします\nお互いの時間を大切にしたいと思っています",
  },
  {
    heading: "患者様情報は取得しない",
    body: "このサービスでは、患者様の個人情報・医療情報は取得しません\n医院の運営に関わる情報のみを取り扱います",
  },
  {
    heading: "できることを誇張しない",
    body: "できることとできないことを、正直にお伝えします\n成果を保証する表現は使いません",
  },
  {
    heading: "AIや仕組みは手段のひとつ",
    body: "必要な場合には、ツールや自動化の仕組みも活用します\nただし、それが目的になることはありません",
  },
];

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-3xl pb-24">
        {/* ページヘッダー */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            大切にして<span className="text-teal-600">いること</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 leading-relaxed">
            押し付けず、一緒に考えていくために
          </p>
        </div>

        {/* 価値観リスト */}
        <div className="space-y-1">
          {VALUES.map((value, i) => (
            <div key={i} className="py-8 border-b border-gray-100 last:border-b-0">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                {value.heading}
              </h2>
              <div className="space-y-1.5">
                {value.body.split("\n").map((line, j) => (
                  <p key={j} className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 締めの一言 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            気になることがあれば、まず状況を聞かせてください
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
