import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "大刁E��してぁE��こと | Dental Route",
  description: "Dental Routeが大刁E��してぁE��老E��方につぁE��ご紹介します、E,
  robots: { index: false, follow: false },
};

const VALUES = [
  {
    heading: "人が主佁E,
    body: "チE�EルめE��絁E��は、あくまで手段です\nどんな状況でも、判断するのは人でぁE,
  },
  {
    heading: "まず状況を知めE,
    body: "状況が刁E��らなぁE��ま、何かを決めることはありません\nまず現在どぁE��ってぁE��かを確認することから始めまぁE,
  },
  {
    heading: "話してから深く老E��めE,
    body: "一度話を聞ぁE��みて、その上で何ができるかを老E��ます\n初回から全てを決める忁E���Eありません",
  },
  {
    heading: "無琁E��受けなぁE,
    body: "対応できなぁE��判断した場合�E、正直にお伝えします\nお互いの時間を大刁E��したぁE��思ってぁE��ぁE,
  },
  {
    heading: "患老E��情報は取得しなぁE,
    body: "こ�Eサービスでは、患老E���E個人惁E��・医療情報は取得しません\n医院の運営に関わる惁E��のみを取り扱ぁE��ぁE,
  },
  {
    heading: "できることを誁E��しなぁE,
    body: "できることとできなぁE��とを、正直にお伝えします\n成果を保証する表現は使ぁE��せん",
  },
  {
    heading: "AIめE��絁E��は手段のひとつ",
    body: "忁E��な場合には、ツールめE�E動化の仕絁E��も活用します\nただし、それが目皁E��なることはありません",
  },
];

export default function PhilosophyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="h-24 md:h-32" />

      <div className="container-lg max-w-3xl pb-36 md:pb-56">
        {/* ペ�Eジヘッダー */}
        <div className="text-center mb-16">
          <h1
            className="fade-up text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            style={{ animationDelay: "0.05s" }}
          >
            大刁E��して<span className="text-teal-600">ぁE��こと</span>
          </h1>
          <p
            className="fade-up text-sm md:text-base text-gray-500 leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            押し付けず、一緒に老E��てぁE��ために
          </p>
        </div>

        {/* 価値観リスチE*/}
        <div className="space-y-1">
          {VALUES.map((value, i) => (
            <div
              key={i}
              className="fade-up py-8 border-b border-gray-100 last:border-b-0"
              style={{ animationDelay: `${0.3 + i * 0.08}s` }}
            >
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3">
                {value.heading}
              </h2>
              <div className="space-y-2">
                {value.body.split("\n").map((line, j) => (
                  <p key={j} className="text-sm md:text-base text-gray-600 leading-loose">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 締め�E一言 */}
        <div
          className="fade-up mt-16 text-center"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            気になることがあれ�E、まず状況を聞かせてください
          </p>
        </div>

        {/* フッターとの余白 */}
        <div className="h-16 md:h-20" />
      </div>

      <Footer />
    </main>
  );
}
